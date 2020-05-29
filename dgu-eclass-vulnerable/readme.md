
# 악용하지 마시오

## 개요
소스코드는 구글 크롬을 기준으로 작성됨.

## 설치
[북마크바(Ctrl+Shift+B)에서 **마우스 우클릭**]-[페이지 추가] 클릭

* 이름: *적당히 아무 이름으로 설정*
* URL: **(중요)** *본래 내용을 지우고, 아래의 '코드 전체'를 복사 붙여넣기*

```javascript
javascript:(function(){class EclassUtils{static repository_url='https://raw.githubusercontent.com/Hepheir/web_functions/master/dgu-eclass/';static isActive=false;static load(){downloadScript(repository_url+'app-compressed.js').then(eval).then(()=>{alert('이클래스 유틸리티 기능이 활성화 되었습니다.');EclassUtils.isActive=true;});}static load_vulnerable(){downloadScript(repository_url+'app-compressed-h.js').then(eval).then(()=>{alert('[주의]이클래스 핵 기능이 활성화 되었습니다.');EclassUtils.isActive=true;});}static unload(){if(confirm('종료하시겠습니까?\n(확인을 누르시면 창이 새로고침 됩니다.)')){EclassUtils.isActive=false;location.reload();}}static downloadScript(url){return new Promise((resolve,reject)=>{let xhr=new XMLHttpRequest();xhr.open('GET',url);xhr.onreadystatechange=()=>{if(xhr.readyState==XMLHttpRequest.DONE)resolve(xhr.responseText);};xhr.send();});}}if(EclassUtils.isActive)EclassUtils.unload();else{unlock=unlock||false;if(!unlock)EclassUtils.load();else EclassUtils.load_vulnerable();}})();
```

그리고 저장.

## 실행
이클래스 홈페이지에서 '설치'과정에서 생성한 북마크를 실행.

> 이클래스 유틸리티 기능이 활성화 되었습니다.

라는 문구가 뜨면 성공.
