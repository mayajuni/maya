/**
 * main
 * 작성자 : 권동준
 */
var mainRoute = require('../routes/mainRoute.js');

/* main */
exports.controller = function(req, res, next){
	res.render('index',{title:'메인페이지'});
	next();
};