function load() {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://raw.githubusercontent.com/Hepheir/web_functions/master/dgu-eclass/app.js');
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            eval(xhr.responseText);
            alert('[성공] 핵을 활성화 하였습니다.');
        }
    };
    xhr.send();
}

try {
    // hack 변수가 선언되었는지, 값은 무엇인지 검사.
    if (hack) {
        if (confirm('핵을 종료하시겠습니까?\n(확인을 누르시면 창이 새로고침 됩니다.)')) {
            location.reload();
        }
    }
    else {
        hack = true;
        load();
    }
} catch (error) {
    hack = true;
    load();
}
