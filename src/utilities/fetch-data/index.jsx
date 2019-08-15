import Taro from '@tarojs/taro'
import buildUrl from 'build-url'

async function fetchData({
                           resource = '',
                           search = '',
                           page = '',
                           pageSize = '',
                           success = () => {
                           },
                           fail = () => {
                           },
                           complete = () => {
                           }
                         }) {
  const queryParams = {}

  if (search) queryParams.q = search
  if (page) queryParams._page = page
  if (pageSize) queryParams._limit = pageSize

  const url = buildUrl(API_WS, {
    path: resource,
    queryParams
  })

  try {
    const response = await Taro.request({
      url
    })

    const {statusCode} = response

    switch (statusCode) {
      case 200:
        if (process.env.NODE_ENV == 'development') {
          setTimeout(() => {
            success(response)
          }, 2000)
        } else {
          success(response)
        }
        break;
      default:
        throw new Error('出问题了！')
    }
  } catch (error) {
    fail(error)
    console('serviceError status: ', this.state.serviceError, error)
  }

  complete()
}

export default fetchData
