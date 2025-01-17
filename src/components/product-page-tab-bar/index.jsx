import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtBadge, AtButton } from "taro-ui";
import MaterialIcon from "../material-icon";

class ProductPageTabBar extends Component {
  config = {
    navigationBarTitleText: "ProductPageTabBar"
  }

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: '',
    primary: '',
    secondary: '',
    icon: '',
    disabled: true,
    disabledText: '',
    dot: false,
    onClick: ()=>{ }
  }

  handleClick() {
    this.props.onClick(...arguments)
  }

  render() {
    const {primary, secondary, icon, disabled, disabledText, dot} = this.props

    const iconItem = (
      <View className='at-tab-bar__item tab-bar__icon' onClick={this.handleClick.bind(this, 'icon')}>
        <AtBadge dot={dot}>
          <View className='at-tab-bar__icon'>
            <MaterialIcon icon={icon} color='#000' />
          </View>
        </AtBadge>
      </View>
    )

    const primaryItem = (
      <View className='tab-bar__item'>
        <AtButton disabled={disabled} type='primary' onClick={this.handleClick.bind(this, 'primary', primary)}>
          {disabled ? disabledText : primary}
        </AtButton>
      </View>
    )

    const secondaryItem = (
      <View className='tab-bar__item'>
        <AtButton disabled={disabled} type='secondary' onClick={this.handleClick.bind(this, 'secondary', secondary)}>
          {secondary}
        </AtButton>
      </View>
    )
    return (
      <View className={this.props.className}>
        <View className='at-tab-bar at-tab-bar--fixed tab-bar'>
          {icon && iconItem}
          {secondary && secondaryItem}
          {primary && primaryItem}
        </View>
      </View>
    )
  }
}

export default ProductPageTabBar

