const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],
    openid:[],
    indexData: [],    // 首页数据
    showPageType: -1,
    time: 3,
    adImgClass:{}
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
    console.log(111);
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
          } else if (questionData.type === 2) {
            pathUrl = path.answerPage;
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
    wx.navigateTo({
      url: path.answerBeforePage
    })
  },
  openNewApp:function(){
    var appid = config.newAppId;
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
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    };
  },
})
