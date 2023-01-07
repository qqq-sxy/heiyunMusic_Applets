//封装请求
// 封装功能函数
// 1、 功能点明确
// 2、 函数内部应该保留固定代码（ 静态）
// 3、 将动态的数据抽取成形参， 由使用者根据自身的情况动态传入实参
// 4、一个良好的功能函数应该设置形参的默认值

// 封装功能组件
// 1、 功能点明确
// 2、 组件内部保留静态的代码
// 3、 将动态的数据抽取成props参数， 由使用者根据自身的情况以标签属性的形式动态传入props数据4
// 4、一个良好的组件应该设置组件的必要性及数据类型

// props: {
//   msg: {
//     required: true,
//     default: 默认值，
//     type: 类型
//   }
// }

import config from '../utils/config'


export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.IPhost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        console.log('请求成功');
        if (data.isLogin) {
          //将用户的cookie存到本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        console.log('请求失败');
        reject(err)
      }
    })
  })

}