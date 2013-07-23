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
			location.reload();
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}

/* 댓글 삭제 */
function deleteComment(_id){
	if($("#delPassword").val() == ''){
		alert("비밀번호를 입력해주세요.");
		$("#delPassword").focus();
		return;
	}
	
	$.ajax({
		data : "_id="+_id+"&password="+$("#delPassword").val(),
		type : "POST",
		async : false,
		url : "/main/ajaxGeustBookDelete",
		success : function() {
			location.reload();
			return;
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
	return;
}

/* 비밀번호 묻는창 오픈 */
function showDelete(_id, e){
	if(!e) e = window.Event;
	
	var x = e.clientX + (document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft);
	var y = e.clientY + (document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop);
	
	$("#comDeleteBox").remove();
	
	$('body').append('<div id="comDeleteBox"></div>');
	
	$("#comDeleteBox").css(
		      {'border-style':'solid',
		       'background':'white',
		       position:'absolute',
		       'border-width':'1px 1px 1px 1px',
		       'top': (y)+'px',
		       'left': (x+17)+'px',
		       'z-index':'10',
		       'border-radius':'5px',
		       'text-align' : 'center'
		      });

	$("#comDeleteBox").html("<div>" +
			   "<input type='password' id='delPassword' size='10' placeholder='비밀번호'>" +
			   '<input type="button" value="삭제" onclick="deleteComment(\''+_id+'\')">' +
			   "<input type='button' value='취소' onclick='closeMemo()'></div>");
}

/* 비밀번호 묻는창 닫기 */
function closeMemo(){
	$("#comDeleteBox").remove();
}