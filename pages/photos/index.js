//index.js
//获取应用实例
const app = getApp()
const AV = require('../../lib/av-weapp-min.js');
var config = require('../../config.js');
// var XXQG = AV.Object.extend('xxqg');

Array.prototype.randomGet = function () {
  var len = this.length;
  var key = Math.floor(Math.random() * len);
  var value = this.valueOf();
  return value[key];
}

const getDataForRender = todo => ({
  images: [todo.get('addr')],
  id: todo.get('objectId'),
  backgroundColor: new Array('#F4A7B9', '#BF6766', '#B47157', '#F9BF45', '#FFC408', '#939650', '#86C166', '#66BAB7', '#7DB9DE','#8B81C3','#B28FCE','#6A8372').randomGet()
});

Page({
  data: {
    userInfo: {}, 
    brick_option:{},
    dataSet:[],
    skipindex:10
  },  


  onLoad: function () {
    var that = this;

    // make options about bricklayout
    var brick_option = {}
    brick_option.defaultExpandStatus = false;
    brick_option.backgroundColor = '#ababab';
    brick_option.forceRepaint = false;
    brick_option.columns = 3;
    brick_option.imageFillMode = 'widthFix';
    that.setData({
      brick_option: brick_option
    });
    // make options about bricklayout  ends

    // fill the initial data 
    new AV.Query('xxqg').limit(20)
      .find().then(todos => this.setData({
        dataSet: todos.map(getDataForRender)
      }))
      .catch(console.error);
    // fill the initial data ends 
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onPullDownRefresh: function () { //下拉刷新
    var skipindex = this.data.skipindex;
    new AV.Query('xxqg').skip(this.data.skipindex)
      .find().then(todos => this.setData({
        dataSet: todos.map(getDataForRender)
      }))
      .catch(console.error);
    this.setData({
      skipindex: skipindex+10
    });  
  },
  onUnload: function () {
    // 页面关闭
  }
 
})
