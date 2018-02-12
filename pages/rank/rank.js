const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],    // 用户信息
    rankData: [],    // 储存接口中的排行数据
    showData: [],    // 展示数据
    tagIndex: 0
  },
  
  onLoad: function() {
    var _this = this;
    this.toggleTag();
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: config.requestBaseURL + api.getRank,
      data: {
        token: config.token,
        openid: app.globalData.openid
      },

      success: ({data}) => {
        wx.hideLoading();
        if (data.code === 0) {
          console.log('rank', data.data)
          app.globalData.rankData = data.data;
          this.setData({ 
            rankData: app.globalData.rankData,
            userInfo: app.globalData.userInfo 
          })
        }
      }
    });
  },

  toggleTag: function(e) {
    var _this = this;
    var showData = [];
    var len = _this.data.rankData || 2;
    var tagIndex = e ? parseInt(e.target.dataset.type) : _this.data.tagIndex;
    if (_this.data.rankData) {

      for (var i = 0; i < len; i++) {
        if (_this.data.rankData[i].type === 'friend' && tagIndex === 0) {
          showData = _this.data.rankData[i];
        } else if (_this.data.rankData[i].type === 'world' && tagIndex === 1) {
          showData = _this.data.rankData[i];
        } 
      }
    }
    _this.setData({ 
      tagIndex: tagIndex,
      showData: showData
    })
  },

  toPrizePage: function() {
    var pathUrl = parseInt(this.data.rankData.prize_type) === 1 ? path.prizePage : path.indexPage;
    wx.navigateTo({
      url: pathUrl
    })
  },

  toIndexPage: function() {
    wx.navigateTo({
      url: path.indexPage
    })
  }
  
})
