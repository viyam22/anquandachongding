const config = {
  requestBaseURL: 'https://dati.yunqer.com/',
	token: 'f14cf4eca31dac45702e5b4a24975337',
  newAppId:'',
	indexAdTime: 3,  // 广告页倒数时间，秒
	showTipTime: 500,  // 答题显示对错提示时间，毫秒
	navigateTime: 2000,  // 提示后跳转页面的时间，毫秒
}

const api = {
	getIndex: '/index',
	getQuestion: '/question',
	getAnswer: '/answer',
	getRank: '/rank',
	postFeedback: '/feedback',
	getRule: '/rule',
	getMemberSave: '/member/save',
	getUserInvite: '/user_invite',
	getAd: '/ad',
  getMoney:'/money/show',
  putMoney:'/money/take',
  inlogin:'/logs/login'
}

const path = {
	adPage: '../ad/ad',
	answerPage: '../answer/answer',
	answerBeforePage: '../answer-before/answer-before',
	indexPage: '../index/index',
	myRankPage: '../my-rank/my-rank',
	prizePage: '../prize/prize',
	rankPage: '../rank/rank',
	rulePage: '../rule/rule',
	share: '../share/share',
  money:'../money/money'
}

module.exports = {
	config,
	api,
	path
}