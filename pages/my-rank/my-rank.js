const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    rankData: null,
    userInfo: null
  },
  
  onLoad: function() {
    var _this = this;
    _this.setData({ 
      rankData: app.globalData.rankData,
      userInfo: app.globalData.userInfo 
    })
  },
})
