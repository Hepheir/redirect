function checkRunnability() {
    try {
        if (EclassUtils);
        return true;
    } catch {
        return false;
    }
}

if (checkRunnability()) {
    if (EclassUtils.isActive)
        EclassUtils.unload();
    else
        EclassUtils.load();
}
else {
    var EclassUtils = class {
        static load() {
            let base_url = EclassUtils.repository_url;
            EclassUtils.downloadScript(base_url + 'app.js')
                .then(eval)
                .then(() => {
                    alert('이클래스 유틸리티 기능이 활성화 되었습니다.');
                    EclassUtils.isActive = true;
                });
        }
    
        static load_vulnerable() {
            // 사용금지
            let base_url = EclassUtils.repository_url;
            EclassUtils.downloadScript(base_url + 'app-h.js')
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
            let xhr = new XMLHttpRequest();
            return new Promise((resolve, reject) => {        
                xhr.open('GET', url);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        resolve(xhr.responseText);
                    }
                };
                xhr.send();
            });
        }
    }
    EclassUtils.repository_url = 'https://raw.githubusercontent.com/Hepheir/web_functions/master/dgu-eclass-vulnerable/';
}