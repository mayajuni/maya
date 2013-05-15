/**
 * main
 * 작성자 : 권동준
 */
var mainRoute = require('../service/mainService.js');

var renderSeed = function(title){
	this.title = title;
}

/* main */
exports.controller = function(req, res, menuList){
	var param = new renderSeed("메인페이지");
	param['menus'] = menuList;
	res.render('index',param);	
};