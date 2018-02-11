const config = {
	requestBaseURL: 'https://p.shuzitansuo.com/anquandachongding',
	token: 'f14cf4eca31dac45702e5b4a24975337',
	indexAdTime: 3,
  newAppId:''
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
	getAd: '/ad'
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
	share: '../share/share'
}

module.exports = {
	config,
	api,
	path
}