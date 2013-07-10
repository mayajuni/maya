/**
 * New node file
 */
exports.paging = function(total, viewCount, groupNo){
	var groupCount = total / viewCount == 0 ? '1' : (total / viewCount);
	console.log(groupCount);
	var html = '';
	var i = (groupNo-1)*10;
	var count = groupCount < (groupNo*10) ? groupCount : (groupNo*10);
	for(i;i<count;i++){
		if(i>0 && (i%10) == 0)
			html='◀ 이전 |';
		else if((i%10) != 0)
			html= html + ' |';
			
		html = html + ' ' + (i+1);
		if(i == (count-1) && groupCount > 10)
			html= html + ' | 다음 ▶';		
	}
	
	console.log(html);
	return html;
}