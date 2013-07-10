/**
 * 게시판
 * 작성자 : 권동준
 */
var db = require('mongojs').connect('14.63.220.231/maya', ['boards']);
var paging = require('../util/paging.js');

/**
 * 게시판
 * param : 메뉴, title 등 여러가지고 값
 */
exports.boardRoute = function(req, res, param){
	var page = parseInt(((req.param('page') == '' || req.param('page') == null) ? '1' : req.param('page')), 10);
	var viewCount = parseInt(((req.param('viewCount') == '' || req.param('viewCount') == null) ? '5' : req.param('viewCount')), 10);
	param['paging'] = paging.topListPaging(71, viewCount, page);
	res.render('board',param);
};