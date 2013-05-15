/**
 * main
 * 작성자 : 권동준
 */
var mainRoute = require('../service/mainService.js');

var renderSeed = function(title){
	this.title = "동주니의 블로그|"+title;
}

/* main */
exports.controller = function(req, res, menuList){
	var param = new renderSeed("메인");
	param['menus'] = menuList;
	res.render('index',param);	
};