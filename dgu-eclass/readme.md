# 악용하지 마시오

## 개요
소스코드는 구글 크롬을 기준으로 작성됨.

## 설치
[북마크바(Ctrl+Shift+B)에서 **마우스 우클릭**]-[페이지 추가] 클릭

* 이름: *적당히 아무 이름으로 설정*
* URL: **(중요)** *본래 내용을 지우고, 아래의 '코드 전체'를 복사 붙여넣기*

```javascript
javascript: (function(){function load(){let xhr=new XMLHttpRequest();xhr.open('GET','https://raw.githubusercontent.com/Hepheir/web_functions/master/dgu-eclass/app.js');xhr.onreadystatechange=()=>{if(xhr.readyState==XMLHttpRequest.DONE){eval(xhr.responseText);alert('[성공]핵을 활성화 하였습니다.');}};xhr.send();}try{if(hack){if(confirm('핵을 종료하시겠습니까?\n(확인을 누르시면 창이 새로고침 됩니다.)')){location.reload();}}else{hack=true;load();}}catch(error){hack=true;load();}})();
```

그리고 저장.

## 실행
이클래스 홈페이지에서 '설치'과정에서 생성한 북마크를 실행.

> [성공]핵을 활성화 하였습니다.

라는 문구가 뜨면 성공.
