/**
 * main
 * 작성자 : 권동준
 */
var pro = require("../util/property.js");

/* 관리자 라우트 */
exports.adminRoute = function(req, res, param){
	if("loginView" == param.path2)
		res.render("admin", {title : "관리자 로그인"});
	else if("login" == param.path2)
		login(req, res);
	else if("logOut" == param.path2)
		logOut(req, res);
};

/* 관리자 로그인 */
function login(req, res){
	res.set("Content-Type", "text/html");
	var admin = req.param("adminPw");
	var err = "";
	if(admin == pro.admin())
		req.session.admin = "OK";
	else
		err = "비밀번호가 일지 하지 않습니다.";
		
	res.send({ err : err});
}

/* 관리자 로그아웃 */
function logOut(req, res){
	req.session = null;
	res.redirect('/');
}