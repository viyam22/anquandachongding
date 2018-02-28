const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    money:0,
    phone:''
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
          phone: data.data.phone
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
        wx.showModal({
          title:'操作成功',
          content: data.data.msg,
          showCancel:false,
      
          success:function(res){
            if (res.confirm) {
              wx.navigateBack({
                delta: 3
              })
              // wx.redirectto({
              //   url: path.indexPage,
              //   complete: function () {
              //   }
              // })
            }
          }
        })
      }
    })
  }
})
