import Taro, { Component } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import classNames from 'classnames'
import { AtInputNumber } from "taro-ui"
import MaterialIcon from "../material-icon"

class CartItem extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      selectStatus: false,
    }
  }
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    item: {},
    editing: false,
    selected: []
  }

  handleClick(type, selectStatus) {
    this.setState({
      selectStatus: !selectStatus
    }, ()=>{
      console.log('handleclick, state:', this.state)
      const {item, selected} = this.props
      const {product_id} = item
      const selectedSet = new Set(selected)

      if (!selectedSet.has(product_id)) {
        selectedSet.add(product_id)
      } else {
        selectedSet.delete(product_id)
      }

      this.props.onChange(type, [...selectedSet])
    })
  }

  handleChangeInput(id, value) {
    this.props.onChange('input', value, id)
  }

  render() {
      const {item, editing, index } = this.props
      const {
        product_id: product_id,
        name: title,
        image: image,
        price: price,
        quantity: quantity,
        total: total,
      } = item
      const {selectStatus} = this.state
      const classValue = classNames('list__item', {
        'at-checkbox__option--selected': selectStatus
      })

      const checkbox = (
        <View className='list__item-checkbox' onClick={this.handleClick.bind(this, 'checkbox', selectStatus, index)}>
          <View className='at-checkbox__icon-cnt'>
            <Text className='at-icon at-icon-check'></Text>
          </View>
        </View>
      )

      const removeItem = (
        <View className='list__item-checkbox'>
          <MaterialIcon icon='remove_circle' size='24' className='mt-2' />
        </View>
      )

      const inputNumber = (
        <AtInputNumber
          min={1}
          max={100}
          step={1}
          value={quantity}
          className='my-2'
          onChange={this.handleChangeInput.bind(this, product_id)}
        />
      )

      const quantityItem = (
        <View className='list__item-content-item mb-1'>
          <Text className='text-muted'>
            {'￥' + price + ' × ' + quantity}
          </Text>
        </View>
      )

      return <View
        key={index}
        className={classValue}
      >
        {editing ? removeItem : checkbox}
        <Image className='list__item-image' src={image} mode='aspectFit' onClick={this.handleClick.bind(this, 'checkbox', selectStatus, index)} />
        <View className='list__item-content'>
          <View className='list__item-content-header mb-1'>
            {title}
          </View>
          {editing ? inputNumber : quantityItem}
          <View className='list__item-content-footer'>
            <Text>{'￥' + total}</Text>
          </View>
        </View>
      </View>
    }
}

export default CartItem
