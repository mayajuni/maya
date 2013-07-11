/**
 * 게시판
 * 작성자 : 권동준
 * 먼가 service와 controll 그리고 DAO가 짬뽕된 느낌..훔... 혼자 고민좀 해보자
 */
var db = require('mongojs').connect('14.63.220.231/maya', ['boards']);
var paging = require('../util/paging.js');

/**
 * 게시판
 * param : 메뉴, title 등 여러가지고 값
 */
exports.boardRoute = function(req, res, param){
	if(param.path2 == 'insert')
		boardInsert(req, res, param);
	else if(param.path2 == 'update')
		boardUpdate(req, res, param);
	else
		boardList(req, res, param); 
};

/**
 * 게시판 목록(처음화면)
 */
function boardList(req, res, param){
	if(req.param('viewCount') == null || req.param('viewCount') == '')
		viewCount = 5;
	if(req.param('page') == null || req.param('page') == '')
		page = 1;
	console.log(param.path2);
	db.boards.find({division: param.path2}).count({}, function (error, data) {
		if(error){
			console.log(error);
			res.render('err', {title : '오류발생.', err : error});
		}
		param['topPaging'] = paging.topListPaging(data, viewCount, page);
		param['paging'] = paging.listPaging(data, viewCount, page);
		
		db.boards.find({division: param.path2}).sort({date : -1}).skip(viewCount * (page - 1)).limit(viewCount, function (error, data) {
			if(error){
				console.log(error);
				res.render('err', {title : '오류발생.', err : error});
			}
			console.log(data);
			param['boardList'] = data;	
			res.render('board',param);
		})
	});
}

/**
 * 게시판 등록
 */
function boardInsert(req, res, param){
	param['title'] = req.param('title');
	res.render('boardInsert', param);
}

/**
 * 게시판 수정
 */
function boardUpdate(req, res, param){
	res.render('boardUpdate', param);
}

/**
 * ajax를 호출해주는 부분이다. 여기서 분기한다. 컨트롤러 역활이다.
 */
exports.boardAjaxRoute = function(req, res, param){
	res.set('Content-Type', 'text/html');
	if(req.path.indexOf('ajaxTopList') >=0)
		ajaxTopList(req, res, param);
	if(req.path.indexOf('ajaxInsert') >=0)
		ajaxInsert(req, res, param);
}

/**
 * topList의 데이터를 json방식으로 return.
 */
function ajaxTopList(req, res, param){		
	param['paging'] = paging.topListPaging(15421, req.param('viewCount'), req.param('page'));
	res.send(param);
}
/**
 * 게시판 등록
 */
function ajaxInsert(req, res, param){
	var division = decodeURIComponent(req.param('division'));
	var title = decodeURIComponent(req.param('title'));
	var content = decodeURIComponent(req.param('content'));
	db.boards.insert({'division':division, 'title':title, 'content':content, 'date': nowDates(), 'comment': ''}, function(error){
		console.log(error);
	});
	res.send('');
}

function nowDates() {  
	//format : yyyyMMddHHmmss
	var ndate = new Date();
	var nyear = ndate.getFullYear();
	var nmonth = ndate.getMonth() + 1;
	var nday = ndate.getDate();
	var nhours = ndate.getHours();
	var nminutes = ndate.getMinutes();
	var nseconds = ndate.getSeconds();
	if(String(nmonth).length == 1)
		nmonth = "0" + nmonth;
	if(String(nday).length == 1)
		nday = "0" + nday;
	if(String(nhours).length == 1)
		nhours = "0" + nhours;
	if(String(nminutes).length == 1)
		nminutes = "0" + nminutes;
	if(String(nseconds).length == 1)
		nseconds = "0" + nseconds;
	s = String(nyear) + String(nmonth) + String(nday)+String(nhours)+String(nminutes)+String(nseconds);

	return s;
}