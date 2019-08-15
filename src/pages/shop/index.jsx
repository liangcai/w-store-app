import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination } from "taro-ui";
import SearchBar from "../../components/search-bar"
import ProductList from "../../components/product-list";
import Placeholder from "../../components/placeholder";


class ShopIndex extends Component {
  config = {
    navigationBarTitleText: "W-Store"
  }

  state = {
    products: [],
    placeholder: true,
    total: 0,
    pageSize: 2,
    current: 1,
  }


  async componentWillMount() {
    const response = await Taro.request({
      url: `${API_WS}/products`
    })

    if (process.env.NODE_ENV == 'development') {
      setTimeout(() => {
        this.setState({
          products: response.data,
          placeholder: false,
        })
      }, 2000)
    } else {
      this.setState({
        products: response.data,
        placeholder: false,
      })
    }


  }


  render() {
    const {products, placeholder, total, pageSize, current} = this.state

    return (
      <View >
        <SearchBar />
        <Placeholder className='m-3' show={placeholder} quantity='10' />
        <ProductList data={products} />
        <AtPagination total={parseInt(total)} pageSize={pageSize} current={current} icon />
      </View >
    )
  }
}

export default ShopIndex

