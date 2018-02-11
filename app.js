const { api, config, path } = require('utils/config.js');

App({
  
  onLaunch: function (res) {
 
    // 展示本地存储能力
    this.globalData.shareId = res.query.id || '0';
    // 登录
    wx.login({
      success: ({code}) => {
        if (code) {
          this.globalData.code = code;
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: ({userInfo}) => {
              this.globalData.userInfo = userInfo;

              this.getOpenid();
              // 可以将 res 发送给后台解码出 unionIds
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
      // }
      }
    })
  },

  getOpenid: function() {
    var _this = this;

    // 缓存有openid则不再请求接口
    wx.getStorage({
      key: 'openid',
      success: ({data}) => {
        _this.globalData.openid = data;
        _this.initFun();
      },
      fail: res => {
        this.userLogin();
      }
    })
  },

  // 执行各页面的接口访问
  initFun: function() {
    this.initIndexData();
    this.initQuestionData();
    this.initRuleData();
    this.initRankData();
    this.userInvite();
  },

  userInvite: function() {
    var _this = this;

    if (!_this.globalData.shareId || _this.globalData.shareId == 0) return;
    wx.request({
      url: config.requestBaseURL + api.getUserInvite,
      data: {
        token: config.token,
        openid_d: _this.globalData.openid,
        openid_s: _this.globalData.shareId
      },
      
      success: ({data}) => {
        console.log('userInvite', data.data)
      }
    });
  },

  userLogin: function() {
    var _this = this;
    if (!_this.globalData.code) return;

    wx.request({
      url: config.requestBaseURL + api.getMemberSave,
      data: {
        token: config.token,
        jscode: _this.globalData.code,
        avataUrl: _this.globalData.userInfo.avatarUrl,
        nickname: _this.globalData.userInfo.nickName,
        gender: _this.globalData.userInfo.gender
      },
      
      success: ({data}) => {
        console.log('login', data)
        if (data.code !== 0) {
          console.log(data.msg);
        }
        wx.setStorage({
          key: 'openid',
          data: data.data.openid
        })
        _this.globalData.openid = data.data.openid;
        _this.initFun();
      }
    });
  },

  // 获取首页数据
  initIndexData: function() {
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getIndex,
      data: {
        token: config.token,
        openid: _this.globalData.openid
      },
      
      success: ({data}) => {
        console.log('index', data.data)
        if (data.code === 0) {
          _this.globalData.indexData = data.data;
          _this.globalData.lifeCount = data.life;
        }
      }
    });
  },

  initQuestionData: function() {
    console.log('initQuestionData')
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getQuestion,
      data: {
        token: config.token,
        openid: _this.globalData.openid,
        
      },
      
      success: ({data}) => {
        if (data.code === 0) {
          console.log('questionData', data.data)
          _this.globalData.questionData = data.data;
        }
      }
    });
  },

  initRankData: function() {
    console.log('initAnswerData')
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getRank,
      data: {
        token: config.token,
        openid: _this.globalData.openid
      },
      
      success: ({data}) => {
        if (data.code === 0) {
          console.log('rank', data.data)
          _this.globalData.rankData = data.data;
          
        }
      }
    });
  },

  initRuleData: function() {
    console.log('initRuleData')
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getRule,
      data: {
        token: config.token,
        openid: _this.globalData.openid,
      },
      
      success: ({data}) => {
        console.log('rule', data.data)
        if (data.code === 0) {
          _this.globalData.ruleData = data.data;
        }
      }
    });
  },


  globalData: {
    lifeCount: 0,
    userInfo: null,
    code: null,
    openid: null,
    indexData: null,
    ruleData: null,
    rankData: null,
    questionData: null,
    shareId: null
  }
})