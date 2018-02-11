const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    ruleData: null
  },

  onReady: function(){

    this.setData({ ruleData: app.globalData.ruleData })
    console.log('*******  rulePage   *******', app, this.data.ruleData)
  },
  
  toIndexPage: function() {
    wx.navigateTo({
      url: path.indexPage
    })
  },


})
