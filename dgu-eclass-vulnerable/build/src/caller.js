class EclassUtils {
    static repository_url = 'https://raw.githubusercontent.com/Hepheir/web_functions/master/dgu-eclass/';

    static isActive = false;

    static load() {
        downloadScript(repository_url + 'app-compressed.js')
            .then(eval)
            .then(() => {
                alert('이클래스 유틸리티 기능이 활성화 되었습니다.');
                EclassUtils.isActive = true;
            });
    }

    static load_vulnerable() {
        // 사용금지
        downloadScript(repository_url + 'app-compressed-h.js')
            .then(eval)
            .then(() => {
                alert('[주의] 이클래스 핵 기능이 활성화 되었습니다.');
                EclassUtils.isActive = true;
            });
    }

    static unload() {
        if (confirm('종료하시겠습니까?\n(확인을 누르시면 창이 새로고침 됩니다.)')) {
            EclassUtils.isActive = false;
            location.reload();
        }
    }

    static downloadScript(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
        
            xhr.open('GET', url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE)
                    resolve(xhr.responseText);
            };
            xhr.send();
        });
    }
}

if (EclassUtils.isActive) EclassUtils.unload();
else {
    unlock = unlock || false;

    if (!unlock) EclassUtils.load();
    else EclassUtils.load_vulnerable();
}
