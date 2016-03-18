/**
 * Created by Leo on 2016/3/12.
 */
var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        console.log(err);
    }
});