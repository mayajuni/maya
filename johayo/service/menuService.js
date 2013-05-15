/**
 * menu
 * 작성자 : 권동준
 */
var db = require('mongojs').connect('14.63.220.231/maya', ['menus']);

exports.getMenuList = function(req){
 	db.menus.find({}, function (error, data) {
		if(error)
			console.log(error);
		else{
			req.session.menus = data;
		}
	});	
 };