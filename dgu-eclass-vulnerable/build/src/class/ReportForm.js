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