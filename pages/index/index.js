const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],
    openid:[],
    indexData: []    // 首页数据
  },

  onShow: function() {
    var _this = this;
    var getApi = setInterval(function() {
      if (app.globalData.indexData) {
        _this.setData({ indexData: app.globalData.indexData })
        clearInterval(getApi);
      }
    }, 500)
  },

  toExamPage: function() {
    wx.navigateTo({
      url: path.answerBeforePage
    })
  },

  toRankPage: function() {
    wx.navigateTo({
      url: path.rankPage
    })
  },

  toRulePage: function() {
    wx.navigateTo({
      url: path.rulePage
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
    
  }
})
