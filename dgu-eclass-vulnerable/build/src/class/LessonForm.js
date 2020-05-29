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
            elements.forEach(elem => {
                if (!elem.getIdsByFlag(['lessonElementId', 'lessonContentsId'], 'LESN')) return;
                
                LessonForm.viewList.updateTable(elem);
            });
            console.log('[@LessonForm.viewList] * Found elements are:', elements);
        }

        static updateTable(elem) {
            let thead_tr, tbody_trs;
            let table = elem.node.querySelector('table');

            thead_tr  = table.querySelector('thead tr');
            tbody_trs = table.querySelectorAll('tbody tr');

            LessonForm.viewList.addTableCell(thead_tr, true);
            for (let tr in tbody_trs)
                LessonForm.viewList.addTableCell(tr);
        }

        static addTableCell(tr, isHead=false) {
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';

            let td;
            if (isHead) {
                td = document.createElement('th');
                td.innerText = '자동수강';
            } else {
                td = document.createElement('td');
            }
            td.className = 'last';

            td.appendChild(checkBox);
            tr.appendChild(td);
        }


    };
}