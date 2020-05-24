// ================================================
// 모든 페이지에 해당하는 함수들
// ================================================

var doc;

function setDocument(newDocument) {
    doc = newDocument
}

function getDocument() {
    return doc;
}

function initialize() {
    let frame = document.querySelector('frame[name="main"]');

    frame.addEventListener('load', renewDocument);

    document.title = '!' + document.title;
    renewDocument();
}

// 매 페이지 갱신시 이 함수를 실행하여 doc를 갱신.
function renewDocument() {
    let frame = document.querySelector('frame[name="main"]');

    console.log('page renewed.');

    setDocument(frame.contentDocument);
    detectPageType();
    // DEBUG
    // __DEBUG__();
}


function detectPageType() {
    let doc = getDocument();
    let formTypes = {
        lessonForm : form => {
            // 강의 목차
            console.log('found lessonForm');
        },
        referenceForm : form => {
            // 학습자료실
            console.log('found referenceForm');
        },
        reportForm : form => {
            console.log('found reportForm');
            
            if (form.hasOwnProperty('reportSubmitDTO.submitStatus')) {
                // 페이지: 학습 활동 / 과제 / 과제 제출 정보
                report_submitView_hack();
            }
            else {
                // 페이지: 학습 활동 / 과제 (목록)
                report_viewList_hack();
            }
        },
        courseForm : form => {
            console.log('found courseForm');
        },
        etestForm : form => {
            console.log('found etestForm');
        },
        attendForm : form => {
            console.log('found attendForm');
        },
        forumForm : form => {
            console.log('found forumForm');
        },
        researchForm : form => {
            console.log('found researchForm');
        },
        teamactForm : form => {
            console.log('found teamactForm');
        }
    };
    for (let ftype in formTypes) {
        if (doc[ftype]) {
            formTypes[ftype](doc[ftype]);
        }
    }
}

function __DEBUG__() {
    let doc = getDocument();

    function parseForm(form) {
        let inputs = form.querySelectorAll('input');
        let obj = {};
        for (let i of inputs) {
            obj[i.name] = i.value || undefined;
        }
        return obj;
    }
    console.log(parseForm(doc.courseForm || doc.reportForm));
}



// ================================================
// 학습 활동 / 과제
// ================================================

function report_viewList_hack() {
    let doc = getDocument();
    let elements;

    // --------------------------------

    function parseReportElement(elem) {
        return {
            node:   elem,
            title:  elem.querySelector('h4.f14').innerText.replace(/\s(?=\s)+/g, ''),
            btnBox: elem.querySelector('ul.btnBox'),
            reportInfoId: (() => {
                let matched = elem.innerHTML.match(/'REPT_[^']+'/);
                if (matched != null) {
                    return matched[0].replace(/'/g, "");
                }
                return null;
            })()
        };
    };

    function createSmallButton(innerText, options) {
        let a = document.createElement('a');
        a.className = 'btn small';
        a.innerHTML = '<i class="icon-note-small-color"></i>'+innerText;
        for (let opt in options) {
            a.setAttribute(opt, options[opt]);
        }
        return a;
    }

    // --------------------------------

    elements = doc.querySelectorAll('div#listBox div.listContent dl.element');

    for (let elem of elements) {
        let parsed_elem = parseReportElement(elem);

        if (parsed_elem.reportInfoId) {
            let li = document.createElement('li');
            li.appendChild(createSmallButton(
                '제출정보보기(수강생전원)', {
                    onclick: `javascript:viewReportList('${parsed_elem.reportInfoId}');`
                }
            ));
            parsed_elem.btnBox.appendChild(li);
        }
    }

}

function report_submitView_hack() {
    let doc = getDocument();
    let btn;

    function createLargeButton(innerText, options) {
        let btn = document.createElement('button');
        btn.className = 'btn large';
        btn.innerHTML = '<i class="icon-list-color"></i>'+innerText;
        for (let opt in options) {
            btn.setAttribute(opt, options[opt]);
        }
        return btn;
    }

    btn = doc.querySelector('button.btn.large');
    btn.parentNode.insertBefore(createLargeButton(
        '수 정 (제출일은 변경되지 않음)', {
            onclick: `javascript:updateReportSubmit();`
        }
    ), btn);
    btn.parentNode.insertBefore(createLargeButton(
        '제출정보보기 (수강생 전원)', {
            onclick: `javascript:viewReportList('${doc.reportForm['reportInfoDTO.reportInfoId'].value}');`
        }
    ), btn);
}
// ================================================
// 실행
// ================================================

initialize();
// renewDocument();
