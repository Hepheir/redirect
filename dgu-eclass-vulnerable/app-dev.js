class ListWrapper {
    static getElements(ref_document) {
        let nodeList, nodeArray, elemArray;
        nodeList = ref_document.querySelectorAll('div#listBox div.listContent dl.element');
        nodeArray = Array.from(nodeList); // 노드 리스트는 for of 반복문외에 사용에 제약이 걸리므로, 배열로 만들어줌. (Array.map 사용이 용이하게.)
        elemArray = nodeArray.map(elem => new ListWrapper.Elements(elem));
        return elemArray;
    }

    static Elements = class {
        constructor(element_node) {
            this.node =      element_node;
            this.title =     element_node.querySelector('h4.f14').innerText.replace(/[\s][\s]+/g, '');
            this.buttonBox = element_node.querySelector('ul.btnBox');

            this.getIdsByFlag = this.getIdsByFlag.bind(this);
            this.appendButton = this.appendButton.bind(this);
        }

        // id_name은 속성명, id_flag는 ID가 가진 패턴에서 앞부분 글자
        // (ex. 속성명: reportInfoId, ID패턴: REPT_20129aadk3...)
        static _getIdsByFlag(node, id_name, id_flag) {
            let reg = new RegExp(`'${id_flag}_[^']+'`, 'g');
            let matched, matched_found;
    
            if ( !(id_name instanceof Array) )
                id_name = new Array(id_name);

            matched = node.innerHTML.match(reg);
            matched_found = (matched != null);

            let ret_obj = new Object();

            try {
                for (let i = 0; i < id_name.length; i++)
                ret_obj[id_name[i]] = (matched_found) ? matched[i].replace(/'/g, '') : null;
            } catch (err) {
                ret_obj = null;
                console.log(matched, err);
            }
            return ret_obj;
        }
    
        getIdsByFlag(id_name, id_flag) {
            let obj = ListWrapper.Elements._getIdsByFlag(this.node, id_name, id_flag);

            for (let key in obj) 
                this[key] = obj[key];

            return obj != null; // appendButton의 조건으로 사용되기도 함.
        }

        appendButton(innerText, attributes) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            let iconType = attributes.hasOwnProperty('icon') ? attributes.icon : 'icon-list-color';
    
            delete attributes.icon; // 아래 for문에서 "icon" 속성이 추가되지 않도록 함.
    
            a.className = 'btn small';
            a.innerHTML = `<i class="${iconType}"></i>${innerText}`;
            for (let attr in attributes) a.setAttribute(attr, attributes[attr]);

            li.appendChild(a);
            this.buttonBox.appendChild(li);
        }
    }
}
class Form {
    static name = '?';

    static load(formClass, form, main) {
        console.log(`[@${formClass.name}] Load.`);

        if (formClass.name == Form.name) {
            let err = `[@Form] Error: 'Sub_Class_of_Form.name' was not Overriden`;
        
            console.log(err);
            throw err;
        }

        formClass.document = main.document;
        formClass.form = form;
    }

    static unload(formClass) {
        console.log(`[@${formClass.name}] Unload.`);

        delete formClass.document;
        delete formClass.form;
    }

    static fetch_from_main(formClass, form, main) {
        formClass.load(formClass, form, main);
        formClass.fetch();
        formClass.unload(formClass);
    }

    static fetch() {
        let err = `[@Form] Error: 'Sub_Class_of_Form.fetch()' was not Overriden`;
        
        console.log(err);
        throw err;
    }
}
class ReportForm extends Form {
    static name = 'ReportForm';
    
    static fetch() {
        let isViewListPage = ReportForm.form.hasOwnProperty('reportSubmitDTO.submitStatus');
        if (!isViewListPage) {
            ReportForm.viewList.fetch();
        }
    }

