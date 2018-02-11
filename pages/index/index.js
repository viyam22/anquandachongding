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
    var pathUrl; 
    var questionData = app.globalData.questionData;
    if (questionData.life === 0 && !questionData.options) {
      pathUrl = path.answerBeforePage;
    } else {
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
  
})
