const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    questionData: null,
    answerData: null,
    qsort: 1,
    loseData: null,
    success: null,
    options: null,
    showPage: 0,      // 0 答题页 1成功页 2失败页
    shareImage: '',
    shareTitle: '',
    time: 0,
    showTime: '',
    itemClass: [],    // 选项的Class
    getTime: null,     // 定时器
    isShowPopup: false
  },

  onLoad: function() {
    this.setData({ 
      questionData: app.globalData.questionData
    })
    this.getTimeTip();
    this.initItem(this.data.questionData);
  },

  getTimeTip: function() {
    var _this = this;
    var time = 0, showTime;
    var getTime = setInterval(function() {
      time ++;
      showTime = time > 60 ? Math.floor(time / 60) + '分' + time % 60 + '秒' : time + '秒'
      _this.setData({ 
        time: time,
        showTime: showTime
      })
    }, 1000)
    _this.setData({ getTime: getTime });
  },

  initItem: function(data) {
    var _this = this;
    var itemClass = [];

    for(var i in data.options) {
      if (data.options.hasOwnProperty(i)) {
        if (!data.isright) {
          itemClass.push('item-default');
        } else if (data.isright === -1) {   // 答错
          if (data.answer === data.options[i]) {
            itemClass.push('item-wrong');
          } else if (data.right == i) {
            itemClass.push('item-right');
          } else {
            itemClass.push('item-default');
          }
        } else {
          if (data.answer === data.options[i]) {
            itemClass.push('item-right');
          } else {
            itemClass.push('item-default');
          }
        }
      }
    }
    _this.setData({ itemClass: itemClass })
  },

  postAnswer: function(e) {
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getAnswer,
      data: {
        token: config.token,
        openid: app.globalData.openid,
        qid: _this.data.questionData.qid,
        time: _this.data.time,
        answer: e.target.dataset.answer,
        eid: _this.data.questionData.eid
      },
      
      success: ({data}) => {
        // var data = {data :{
        //   count:1,
        //   duration:10,
        //   eid:"1",
        //   life:"1",
        //   options:{1: "罗纳尔多", 2: "C罗", 3: "梅西", 4: "克洛泽"},
        //   people:80,
        //   qid:"2",
        //   score:0,
        //   title:"世界杯进球最多的球员",
        //   total:5,
        //   type:2,
        //   answer: '克洛泽',
        //   isright: 1,
        //   right: 4
        // }}
        if (data.code === 0) {
          var answerData = data.data, shareImage = '', shareTitle = '', qsort = _this.data.qsort;
          if (!answerData.options) {
            if (answerData.type === 3) {
              // 答案正确
              clearInterval(_this.data.getTime);
              shareTitle = answerData.share_msg || '安全大冲顶';
              shareImage = answerData.share_image || '';
              setTimeout(function() {_this.setData({ showPage: 1 })}, config.showTipTime)
            } else if (answerData.type === 4) {
              // 答案错误
              clearInterval(_this.data.getTime);
              shareTitle = answerData.share_msg || '安全大冲顶';
              shareImage = answerData.share_image || '';
              setTimeout(function() {_this.setData({ showPage: 2 })}, config.showTipTime)
            }
          } else {
            if (answerData.total === answerData.count) {
              shareTitle = answerData.share_msg || '安全大冲顶';
              shareImage = answerData.share_image || '';
              setTimeout(function() {_this.setData({ showPage: 1 })}, config.showTipTime)
            } else {
              // 下一题
              qsort ++;
              setTimeout(function() { _this.nextQuestion() }, config.showTipTime);
              _this.initItem(answerData)
            }
          }
          _this.setData({
            answerData: answerData,
            qsort: qsort,
            shareImage: shareImage,
            shareTitle: shareTitle
          })
          
        }
      }
    });
  },

  nextQuestion: function() {
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getQuestion,
      data: {
        token: config.token,
        openid: app.globalData.openid,
        qsort: _this.data.qsort
      },
      
      success: ({data}) => {
        if (data.code === 0) {
          _this.initItem(data.data);
          _this.setData({ 
            questionData: data.data,
            time: 0
          })
        }
      }
    });
  },

  toRankPage: function() {
    wx.navigateTo({
      url: path.rankPage
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: _this.questionData.share_msg,
      imageUrl: _this.questionData.share_image,
      path: '/pages/index?openid_s=' + app.globalData.openid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  getLifeCount: function() {

  }

})
