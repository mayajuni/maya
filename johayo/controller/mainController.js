/**
 * main
 * 작성자 : 권동준
 */
var mainRoute = require('../routes/mainRoute.js');
var useDB = 'testDB';
var db = require('mongojs').connect(useDB, ['tests']);

/* main */
exports.controller = function(req, res, next){
	db.test.find({}, {name:1, score:1, _id:0},function (error, data) { 
    	console.log(data); 
	});
	res.render('index',{title:'메인페이지'});
};