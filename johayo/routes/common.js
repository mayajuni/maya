/**
 * common
 * 작성자 : 권동준
 */

/* main controller */
var main = require('../routes/main.js');
var board = require('../routes/board.js');
var db = require('mongojs').connect('14.63.220.231/maya', ['menus']);
 
/* url을 통해 controller을 찾아준다. */
exports.findRoutes = function(req, res, next){
	var paths = req.path.split('/');
	var date3;
	/* 메뉴정보 리턴 */
	db.menus.find({}).sort({rank : 1}, function (error, menuList) {
		if(error){
			console.log(error);
			res.render('err', {title : '오류발생.', err : error});
		}else{
			/* 클릭된 메뉴 찾기*/
			var menuName = '';
			for(var i=0;i<menuList.length;i++){
				var data = menuList[i];
				if(data.url == req.path){
					data.click = 'Y';
					menuName = data.name;
				}
				else
					data.click = 'N';
			}
			
			if(paths[1] == '')
				main.mainRoute(req, res, menuList);
			else if(paths[1] == 'board')
				board.boardRoute(req, res, menuList, menuName);
			else 
				res.render('err', {title : '찾는 페이지가 없습니다', menus : menuList});
		}
	});
	
};