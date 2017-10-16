/**
 * created by NasskalteJuni
 */
const sha1 = require('sha1');

module.exports = function(key){
    let expect = "dced5e0ad77e01104291133c9400e850fb86909d";
    return sha1(key) === expect;
};