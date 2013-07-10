/**
 * common
 * 작성자 : 권동준
 */

/* main controller */
var main = require('../routes/main.js');
var board = require('../routes/board.js');
var db = require('mongojs').connect('14.63.220.231/maya', ['menus']);

var renderSeed = function(title){
	this.title = "MaYa | "+title;
}
 
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
			var param = '';
			if(paths[1] == ''){
				param = new renderSeed('main');
			}else{
				/* 클릭된 메뉴 찾기*/
				for(var i=0;i<menuList.length;i++){
					var data = menuList[i];
					if(data.url == req.path){
						data.click = 'Y';
						param = new renderSeed(data.name);
						param['boardName'] = data.name;
					}
					else
						data.click = 'N';
				}
			}
			/* 메뉴 데이터 넣기 */
			param['menus'] = menuList;
			/* 메뉴 paths[1] 넣기 */
			param['path'] = paths[1];
			
			if(paths[1] == '')
				main.mainRoute(req, res, param);
			else if(paths[1] == 'board')
				board.boardRoute(req, res, param);
			else 
				res.render('err', {title : '찾는 페이지가 없습니다', menus : menuList});
		}
	});
	
};
