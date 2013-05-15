/**
 * common
 * 작성자 : 권동준
 */

/* main controller */
var main = require('../controller/mainController.js');
var menu = require('../service/menuService.js');
var db = require('mongojs').connect('14.63.220.231/maya', ['menus']);
 
/* url을 통해 controller을 찾아준다. */
exports.findController = function(req, res, next){
	var paths = req.path.split('/');
	
	/* 메뉴정보 리턴 */
	db.menus.find({}, function (error, datas) {
		if(error){
			console.log(error);
			res.render('err', {title : '오류발생.', err : error});
		}else{
			var menuList;
			/* 클릭된 메뉴 찾기*/
			for(var i=0;i<datas.length;i++){
				var data = datas[i];
				if(data.url == req.path)
					data.click = 'Y';
				else
					data.click = 'N';
				
				menuList = data;
			}
			
			if(paths[1] == '')
				main.controller(req, res, datas);
			else
				res.render('err', {title : '찾는 페이지가 없습니다', menus : datas});
		}
	});	
};