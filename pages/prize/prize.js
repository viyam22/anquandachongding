const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    inputPhone: null,
    inputName: '',
    inputAdress: ''
  },
  
  // 绑定手机输入值
  bindPhoneInput: function(e) {
    this.setData({
      inputPhone: e.detail.value
    })
  },

  // 绑定姓名输入值
  bindNameInput: function(e) {
    this.setData({
      inputName: e.detail.value
    })
  },

  // 绑定地址输入值
  bindAdressTextArea: function(e) {
    this.setData({
      inputAdress: e.detail.value
    })
  },

  submit: function() {
    var _this = this;
    var inputPhone = _this.data.inputPhone,
        inputName = _this.data.inputName,
        inputAdress = _this.data.inputAdress;

    if (!inputName.replace(/\s/g, "")) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!inputPhone.replace(/\s/g, "") || inputPhone.replace(/\s/g, "").length !== 11) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!inputAdress.replace(/\s/g, "")) {
      wx.showToast({
        title: '请填写地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    wx.request({
      url: config.requestBaseURL + api.postFeedback,
      method: 'POST',
      data: {
        token: config.token,
        openid: app.globalData.openid,
        name: inputName,
        phone: inputPhone,
        detail: inputAdress
      },
      
      success: ({data}) => {
        console.log('---', data)
        if (data.code !== 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title:  data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        setTimeout(function() {
          wx.navigateTo({
            url: path.rankPage
          })
        }, config.navigateTime)
      }
    });
  },
  
})
