/*!
 * refs
 */
var SLICE = Array.prototype.slice;
var CONCAT = Array.prototype.concat;
var ALL_EVENT = '__all__';

var EventProxy = function () {
    if (!(this instanceof EventProxy)) {
        return new EventProxy();
    }
    this._callbacks = {};
    this._fired = {};
};

/**
 * Bind an event, specified by a string name, `ev`, to a `callback` function.
 * Passing __ALL_EVENT__ will bind the callback to all events fired.
* Examples:
 * ```js
 * var proxy = new EventProxy();
 * proxy.addListener("template", function (event) {
 *     // TODO
 * });
 * ```
 * @param {String} eventname Event name.
 * @param {Function} callback Callback.
 */
EventProxy.prototype.addListener = function (ev, callback) {
    this._callbacks[ev] = this._callbacks[ev] || [];
    this._callbacks[ev].push(callback);
    return this;
};
/**
 * `addListener` alias, `bind`
 */
EventProxy.prototype.bind = EventProxy.prototype.addListener;
/**
 * `addListener` alias, `on`
 */
EventProxy.prototype.on = EventProxy.prototype.addListener;
/**
 * `addListener` alias, `subscribe`
 */
EventProxy.prototype.subscribe = EventProxy.prototype.addListener;

/**
 * Remove one or many callbacks.
 *
 * - If `callback` is null, removes all callbacks for the event.
 * - If `eventname` is null, removes all bound callbacks for all events.
 * @param {String} eventname Event name.
 * @param {Function} callback Callback.
 */
EventProxy.prototype.removeListener = function (eventname, callback) {
    var calls = this._callbacks;
    if (!eventname) {
        this._callbacks = {};
    } else {
        if (!callback) {
            calls[eventname] = [];
        } else {
            var list = calls[eventname];
            if (list) {
                var l = list.length;
                for (var i = 0; i < l; i++) {
                    if (callback === list[i]) {
                        list[i] = null;
                    }
                }
            }
        }
    }
    return this;
};

/**
 * `removeListener` alias, unbind
 */
EventProxy.prototype.unbind = EventProxy.prototype.removeListener;

/**
 * Trigger an event, firing all bound callbacks. Callbacks are passed the
 * same arguments as `trigger` is, apart from the event name.
 * Listening for `"all"` passes the true event name as the first argument.
 * @param {String} eventname Event name
 * @param {Mix} data Pass in data
 */
EventProxy.prototype.trigger = function (eventname, data) {
    var list, ev, callback, i, l;
    var both = 2;
    var calls = this._callbacks;
    while (both--) {
        ev = both ? eventname : ALL_EVENT;
        list = calls[ev];
        if (list) {
            for (i = 0, l = list.length; i < l; i++) {
                if (!(callback = list[i])) {
                    list.splice(i, 1);
                    i--;
                    l--;
                } else {
                    var args = [];
                    var start = both ? 1 : 0;
                    for (var j = start; j < arguments.length; j++) {
                        args.push(arguments[j]);
                    }
                    callback.apply(this, args);
                }
            }
        }
    }
    return this;
};

/**
 * `trigger` alias
 */
EventProxy.prototype.emit = EventProxy.prototype.trigger;
/**
 * `trigger` alias
 */
EventProxy.prototype.fire = EventProxy.prototype.trigger;

/**
 * Bind an event like the bind method, but will remove the listener after it was fired.
 * @param {String} ev Event name
 * @param {Function} callback Callback
 */
EventProxy.prototype.once = function (ev, callback) {
    var self = this;
    var wrapper = function () {
        callback.apply(self, arguments);
        self.unbind(ev, wrapper);
    };
    this.bind(ev, wrapper);
    return this;
};

/**
 * Assign the only one 'error' event handler.
 * @param {Function(err)} callback
 */
EventProxy.prototype.fail = function (callback) {
    var that = this;

    that.once('error', function () {
        that.unbind();
        // put all arguments to the error handler
        // fail(function(err, args1, args2, ...){})
        callback.apply(null, arguments);
    });
    return this;
};

/**
 * A shortcut of ep#emit('error', err)
 */
EventProxy.prototype.throw = function () {
    var that = this;
    that.emit.apply(that, ['error'].concat(SLICE.call(arguments)));
};

/**
 * The callback will be executed after any registered event was fired. It only executed once.
 * @param {String} eventname1 Event name.
 * @param {String} eventname2 Event name.
 * @param {Function} callback The callback will get a map that has data and eventname attributes.
 */
EventProxy.prototype.any = function () {
    var proxy = this,
        callback = arguments[arguments.length - 1],
        events = SLICE.call(arguments, 0, -1),
        _eventname = events.join("_");

    proxy.once(_eventname, callback);

    var _bind = function (key) {
        proxy.bind(key, function (data) {
            proxy.trigger(_eventname, {"data": data, eventName: key});
        });
    };

    for (var index = 0; index < events.length; index++) {
        _bind(events[index]);
    }
};

/**
 * Success callback wrapper, will handler err for you.
 *
 * ```js
 * fs.readFile('foo.txt', ep.done('content'));
 *
 * // equal to =>
 *
 * fs.readFile('foo.txt', function (err, content) {
 *     if (err) {
 *         return ep.emit('error', err);
 *     }
 *     ep.emit('content', content);
 * });
 * ```
 *
 * ```js
 * fs.readFile('foo.txt', ep.done('content', function (content) {
 *     return content.trim();
 * }));
 *
 * // equal to =>
 *
 * fs.readFile('foo.txt', function (err, content) {
 *     if (err) {
 *         return ep.emit('error', err);
 *     }
 *     ep.emit('content', content.trim());
 * });
 * ```
 * @param {Function|String} handler, success callback or event name will be emit after callback.
 * @return {Function}
 */
EventProxy.prototype.done = function (handler, callback) {
    var that = this;
    return function (err, data) {
        if (err) {
            // put all arguments to the error handler
            return that.emit.apply(that, ['error'].concat(SLICE.call(arguments)));
        }

        // callback(err, args1, args2, ...)
        var args = SLICE.call(arguments, 1);

        if (typeof handler === 'string') {
            // getAsync(query, ep.done('query'));
            // or
            // getAsync(query, ep.done('query', function (data) {
            //     return data.trim();
            // }));
            if (callback) {
                // only replace the args when it really return a result
                return that.emit(handler, callback.apply(null, args));
            } else {
                // put all arguments to the done handler
                //ep.done('some');
                //ep.on('some', function(args1, args2, ...){});
                return that.emit.apply(that, [handler].concat(args));
            }
        }

        // speed improve for mostly case: `callback(err, data)`
        if (arguments.length <= 2) {
            return handler(data);
        }

        // callback(err, args1, args2, ...)
        handler.apply(null, args);
    };
};

/**
 * Create a new EventProxy
 * Examples:
 * ```js
 * var ep = EventProxy.create();
 * ep.assign('user', 'articles', function(user, articles) {
 *     // do something...
 * });
 * // or one line ways: Create EventProxy and Assign
 * var ep = EventProxy.create('user', 'articles', function(user, articles) {
 *     // do something...
 * });
 * ```
 * @return {EventProxy} EventProxy instance
 */
EventProxy.create = function () {
    var ep = new EventProxy();
    var args = CONCAT.apply([], arguments);
    if (args.length) {
        var errorHandler = args[args.length - 1];
        var callback = args[args.length - 2];
        if (typeof errorHandler === 'function' && typeof callback === 'function') {
            args.pop();
            ep.fail(errorHandler);
        }
        ep.assign.apply(ep, args);
    }
    return ep;
};

module.exports = EventProxy;
