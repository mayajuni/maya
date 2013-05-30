/**
 * main
 * 작성자 : 권동준
 */
var db = require('mongojs').connect('14.63.220.231/maya', ['boards']);

/* main */
exports.boardRoute = function(req, res, param){
	res.render('index',param);
};