const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    money:0
  },
  onLoad: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...'
    });

    wx.request({
      url: config.requestBaseURL + api.getMoney,
      data: {
        token: config.token,
        openid: app.globalData.openid
      },
      success: ({ data }) => {
        this.setData({
          money: data.data.money,
        })
        wx.hideLoading();
      }
    })
  },
  submit:function(){
    var _this = this;
    wx.showLoading({
      title: '加载中...'
    });

    wx.request({
      url: config.requestBaseURL + api.putMoney,
      data: {
        token: config.token,
        openid: app.globalData.openid
      },
      success: ({ data }) => {
        wx.hideLoading();
        wx.showToast({
          title: data.data.msg,
          icon: 'success',
          complete:function(){
            setTimeout(function(){
              wx.navigateTo({
                url: path.rankPage,
                complete: function () {
                }
              })
            },1500)
         
          }
        })
      }
    })
  }
})
