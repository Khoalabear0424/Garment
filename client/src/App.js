import React, { Component } from 'react';
import ArticleDisplay from './components/ArticleDisplay';
import { getClothes, getType } from './services/scrapeClothesService';
import { paginate } from './utils/paginate';
import Navbar from './components/Navbar';
import ListGroup from './components/ListGroup';
import Pagination from './components/common/pagination';

class App extends Component {
  state = {
    clothes: [],
    pageSize: 60,
    currentPage: 1,
    clothesTypes: ['All', 'Tops', 'Dresses', 'Jackets', 'Pants', 'Shorts', 'Shoes']
  }

  async componentDidMount() {
    const { data: clothes } = await getClothes();
    this.setState({ clothes })
  }

  checkMethod = () => {
    console.log(this.state)
  }

  handlePageChange = page => {
    this.setState({ currentPage: page })
  }

  handleFilter = async (type) => {
    if (type === 'All') {
      const { data: clothes } = await getClothes();
      this.setState({ clothes })
    } else {
      var { clothes } = this.state;
      getType(type).then((r) => {
        clothes = r;
        this.setState({ clothes })
      })
    }
  }

  render() {
    const { length: count } = this.state.clothes;
    const { pageSize, currentPage, clothes: currentClothes, clothesTypes } = this.state;

    const currClothesArray = paginate(currentClothes, currentPage, pageSize)

    return <div className="App">
      <header><Navbar /></header>
      <div className="row">
        <div className="col-2">
          <ListGroup
            onClickFilter={this.handleFilter}
            clothesTypesArray={clothesTypes}
          />
        </div>
        <div className="col-10">
          <ArticleDisplay
            currClothesArray={currClothesArray}
          />
        </div>
      </div>

      <div className="container">
        <Pagination
          itemsCount={count}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />
      </div>
    </div>;
  }
}

export default App;
