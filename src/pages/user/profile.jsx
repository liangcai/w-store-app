import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'

class UserProfile extends Component {
  config = {
    navigationBarTitleText: "我的信息"
  }

  state = {
    username: ''
  }

  async componentWillMount() {
    try {
      const tokensStorage = await Taro.getStorage({
        key: 'token'
      })

      const { username } = tokensStorage.data

      if (username) {
        this.setState({
          username
        })
      }
    } catch (error) {
      Taro.navigateTo({
        url: '/pages/user/account'
      })
    }
  }

  render() {
    const { username } = this.state
    return (
      <View>
      <View className='page-demo'>
        {username ? username : 'UserProfile'}
      </View>
      </View>
    )
  }
}

export default UserProfile
