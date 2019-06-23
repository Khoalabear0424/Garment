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
    clothesTypes: ['All', 'Tops', 'Dresses', 'Jackets', 'Pants', 'Shorts', 'Shoes', 'Accessories', 'Misc'],
    currentFilter: 'All'
  }

  async componentDidMount() {
    const { data: clothes } = await getClothes();
    this.setState({ clothes })
  }

  checkMethod = () => {
    alert(this.state.currentFilter)
  }

  handlePageChange = page => {
    this.setState({ currentPage: page })
    window.scrollTo(0, 0)
  }

  handleFilter = async (type, brand = null, value = 'All') => {
    this.handlePageChange(1)
    var { currentFilter } = this.state
    currentFilter = type;
    if (type === 'All') {
      var { data: clothes } = await getClothes();
      this.setState({ clothes })
    } else {
      var { clothes, currentFilter } = this.state;
      currentFilter = type;
      getType(type, brand, value).then((r) => {
        clothes = r;
        this.setState({ clothes, currentFilter })
      })
    }
  }

  render() {
    const { length: count } = this.state.clothes;
    const { pageSize, currentPage, clothes: currentClothes, clothesTypes, currentFilter } = this.state;

    const currClothesArray = paginate(currentClothes, currentPage, pageSize)

    return <div className="App">
      <header><Navbar /></header>
      <div className="row">
        <div className="col-lg-2 col-md-2 col-sm-2">
          <ListGroup
            checkState={this.checkMethod}
            selectedItem={currentFilter}
            onClickFilter={this.handleFilter}
            onPageChange={this.handlePageChange}
            clothesTypesArray={clothesTypes}
          />
        </div>
        <div className="col-lg-10 col-md-10 col-sm-10 justify-content-center">
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
