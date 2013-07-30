/**
 * main
 * 작성자 : 권동준
 */
var err = require("../routes/err.js");
var dateUtil = require("../util/dateUtil.js");
var paging = require("../util/paging.js");
var pro = require("../util/property.js");
var db = require('mongojs').connect(pro.dbInfo(), ['boards', 'guestBooks']);
 
/**
 * ajax 관련 컨트롤러?
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
exports.geustBookAjaxRoute = function(req, res, param){
	res.set("Content-Type", "text/html");
	/* 게시판 목록(상위) 가져오기페이징 포함 */
	if(req.path.indexOf("ajaxGeustBookInsert") >=0)
		ajaxGeustBookInsert(req, res, param);
	else if(req.path.indexOf("ajaxGeustBookDelete") >=0)
		ajaxGeustBookDelete(req, res, param);
	else if(req.path.indexOf("ajaxGuest") >=0 )
		ajaxGuest(req, res, param);
}	
 
/**
 * 메인
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
exports.mainRoute = function(req, res, param){
	var viewCount = (req.param("viewCount") == null || req.param("viewCount") == "") ? 5 :  parseInt( req.param("viewCount"), 10 );
	var page = (req.param("page") == null || req.param("page") == "") ? 1 : parseInt( req.param("page"), 10 );

	/* 게시판 전체 목록은 그냥 페이지 없이 5개만 무조건 나오게 한다. */
	db.boards.find({}).sort({date : -1, comment : {date : 1}}).skip(0).limit(5, function (err, boardList) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		
		/* 방명록 카운트 */
		db.guestBooks.find({}).count({}, function (err, guestBookCount) {
			if(err){
				console.log(err);
				err.error(res, err);
			}
			param["boardList"] = boardList;
			
			/* 방명록 페이징 처리 */
			param["paging"] = paging.listPaging(guestBookCount, viewCount, page);
			
			/* 방명록 내용 */
			db.guestBooks.find({}).sort({date : -1, comment : {date : 1}}).skip(viewCount * (page - 1)).limit(viewCount, function (err, guestBook){
				if(err){
					console.log(err);
					err.error(res, err);
				}
				
				param["guestBookList"] = guestBook;
				res.render('main',param);
			});
		});
	});
};

/**
 * 방명록 삭제
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function ajaxGuest(req, res, param){
	var viewCount = (req.param("viewCount") == null || req.param("viewCount") == "") ? 5 :  parseInt( req.param("viewCount"), 10 );
	var page = (req.param("page") == null || req.param("page") == "") ? 1 : parseInt( req.param("page"), 10 );
	
	/* 방명록 카운트 */
	db.guestBooks.find({}).count({}, function (err, guestBookCount) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		/* 방명록 페이징 처리 */
		param["paging"] = paging.listPaging(guestBookCount, viewCount, page);
		
		/* 방명록 내용 */
		db.guestBooks.find({}).sort({date : -1, comment : {date : 1}}).skip(viewCount * (page - 1)).limit(viewCount, function (err, guestBook){
			if(err){
				console.log(err);
				err.error(res, err);
			}
			
			param["guestBookList"] = guestBook;
			res.send(param);
		});
	});
}

/**
 * 방명록 삭제
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function ajaxGeustBookDelete(req, res, param){
	var _id = decodeURIComponent(req.param("_id"));
	var password = decodeURIComponent(req.param("password"));
	
	db.guestBooks.remove({_id : db.ObjectId(_id), password : password});
	res.send("");
}

/**
 * 방명록 등록
 * 
 * @param req
 * @param res
 * @param param
 * @returns
 */
function ajaxGeustBookInsert(req, res, param){
	var id = decodeURIComponent(req.param("id"));
	var password = decodeURIComponent(req.param("password"));
	var content = decodeURIComponent(req.param("content"));
	
	db.guestBooks.insert({"id":id, "password":password, "content":content, "date": dateUtil.nowDates(), "comment": []}, function(err){
		if(err)
			console.log(err);
	});
	res.send("");
}