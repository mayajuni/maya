/**
 * 에러났을시
 */
exports.error = function(res, err){
	res.render('common/err', {title : err, err : err});
}
 