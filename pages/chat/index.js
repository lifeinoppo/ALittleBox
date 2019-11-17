// pages/chat/index.js
const app = getApp()
// added by jxc 
// page/recorder/index.js
var util = require('../../utils/util.js')
var qiniu = require('../../lib/qiniuUploader.js')
const SAVE_VOICE = "保存录音"
// added end by jxc 
var server = app.globalData.server;
var appid = app.globalData.appid;


var playTimeInterval;
var recordTimeInterval;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        inputValue: '',
        // for recording function by jxc 
        recording: false,
        playing: false,
        hasRecord: false,
        recordTime: 0,
        playTime: 0,
        formatedRecordTime: '00:00:00',
        formatedPlayTime: '00:00:00',
        saveVoice: SAVE_VOICE,
        tempFilePath: "",
        inputValue:'',
        // recording function vars end by jxc 
        // 增加名家名言、名著名言
        chatNum :1,
        chatList: [{ 'words': '声音，就是一种生活方式，声音让我们重新理解生活。','nickname':'知日手帖11-《听，宇宙的声音》'},]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this

        // wx.getUserInfo({
        //   success: function (res) {
        //     that.setData({
        //       userInfo: res.userInfo
        //     })
        //   }
        // })

        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: userInfo
            })
        }

      
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // 准备录音环境
      this.audioCtx = wx.createAudioContext('myAudio')
    },

    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    // add for input message handle 
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })

    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var that = this;
        //console.log(that.data);
        return {
            title: that.data.mainInfo.share,
            imageUrl: that.data.mainInfo.thumb,
            path: 'pages/index/index',
            success: function(res) {
                wx.showToast({
                    title: '分享成功',
                })
            },
            fail: function(res) {
                // 转发失败
                wx.showToast({
                    title: '分享取消',
                })
            }
        }
    },
    // add by jxc 20181111
    longpress: function (e) {
      console.log("long tap");
      // 长按录音处理
      /*  delete by jxc 20181129
      wx.showModal({
        title: '提示',
        content: '录音开始',
        showCancel: false
      })
      */
      this.startRecord();
      // 录音上传后台处理
      /*
      wx.showModal({
        title: '提示',
        content: '长按事件被触发',
        showCancel: false
      })
      */
    },

    touchEnd:function(){
        wx.showModal({
          title: '提示',
          content: '采集完成' ,
          showCancel: false
        })
        console.log(this.data.tempFilePath)
        this.stopRecord();
        // 上传录音
        var that = this;
        wx.uploadFile({
          url: 'https://xjnyolqhovwi.leanapp.cn/qiniu',
          filePath: that.data.tempFilePath,
          name: 'file',
          method: 'POST',
          formData: {
            filename: that.data.inputValue
          },
          success: function (res) {
            console.log("upload success", res);
          },
          fail: function (res) {
            console.log("upload fail", res);
          },
          });

    },

    // record function added by jxc 20181111
    startRecord: function () {
      this.setData({
        recording: true
      })

      var that = this
      recordTimeInterval = setInterval(function () {
        var recordTime = that.data.recordTime += 1
        that.setData({
          formatedRecordTime: util.formatTime(that.data.recordTime),
          recordTime: recordTime
        })
      }, 1000)

      wx.startRecord({
        success: function (res) {

          // @ tempFilePath: wxfile://    本地临时录音的路径 
          // @ errMsg:  startRecord : ok  应该是返回信息
          that.setData({
            hasRecord: true,
            tempFilePath: res.tempFilePath,
            formatedPlayTime: util.formatTime(that.data.playTime)
          })
        },
        complete: function () {
          that.setData({
            recording: false
          })
          clearInterval(recordTimeInterval)

        },
        fail: function (res) {
          wx.showToast({
            title: res.message,
            duration: 2000
          })
        }
      })
    },

    stopRecord: function () {
      wx.stopRecord()
    },

    // add for debug voice upload 
    playVoice: function () {
      var that = this
      
      wx.playVoice({
        filePath: this.data.tempFilePath,
        success: function () {
         
        }
      })
    },
    
})