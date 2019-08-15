import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import className from 'classnames'

class Placeholder extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: '',
    show: false,
    quantity: '1'
  }

  render() {
    const classValue = className(
      'ui placeholder',
      this.props.className
    )
    const quantity = parseInt(this.props.quantity)
    const items = [...Array(quantity).keys()]
    const {show} = this.props

    return (
      <View>
        {
          show &&
          items.map(i =>
            <View key={i} className={classValue}>
              <View className='image rectangular'></View>
              <View className='line'></View>
              <View className='very short line'></View>
            </View>
          )
        }
      </View>
    )
  }
}

export default Placeholder
