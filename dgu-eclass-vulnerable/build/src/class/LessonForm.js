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
                isFound = elem.getIdsByFlag(['lessonElementId', 'lessonContentsId'], 'LESN');

                if (isFound) elem.appendButton(
                    '제출정보보기(수강생전원)', {
                        onclick: `javascript:viewReportList('${elem.reportInfoId}', 'N');`
                    }
                );
            });
            console.log('[@LessonForm.viewList] * Found elements are:', elements);
        }

        static updateTable(elements) {
            elements.forEach(elem => {
                if (elem.reportInfoId === null)
                    return;

                elem.appendButton(
                    '제출정보보기(수강생전원)', {
                        onclick: `javascript:viewReportList('${elem.reportInfoId}', 'N');`
                    }
                );
            });
        }
    };
}