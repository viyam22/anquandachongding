const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    questionData: null,
    lifeCount: 0,
    starttime: 0,
    showTime: 0,
    showText:0,
  },

  onLoad: function() {
    this.setData({ 
      questionData: app.globalData.questionData,
      starttime: app.globalData.questionData.starttime,
      type: app.globalData.questionData.type
    })
    this.getCountDown();

    // if (parseInt(this.data.questionData.life) !== 0) this.toAnswerPage();
  },

  getCountDown: function() {
    var _this = this;
   
    if (_this.data.type === 3){
      _this.setData({
        showText:1
      })
      return;
    }

    if (_this.data.starttime < 0) {
      wx.navigateTo({
        url: path.answerPage
      })
    } else {
      var countDown = setInterval(function() {
        if (_this.data.starttime === 0) {
          clearInterval(countDown)
          wx.navigateTo({
            url: path.answerPage
          })
        } else {
          var starttime = _this.data.starttime, showTime;
          if (starttime > 3600) {
            showTime = Math.floor(starttime / 3600) + '小时' + Math.floor((starttime % 3600) / 60) + '分' + starttime % 60 + '秒';
          } else if (starttime < 3600 && starttime > 60) {
            showTime = Math.floor(starttime / 60) + '分' + starttime % 60 + '秒';
          } else {
            showTime = starttime + '秒'
          }
          
          _this.setData({ 
            starttime: starttime -1,
            showTime: showTime
          })
        }
      }, 1000)
    }
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
      success: function(res) {
        // 转发成功
        console.log(res);
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

  
})
