/**
 * main
 * 작성자 : 권동준
 */
var mainRoute = require('../service/mainService.js');

var renderSeed = function(title){
	this.title = "MaYa | "+title;
}

/* main */
exports.controller = function(req, res, menuList){
	var param = new renderSeed("Main");
	param['menus'] = menuList;
	res.render('index',param);	
};