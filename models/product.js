var mongoose = require('mongoose');
var BaseModel = require("./base_model");

 // var product3 = {
 //    name: '测试3',
 //    desc: '这是一个测试商品',
 //    tags: ['spotlight'],
 //    pics: ['http://soofruit.oss-cn-hangzhou.aliyuncs.com/item/shrimps_express.jpg'],
 //    originPrice: 50,
 //    sellPrice: 30,
 //    sales: 100,
 //    balance: 100
 // };

/**
 * 产品
 */
var ProductSchema = new mongoose.Schema({

    //名称/标题
    name: String,

    //描述
    desc: String,

    //标签(商品列表中展示用)
    tags: [String],

    //图片相对路径
    pics: [String],

    //保证项(包邮,正品保障,48小时发货,等等)
    ensures: [String],

    //规格(eg:500g)
    spec: String,

    //原产地
    provenance: String,

    //保质期
    shelfLife: Number,

    //存储方式
    storage: String,

    //原价
    originPrice: Number,

    //卖价
    sellPrice: Number,

    //销量
    sales: Number,

    //库存
    balance: Number,

    //是否有效
    active: { type: Boolean, default: false },

    //创建时间
    createTime: { type: Date, default: Date.now},

    //最近更新时间
    lastUpdateTime: { type: Date, default: Date.now}
});

ProductSchema.plugin(BaseModel);
ProductSchema.index({createTime: -1});

mongoose.model('Product', ProductSchema);