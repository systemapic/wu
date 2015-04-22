var redis = require('redis');

// kue
var port2 = 6379;
var host2 = 'redis-kue';
var auth2 = 'crlAxeVBbmaxBY5GVTaxohjsgEUcrT5IdJyHi8J1fdGG8KqXdfw3RP0qyoGlLltoVjFjzZCcKHvBVQHpTUQ26W8ql6xurdm0hLIY';

// token
var port = 6379;
var host = 'redis-token';
var auth = '9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE';


var r = redis.createClient(port2, host2);
r.auth(auth2);
r.set("docked", "sure2", redis.print);
r.set('yo', 'i am kue', redis.print);
r.get("docked", redis.print);
r.on('error', console.error);

var r = redis.createClient(port, host);
r.auth(auth);
r.set("docked", "sure", redis.print);
r.set('yoyo', 'i am token', redis.print);
r.get("docked", redis.print);
r.on('error', console.error);
