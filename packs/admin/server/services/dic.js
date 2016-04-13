var Dic = require('../../../shared/models').Dic;


module.exports.list = function (req, res) {
    Dic.find().lean().exec(function (err, doc) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(doc);
        }
    });
};


module.exports.detail = function (req, res) {
    Dic.findById(req.params._id).lean()
        .exec(function (err, doc) {
            if (err) {
                res.json({code: 500, message: err});
            }
            else {
                res.json(doc);
            }
        });
};


module.exports.create = function (req, res) {
    var dic = new Dic(req.body);

    dic.save(function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(dic._id.toString());
        }
    });
};


module.exports.update = function (req, res) {
    Dic.update({_id: req.params._id}, req.body, function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json({code: 0});
        }
    });
};


module.exports.delete = function (req, res) {
    Dic.remove({_id: req.params._id}, function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json({code: 0});
        }
    });
};


module.exports.getDicTypes = function (req, res) {
    Dic.find({Type: 'DicType'}, {_id: 0, Name: 1}).lean()
        .exec(function (err, doc) {
            if (err) {
                res.json({code: 500, message: err});
            }
            else {
                res.json(doc);
            }
        });
};