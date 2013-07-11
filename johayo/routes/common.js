/**
 * common
 * 작성자 : 권동준
 */

/* main controller */
var main = require('../routes/main.js');
var board = require('../routes/board.js');
var db = require('mongojs').connect('14.63.220.231/maya', ['menus']);

/**
 * url을 분석해서 넣어준다.
 */
var renderSeed = function(path){
	var paths = path.split('/');
	this.path1 = paths[1];
	this.path2 = paths[2];
	this.path3 = paths[3];
}

/* url을 통해 controller을 찾아준다. */
exports.findRoutes = function(req, res, next){
	var param = new renderSeed(req.path);
	
	/* ajax 호출은 menu정보기 필요 없다. */
	if(req.path.indexOf('ajax') > 0){
		if(param.path1 == 'board')
			board.boardAjaxRoute(req, res, param);
		else
			res.render('err', {title : '찾는 페이지가 없습니다'});
	}else{
		/* 메뉴정보 리턴 */
		db.menus.find({use_yn : 'Y'}).sort({rank : 1}, function (error, menuList) {
			if(error){
				console.log(error);
				res.render('err', {title : '오류발생.', err : error});
			}else{
				if(param.path1 == ''){
					param['title'] = 'main';
				}else{
					/* 클릭된 메뉴 찾기*/
					for(var i=0;i<menuList.length;i++){
						var data = menuList[i];
						if(data.url == req.path){
							data.click = 'Y';
							param['title'] = data.name;
						}
						else
							data.click = 'N';
					}
				}
				/* 메뉴 데이터 넣기 */
				param['menus'] = menuList;
				
				if(param.path1 == '')
					main.mainRoute(req, res, param);
				else if(param.path1 == 'board')
					board.boardRoute(req, res, param);
				else 
					res.render('err', {title : '찾는 페이지가 없습니다'});
			}
		});
	}
	
};
