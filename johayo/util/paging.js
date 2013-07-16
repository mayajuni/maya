/**
 * New node file
 */
 
/** 
 * top 목록 페이징 만들기
 * total : 전체수
 * viewCout : 보여지는 row수
 * page : 현재 페이지 (1|2|3| 여기서 숫자)
 */
exports.topListPaging = function(total, viewCount, page){	
	if(viewCount == null || viewCount == '')
		viewCount = 5;
	if(page == null || page == '')
		page = 1;
		
	var groupCount = total / viewCount == 0 ? '1' : (total / viewCount);
	var html = '';
	var nowGroup = parseInt((page / 10), 10) + 1;
	if((page%10) == 0)
		nowGroup = nowGroup - 1;
	var i = (nowGroup-1)*10;
	var count = groupCount < (nowGroup*10) ? groupCount : (nowGroup*10);
	for(i;i<count;i++){
		if(i>0 && (i%10) == 0)
			html='<span onclick="moveTopPage('+i+', '+viewCount+')" style="cursor: pointer;">이전</span> |';
		else if((i%10) != 0)
			html= html + ' |';
			
		
		if(page == (i+1))
			html = html + ' <span style="font-weight: bold;">' + (i+1)+"</span>";
		else
			html = html + ' <span onclick="moveTopPage('+(i+1)+', '+viewCount+')" style="cursor: pointer;">' + (i+1)+"</span>";
			 
		if(i == (count-1) && groupCount > 10)
			html= html + ' | <span onclick="moveTopPage('+(i+2)+', '+viewCount+')" style="cursor: pointer;">다음</span>';		
	}
	
	return html;
}

/** 
 * 페이징 만들기
 * total : 전체수
 * viewCout : 보여지는 row수
 * page : 현재 페이지 (1|2|3| 여기서 숫자)
 */
exports.listPaging = function(total, viewCount, page){
	if(viewCount == null || viewCount == '')
		viewCount = 5;
	if(page == null || page == '')
		page = 1;
		
	var groupCount = total / viewCount == 0 ? '1' : (total / viewCount);
	var html = '';
	var nowGroup = parseInt((page / 10), 10) + 1;
	if((page%10) == 0)
		nowGroup = nowGroup - 1;
	var i = (nowGroup-1)*10;
	var count = groupCount < (nowGroup*10) ? groupCount : (nowGroup*10);
	for(i;i<count;i++){
		if(i>0 && (i%10) == 0)
			html='<span onclick="movePage('+i+', '+viewCount+')" style="cursor: pointer;">◀ 이전</span> |';
		else if((i%10) != 0)
			html= html + ' |';
		
		if(page == (i+1))
			html = html + ' <span style="font-weight: bold;">' + (i+1)+"</span>";
		else
			html = html + ' <span ng-click="movePage('+(i+1)+', '+viewCount+')" style="cursor: pointer;">' + (i+1)+"</span>";
			 
		if(i == (count-1) && groupCount > 10)
			html= html + ' | <span ng-click="movePage('+(i+2)+', '+viewCount+')" style="cursor: pointer;">다음 ▶</span>';		
	}
	
	return html;
}