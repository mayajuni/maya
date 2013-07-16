/**
 * 게시판
 * 작성자 : 권동준
 * 먼가 service와 controll 그리고 DAO가 짬뽕된 느낌..훔... 혼자 고민좀 해보자
 */
var pro = require("../util/property.js");
var paging = require("../util/paging.js");
var err = require("../routes/err.js");
var db = require('mongojs').connect(pro.dbInfo(), ['boards']);

/**
 * 게시판
 */
exports.boardRoute = function(req, res, param){
	if(("insert" == param.path2 || "update" == param.path2)){
		if(!param['isAdmin'])
			err.error(res, '권한이 없습니다.');
		else
			param["title"] = null == req.param("title") ? "게시판" : req.param("title");
	}
	
	if("insert" == param.path2)
		boardInsert(req, res, param);
	else if("update" == param.path2)
		boardUpdate(req, res, param);
	else if("detail" == param.path3)
		boardDetail(req, res, param);
	// 위에 3가지 경우 빼고는 title은 다 존재 한다. 
	else if ('' != param["title"] && null != param["title"])
		boardList(req, res, param);
	else 
		err.error(res, '찾는 페이지가 없습니다.');
};

/**
 * ajax를 호출해주는 부분이다. 여기서 분기한다. 컨트롤러 역활이다.
 */
exports.boardAjaxRoute = function(req, res, param){
	res.set("Content-Type", "text/html");
	if(req.path.indexOf("ajaxTopList") >=0)
		ajaxTopList(req, res, param);
	else if(req.path.indexOf("ajaxInsert") >=0)
		ajaxInsert(req, res, param);
	else if(req.path.indexOf("ajaxCommentInsert") >=0)
		ajaxCommentInsert(req, res, param);
	else if(req.path.indexOf("ajaxCommentDelete") >=0)
		ajaxCommentDelete(req, res, param);
}

/**
 * 게시판 리스트
 * 
 * @param req
 * @param res
 * @param param
 */
function boardList(req, res, param){
	var viewCount = (req.param("viewCount") == null || req.param("viewCount") == "") ? 5 :  parseInt( req.param("viewCount"), 10 );
	var page = (req.param("page") == null || req.param("page") == "") ? 1 : parseInt( req.param("page"), 10 );
	
	db.boards.find({division: param.path2}).count({}, function (err, data) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		param["topPaging"] = paging.topListPaging(data, viewCount, page);
		param["paging"] = paging.listPaging(data, viewCount, page);
		
		db.boards.find({division: param.path2}).sort({date : -1, comment : {date : 1}}).skip(viewCount * (page - 1)).limit(viewCount, function (err, data) {
			if(err){
				console.log(err);
				err.error(res, err);
			}
			
			param["boardList"] = data;
			res.render("board",param);
		})
	});
}

/**
 * 
 * @param req
 * @param res
 * @param param
 */
function boardDetail(req, res, param){
	var _id = req.param("_id");
	
	if(null == _id || '' == _id)
		err.error(res, '필수값 전달 안됨');
	
	db.boards.findOne({ _id: db.ObjectId(_id) }, function (err, data) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		
		param["boardInfo"] = data;
		
		res.render("boardDetail",param);
	});
}

/**
 * 게시판 등록 페이지 호출
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function boardInsert(req, res, param){
	res.render("boardInsert", param);
}

/**
 * 게시판 수정 페이지 호출
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function boardUpdate(req, res, param){
	res.render("boardUpdate", param);
}

/**
 * topList의 데이터를 json방식으로 return.
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function ajaxTopList(req, res, param){	
	var viewCount = (req.param("viewCount") == null || req.param("viewCount") == "") ? 5 :  parseInt( req.param("viewCount"), 10 );
	var page = (req.param("page") == null || req.param("page") == "") ? 1 : parseInt( req.param("page"), 10 );
	
	db.boards.find({division: param.path2}).count({}, function (err, count) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		
		db.boards.find({division: param.path2}).sort({date : -1, comment : {date : 1}}).skip(viewCount * (page - 1)).limit(viewCount, function (err, data) {
			if(err){
				console.log(err);
				err.error(res, err);
			}
			
			param["boardList"] = data;
			param["topPaging"] = paging.topListPaging(count, viewCount, page);
			res.send(param);
		})
	});
}

/**
 * 게시판 등록
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function ajaxInsert(req, res, param){
	var division = decodeURIComponent(req.param("division"));
	var title = decodeURIComponent(req.param("title"));
	var content = decodeURIComponent(req.param("content"));
	db.boards.insert({"division":division, "title":title, "content":content, "date": nowDates(), "comment": []}, function(err){
		if(err)
			console.log(err);
	});
	res.send("");
}

/**
 * 댓글 등록 후 댓글 목록을 가져다 준다.
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function ajaxCommentInsert(req, res, param){
	var _id = decodeURIComponent(req.param("_id"));
	var id = decodeURIComponent(req.param("id"));
	var password = decodeURIComponent(req.param("password"));
	var content = decodeURIComponent(req.param("content"));
	
	db.boards.findAndModify({
		query: { _id: db.ObjectId(_id) },
    	update: { $push : {comment : {id : id, password : password, content : content, date : nowDates()}} },
    	new: true
    	},
    	function(err, data){
    		if(err)
				console.log(err);
				
			param['boardInfo'] = data;
			res.send(param);
	});
}

function ajaxCommentDelete(req, res, param){
	var _id = decodeURIComponent(req.param("_id"));
	var id = decodeURIComponent(req.param("id"));
	var password = decodeURIComponent(req.param("password"));
	var date = decodeURIComponent(req.param("commentDate"));
	
	console.log(_id + "/" + id + "/" + password  + "/" + date);
	
	db.boards.findAndModify({
		query: { _id: db.ObjectId(_id) },
    	update: { $pull : {comment : {id : id, password : password, date : date}} },
    	new: true
    	},
    	function(err, data){
    		if(err)
				console.log(err);
    		
			param['boardInfo'] = data;
			res.send(param);
	});
}

/**
 * 현재 날짜 가져오기. 유틸로 해서 뺼까 고민중
 * 
 * @returns
 */
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