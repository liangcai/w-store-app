import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import fetchData from "../../utilities/fetch-data";
import Placeholder from "../../components/placeholder";
import ErrorPage from "../../components/error-page";

class ProductShow extends Component {
  config = {
    navigationBarTitleText: "ProductShow"
  }

  state = {
    product: {},
    placeholder: true,
    serviceError: false,
    errorPageMessage: '',
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
      setTimeout(() => {
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

  fetchDataFail(error) {
    this.setState({
      serviceError: true,
      errorPageMessage: error.message,
    })
  }

  componentWillMount() {
    const {id} = this.$router.params

    this.fetchData({
      resource: 'products',
      id,
      success: this.fetchDataSuccess.bind(this),
      complete: this.fetchDataComplete.bind(this),
      fail: this.fetchDataFail.bind(this),
    })
  }

  render() {
    const {product, placeholder, serviceError, errorPageMessage} = this.state

    const page = (
      <View >
        <Placeholder className='m-3' show={placeholder} type='product' />
        {!placeholder &&
        <View className='page-demo' >
          {product.name}
        </View >
        }
      </View >
    )

    const errorPage = (
      <ErrorPage content={errorPageMessage} />
    )

    return (
      <view >
        {serviceError ? errorPage : page}
      </view >
    )
  }
}

export default ProductShow

