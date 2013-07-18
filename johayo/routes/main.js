/**
 * main
 * 작성자 : 권동준
 */
var board = require('../routes/board.js');
var err = require("../routes/err.js");
var paging = require("../util/paging.js");
var pro = require("../util/property.js");
var db = require('mongojs').connect(pro.dbInfo(), ['boards']);
 
/* main */
exports.mainRoute = function(req, res, param){
	var viewCount = (req.param("viewCount") == null || req.param("viewCount") == "") ? 5 :  parseInt( req.param("viewCount"), 10 );
	var page = (req.param("page") == null || req.param("page") == "") ? 1 : parseInt( req.param("page"), 10 );

	db.boards.find({}).sort({date : -1, comment : {date : 1}}).skip(0).limit(5, function (err, data) {
		if(err){
			console.log(err);
			err.error(res, err);
		}
		
		param["boardList"] = data;
		
		res.render('main',param);
	});	
};