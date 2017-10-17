'use-strict';

sha1 = require('sha1');

module.exports = function(){
    return generateClientID;
};

function generateClientID(req, res, next){
    const hash = sha1(req.ip + req.useragent);
    if(req.body) req.body.user = hash;
    next();
}