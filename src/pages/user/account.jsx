import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton, AtMessage } from "taro-ui"

class UserAccount extends Component {
  config = {
    navigationBarTitleText: "登录"
  }

  static options = {
    addGlobalClass: true
  }

  state = {
    username: '',
    password: '',
    action: 'login',
    submitButtonText: '登录'
  }

  async userLogin() {
    const {username, password} = this.state

    const response = await Taro.request({
      method: 'POST',
      url: `${API_WS}/user-login`,
      data: {
        username,
        password
      }
    })

    switch (response.statusCode) {
      case 200:
        await Taro.setStorage({
          key: 'token',
          data: response.data
        })

        Taro.eventCenter.trigger('user::logged_in', response.data)
        Taro.navigateBack()

        break
      case 404:
        Taro.atMessage({
          type: 'error',
          message: response.data
        })
      case 401:
        Taro.atMessage({
          type: 'error',
          message: response.data
        })
        break
    }
  }

  handleChange(field, value) {
    this.setState({
      [field]: value
    })
  }

  async userRegister() {
    const {username, password} = this.state

    const response = await Taro.request({
      method: 'POST',
      url: `${API_WS}/users`,
      data: {
        username,
        password
      }
    })

    switch (response.statusCode) {
      case 201:
        this.userLogin()
        break
      case 409:
        Taro.atMessage({
          type: 'error',
          message: response.data
        })
        break
    }
  }


  handleClick(field) {
    switch (field) {
      case 'login':
        this.userLogin(this)
        break
      case 'register':
        this.userRegister(this)
        break
    }
  }

  handleClickText(text) {
    switch (text) {
      case 'register':
        Taro.setNavigationBarTitle({
          title: '注册用户'
        })

        this.setState({
          action: 'register',
          submitButtonText: '注册用户'
        })
        break
      case 'login':
        Taro.setNavigationBarTitle({
          title: '登录'
        })

        this.setState({
          action: 'login',
          submitButtonText: '登录'
        })
        break
      case 'wxlogin':
        this.wxUserLogin()
        break
    }
  }

  async wxLoginCode() {
    try {
      const response = await Taro.login()
      const {code} = response
      return code
    } catch (error) {
      Taro.atMessage({
        type: 'error',
        message: '微信登录失败， 请重试！'
      })
    }
  }

  async wxUserLogin(){
    console.log('微信登录')
    const code = await this.wxLoginCode()
    console.log('登录凭证: ', code)

    if (!code) return

    try {
      const response = await Taro.request({
        method: 'POST',
        url: `${API_WS}/wx-login`,
        data: {
          code
        }
      })
    } catch (error) {
      Taro.atMessage({
        type: 'error',
        message: '微信登录失败，请重试!'
      })
    }
  }

  render() {
    const {action, submitButtonText} = this.state

    const registerText = (
      <Text
        className='px-2'
        onClick={this.handleClickText.bind(this, 'register')}
      >注册用户</Text>
    )

    const loginText = (
      <Text
        className='px-2'
        onClick={this.handleClickText.bind(this, 'login')}
      >登录
      </Text>
    )

    const wxLoginText = (
      <Text
        className='px-2'
        onClick={this.handleClickText.bind(this, 'wxlogin')}
      >微信登录
      </Text>
    )

    return (
      <View className='pt-5 m-5 form'>
        <AtMessage />
        <AtInput
          name='username'
          type='text'
          placeholder='用户'
          value={this.state.username}
          onChange={this.handleChange.bind(this, 'username')}
          className='mb-3'
        />
        <AtInput
          name='password'
          type='password'
          placeholder='密码'
          value={this.state.password}
          onChange={this.handleChange.bind(this, 'password')}
          className='mb-3'
        />
        <AtButton
          type='primary'
          onClick={this.handleClick.bind(this, action)}
          className='mt-5'
        >{submitButtonText}</AtButton>
        <View className='mt-3 text-center text-muted'>
          {action === 'login' && registerText}
          {action === 'register' && loginText}
          /
          {wxLoginText}
        </View>
      </View>
    )
  }
}

export default UserAccount
