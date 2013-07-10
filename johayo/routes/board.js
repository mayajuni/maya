/**
 * main
 * 작성자 : 권동준
 */
var db = require('mongojs').connect('14.63.220.231/maya', ['boards']);
var paging = require('../util/paging.js');

/* main */
exports.boardRoute = function(req, res, param){
	param['paging'] = paging.paging(0, 5, 1);
	res.render('board',param);
};