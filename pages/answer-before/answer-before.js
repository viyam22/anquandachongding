const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    questionData: null,
    lifeCount: 0,
    time: 3
  },

  onLoad: function() {
    this.setData({ 
      questionData: app.globalData.questionData
    })
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
      path: '/pages/index?openid_s=' + app.globalData.openid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  toAnswerPage: function() {
    var _this = this;
    var countDown = setInterval(function() {
      if (_this.data.time === 0) {
        clearInterval(countDown)
        wx.navigateTo({
          url: path.answerPage
        })
      } else {
        _this.setData({ time: _this.data.time -1 })
      }
    }, 1000)
  }
  
})
