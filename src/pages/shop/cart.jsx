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
    selectedItems: [],
    editing: false,
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

  onChangeCartItem(type, value) {
    switch (type) {
      case 'checkbox':
        this.setState({
          selectedItems: value
        })

        break
      case 'input':
        console.log(type, value)
        break
    }
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

  onClickTabBar(type) {
    switch (type) {
      case 'textButton':
        this.setState({
          editing: true
        })

        Taro.setNavigationBarTitle({
          title: '编辑购物车'
        })
        break
      case 'textButtonAlt':
        this.setState({
          editing: false
        })
        Taro.setNavigationBarTitle({
          title: '购物车'
        })
        break
    }
  }

  render() {
    const {cart, selectedItems, editing} = this.state

    const quantity = this.sumItems(cart.items, selectedItems, 'product_id', 'quantity')
    const total = this.sumItems(cart.items, selectedItems, 'product_id', 'total')

    const tabBarText = `(${quantity}) 件`
    const tabBarTextPrimary = `￥${total}`
    console.log('cart.state', this.state)
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
          editing={editing}
        />
        <CartPageTabBar
          primary='提交订单'
          disabled={selectedItems.length === 0}
          disabledText='请先选择'
          textButton='编辑'
          textButtonAlt='完成'
          text={tabBarText}
          textPrimary={tabBarTextPrimary}
          onClick={this.onClickTabBar.bind(this)}
        />
      </View>
    )
  }
}

export default ShopCart
