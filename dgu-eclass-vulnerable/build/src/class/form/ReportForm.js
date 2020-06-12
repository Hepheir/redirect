class ReportForm extends Form {
    static name = 'ReportForm';
    
    static fetch() {
        let isStudyActivityPage = !this.document.reportForm.hasOwnProperty('reportSubmitDTO.submitStatus');

        if (isStudyActivityPage) {
            console.log(`[@ReportForm] * Fetch for '학습 활동/과제'`);
            this.fetch_studyActivity();
        }
    }

    // 페이지: 학습 활동 / 과제 (목록)
    static fetch_studyActivity() {
        let elements = this.document.querySelectorAll('div#listBox div.listContent dl.element');

        for (let elem of elements) {
            let buttonBox = elem.querySelector('ul.btnBox');
            let matched = elem.innerHTML.match(/REPT_[^']+/);

            if (matched) {
                let reportInfoId = matched[0];

                buttonBox.innerHTML += 
                    `<li>
                        <a class="btn small" onclick="javascript:viewReportList('${reportInfoId}', 'N');">
                            <i class="icon-list-color"></i>
                            제출정보보기(수강생전원)
                        </a>
                    </li>`;
            }
        }
    }
}