/**
 * 에러났을시
 */
exports.error = function(res, err){
	res.render('err', {title : err, err : err});
}
 