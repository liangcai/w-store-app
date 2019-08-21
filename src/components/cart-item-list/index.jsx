import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import classNames from 'classnames'
import CartItem from "../cart-item"

class CartItemList extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    selected: [],
    items: [],
    className: ''
  }

  render() {
    const {items, selected, className, editing} = this.props
    const rootClassValue = classNames('list', className)

    return (
      <View className={rootClassValue}>
        {items.map((item, index) => {
          return (
            <CartItem
              key={index}
              item={item}
              editing={editing}
              selected={selected}
              onChange={this.props.onChange}
            />
          )
        })}
      </View>
    )
  }
}

export default CartItemList
