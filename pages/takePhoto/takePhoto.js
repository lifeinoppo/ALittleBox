// pages/takePhoto/takePhoto.js
// 此文件已经废弃不用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: "front",
    width: 0,
    height: 0,
    gap:0,
    hasTakePhoto: false,
    src: "",
    logo: "../../assets/imgs/takephoto_meitu_1.jpg",
    resdata:{},   // 为了记录返回数据
    windowWidth: 0,
    backimgwidth:0,
    backimgheight:0,
    canvasWidth:0,
    canvasHeight:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 先读取设备参数
    var myCanvasWidth = 0;
    var myCanvasHeight = 0;
    var res = wx.getSystemInfoSync();
    var windowWidth = res.screenWidth;
    var windowHeight = res.screenHeight;
    var windowscale = windowHeight / windowWidth;
    that.setData({windowWidth:windowWidth});
    that.setData({windowHeight: windowHeight });  

    // 自适应canvas
    myCanvasWidth = res.windowWidth ;
    myCanvasHeight = res.windowHeight - 200 ;
    that.setData({
      canvasWidth: myCanvasWidth,
      canvasHeight: myCanvasHeight
    })
    
  

    // width and height set ahead 
    var backpic_width = 1581;
    var backpic_height = 2319;
    that.setData({
      backimgwidth: backpic_width,
      backimgheight: backpic_height
    })

    // 使用自带的摄像头
    // canvas 绘背景图
    let width = that.data.windowWidth;
    let height = that.data.windowHeight;
    let backwidth = that.data.backimgwidth;
    let backheight = that.data.backimgheight;
    const ctx = wx.createCanvasContext('myCanvas');
    

    wx.chooseImage({
      count: 1,
      success: function (res) {
        // 这里无论用户是从相册选择还是直接用相机拍摄，拍摄完成后的图片临时路径都会传递进来
        var filePath = res.tempFilePaths[0];
        // add by jxc 20181002,for face detection 
        var base64_data = wx.getFileSystemManager().readFileSync(filePath,"base64");
        
        // added end by jxc 
        var access_token = '';

        wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token='+access_token,
          data: { 'image': base64_data, 'image_type': 'BASE64', 'face_type': 'LIVE', 'face_field':'gender'},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          },// 设置请求的 header
          success: function (res) {
            if (res.statusCode == 200) {
              /*
              console.log('人脸数目： ' + res.data.result.face_num);
              console.log('人脸左： ' + res.data.result.face_list[0].location.left);
              console.log('人脸上： ' + res.data.result.face_list[0].location.top);
              console.log('人脸宽： ' + res.data.result.face_list[0].location.width);
              console.log('人脸高： ' + res.data.result.face_list[0].location.height);
              */
              var face_bias = 40;  // 修正量
              var width_bias = 20;
              var cloth_bias = 10; // 衣服的偏移量
              var face_left = res.data.result.face_list[0].location.left;
              var face_top = res.data.result.face_list[0].location.top - face_bias;
              var face_width = res.data.result.face_list[0].location.width;
              var face_height = res.data.result.face_list[0].location.height + face_bias;
              var maleorfemale = res.data.result.face_list[0].gender.type; // 自动判断男性或女性
              // console.log("male or female : "+maleorfemale)
              var des_head_ratio = 6.4;
              var des_head_width = width / des_head_ratio;
              var des_head_height = width / des_head_ratio;
              // console.log('error code : ' + res.error_code + res.error_msg);

              // 画人像
              ctx.drawImage(filePath, face_left, face_top, face_width, face_height, (width - des_head_width) / 2 + width_bias, (height - des_head_height) / 2 - 150, des_head_width, des_head_height)
              // 绘制衣服,分男女
              if(maleorfemale=='male'){
              ctx.drawImage('../../images/yi-man.png', (width - des_head_width) / 2 - cloth_bias, (height + des_head_height) / 2 - 150, width/3,(height-200)/2);
              }else if(maleorfemale=='female'){
              ctx.drawImage('../../images/yi-woman.png', (width - des_head_width) / 2 - cloth_bias, (height + des_head_height) / 2 - 150, width / 3, (height - 200) / 2); 
              }
              ctx.draw()//绘制到canvas
  
            } else {
              console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
            }
          },
          fail: function () {
            console.log("index.js wx.request CheckCallUser fail");
          },
          complete: function () {
            // complete
          }
        })


      
      },
      fail: function (error) {
        console.error("调用本地相册文件时出错")
        console.warn(error)
      },
      complete: function () {

      }
    })


  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

})