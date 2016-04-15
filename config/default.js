/*!     
 * 配置文件（开发环境）：
 * 1. 站点配置（端口，Host地址）       
 * 2. 数据库配置（mongodb，redis）
 * 3. 微信公众号配置       
 * 4. 微信开放平台配置      
 */
module.exports = {

    // 站点端口
    port: 3000,

    // 数据库连接字符串
    db: "mongodb://localhost/test",

    // 图片上传路径
    UploadDir: "./assets/imgs/upload",

    // 微信
    WeChat: {
        // 公众号ID
        appID: "wx94911ed9aa3ef58c",
        // 公众号密钥
        appSecret: "c2f8def6c499b979bc46f7beee43091d",
        // 公众号预设Token    
        token: "Soostep123"
    },

    OpenAPI: {
        authorizeURL: "https://open.weixin.qq.com/connect/oauth2/authorize",
        authorizeURLForWebsite: "https://open.weixin.qq.com/connect/qrconnect",
        oauth2URL: "https://api.weixin.qq.com/sns/oauth2/access_token",
        oauth2RefreshURL: "https://api.weixin.qq.com/sns/oauth2/refresh_token",
        authURL: "https://api.weixin.qq.com/sns/auth"
    },
    
    SECRET_TOKEN: 'aMdoeb5ed87zorRdkD6greDML81DcnrzeSD648ferFejmplx',
    
    TOKEN_EXPIRATION_SEC: 60000 * 60,
    
    SECRET_SESSION: 'soostep',
    
    SESSION_TRY_TIMES: 3,
    
    SALT_WORK_FACTOR : 10
};