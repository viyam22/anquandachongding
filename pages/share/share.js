const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    questionData: null,
    lifeCount: 0,
    starttime: 0,
    showTime: 0,
    showText: 0,
  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中...'
    });

    wx.request({
      url: config.requestBaseURL + api.getAd,
      data: {
        token: config.token,
        openid: app.globalData.openid,
        position:2
      },
      success: ({ data }) => {
        if (data.code === 0) {
          console.log('ad', data.data)
    
          wx.hideLoading();

       
      
        }
      }
    });


    // if (parseInt(this.data.questionData.life) !== 0) this.toAnswerPage();
  },
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: _this.data.questionData.share_msg,
      imageUrl: _this.data.questionData.share_image,
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
  toRulePage: function () {
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


})
