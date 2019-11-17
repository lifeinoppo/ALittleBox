//index.js
//获取应用实例
const app = getApp()
var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var config = require('../../config.js');
var moment = require('../../utils/moment-with-locales.js');
const AV = require('../../lib/av-weapp-min.js');
AV.init({
  appId: config.secret.lean.appId,
  appKey: config.secret.lean.appKey
});


Array.prototype.randomGet = function () {
  var len = this.length;
  var key = Math.floor(Math.random() * len);
  var value = this.valueOf();
  return  value[key];
}

const getDataForRender = book => ({
  images: [book.get('img')],
  content: book.get('name') + book.get('desc'),
  id: book.get('objectId'),
  backgroundColor: new Array('#1A94BC', '#B2BBBE', '#D8E3E7', '#22A2C3', '#B0D5DF', '#126E82', '#0F95B0','#58B2DC','#3A8FB7').randomGet()
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    takephoto_txt:"",
    brick_option: {},
    dataSet: [],
    skipindex: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Bmob.initialize(config.secret.bmob.appId, config.secret.bmob.appKey);
    moment.locale('zh-cn');
    
    // make options about bricklayout
    var brick_option = {}
    brick_option.defaultExpandStatus = false;
    brick_option.backgroundColor = '#66BBCE';
    brick_option.forceRepaint = false;
    brick_option.columns = 2;
    brick_option.imageFillMode = 'widthFix';
    this.setData({
      brick_option: brick_option
    });

    // fill the initial data 
    new AV.Query('books').limit(20)
      .find().then(todos => this.setData({
        dataSet: todos.map(getDataForRender)
      }))
      .catch(console.error);
  },

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    // 获取剪贴板内容，进行判断
    wx.getClipboardData({
      success: function (res) {
        var clipstr = res.data;
        if (clipstr.indexOf('read.douban') >= 0) {
            
        }
      }
    })
  },

  /**
   * 生命周期函数--监听被展示时调用
   */
  onShow: function(){
    
  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () { //下拉刷新
    var skipindex = this.data.skipindex;
    new AV.Query('books').skip(this.data.skipindex)
      .find().then(books => this.setData({
        dataSet: books.map(getDataForRender)
      }))
      .catch(console.error);
    this.setData({
      skipindex: skipindex + 10
    });
  },


  /**
   * 跳转到拍照界面
   */
  takePhoto: function(){
    
      wx.chooseImage({
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'], 
        success: function (res) {

          // console.log(moment().format('llll'))
          var tempFiles = res.tempFiles;
          for (let item of tempFiles) {
            var extension = /\.([^.]*)$/.exec(item.path);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = moment().format('llll')+ "." + extension; //上传图片名
            var filepath = [item.path]
            // console.log('item', item.path)
            var file = new Bmob.File(name, filepath);
            file.save().then(function(res){
                wx.request({
                  url: 'https://xjnyolqhovwi.leanapp.cn/text',
                  method: 'POST',
                  data: {
                    addr: res.url(),
                    time: moment().format('llll')
                  },
                  header: {
                    //设置参数内容类型为json
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    // console.log("request success", res);
                  },
                  fail: function (res) {
                    // console.log("request fail", res);
                  },
                });
            });
          }
        }  
        
        })
   
  },



  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
