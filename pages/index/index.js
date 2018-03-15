const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],
    openid:[],
    indexData: [],    // 首页数据
    showPageType: -1,
    time: 3,
    adImgClass:{},
    linkappid:''
  },
  onShow: function() {
    var _this = this;
 
    var has=setInterval(function(){
 
      if (!app.globalData.openid){
        return;
      }else{
        clearInterval(has);
        _this.initIndexData();
      }
    },500)


    var showPageType;
  
    wx.showLoading({
      title: '加载中...'
    });

    var getApi = setInterval(function() {
      if (app.globalData.indexData) {
        _this.setData({ indexData: app.globalData.indexData })
        clearInterval(getApi);
        if (!_this.data.indexData.ad || _this.data.time==0) {
          showPageType = 0;
          wx.hideLoading();
        } else {
          showPageType = 1;
          wx.hideLoading();
          _this.toIndexPage();
        }
        _this.setData({ showPageType: showPageType })
      }
    }, 200);
  },
  // 获取首页数据
  initIndexData: function () {
    var _this = this;
 
    wx.request({
      url: config.requestBaseURL + api.getIndex,
      data: {
        token: config.token,
        openid: app.globalData.openid
      },

      success: ({ data }) => {
        console.log('index', data.data)
        if (data.code === 0) {
          app.globalData.indexData = data.data;
          app.globalData.lifeCount = data.life;
          wx.hideLoading();
          _this.setData({ 
            linkappid: data.data.linkappid,
            indexData: app.globalData.indexData
            });
        }
      }
    });
  },
  toIndexPage: function() {
    var _this = this;
    var countDown = setInterval(function() {
      if (_this.data.time === 0) {
        clearInterval(countDown)
        _this.setData({ showPageType: 0 })
      } else {
        _this.setData({ time: _this.data.time -1 })
      }
    }, 1000)
  },

  toExamPage: function() {
    var _this = this;
    var pathUrl; 
    wx.showLoading({
      title:'加载中...'
    });
    wx.request({
      url: config.requestBaseURL + api.getQuestion,
      data: {
        token: config.token,
        openid: app.globalData.openid,
      },
      success: ({data}) => {
        if (data.code === 0) {
          console.log('questionData', data.data)
          app.globalData.questionData = data.data;
          var questionData = data.data;
          if (questionData.type === 1 || questionData.type === 3) {
            pathUrl = path.answerBeforePage;
          } else if (questionData.type === 2 ||
                    questionData.type === 4 ||
                    questionData.type === 5) {
            pathUrl = path.answerPage;
          } else if (questionData.type === 6) {
            // 答题活动排行榜已生成.跳转到排行版页面
            pathUrl = path.rankPage;
          }
         
          wx.navigateTo({
            url: pathUrl,
            complete:function(){
              wx.hideLoading();
            }
          })
        }
      }
    });
  },

  toRankPage: function() {
    wx.showLoading({
      title: '加载中...'
    });
    wx.navigateTo({
      url: path.rankPage,
      complete: function () {
        wx.hideLoading();
      }
    })

  },

  toRulePage: function() {
    wx.showLoading({
      title: '加载中...'
    });
    wx.navigateTo({
      url: path.rulePage,
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  toSharePage:function(){
    wx.redirectto({
      url: path.answerBeforePage
    })
  },
  openNewApp:function(){
    var appid = this.data.linkappid;
    if (!appid){
      wx.showToast({
        title: '暂未开放',
        icon: "none",
        duration: 2000
      })
      
    }else{
      wx.navigateToMiniProgram({
        appId: appid,
        path: '',
        extraData: {
          openid: app.globalData.openid
        },
        envVersion: '',
        success(res) {
          // 打开成功
          console.log(res);
        },
        fail(res){
          console.log(res);
        }
      })
    };
  },
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: _this.data.indexData.share_msg,
      imageUrl: _this.data.indexData.share_image,
      path: '/pages/index/index?openid_s=' + app.globalData.openid,
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
