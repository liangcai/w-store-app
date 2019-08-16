import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import fetchData from "../../utilities/fetch-data";
import Placeholder from "../../components/placeholder";

class ProductShow extends Component {
  config = {
    navigationBarTitleText: "ProductShow"
  }

  state = {
    product: {},
    placeholder: true,
  }

  constructor() {
    super(...arguments)
    this.fetchData = fetchData
  }

  fetchDataSuccess(response) {
    const {data} = response
    this.setState({
      product: data
    })
    Taro.setNavigationBarTitle({
      title: data.name
    })
  }

  fetchDataComplete() {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() =>{
        this.setState({
          placeholder: false
        })
      }, 1000)
    } else {
      this.setState({
        placeholder: false
      })
    }
  }

  componentWillMount() {
    const {id} = this.$router.params

    this.fetchData({
      resource: 'products',
      id,
      success: this.fetchDataSuccess.bind(this),
      complete: this.fetchDataComplete.bind(this),
    })
  }

  render() {
    const {product, placeholder} = this.state
    return (
      <View >
        <Placeholder className='m-3' show={placeholder} type='product' />
        {!placeholder &&
          <View className='page-demo'>
            {product.name}
          </View>
        }
      </View >
    )
  }
}

export default ProductShow

