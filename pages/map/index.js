// pages/map/index.js

const app = getApp()
var server = app.globalData.server;
var appid = app.globalData.appid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })

    var mainInfo = {
      "he_tel":"18861761918",
      "she_tel":"18351505514"
    }

    var lng = 119.8453100000;
    var lat = 31.3593100000; 
    that.setData({  
      mainInfo: mainInfo,       
      lng: lng, // 全局属性，用来取定位坐标
      lat: lat,
      markers: [{
        iconPath: "/images/nav.png",
        id: 0,
        latitude: lat, // 页面初始化 options为页面跳转所带来的参数 
        longitude: lng,
        width: 50,
        height: 50
      }],       
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    //console.log(that.data);
    return {
      title: that.data.mainInfo.share,
      imageUrl: that.data.mainInfo.thumb,
      path: 'pages/index/index',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },
  callhe: function (event) {
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.he_tel
    })
  },
  addPoint: function () {
    wx.navigateTo({
      url: '/pages/add_gourmet/add_gourmet'
    })
  },
  // 气味博物馆的收藏地点展示
  showPoint: function (event) {
    wx.showToast({
      title: '功能正在开发中。。。。。',
    })
  }
})