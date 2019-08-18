import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { AtTabs, AtTabsPane, AtListItem, AtList } from "taro-ui";
import fetchData from "../../utilities/fetch-data";
import Placeholder from "../../components/placeholder";
import ErrorPage from "../../components/error-page";
// import RichTextWxParse from "../../components/rich-text-wx-parse";
import ProductPageCard from "../../components/product-page-card";
import ProductPageTab from "../../components/product-page-tab";
import MaterialIcon from "../../components/material-icon";
import ProductPageTabBar from "../../components/product-page-tab-bar";
import ProductPageActionSheet from "../../components/product-page-action-sheet";

class ProductShow extends Component {
  config = {
    navigationBarTitleText: "ProductShow",
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark',
  }

  state = {
    product: {},
    placeholder: true,
    serviceError: false,
    errorPageMessage: '',
    indicatorDots: false,
    activeTab: 0,
    actionSheet: false,
    actionSheetAction: '',
    actionSheetActionText: '',
  }

  constructor() {
    super(...arguments)
    this.fetchData = fetchData

    const {id = 1, name} = this.$router.params
    this.id = id
    this.name = name
  }

  onPullDownRefresh() {
    this.setState({
      serviceError: false,
      placeholder: true,
    }, () => {
      this.fetchData({
        resource: 'products',
        id: this.id,
        success: this.fetchDataSuccess.bind(this),
        fail: this.fetchDataFail.bind(this),
        complete: this.fetchDataComplete.bind(this)
      })
    })
  }

  fetchDataSuccess(response) {
    const {data} = response
    this.setState({
      product: data,
    })

    if (data.images.length > 1) {
      this.setState({
        indicatorDots: true
      })
    }

    Taro.setNavigationBarTitle({
      title: data.name
    })
  }

  fetchDataComplete() {
    // if (process.env.NODE_ENV === 'development') {
    //   setTimeout(() => {
    //     this.setState({
    //       placeholder: false
    //     })
    //   }, 1000)
    // } else {
    //   this.setState({
    //     placeholder: false
    //   })
    // }
    this.setState({
      placeholder: false
    })
    Taro.stopPullDownRefresh()
  }


  fetchDataFail(error) {
    this.setState({
      serviceError: true,
      errorPageMessage: error.message,
    })
  }

  componentWillMount() {
    if (this.name) {
      Taro.setNavigationBarTitle({
        title: this.name
      })
    }
    this.fetchData({
      resource: 'products',
      id: this.id,
      success: this.fetchDataSuccess.bind(this),
      fail: this.fetchDataFail.bind(this),
      complete: this.fetchDataComplete.bind(this),
    })
  }

  onClickTab(activeTab) {
    this.setState({
      activeTab
    })
    console.log('修改activeTab', activeTab)
  }

  onClickTabBar(item, itemText) {
    console.log(`点击：${item}`)

    switch (item) {
      case 'primary':
        this.setState({
          actionSheet: true,
          actionSheetAction: item,
          actionSheetActionText: itemText
        })
        break
      case 'secondary':
        this.setState({
          actionSheet: true,
          actionSheetAction: item,
          actionSheetActionText: itemText
        })
        break
    }
    console.log(`actionSheet: ${this.state.actionSheet}`)
  }

  render() {
    const {product, placeholder, serviceError, errorPageMessage, indicatorDots, activeTab, actionSheet, actionSheetAction, actionSheetActionText} = this.state
    const tabList = [
      {title: '描述'},
      {title: '参数'},
    ]

    const page = (
      <View>
        <Placeholder className='m-3' show={placeholder} type='product' />
        {!placeholder &&
        <View>
          <ProductPageCard data={product} indicatorDots={indicatorDots} />
          {/*<Text className='material-icons m-10' style='font-size: 48px; color: #645394'>account_circle</Text>*/}
          <MaterialIcon className='m-3' icon='face' size='24' color='#000' />
          <ProductPageTab data={product} tabList={tabList} activeTab={activeTab} onClick={this.onClickTab.bind(this)} />
          <ProductPageTabBar
            primary='立即购买'
            secondary='加入购物车'
            icon='shopping_basket'
            disabled={false}
            disabledText='暂时无货'
            onClick={this.onClickTabBar.bind(this)}
            dot
          />
          <ProductPageActionSheet
            show={actionSheet}
            action={actionSheetAction}
            actionText={actionSheetActionText}
          />
        </View>
        }
      </View>
    )

    const errorPage = (
      <ErrorPage content={errorPageMessage} />
    )

    return (
      <view>
        {serviceError ? errorPage : page}
      </view>
    )
  }
}

export default ProductShow

