import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtActionSheet, AtButton} from "taro-ui";

class ProductPageActionSheet extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    show: false,
    action: '',
    actionText: '',
  }


  render() {
    const { show, action, actionText } = this.props
    console.log(`show: ${show}`)
    return (
      <View className='action-sheet'>
        <AtActionSheet isOpened={show}>
          <View className='p-3'>
            ActionSheet
          </View>
          <View className='action-sheet__action'>
            <AtButton type={action}>{actionText}</AtButton>
          </View>
        </AtActionSheet>
      </View>
    )
  }
}

export default ProductPageActionSheet
