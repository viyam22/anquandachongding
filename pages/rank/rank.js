const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],    // 用户信息
    rankData: [],    // 储存接口中的排行数据
    showData: [],    // 展示数据
    tagIndex: 0,
    image:'',
    showTime:'计算中',
    starttime:'',

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
            userInfo: app.globalData.userInfo ,
            showData: app.globalData.rankData.friend
          })
  
          if(data.data.type==2){
            var starttime = data.data.starttime;
            this.setData({
              starttime: starttime,
            })
            var d=setInterval(function(){

              if (_this.data.starttime === 0) {
                clearInterval(d)
                // wx.navigateTo({
                //   url: path.rulePage
                // })
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
                  showTime: showTime,
                  starttime: starttime-1
                })
              }
           
            },1000)
           
            _this.setData({
              image: data.data.image,
            })
          }
        }
      }
    });
  },

  toggleTag: function(e) {
    var _this = this;
    var showData = [];
    var len = _this.data.rankData || 2;
    var tagIndex = e ? parseInt(e.target.dataset.type) : _this.data.tagIndex;
    if (tagIndex === 0){
      showData = _this.data.rankData.friend;
    }else{
      showData = _this.data.rankData.world;
    }
    _this.setData({ 
      tagIndex: tagIndex,
      showData: showData
    })
  },

  toPrizePage: function() {
    var pathUrl;
    if (this.data.rankData.prize_type==1){
       pathUrl = path.prizePage;
    }else{
      pathUrl = path.money;
    }

    wx.navigateTo({
      url: pathUrl
    })
  },
  toPrizePage2:function(){
    var pathUrl = path.money;
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
