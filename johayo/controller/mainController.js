/**
 * main
 * 작성자 : 권동준
 */
var mainRoute = require('../routes/mainRoute.js');
var useDB = '14.63.220.231/testDB';
var db = require('mongojs').connect(useDB, ['tests']);

var renderSeed = function(title){
	this.title = title;
}

/* main */
exports.controller = function(req, res, next){
	db.tests.find({}, function (error, data) {
		if(error){
			console.log(error);
			res.render('err',error);
		}else {
			console.log(data);
			var param = new renderSeed("메인페이지");
			param["data"] = data;
	    	res.render('index',param);
    	}
	});
};