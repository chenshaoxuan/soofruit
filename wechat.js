/*!
 * 微信基础类：
 * 1. 提供微信签名Token的认证
 * 2. 提供微信AccessToken的发布(定期刷新)和订阅
 *    多进程间共享Redis数据，订阅AccessToken刷新事件
 * 3. 
 */

var configLoader = require('./config');
var config = new configLoader();

var Wechat = function (appID, appSecret) {
	this.appID = appID || config.WechatAPI.appID;
	this.appSecret = appSecret || config.WechatAPI.appSecret;
	console.log(this.appID);
}

module.exports = Wechat;

/*
// 微信API
var api = new API(config.appID, config.appSecret, function(callback) {
	
})
*/