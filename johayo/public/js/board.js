/* 게시판 정보 */
function board($scope, $http, $location){
	/* top게시판 목록 열기 닫기 */
	$scope.topDisplay = '';
	$scope.openColse = function(){
		if($scope.topDisplay =='hidden'){
			$scope.oc = '닫기';
			$scope.topDisplay='';			
		}else{
			$scope.oc = '열기';
			$scope.topDisplay='hidden';
		}
	}
	
	/* 게시판 삭제 */
	$scope.deleteBoard = function (_id){
		$.ajax({
			data : "_id="+_id,
			type : "POST",
			async : false,
			url : "/board/ajaxDelete",
			success : function(data) {
				if(data){
					alert(data);
					return;
				}
					
				alert("삭제되셨습니다.");
				location.reload();
				return;
			},
			error : function() {
				alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
				return;
			}
		});
	}
	
	/* 게시판 수정 */
	$scope.modifyBoard = function(){
		checkBoard();
		if(!confirm("수정하시겠습니까?")) return
		$.ajax({
			data : $("#modify").serialize().replace(/%/g,'%25'),
			type : "POST",
			async : false,
			url : "/board/ajaxModify",
			success : function(data) {
				if(data){
					alert(data);
					return;
				}
					
				alert("수정되셨습니다.");
				location.href="/board/"+$("#division").val()+"/detail?_id="+$("#_id").val();
				return;
			},
			error : function() {
				alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
				return;
			}
		});
	}
	
	/* 게시판 등록 */
	$scope.insertBoard = function(){
		checkBoard();
		
		$.ajax({
			data : $("#insert").serialize().replace(/%/g,'%25'),
			type : "POST",
			async : false,
			url : "/board/ajaxInsert",
			success : function(data) {
				if(data){
					alert(data);
					return;
				}
					
				alert("등록되셨습니다.");
				location.reload();
				//location.href="/board/"+$("#division").val();
				return;
			},
			error : function() {
				alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
				return;
			}
		});
	}
	
	function checkBoard(){
		oEditors.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);	// 에디터의 내용이 textarea에 적용됩니다.
		if($("#division").val() == ''){
			alert("게시판 구분을 선택해주세요.");
			$("#division").focus();
			return;
		}
		if($("#title").val() == ''){
			alert("제목을 입력해주세요.");
			$("#title").focus();
			return;
		}
		
		if($("#content").val() == '<br>'){
			alert("내용을 입력해주세요.");
			$("#content").focus();
			return;
		}
	}
}

/* 게시판 페이지 이동 */
function movePage(page, viewCount){
	location.href=window.location.pathname+"?page="+page+"&viewCount="+viewCount;
}

/* 상위 게시판 페이지 이동 ajax */
function moveTopPage(page, viewCount){
	$.ajax({
		data : 'page='+page+'&viewCount='+viewCount,
		type : "POST",
		async : false,
		url : window.location.pathname+"/ajaxTopList",
		success : function(data) {
			 var data = eval('('+data+')');
			 var html = '';
			 for(var i=0;i<data.boardList.length;i++){
				 html = html + '<tr><td scope="row"><span onclick="goDetail(\''+data.boardList[i]._id+'\', \''+data.topPaging.nowPage+'\');" name="aTag" id="aTag'+i+'" style="cursor: pointer;">';
				 html = html + data.boardList[i].title+'</span>';
				 if(data.boardList[i].comment.length > 0)
					 html = html + ' <span style="color: #FF3636;">(<b>'+data.boardList[i].comment.length+'</b>)</span>';
				 html = html + '</td><td scope="row">'+data.boardList[i].date.substring(0,4)+'/'+data.boardList[i].date.substring(4,6)+'/'+data.boardList[i].date.substring(6,8)+'</td></tr>';
			 }
			 $("#boardList").html(html);
			 $("#topPaging").html(data.topPaging.html);
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}

/* 상세 보기 */
function goDetail(_id, nowPage){
	var url = window.location.pathname
	if(window.location.pathname.indexOf("detail") < 0)
		url = url +"/detail";
	
	location.href=url+"?_id="+_id+"&page="+nowPage;
}

/* 댓글 리스트 리셋 */
function commentList(index, data){
	$("#comDeleteBox").remove();
	var html = '';
	
	for(var i=0;i<data.boardInfo.comment.length;i++){
		html = html + '<tr><td colspan="3"><span class="commentTitle">'+data.boardInfo.comment[i].id+'</span> <span style="font-size: 11px;">('+data.boardInfo.comment[i].date.substring(0,4)+'/'+data.boardInfo.comment[i].date.substring(4,6)+'/'+data.boardInfo.comment[i].date.substring(6,8)+' '+data.boardInfo.comment[i].date.substring(8,10)+':'+data.boardInfo.comment[i].date.substring(10,12)+')</span>';
		html = html + '<span style="cursor: pointer;" onclick="showDelete(\''+index+'\', \''+data.boardInfo._id+'\', \''+data.boardInfo.comment[i].id+'\', \''+data.boardInfo.comment[i].date+'\', event)"> x </span></td></tr>';
		html = html + '<tr><td colspan="3" class="commentContent"><pre>'+data.boardInfo.comment[i].content+'</pre></td></tr>';
	}
	
	$("#comment"+index).html(html);
}

/* 댓글 열기 닫기 */
function commentOpenColse(index){
	if($("#commnetDisplay"+index).attr('class') == 'hidden'){
		$("#tfoot"+index).attr('class', 'tfoot');
		$("#commnetDisplay"+index).attr('class', '');
	}else{
		$("#tfoot"+index).attr('class', '');
		$("#commnetDisplay"+index).attr('class', 'hidden');
	}
}

/* 댓글 등록 */
function insertComment(index, _id){
	if($("#content"+index).val() == ''){
		alert("내용을 입력해주세요.");
		$("#content"+index).focus();
		return;
	}
	if($("#id"+index).val() == ''){
		alert("아이디을 입력해주세요.");
		$("#id"+index).focus();
		return;
	}
	if($("#password"+index).val() == ''){
		alert("비밀번호을 입력해주세요.");
		$("#password"+index).focus();
		return;
	}
	
	$.ajax({
		data : "_id="+_id+"&id="+$("#id"+index).val()+"&password="+$("#password"+index).val()+"&content="+$("#content"+index).val(),
		type : "POST",
		async : false,
		url : "/board/ajaxCommentInsert",
		success : function(data) {
			var data = eval('('+data+')');
			commentList(index, data);
			return;
		},
		error : function() {
			alert("시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
			return;
		}
	});
}

/* 댓글 삭제 */
function deleteComment(index, boardId, id, commentDate){
	if($("#delPassword").val() == ''){
		alert("비밀번호를 입력해주세요.");
		$("#delPassword").focus();
		return;
	}
	
	$.ajax({
		data : "_id="+boardId+"&id="+id+"&password="+$("#delPassword").val()+"&commentDate="+commentDate,
		type : "POST",
		async : false,
		url : "/board/ajaxCommentDelete",
		success : function(data) {
			var data = eval('('+data+')');
			commentList(index, data);
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
function showDelete(index, boardId, id, commentDate, e){
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
			   '<input type="button" value="삭제" onclick="deleteComment(\''+index+'\', \''+boardId+'\', \''+id+'\', \''+commentDate+'\')">' +
			   "<input type='button' value='취소' onclick='closeMemo()'></div>");
}

/* 비밀번호 묻는창 닫기 */
function closeMemo(){
	$("#comDeleteBox").remove();
}