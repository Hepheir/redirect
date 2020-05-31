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