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
		if(err){
			console.log(err);
			res.render('err',err);
		}else {
			console.log(data);
			var param = new renderSeed("POST LIST");
			param["data"] = data;
	    	res.render('index',param);
    	}
	});
};