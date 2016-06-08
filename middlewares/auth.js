var mongoose   = require('mongoose');
var UserModel  = mongoose.model('User');
var config     = require('config');
var UserProxy  = require('../proxy').User;
var EventProxy = require('../common/event_proxy');
var logger     = require('../common/logger');

// 验证用户是否登录
exports.authUser = function (req, res, next) {
    if (config.debug || exports.ignore.test(req.url)) {
        return next();
    }

    var ep = EventProxy.create();
    ep.fail(next);

    ep.on('auth', function (user) {
        if (!user) {
            req.session.targetUrl = req.url;
            return res.redirect('/login');
        }

        user = res.locals.current_user = req.session.user = new UserModel(user);
        res.locals.userID = req.session.userID = user._id;
        return next();
    });
    
    // Ensure current_user always has defined.
    res.locals.current_user = null;

    // 先查找Session，找到直接放入locals
    if(req.session.user) {
        return ep.emit('auth', req.session.user);
    }

    // 查找浏览器Cookie
    var auth_token = req.signedCookies[config.auth_cookie_name];
    if (auth_token) {
        var auth = auth_token.split('||');
        var unionID = auth[0];

        return UserProxy.getUserByUnionID(unionID, ep.done('auth'));
    }

    req.session.targetUrl = req.url;
    res.redirect('/login');
    return next();
};

exports.ignore = /^\/(login|wechat|public|sections)/;

// 目前只是以微信端unionid作为Session
exports.gen_session = function(user, res) {
    var auth_token = user.unionid + '||'; 
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
};