/**
 * main
 * 작성자 : 권동준
 */
var db = require('mongojs').connect('14.63.220.231/maya', ['menus']);
var renderSeed = function(title){
	this.title = "MaYa | "+title;
}

/* main */
exports.boardRoute = function(req, res, menuList, menuName){
	var param = new renderSeed(menuName);
	param['menus'] = menuList;
	res.render('index',param);
};