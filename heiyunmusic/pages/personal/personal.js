import request from '../../utils/request'
let startY = 0 //手指移动起始坐标
let moveY = 0 //手指移动坐标
let moveDistance = 0 //手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0px)',
    coverTransition: '',
    userInfo: {},
    recentPlayList: [] //播放记录
  },
  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY //获取手指起始坐标
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance <= 0) {
      moveDistance = 0
    }
    if (moveDistance >= 80) {
      moveDistance = 80
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo);
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },

  async getUserRecentPlayList(userId) {
    let index = 0
    let recentPlayListData = await request('/user/record', {
      uid: userId,
      type: 0
    })
    let recentPlayList = recentPlayListData.allData.splice(0, 10).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
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