import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtBadge, AtButton } from "taro-ui";
import MaterialIcon from "../material-icon";

class CartPageTabBar extends Component {

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
    const {primary,
      secondary,
      icon,
      disabled,
      disabledText,
      dot,
      textButton,
      text,
      textPrimary
    } = this.props

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

    const textButtonItem = (
      <View className='tab-bar__item tab-bar__text-button'>
        <AtButton
          onClick={this.handleClick.bind(this, 'textButton', textButton)}
        >{textButton}
        </AtButton>
      </View>
    )

    const textItem = (
      <View className='tab-bar__item tab-bar__text'>
        {text && <Text className='text-muted'>{text}</Text>}
        {textPrimary && <Text className='text-bold ml-2'>{textPrimary}</Text>}
      </View>
    )

    return (
      <View className={this.props.className}>
        <View className='at-tab-bar at-tab-bar--fixed tab-bar'>
          {icon && iconItem}
          {(text || textPrimary) && textItem}
          {textButton && textButtonItem}
          {secondary && secondaryItem}
          {primary && primaryItem}
        </View>
      </View>
    )
  }
}

export default CartPageTabBar

