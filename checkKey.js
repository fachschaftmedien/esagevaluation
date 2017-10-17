'use-strict';

var sha1 = require('sha1');

module.exports = function(key){
    var expect = "dced5e0ad77e01104291133c9400e850fb86909d";
    return sha1(key) === expect;
};