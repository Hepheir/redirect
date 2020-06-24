
# Ntest 시험 성적 보기

## 개요
* 소스코드는 구글 크롬을 기준으로 작성됨.

* 기능: Ntest 웹 페이지에는 사용자 성적이 데이터로써 존재하지만 문구로서 나타나지 않는데, 이를 찾아 보여줌.

## 설치

1. 북마크 생성
    * 구글 크롬에서 [북마크바(Ctrl+Shift+B) 위에 마우스 커서를 올리고 **우클릭**] -> [페이지 추가]


2. 북마크 수정
    * 이름: *적당히 아무 이름으로 설정*
    * URL: **(중요)** *본래 내용을 지우고, 아래의 '코드 전체'를 복사 붙여넣기*

    ```javascript
    javascript:function viewFinalPoint(){let url="/zax/morehistory";let type="post";let opt={start:0,end:10};if(!isCaping){isAutoMsg=false;ajaxing();}isNoBG=false;capResult=null;capOK=false;isCaping=true;_callback="";$.ajax({type:type,url:url,data:opt,success:result=>{capResult=result;isCaping=false;for(let idx=0;idx<capResult.Obj.length;idx++){let li_node=document.querySelector(`li[data-eno="${idx}"]`)||false;if(li_node){li_node.querySelector('div').innerHTML+=`<p class="txt">내 점수: ${capResult.Obj[idx].FinalPoint}점</p>`;}}setcap();},error:result=>{console.log(result.responseText);isCaping=false;msg("네트워크 상태를 확인해주세요.");location.href="/";},complete:()=>{ajaxing(false);}});}viewFinalPoint();
    ```

3. 북마크 저장 & 실행
* 반드시 '응시이력' 페이지에서 실행해야함. (그 외에 페이지에서 실행시 아무 기능이 없음)


> 성공시, 응시이력 하단에 '내 점수: ~~점' 으로 출력됨.