import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination, AtActivityIndicator } from "taro-ui";
import _ from 'lodash';
import SearchBar from "../../components/search-bar"
import ProductList from "../../components/product-list";
import Placeholder from "../../components/placeholder";
import ErrorPage from "../../components/error-page";
import fetchData from "../../utilities/fetch-data";


class ShopIndex extends Component {
  constructor() {
    super(...arguments)
    this.fetchData = fetchData
  }

  config = {
    navigationBarTitleText: "W-Store",
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  }

  state = {
    products: [],
    placeholder: true,
    total: 0,
    pageSize: 2,
    current: 1,
    serviceError: false,
    search: '',
    searching: false,
    errorPageMessage: '',
  }

  onPullDownRefresh() {
    this.setState({
      serviceError: false,
      current: 1,
    }, () => {
      this.fetchData({
        resource: 'products',
        search: this.state.search,
        page: this.state.current,
        pageSize: this.state.pageSize,
        success: this.fetchDataSuccess.bind(this),
        fail: this.fetchDataFail.bind(this),
        complete: this.fetchDataComplete.bind(this),
      })
    })
  }

  search(value = '') {
    console.log(`search: ${value}`)
    this.setState({
      searching: true,
      current: 1,
    }, () => {
      this.fetchData({
        resource: 'products',
        search: value,
        page: this.state.current,
        pageSize: this.state.pageSize,
        success: this.fetchDataSuccess.bind(this),
        fail: this.fetchDataFail.bind(this),
        complete: this.fetchDataComplete.bind(this),
      })
    })

  }

  debounceSearch = _.debounce(this.search, 1000)

  onChangeSearchBar(value) {
    console.log(value)
    this.setState({
      search: value
    }, () => {
      this.debounceSearch(this.state.search)
    })
  }

  onActionClickSearchBar() {
    this.search(this.state.search)
    console.log('action click search')
  }

  onConfirmSearchBar() {
    this.search(this.state.search)
    console.log('confirm search')
  }

  fetchDataSuccess(response) {
    const {data, header} = response
    this.setState({
      products: data,
      placeholder: false,
      serviceError: false,
      total: header['X-Total-Count']
    })

    if (data.length === 0) {
      this.setState({
        serviceError: true,
        errorPageMessage: '没有可以显示的内容。'
      })
    }
  }

  fetchDataFail(error) {
    console.log('error: ', error.message, error)
    this.setState({
      serviceError: true,
      searching: false,
      errorPageMessage: error.message,
    })
  }

  fetchDataComplete() {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        this.setState({
          searching: false
        })
      }, 2000)
    } else {
      this.setState({
        searching: false
      })
    }
    Taro.stopPullDownRefresh()
  }

  async componentWillMount() {
    this.fetchData({
      resource: 'products',
      page: this.state.current,
      pageSize: this.state.pageSize,
      success: this.fetchDataSuccess.bind(this),
      fail: this.fetchDataFail.bind(this)
    })
  }


  onPageChange({current}) {
    this.setState({
        current,
        placeholder: true
      }, () => {
        this.fetchData({
          resource: 'products',
          page: this.state.current,
          pageSize: this.state.pageSize,
          success: this.fetchDataSuccess.bind(this),
          fail: this.fetchDataFail.bind(this)
        })
      }
    )
  }

  onClickListItem(id) {
    Taro.navigateTo({
      url: `/pages/product/show?id=${id}`
    })
  }

  render() {
    const {products, placeholder, total, pageSize, current, serviceError, searching, errorPageMessage} = this.state

    const page = (<View >
      <Placeholder className='m-3' show={placeholder} quantity={pageSize} />
      {!placeholder && <ProductList data={products} onClickListItem={this.onClickListItem} />}
      {total > pageSize && <AtPagination
        icon
        total={parseInt(total)}
        pageSize={pageSize}
        current={current}
        className='my-4'
        onPageChange={this.onPageChange.bind(this)}
      />}
    </View >)
    const errorPage = (
        <ErrorPage content={errorPageMessage} />
    )
    return (
      <View >
        <SearchBar
          value={this.state.search}
          onChange={this.onChangeSearchBar.bind(this)}
          onActionClick={this.onActionClickSearchBar.bind(this)}
          onConfirm={this.onConfirmSearchBar.bind(this)}
        />
        {searching && <AtActivityIndicator content='搜索中...' className='position-absolute m-3' color='#FF1122' />}
        {serviceError ? errorPage : page}
      </View >
    )
  }
}

export default ShopIndex

