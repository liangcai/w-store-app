import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { AtCheckbox } from "taro-ui"
import fetchData from "../../utilities/fetch-data"
import CartItemList from "../../components/cart-item-list"
import CartPageTabBar from "../../components/cart-page-tab-bar"

class ShopCart extends Component {
  config = {
    navigationBarTitleText: "购物车"
  }

  state = {
    cart: {
      total: 0,
      items: []
    },
    selectedItems: []
  }

  constructor() {
    super(...arguments)
    this.fetchData = fetchData
  }

  getCartSuccess(response) {
    this.setState({
      cart: response.data
    })
  }

  getCart() {
    this.fetchData({
      resource: 'shopping-cart',
      success: this.getCartSuccess.bind(this)
    })
  }

  componentWillMount() {
    this.getCart()
  }

  componentDidShow() {
    this.getCart()
  }

  onChangeCartItem(value) {
    this.setState({
      selectedItems: value
    }, () => {
      console.log(this.state.selectedItems)
    })
  }

  sumItems(items, compareItems, compare, prop) {
    const result = items.map(item => {
      if (compareItems.includes(item[compare])) {
        return item[prop]
      }
      return 0
    })
    return result.reduce((v1, v2) => v1 + v2, 0)
  }

  render() {
    const {cart, selectedItems} = this.state

    const quantity = this.sumItems(cart.items, selectedItems, 'product_id', 'quantity')
    const total = this.sumItems(cart.items, selectedItems, 'product_id', 'total')

    const tabBarText = `(${quantity}) 件`
    const tabBarTextPrimary = `￥${total}`
    // const items = cart.items.map(item => {
    //   const {product_id, name, price, quantity, total} = item
    //   return {
    //     value: product_id,
    //     label: name,
    //     desc: `￥${price} × ${quantity} = ￥${total}`
    //   }
    // })

    // return (
    //   <View>
    //   <AtCheckbox options={items} selectedList={selectedItems} onChange={this.onChangeCartItem.bind(this)}/>
    //   </View>
    // )
    return (
      <View className='pb-5'>
        <CartItemList
          items={cart.items}
          selected={selectedItems}
          onChange={this.onChangeCartItem.bind(this)}
          className='mb-5'
        />
        <CartPageTabBar
          primary='提交订单'
          disabled={selectedItems.length === 0}
          disabledText='请先选择'
          textButton='编辑'
          textButtonAlt='完成'
          text={tabBarText}
          textPrimary={tabBarTextPrimary}
        />
      </View>
    )
  }
}

export default ShopCart
