/**
 * main
 * 작성자 : 권동준
 */
var board = require('../routes/board.js');
var err = require("../routes/err.js");
var paging = require("../util/paging.js");
var pro = require("../util/property.js");
var db = require('mongojs').connect(pro.dbInfo(), ['boards', 'guestBooks']);
 
/* main */
exports.mainRoute = function(req, res, param){
	var viewCount = (req.param("viewCount") == null || req.param("viewCount") == "") ? 5 :  parseInt( req.param("viewCount"), 10 );
	var page = (req.param("page") == null || req.param("page") == "") ? 1 : parseInt( req.param("page"), 10 );

	/* 게시판 전체 목록은 그냥 페이지 없이 5개만 무조건 나오게 한다. */
	db.boards.find({}).sort({date : -1, comment : {date : 1}}).skip(0).limit(5, function (err, boardList) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		
		param["boardList"] = boardList;
		/* 방명록 카운트 */
		db.boards.find({division: param.path2}).count({}, function (err, guestBookCount) {
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
				res.render('main',param);
			});
		});
	});
};