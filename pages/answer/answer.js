const { api, config, path } = require('../../utils/config.js');

const app = getApp()

Page({
  data: {
    questionData: null,
    answerData: null,
    qid: 0,
    loseData: null,
    success: null,
    options: null,
    showPage: 0,      // 0 答题页 1成功页 2失败页
    shareImage: '',
    shareTitle: '',
    time: 0,
    itemClass: [],    // 选项的Class
  },

  onLoad: function() {
    this.setData({ 
      questionData: app.globalData.questionData
    })
    this.getTimeTip();
  },

  getTimeTip: function() {
    var _this = this;
    var time = 0;
    var getTime = setInterval(function() {
      time ++;
      _this.setData({ time: time })
    }, 1000)
  },

  test: function() {
    var questionData = 
          {
            "life": "1",
            "count": "1",
            "total": "12",
            "people": "12",
            "score": "121212",
            "qid": "1",
            "duration": "10",
            "type": "1",
            "title": "中国有几个省？",
            "options": [
              {
                  "1": "一个"
              },
              {
                  "2": "两个"
              },
              {
                  "3": "三个"
              },
              {
                  "4": "都不对"
              }
            ],
            "answer": "1",
            "right": "4",
            "msg": "1",
            "isright": "-1",
          };
    var loseData = {
            "life": "1",
            "count": "1",
            "total": "12",
            "people": "12",
            "score": "121212",
            "msg": "冲关失败，欢迎参与下期答题！",
            "image": "http://piaowuadmin.corpmarket.com/upload/images/event/201801/d75d42438a4.jpg",
            "share_msg": "安全大冲顶",
            "share_image": "http://piaowuadmin.corpmarket.com/upload/images/event/201801/d75d42438a4.jpg",
        }
      
    this.setData({ 
      questionData: questionData,
      options: questionData.options
      // loseData: loseData
    });
  },

  initItem: function() {
    var _this = this;
    var itemClass = [];
    var answerData = _this.data.answerData;
    for (var i = 0, len = answerData.options.length; i < len; i++) {
      if (!answerData.isright) {
        itemClass.push('item-default');
      } else {
        if (parseInt(answerData.answer) === i && answerData.answer === answerData.right) {
          itemClass.push('item-right');
        } else if (parseInt(answerData.answer) === i && !answerData.answer === answerData.right) {
          itemClass.push('item-wrong');
        } else {
          itemClass.push('item-default');
        }
      }
    }
  },

  postAnswer: function(e) {
    var _this = this;
    wx.request({
      url: config.requestBaseURL + api.getAnswer,
      data: {
        token: config.token,
        openid: app.globalData.openid,
        qid: _this.data.qid,
        time: _this.data.time,
        answer: e.target.detail.answer
      },
      
      success: ({data}) => {
        if (data.code === 0) {
          var answerData = data.data, shareImage = '', shareTitle = '', qid = _this.data.qid;
          
          if (data.answer !== data.right) {  
          // 答案错误
            showPage = 2;
            shareTitle = data.share_msg;
            shareImage = data.share_image;
            setTimeout(function() {_this.setData({ showPage: 1 })}, 2000)
          } else if (data.answer === data.answer) {
            // 答案正确
            showPage = 1;
            shareTitle = data.share_msg;
            shareImage = data.share_image;
            if (data.total === data.count) {
              setTimeout(function() {_this.setData({ showPage: 1 })}, 2000)
            } else {
              qid ++;
            }
          }
          _this.setData({
            answerData: answerData,
            qid: qid,
            shareImage: shareImage,
            shareTitle: shareTitle
          })
          _this.initItem()
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
        qsort: qid
      },
      
      success: ({data}) => {
        if (data.code === 0) {
          console.log('questionData', data)
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
  }

})
