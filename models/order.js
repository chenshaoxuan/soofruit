var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * 订单
 */
var OrderSchema = new mongoose.Schema({

    //商品
    goods: [{
        goodID: ObjectId,
        name: String,
        sellPrice: Number,
        pic: String,
        quantity: Number
    }],

    //用户ID
    userID: ObjectId,

    //订单状态
    status: String,

    //订单总额
    totalAmount: Number,

    //实际付款
    payAmount: Number,

    //减免额度(优惠券,积分,等)
    deductAmount: {type: Number, default: 0},

    //创建时间
    createTime: {type: Date, default: Date.now},

    //付款时间
    payTime: Date,

    //收货时间(用户收货后在线上点击"确认收货")
    pickTime: Date,

    //成交时间(确认收货 N 天后自动记入)
    finishTime: Date,

    //收货地址ID
    addressID: ObjectId,

    //快递公司
    expressCom: String,

    //快递单号
    expressNO: String
});
OrderSchema.index({createTime: -1});
OrderSchema.plugin(require('./plugins/paged_find'));

mongoose.model('Order', OrderSchema);