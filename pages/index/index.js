const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],
    openid:[],
    indexData: [],    // 首页数据
    showPageType: -1,
    time: 0
  },

  onShow: function() {
    var _this = this;
    var showPageType;
    var getApi = setInterval(function() {
      if (app.globalData.indexData) {
        _this.setData({ indexData: app.globalData.indexData })
        clearInterval(getApi);
        if (!_this.data.indexData.ad) {
          showPageType = 0;
        } else {
          showPageType = 1;
          _this.toIndexPage();
        }
        _this.setData({ showPageType: showPageType })
      }
    }, 500);
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
    var pathUrl; 
    var questionData = app.globalData.questionData;
    if (questionData.type === 1 || questionData.type === 3) {
      pathUrl = path.answerBeforePage;
    } else if (questionData.type === 2) {
      pathUrl = path.answerPage;
    }
    wx.navigateTo({
      url: pathUrl
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
  }
})
