import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class UserAccount extends Component {
  config = {
    navigationBarTitleText: "UserAccount"
  }

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {

  }


  render() {
    return (
      <View>
        UserAccount
      </View>
    )
  }
}

export default UserAccount
