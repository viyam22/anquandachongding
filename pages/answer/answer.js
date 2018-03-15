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
    shareImage2: '',
    shareTitle2: '',
    time: 0,
    showTime: '',
    itemClass: [],    // 选项的Class
    getTime: null,     // 定时器
    musis:null,
    isShowPopup: false,
    popupTxt: '',
    duration: 0,       // 每题的限制时间
    animationData: {},    // 定义动画
    isLock: false,
    showTime2:'',
    fail:'../../images/img-fail.png',
    animationData2:{},
    showAmit:'block',
    timeTip: 0
  },

  onLoad: function() {
    var _this = this;
    // _this.setMusic();
    // console.log('options', options)
    // if (options.type === '4') {
    //   _this.setData({
    //     showPage: 2,
    //     fail: options.img.image
    //   });
    //   return;
    // } else 
    // if (options.type === '5') {
    //   _this.setData({ showPage: 1 });
    //   return;
    // }
    var questionData = app.globalData.questionData;
    var showPage;
    if (questionData.type === 4) {
      //  答题活动排行榜未生成，答题失败.显示答题失败页面
      showPage = 2;
      // return;
    } else if (questionData.type === 5) {
      // 答题活动排行榜未生成，答题成功.显示答题成功页面
      showPage = 1;
      // return;
    } else {
      showPage = 0;
    }

    _this.setData({
      showPage,
      shareImage2: questionData.share_image,
      shareTitle2: questionData.share_msg,
      questionData: app.globalData.questionData,
      duration: parseInt(app.globalData.questionData.duration) * 100,
      score: app.globalData.questionData.score
    })
    wx.hideLoading();
   
    _this.getTimeTip();
    _this.initItem(app.globalData.questionData);
  },

  scaleItem: function() {
  
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      transformOrigin: "50% 50%",
      delay: 1000
    })
    animation.scale(2, 2).scale(1, 1).step();

    this.setData({
      animationData: animation.export()
    })
  },

  getTimeTip: function() {
    var _this = this;
    // _this.scaleItem();
    var showTime2 = _this.data.score;
    _this.setData({
      showTime2: showTime2
    })
    var time = 0, showTime = '';
    var getTime = setInterval(function() {
      if (_this.data.time === _this.data.duration - 10) {
        clearInterval(_this.data.getTime);
        _this.postAnswer();
      }
      time ++;
      showTime = time > 100 ? Math.floor(time / 100) + '\'' + time % 100 : time;
      var timeTip = Math.floor((_this.data.duration - time) / _this.data.duration * 10)
      _this.setData({ 
        time: time,
        showTime: showTime,
        timeTip: timeTip
      })
    }, 10)
    
  
    _this.setData({ getTime: getTime });
  },

  initItem: function(data) {
    var _this = this;
    var itemClass = [];
    var isMove = false;
    for(var i in data.options) {
      if (data.options.hasOwnProperty(i)) {
        if (!data.isright) {
          itemClass.push('item-default');
        } else if (data.isright === -1) {   // 答错
          if (data.answer === data.options[i]) {
            itemClass.push('item-wrong');
            isMove = true;
          } else if (data.right == i) {
            itemClass.push('item-right');
            isMove = true;
          } else {
            itemClass.push('item-default');
          }
        } else {
          if (data.answer === data.options[i]) {
            itemClass.push('item-right');
            isMove = true;
          } else {
            itemClass.push('item-default');
          }
        }
      }
    }
    _this.setData({ itemClass: itemClass })
    if (isMove) {
      // _this.scaleItem();
    }
  },

  postAnswer: function(e) {
    var _this = this;
    if (_this.data.isLock) return;
    var itemClass = _this.data.itemClass;
    if (e) {
      var right = _this.data.questionData.right;
      console.log();
      var index = parseInt((e.target.dataset.index) -1);
      itemClass[parseInt(right) - 1] = 'item-right';
      if (e.target.dataset.index != right){
        itemClass[index] ='item-wrong';
      }
    }
    _this.setData({ 
      isLock: true,
      itemClass: itemClass
    })
   
    var answer = e ? e.target.dataset.index : '0'
    clearInterval(_this.data.getTime);
    console.log('answer', answer)
    var time = _this.data.time * 10;
  
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: config.requestBaseURL + api.getAnswer,
      data: {
        token: config.token,
        openid: app.globalData.openid,
        qid: _this.data.questionData.qid,
        time: time ,
        answer: answer,
        eid: _this.data.questionData.eid
      },
      
      success: ({data}) => {
        wx.hideLoading();
        if (data.code === 0) {
          var answerData = data.data, shareImage = '', shareTitle = '', qsort = _this.data.qsort;
          // if (!answerData.options) {
            if (answerData.type === 3) {
              // 答题成功
              setTimeout(function(){
                _this.setData({
                  showAmit: "none",
                });
              },2000);
              clearInterval(_this.data.getTime);
              shareTitle = answerData.share_msg || '安全大冲顶';
              shareImage = answerData.share_image || '';
              setTimeout(function() {
                _this.setMusic(2, function () {
                  _this.setData({ showPage: 1 });
                })
              }, config.showTipTime)
              
            } else if (answerData.type === 4) {
              // 答案错误且无生命值
            
              // itemClass[parseInt(answerData.right) - 1] = 'item-right';
              clearInterval(_this.data.getTime);
              shareTitle = answerData.share_msg || '安全大冲顶';
              shareImage = answerData.share_image || '';
         
              setTimeout(function() {
                _this.setMusic(0,function(){
                  _this.setData({
                    showPage: 2,
                    fail: answerData.image
                  });
                });
              
                }, config.showTipTime);
     
              // 邀请
            } else if (answerData.type === 2) {
              // 答案错误但有生命值
              qsort ++;
             
              // itemClass[parseInt(answerData.right) - 1] = 'item-right';
              _this.setMusic(1,function(){
                _this.setData({
                  isShowPopup: true,
                  popupTxt: answerData.msg
                })

                setTimeout(function () {
                  _this.nextQuestion();
                }, 1000);
               
              });
            } else if (answerData.type === 1) {
              // 下一题
             
              qsort ++;
              // itemClass[parseInt(answerData.right) - 1] = 'item-right';
              _this.setData({ 
                isLock: true,
                itemClass: itemClass
              })
              _this.setMusic(1,function(){
                _this.setData({
                  isShowPopup: false,
                  popupTxt: answerData.msg
                })

                setTimeout(function () {
                  _this.nextQuestion();
                }, 1000);
          
              });
            } else if (answerData.type === 6) {

            }
          
          _this.setData({
            answerData: answerData,
            qsort: qsort,
            shareImage2: shareImage,
            shareTitle2: shareTitle,
            isLock:false,
          })
        }
      }
    });
  },
  getLife: function() {
    var _this = this;
    var getLiftInterval = setInterval(function() {
      wx.request({
        url: config.requestBaseURL + api.getQuestion,
        data: {
          token: config.token,
          openid: app.globalData.openid,
        },
        success: ({data}) => {
          if (data.code === 0 && data.data.life > 0) {
            clearInterval(_this.data.getLiftInterval)
            _this.setData({
              isShowPopup: true,
              popupTxt: '复活成功,自动进入下一题'
            })
            setTimeout(function() {
              _this.setData({
                isShowPopup: false
              })
              _this.nextQuestion();
            })
          }
        }
      });
    }, 1000)
    _this.setData({ getLiftInterval: getLiftInterval })
  },

  nextQuestion: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...'
    });
    wx.request({
      url: config.requestBaseURL + api.getQuestion,
      data: {
        token: config.token,
        openid: app.globalData.openid,
        qsort: _this.data.qsort
      },
      
      success: ({data}) => {
        wx.hideLoading();
        if (data.code === 0) {
          console.log(data.data);
          _this.initItem(data.data);
          _this.getTimeTip();
          _this.setData({ 
            questionData: data.data,
            time: 0,
            duration: parseInt(data.data.duration) * 100,
            score: data.data.score,
            isShowPopup: false,
            showTime2: data.data.score,
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
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(_this.data.shareImage2);
    return {
      title: _this.data.shareTitle2,
      imageUrl: _this.data.shareImage2,
      path: '/pages/index/index?openid_s=' + app.globalData.openid,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  setMusic: function(mp3,call) {
    //成功mp3:http://huiya-video.hengdikeji.com/right.mp3
    //失败mp3:http://huiya-video.hengdikeji.com/error.mp3
    var _this=this;
    var musis=[
      'https://p.shuzitansuo.com/xcxdt/public/static/mp3/error.mp3',
      'https://p.shuzitansuo.com/xcxdt/public/static/mp3/right.mp3',
      'https://p.shuzitansuo.com/xcxdt/public/static/mp3/finish.mp3'
    ];
    wx.playBackgroundAudio({
        dataUrl: musis[mp3],
        title: 'music',
        coverImgUrl: '',
        complete:function(){
          if (mp3!=2){
            setTimeout(function () {
              wx.stopBackgroundAudio();
            }, 1000)
          }else{
   
            _this.animationData2();
          }
          
          call();
        }
    })
   
  },
  animationData2:function(){
    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // animation.scale(2, 2).rotate(45).step()
    // this.setData({
    //   animationData2: animation.export()
    // })
  }
})
