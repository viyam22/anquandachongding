const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    userInfo: [],    // 用户信息
    rankData: [],    // 储存接口中的排行数据
    showData: [],    // 展示数据
    tagIndex: 0
  },

  test: function() {
    // 测试数据
    var rankData = [
    {
      "type": "friend",
      "title": "好友排名",
      "list": [
        {
          "openid": "213383",
          "nickname": "张三",
          "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
          "score": "11分11秒.123",

        },
        {
          "openid": "213383",
          "nickname": "张三",
          "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
          "score": "11分11秒.123",
        },
        {
          "openid": "213383",
          "nickname": "张三",
          "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
          "score": "11分11秒.123",
        }
      ],
      "me": [
          {
              "openid": "213383",
              "nickname": "张三",
              "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
              "score": "11分11秒.123",
              "sort": "第5名",
          },
        ]
       },
    {
      "type": "world",
      "title": "世界排名",
      "prize": "1",
      "list": [
          {
              "openid": "213383",
              "nickname": "张三",
              "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
              "score": "11分11秒.123",
          },
          {
              "openid": "213383",
              "nickname": "张三",
              "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
              "score": "11分11秒.123",
          },
          {
              "openid": "213383",
              "nickname": "李四",
              "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
              "score": "11分11秒.123",
          }
      ],
      "me": [
          {
              "openid": "213383",
              "nickname": "张三",
              "avataUrl": "http://admin.web.shuzitansuo.com/upload/images/ad/201710/b5e9a8c840f.jpg",
              "score": "11分11秒.123",
              "sort": "第115名",
          },
      ]
      }
    ]

    this.setData({ rankData: rankData })

  },

  onLoad: function() {
    this.toggleTag();
    this.setData({ 
      rankData: app.globalData.rankData,
      userInfo: app.globalData.userInfo 
    })

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
    wx.navigateTo({
      url: path.prizePage
    })
  },
  
})
