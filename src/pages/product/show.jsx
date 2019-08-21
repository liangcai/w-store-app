import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtMessage } from "taro-ui";
import fetchData from "../../utilities/fetch-data";
import Placeholder from "../../components/placeholder";
import ErrorPage from "../../components/error-page";
// import RichTextWxParse from "../../components/rich-text-wx-parse";
import ProductPageCard from "../../components/product-page-card";
import ProductPageTab from "../../components/product-page-tab";
import MaterialIcon from "../../components/material-icon";
import ProductPageTabBar from "../../components/product-page-tab-bar";
import ProductPageActionSheet from "../../components/product-page-action-sheet";

class ProductShow extends Component {
  config = {
    navigationBarTitleText: "商品详情",
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  }

  state = {
    product: {},
    placeholder: true,
    serviceError: false,
    errorPageMessage: '',
    indicatorDots: false,
    actionSheet: false,
    actionSheetAction: '',
    actionSheetActionText: '',
    cartIndicator: false,
  }

  constructor() {
    super(...arguments)
    this.fetchData = fetchData

    const {id = 1, name} = this.$router.params
    this.id = id
    this.name = name
  }

  onPullDownRefresh() {
    this.setState({
      serviceError: false,
      placeholder: true,
    }, () => {
      this.getCart()
      this.fetchData({
        resource: 'products',
        id: this.id,
        success: this.fetchDataSuccess.bind(this),
        fail: this.fetchDataFail.bind(this),
        complete: this.fetchDataComplete.bind(this)
      })
    })
  }

  fetchDataSuccess(response) {
    const {data} = response
    this.setState({
      product: data,
    })

    if (data.images.length > 1) {
      this.setState({
        indicatorDots: true
      })
    }

    Taro.setNavigationBarTitle({
      title: data.name
    })
  }

  fetchDataComplete() {
    // if (process.env.NODE_ENV === 'development') {
    //   setTimeout(() => {
    //     this.setState({
    //       placeholder: false
    //     })
    //   }, 1000)
    // } else {
    //   this.setState({
    //     placeholder: false
    //   })
    // }
    this.setState({
      placeholder: false
    })
    Taro.stopPullDownRefresh()
  }


  fetchDataFail(error) {
    this.setState({
      serviceError: true,
      errorPageMessage: error.message,
    })
  }

  getCartSuccess(response) {
    if (response.data.items.length > 0) {
      this.setState({
        cartIndicator: true
      })
    } else {
      this.setState({
        cartIndicator: false
      })
    }
  }

  getCart() {
    this.fetchData({
      resource: 'cart',
      success: this.getCartSuccess.bind(this)
    })
  }

  componentWillMount() {
    if (this.name) {
      Taro.setNavigationBarTitle({
        title: this.name
      })
    }

    this.getCart()

    this.fetchData({
      resource: 'products',
      id: this.id,
      success: this.fetchDataSuccess.bind(this),
      fail: this.fetchDataFail.bind(this),
      complete: this.fetchDataComplete.bind(this),
    })
  }

  onClickTabBar(item, itemText) {
    console.log(`点击：${item}`)

    switch (item) {
      case'icon':
        Taro.switchTab({
          url: '/pages/shop/cart'
        })
        break
      case 'primary':
        this.setState({
          actionSheet: true,
          actionSheetAction: item,
          actionSheetActionText: itemText
        })
        break
      case 'secondary':
        this.setState({
          actionSheet: true,
          actionSheetAction: item,
          actionSheetActionText: itemText
        })
        break
    }
    console.log(`actionSheet: ${this.state.actionSheet}`)
  }

  async addCartItem(item) {
    console.log('addCartItem', item)
    const response = await Taro.request({
      method: 'POST',
      url: `${API_WS}/cart-item`,
      data: item,
    })

    switch (response.statusCode) {
      case 200:
      case 201:
        Taro.atMessage({
          message: '操作成功',
          type: 'success'
        })
        this.setState({
          cartIndicator: true
        })
        break

      default:
        Taro.atMessage({
          message: '操作失败',
          type: 'error'
        })
        break
    }
  }

  onClickActionSheetAction(obj) {
    const {action, quantity} = obj
    const {product} = this.state

    console.log(`action: ${action} quantity: ${quantity}`)
    switch (action) {
      case 'secondary':
        this.addCartItem({
          product_id: product.id,
          quantity
        })
        break
    }
    this.setState({
      actionSheet: false
    })
  }

  render() {
    const {product, placeholder, serviceError, errorPageMessage, indicatorDots, actionSheet, actionSheetAction, actionSheetActionText, cartIndicator} = this.state
    const tabList = [
      {title: '描述'},
      {title: '参数'},
    ]

    const page = (
      <View className='pb-3'>
        <Placeholder className='m-3' show={placeholder} type='product' />
        {!placeholder &&
        <View>
          <ProductPageCard data={product} indicatorDots={indicatorDots} />
          {/*<Text className='material-icons m-10' style='font-size: 48px; color: #645394'>account_circle</Text>*/}
          <MaterialIcon className='m-3' icon='face' size='24' color='#000' />
          <ProductPageTab data={product} tabList={tabList} />
          <ProductPageActionSheet
            show={actionSheet}
            actionSheetAction={actionSheetAction}
            actionText={actionSheetActionText}
            onClick={this.onClickActionSheetAction.bind(this)}
            data={product}
          />
        </View>
        }
        <ProductPageTabBar
          primary='立即购买'
          secondary='加入购物车'
          icon='shopping_basket'
          disabled={false}
          disabledText='暂时无货'
          onClick={this.onClickTabBar.bind(this)}
          dot={cartIndicator}
        />
      </View>
    )

    const errorPage = (
      <ErrorPage content={errorPageMessage} />
    )

    return (
      <view>
        <AtMessage />
        {serviceError ? errorPage : page}
      </view>
    )
  }
}

export default ProductShow

