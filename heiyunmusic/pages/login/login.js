// 登录流程
// 1、 收集表单数据
// 2、 前端验证
// 验证用户信息是否合法
// 3、 后端验证
// 验证用户是否存在， 验证密码是否正确

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // phone: '', //手机号
    email: '', //网易邮箱
    password: '' //用户密码
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  handleInput(event) {
    let type = event.currentTarget.id
    // console.log(type, event.detail.value)
    this.setData({
      [type]: event.detail.value
    })
  },

  async login() {
    let {
      email,
      password
    } = this.data

    if (!email) {
      wx.showToast({
        title: '邮箱不能为空',
        icon: 'error'
      })
      return;
    }
    // let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    let emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/

    if (!emailReg.test(email)) {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'error'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
      return;
    }

    let result = await request('/login', {
      email,
      password,
      isLogin: true
    })

    // console.log('hhh:', result)

    if (result.code === 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      //将用户信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))

      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    } else if (result.code === 400) {
      wx.showToast({
        title: '邮箱错误',
        icon: 'error'
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'error'
      })
    } else {
      wx.showToast({
        title: '登录失败请重新登录',
        icon: 'error'
      })
    }

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})