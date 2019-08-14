import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtSearchBar} from "taro-ui"

class SearchBar extends Component {

  state = {
    value: ''
  }

  //值有变化的时候触发
  onChange(value) {
    this.setState({
      value: value
      })
  }

  //搜索栏默认动作按钮，按下搜索执行的动作
  onActionClick() {
    console.log(`搜索: ${this.state.value}`)
  }

  //按下键盘上的确认完成会触发
  onConfirm() {
    console.log(`键盘提交: ${this.state.value}`)
  }

  render() {
    return (
      <View>
        <AtSearchBar
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
        />
      </View>
    )
  }
}

export default SearchBar
