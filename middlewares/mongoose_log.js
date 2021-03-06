var mongoose = require('mongoose');
var logger   = require('../lib/logger');
var config = require('config');

// debug模式纪录query到cheese文件中
if (config.debug) {
  var traceMQuery = function (method, info, query) {
    return function (err, result, millis) {
      if (err) {
        logger.error('traceMQuery error:', err);
      }
      var infos = [];
      infos.push(query._collection.collection.name + "." + method.blue);
      infos.push(JSON.stringify(info));
      infos.push((millis + 'ms').green);

      logger.debug("MONGO".magenta, infos.join(' '));
    };
  };

  mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
}
