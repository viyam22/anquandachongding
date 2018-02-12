const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    ruleData: null
  },

  onReady: function(){
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getRule,
      data: {
        token: config.token,
        openid: app.globalData.openid,
      },
      
      success: ({data}) => {
        console.log('rule', data.data)
        if (data.code === 0) {
          app.globalData.ruleData = data.data;
          this.setData({ ruleData: app.globalData.ruleData })
        }
      }
    });
  },
  
  toIndexPage: function() {
    wx.navigateTo({
      url: path.indexPage
    })
  },


})
