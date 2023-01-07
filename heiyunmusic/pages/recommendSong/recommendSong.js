import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [], //推荐列表数据
    index: 0, //表示点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        success: () => {
          //跳转至登录页面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    this.getRecommendList()

    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {
        recommendList,
        index
      } = this.data
      if (type === 'pre') { //上一首
        (index === 0) && (index = recommendList.length)
        index -= 1
      } else { //下一首
        (index === recommendList.length - 1) && (index = -1)
        index += 1
      }
      //更新下标
      this.setData({
        index
      })

      let musicID = recommendList[index].id;
      // //将音乐ID回传给songDetail页面
      PubSub.publish('musicID', musicID)

    })
  },


  //获取用户每日数据
  async getRecommendList() {
    //获取每日推荐的数据
    let recommendListData = await request('/recommend/songs')
    console.log('idhu:', recommendListData.data)
    this.setData({
      recommendList: recommendListData.data.dailySongs
    })
  },

  toSongDetail(event) {
    let {
      song,
      index
    } = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicID=' + song.id,
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