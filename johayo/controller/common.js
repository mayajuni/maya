/**
 * common
 * 작성자 : 권동준
 */

/* main controller */
var main = require('../controller/mainController.js');
 
/* url을 통해 controller을 찾아준다. */
exports.findController = function(req, res, next){
	var var1="";
	
	if(req.params.var1) var1 = req.params.var1;
	
	if(var1 == '')
		main.controller(req, res, next);
	else
		res.render('err', {title : '찾는 페이지가 없습니다'});
};