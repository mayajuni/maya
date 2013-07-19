/**
 * 메인페이지 js
 */
function main($scope){
	
}

/* 상위 게시판 페이지 이동 ajax */
function movePage(page, viewCount){
	$.ajax({
		data : 'page='+page+'&viewCount='+viewCount,
		type : "POST",
		async : false,
		url : window.location.pathname+"/ajaxTopList",
		success : function(data) {
			 var data = eval('('+data+')');
			 var html = '';
			 for(var i=0;i<data.boardList.length;i++){
				 html = html + '<tr><td scope="row">' + data.boardList[i].title+'</span>';
				 html = html + '</td><td scope="row">'+data.boardList[i].date.substring(0,4)+'/'+data.boardList[i].date.substring(4,6)+'/'+data.boardList[i].date.substring(6,8)+'</td></tr>';
			 }
			 $("#guestBookList").html(html);
			 $("#paging").html(data.topPaging);
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}

/* 방명록 등록 */
function insertGeustBook(){
	if($("#content").val() == ''){
		alert("내용을 입력해주세요.");
		$("#content").focus();
		return;
	}
	if($("#id").val() == ''){
		alert("아이디을 입력해주세요.");
		$("#id").focus();
		return;
	}
	if($("#password").val() == ''){
		alert("비밀번호을 입력해주세요.");
		$("#password").focus();
		return;
	}
	
	$.ajax({
		data : "id="+$("#id").val()+"&password="+$("#password").val()+"&content="+$("#content").val(),
		type : "POST",
		async : false,
		url : "/main/ajaxGeustBookInsert",
		success : function(data) {
			var data = eval('('+data+')');
			var html = '';
			
			for(var i=0;i<data.boardInfo.comment.length;i++){
				html = html + '<tr><td colspan="3"><span class="commentTitle">'+data.boardInfo.comment[i].id+'</span> <span style="font-size: 11px;">('+data.boardInfo.comment[i].date.substring(0,4)+'/'+data.boardInfo.comment[i].date.substring(4,6)+'/'+data.boardInfo.comment[i].date.substring(6,8)+' '+data.boardInfo.comment[i].date.substring(8,10)+':'+data.boardInfo.comment[i].date.substring(10,12)+')</span>';
				html = html + '<span style="cursor: pointer;" onclick="showDelete(\''+index+'\', \''+data.boardInfo._id+'\', \''+data.boardInfo.comment[i].id+'\', \''+data.boardInfo.comment[i].date+'\', event)"> x </span></td></tr>';
				html = html + '<tr><td colspan="3" class="commentContent"><pre>'+data.boardInfo.comment[i].content+'</pre></td></tr>';
			}
			
			$("#comment"+index).html(html);
			return;
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}