/**
 * common
 * 작성자 : 권동준
 */

/* main controller */
var main = require('../routes/main.js');
var board = require('../routes/board.js');
var admin = require('../routes/admin.js');
var pro = require("../util/property.js");
var err = require("../routes/err.js");
var db = require('mongojs').connect(pro.dbInfo(), ['menus']);

/**
 * url을 분석해서 넣어준다.
 */
var renderSeed = function(req){
	var paths = req.path.split('/');
	this.path1 = (paths[1] == null || paths[1] == '') ? 'main' : paths[1];
	this.path2 = paths[2];
	this.path3 = paths[3];
	this.isAdmin = (req.session.admin == null || req.session.admin == '') ? false : true;
}

/**
 * 필요한 라우터를 찾아준다.(컨트롤러 역활)
 * 
 * @param req
 * @param res
 * @param next
 */
exports.findRoutes = function(req, res, next){
	var param = new renderSeed(req);
	
	/* ajax, admin 호출은 menu정보기 필요 없다. */
	if(req.path.indexOf('ajax') > 0 || req.path.indexOf('admin') > 0)
		notMenuInfo(req, res, param);
	else
		needMenuInfo(req, res, param);
};

/**
 * 메뉴정보가 필요 없는 부분(ajax호출이나 admin호출시 사용)
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function notMenuInfo(req, res, param){
	if('board' == param.path1)
		board.boardAjaxRoute(req, res, param);
	else if('admin' == param.path1)
		admin.adminRoute(req, res, param);
	else if('main' == param.path1)
		main.geustBookAjaxRoute(req, res, param);
	else
		err.error(res, '찾는 페이지가 없습니다.');
}

/**
 * 메뉴정보가 필요한 부분
 * 호출한 url과 메뉴 url가 다를시 호출 url를 split 하여 2번째에 있는걸로 체크를 해서 넣어준다.
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function needMenuInfo(req, res, param){
	/* 메뉴정보 리턴 */
	db.menus.find({use_yn : 'Y'}).sort({rank : 1}, function (error, menuList) {
		if(error){
			console.log(error);
			err.error(res, error);
		}else{
			if('main' == param.path1){
				param['title'] = 'main';
			}
			else{
				/* 클릭된 메뉴 찾기*/
				for(var i=0;i<menuList.length;i++){
					var data = menuList[i];
					if(data.url == req.path){
						data.click = 'Y';
						param['title'] = data.name;
					}
					else if(data.url.indexOf(param.path2) > -1){
						data.click = 'Y';
						param['title'] = data.name;
					}
					else
						data.click = 'N';
				}
			}
			/* 메뉴 데이터 넣기 */
			param['menus'] = menuList;
			
			if('main' == param.path1)
				main.mainRoute(req, res, param);
			else if('board' == param.path1)
				board.boardRoute(req, res, param);
			else if('profile' == param.path1)
				res.render("profile", param);
			else 
				err.error(res, '찾는 페이지가 없습니다.');
		}
	});
}