    // 페이지: 학습 활동 / 과제 (목록)
    static viewList = class {
        static fetch() {
            let elements, isFound;
            console.log('[@ReportForm.viewList] Fetch page.');

            elements = ListWrapper.getElements(ReportForm.document);
            elements.forEach(elem => {
                isFound = elem.getIdsByFlag('reportInfoId', 'REPT');

                if (isFound) elem.appendButton(
                    '제출정보보기(수강생전원)', {
                        onclick: `javascript:viewReportList('${elem.reportInfoId}', 'N');`
                    }
                );
            });
            console.log('[@ReportForm.viewList] * Found elements are:', elements);
        }
    };
}
class LessonForm extends Form {
    static name = 'LessonForm';

    static fetch() {
        LessonForm.viewList.fetch();
    }

    // 위치: 강의목록 / 강의 목록
    static viewList = class {
        static fetch() {
            let elements, isFound;
            console.log('[@LessonForm.viewList] Fetch page.');

            elements = ListWrapper.getElements(LessonForm.document);
            console.log('[@LessonForm.viewList] * Found elements are:', elements);

            elements.forEach(elem => {
                LessonForm.viewList.updateTable(elem);
            });
        }

        static updateTable(elem) {
            let thead_tr, tbody_trs;
            let table = elem.node.querySelector('table');

            thead_tr  = table.querySelector('thead tr');
            tbody_trs = table.querySelectorAll('tbody tr');

            LessonForm.viewList.addTableCell(thead_tr, true);
            Array.from(tbody_trs).forEach(tr => {
                LessonForm.viewList.addTableCell(tr);
            });
        }


        static addTableCell(tr, isHead=false) {
            let checkBox, td;
            let obj = ListWrapper.Elements._getIdsByFlag(tr, ['lessonElementId', 'lessonContentsId'], 'LESN');

            if (isHead) {
                td = document.createElement('th');
                td.innerText = '자동수강';
            }
            else {
                td = document.createElement('td');

                if (obj != null) {
                    checkBox = document.createElement('input');
                    checkBox.type = 'checkbox';

                    td.innerText += obj.lessonElementId;
                    td.appendChild(checkBox);
                }
            }

            td.className = 'last';
            tr.appendChild(td);
        }


    };
}
class Main {
    constructor() {
        this.frame = undefined;
        this.document = undefined;

        this.formTypes = {
            lessonForm : LessonForm,
            referenceForm : undefined,
            reportForm : ReportForm,
            courseForm : CourseForm,
            etestForm : undefined,
            attendForm : undefined,
            forumForm : undefined,
            researchForm : undefined,
            teamactForm : undefined
        };

        this.init = this.init.bind(this);
        this.exit = this.exit.bind(this);
        this.refresh = this.refresh.bind(this);

        this.renewDocument = this.renewDocument.bind(this);
        this.detectPageType = this.detectPageType.bind(this);

        this.init();
    }

    init() {
        console.log('[@Main] Initialize.');
        
        this.frame = document.querySelector('frame[name="main"]');
        if (!this.frame) {
            console.log(document);
            throw `Error: Couldn't grab <frame> from the document.`;
        }
        this.frame.addEventListener('load', this.renewDocument);
        document.title = '!' + document.title;

        this.renewDocument();
    }

    exit() {
        console.log('[@Main] Unload.');

        this.frame.removeEventListener('load', this.renewDocument);
        document.title = document.title.replace(/^!/, '');

        // this.refresh();
    }

    refresh() {
        try {
            this.document.querySelector('form').submit();
        } catch (err) {
            console.log(`[@Main] * Failed to refresh after unloading.\n`, err);

            if (confirm('확인을 누르시면 창이 새로고침 됩니다.'))
                location.reload();
        }
    }

    renewDocument() {
        console.log('[@Main] Renew Page.');

        this.frame =  document.querySelector('frame[name="main"]');
        this.document = this.frame.contentDocument;

        this.detectPageType();
    }

    detectPageType() {
        console.log('[@Main] Detect page types:');
        let formName, form;

        for (formName in this.formTypes) {
            form = this.document[formName];
            if (form) {
                console.log(`[@Main] * found '${formName}'.`);

                try {
                    this.formTypes[formName].fetch_from_main(this.formTypes[formName], form, this);
                } catch (err) {
                    console.log(`[@Main] * '${formName}' page is not supported yet.\n`, err);
                }
            }
        }
    }
}

var main = new Main();