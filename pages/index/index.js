// pages/invitation/index.js
const app = getApp()
var config = require('../../config.js');
const AV = require('../../lib/av-weapp-min.js');

Array.prototype.randomGet = function () {
  var len = this.length;
  var key = Math.floor(Math.random() * len);
  var value = this.valueOf();
  return value[key];
}

const getDataForRender = film => ({
  images: [film.get('img')],
  content: film.get('name')+film.get('desc'),
  id: film.get('objectId'),
  backgroundColor: new Array('#42602D', '#B5CAA0', '#91AD70', '#90B44B', '#89916B', '#7BA23F', '#86C166', '#516E41','#91B493').randomGet()
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        animationData: "",
        userInfo: {},
        brick_option: {},
        music_url: '',
        dataSet: [],
        skipindex: 10,
        hotTag: ['剧情','喜剧','动作','爱情','科幻','动画','悬疑','惊悚','恐怖','犯罪','音乐','歌舞','传记','历史','战争','西部','奇幻','冒险','灾难','武侠']

    },

    // 提供按标签搜索功能
    searchByTag: function(e){
      var that = this;
      var keyword = e.currentTarget.dataset.keyword;
      new AV.Query('douban').contains('type',keyword).limit(20)
        .find().then(films => this.setData({
          dataSet: films.map(getDataForRender)
        }))
        .catch(console.error);
    },

    // 提供搜索梗概功能
    search: function (e) {
      var that = this;
      var keyword = e.detail.value.keyword;
      if (keyword == '') {
        message.show.call(that, {
          content: '请输入内容',
          icon: 'null',
          duration: 1500
        })
        return false
      } else {
        new AV.Query('douban').contains('desc', keyword).limit(20)
          .find().then(films => this.setData({
            dataSet: films.map(getDataForRender)
          }))
          .catch(console.error);
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // make options about bricklayout
        var brick_option = {}
        brick_option.defaultExpandStatus = false;
        brick_option.backgroundColor = '#ababab';
        brick_option.forceRepaint = false;
        brick_option.columns = 2;
        brick_option.imageFillMode = 'widthFix';
        this.setData({
          brick_option: brick_option
        });

      // fill the initial data 
      new AV.Query('douban').limit(20)
        .find().then(todos => this.setData({
          dataSet: todos.map(getDataForRender)
        }))
        .catch(console.error);
    // fill the initial data ends 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      // 获取剪贴板内容，进行判断
      wx.getClipboardData({
        success: function (res) {
          var clipstr = res.data;
          if(clipstr.indexOf('movie.douban')>=0){
            
          }
        }
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // simple request  test 

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
    onPullDownRefresh: function () { //下拉刷新
      var skipindex = this.data.skipindex;
      new AV.Query('douban').skip(this.data.skipindex)
        .find().then(todos => this.setData({
          dataSet: todos.map(getDataForRender)
        }))
        .catch(console.error);
      this.setData({
        skipindex: skipindex + 10
      });
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
    }
})