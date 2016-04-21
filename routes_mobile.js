var router = require('express').Router();
var account = require('./service/account');
var cart = require('./service/cart');
var addressOrigin = require('./service/address_origin');
var address = require('./service/address');

router.get('/account', account.signin);

router.get('/cartSession/:_id', cart.getCartSession)
    .post('/cartSession', cart.setCartSession);

router.get('/addressOrigin/:addrLv/:id', addressOrigin.list);
router.get('/addresses/:userID', address.list);
router.post('/address', address.create);
router.get('/address/:_id', address.detail)
    .put('/address/:_id', address.update)
    .delete('/address/:_id', address.delete);

module.exports = router;