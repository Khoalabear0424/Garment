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
    currentFilter: null,
    priceFilterValue: '$ - $$',
    currentBrand: null,
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

  handleFilter = async (type, brand, price = null) => {
    var { currentFilter, currentBrand } = this.state

    if (type) currentFilter = type;
    if (brand === currentBrand) currentBrand = null;
    else currentBrand = brand;

    if (type === 'All') {
      var { data: clothes } = await getClothes();
      this.setState({ clothes, currentFilter, currentBrand })
    } else {
      var { clothes } = this.state;
      getType(currentFilter, currentBrand, price).then((r) => {
        clothes = r;
        this.setState({ clothes, currentFilter, currentBrand })
      })
    }
  }

  handlePriceFilter = () => {
    let { priceFilterValue } = this.state;
    if (priceFilterValue === '$ - $$') {
      priceFilterValue = '$$ - $'
    } else {
      priceFilterValue = '$ - $$'
    }
    this.setState({ priceFilterValue });
    return priceFilterValue;
  }

  render() {
    const { length: count } = this.state.clothes;
    const { pageSize, currentPage, clothes: currentClothes, clothesTypes, currentFilter, priceFilterValue, currentBrand } = this.state;

    const currClothesArray = paginate(currentClothes, currentPage, pageSize)

    return <div className="App">
      <header><Navbar
        onClickFilter={this.handleFilter}
        priceFilterValue={priceFilterValue}>
      </Navbar>
      </header>
      <div className="row">
        <div className="col-lg-2 col-md-2 col-sm-2">
          <ListGroup
            checkState={this.checkMethod}
            selectedItem={currentFilter}
            onClickFilter={this.handleFilter}
            onPageChange={this.handlePageChange}
            clothesTypesArray={clothesTypes}
            priceFilterValue={priceFilterValue}
            onClickPriceFilter={this.handlePriceFilter}
            currentBrand={currentBrand}
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
