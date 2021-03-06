const { api, config, path } = require('../../utils/config.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    indexData: null,
    time: 0,
    isShow: false
  },

  onLoad: function() {
    var _this = this;

    var getApi = setInterval(function() {
      if (app.globalData.indexData) {
        _this.setData({ 
          indexData: app.globalData.indexData,
          time: config.indexAdTime
        })
        clearInterval(getApi);
        console.log('====', !_this.data.indexData.ad)
        if (!_this.data.indexData.ad) {
          wx.navigateTo({
            url: path.indexPage
          })
        } else {
          _this.setData({ isShow: true })
          _this.toIndexPage();
        }
      }
    }, 500);
  },

  toIndexPage: function() {
    var _this = this;
    var countDown = setInterval(function() {
      if (_this.data.time === 0) {
        clearInterval(countDown)
        wx.navigateTo({
          url: path.indexPage
        })
      } else {
        _this.setData({ time: _this.data.time -1 })
      }
    }, 1000)
  } 

})
