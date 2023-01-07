import request from "../../utils/request";
import PubSub from "pubsub-js";
import moment from "moment";
//获取全局实例
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    song: {}, //歌曲详情对象
    musicId: "",
    musicLink: "", //音乐的链接
    currentTime: "00:00", //实时时间
    durationTime: "00:00", //总时长
    currentWidth: 0, //实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //options专门用来接收路由跳转传参的
    //原生小程序路由传参。对小程序的长度有限制，如果参数过长会被自动截取
    let musicID = options.musicID;
    this.setData({
      musicID,
    });
    this.getMusicInfo(musicID);

    /*
     * 问题： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
     * 解决方案：
     *   1. 通过控制音频的实例 backgroundAudioManager 去监视音乐播放/暂停
     *
     * */
    //判断当前页面音乐是否在播放
    if (
      appInstance.globalData.isMusicPlay &&
      appInstance.globalData.musicID == musicID
    ) {
      //修改当前前页面播放状态为true
      this.setData({
        isPlay: true,
      });
    }
    //监视音乐播放和暂停
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {
      //修改音乐是否播放的状态
      //修改是否播放
      this.changePlayState(true);

      //修改全局音乐播放的状态
      appInstance.globalData.musicID = musicID;
    });

    //暂停
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });

    //停止
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    //用来监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      ///自动切换下一首音乐，并自动播放
      PubSub.publish("switchType", "next");
      //将实时进度条的长度还原成0
      this.setData({
        currentWidth: 0,
        currentTime: "00:00",
      });
    });
    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log("总时长：", this.backgroundAudioManager.duration);
      // console.log("实时时长：", this.backgroundAudioManager.currentTime);
      //格式化实时的播放时间
      let currentTime = moment(
        this.backgroundAudioManager.currentTime * 1000
      ).format("mm:ss");
      let currentWidth =
        (this.backgroundAudioManager.currentTime /
          this.backgroundAudioManager.duration) *
        450;
      this.setData({
        currentTime,
        currentWidth,
      });
    });

    // //订阅来自recommendSong页面发布的musicID的消息
    // PubSub.subscribe('musicID', (msg, musicID) => {
    //   console.log(1)
    //   console.log(msg, musicID);
    //   //取消订阅
    //   PubSub.unsubscribe('musicID')
    // })
  },

  //修改播放状态
  changePlayState(isPlay) {
    //修改是否播放
    this.setData({
      isPlay,
    });
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //获取音乐详情
  async getMusicInfo(musicID) {
    let songData = await request("/song/detail", {
      ids: musicID,
    });

    let durationTime = moment(songData.songs[0].dt).format("mm:ss");
    this.setData({
      song: songData.songs[0],
      durationTime,
    });
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    });
  },

  //点击暂停/播放的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    // //修改是否播放
    // this.setData({
    //   isPlay
    // })
    let { musicID, musicLink } = this.data;
    this.musicControl(isPlay, musicID, musicLink);
  },

  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicID, musicLink) {
    if (isPlay) {
      //音乐播放

      if (!musicLink) {
        //获取音乐的播放链接
        let musicLinkData = await request("/song/url", {
          id: musicID,
        });
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink,
        });
      }
      //创建控制音乐播放的实例
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      //暂停音乐
      this.backgroundAudioManager.pause();
    }
  },

  //点击切歌的回调
  handleSwitch(event) {
    //获取切歌的类型
    let type = event.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    // //订阅来自recommendSong页面发布的musicID的消息
    PubSub.subscribe("musicID", (msg, musicID) => {
      console.log(musicID);
      //获取音乐的详情信息
      this.getMusicInfo(musicID);
      //自动播放当前的音乐
      this.musicControl(true, musicID);
      //取消订阅
      PubSub.unsubscribe("musicID");
    });

    //发布消息给recommendSong
    PubSub.publish("switchType", type);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
