var Bmob = require('./bmob.js');
var config = require('../config.js');
Bmob.initialize(config.secret.bmob.appId, config.secret.bmob.apikey);
console.log('bmob init!!!')