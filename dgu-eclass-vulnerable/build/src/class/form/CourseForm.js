class CourseForm extends Form {
    static name = 'CourseForm';

    static fetch() {
        // document 바인딩
        this.WeekLesson.document = this.document;
        this.WeekLesson.AutoLearn.document = this.document;
        this.WeekLesson.AsMobile.document  = this.document;
        this.WeekLesson.Download.document  = this.document;

        this.WeekLesson.fetch();
    }

    static WeekLesson = class {
        static fetch() {
            let doms = {
                week_title: this.document.querySelectorAll('div#listBox table.boardListBasic2 thead tr              th:not(.first)'),
                week_inner: this.document.querySelectorAll('div#listBox table.boardListBasic2 tbody tr:first-child  td:not(.first)')
            };

            for (let i = 0; i < doms.week_title.length; i++) {
                let videos = Array.from(doms.week_inner[i].querySelectorAll('div.video.on'));

                // 화상강의 수업 제외
                for (let v_idx = videos.length; videos && v_idx > 0; v_idx--) {
                    try {
                        let isVirtual = videos[v_idx].getAttribute('style').includes('#d5ebbb;');
                        if (isVirtual) delete videos[v_idx];
                    } catch (err) { }
                }

                // 녹강이 있다면,
                if (videos.length) this.fetch_week_addButtons(doms.week_title[i], doms.week_inner[i]);
            }
        }

        static fetch_week_addButtons(title, inner) {
            let videos = Array.from(inner.querySelectorAll('div.video.on'));
            // 화상강의 수업 제외
            for (let v_idx = videos.length; videos && v_idx > 0; v_idx--) {
                try {
                    let isVirtual = videos[v_idx].getAttribute('style').includes('#d5ebbb;');
                    if (isVirtual) delete videos[v_idx];
                } catch (err) { }
            }
            // 녹강이 없다면 PASS
            if (videos.length == 0) return;

            // 각 주차 마다 작업
            title.innerHTML += '<br/>';
            // ----------------
            var btn_autoLearn = this._util_DOM_fromString(`
                <a  class="btn btn-red fcWhite"
                    style="margin-top:8px;"
                    title="자동수강">

                        자동수강
                </a>`);
            btn_autoLearn.addEventListener('click', (new this.AutoLearn(videos)).onClick);
            title.appendChild(btn_autoLearn);
            // 각 차시마다 작업
            for (let video of videos) {
                let btnGroup = this._util_DOM_fromString(`<li class="btn-group mt10 fr" style="width:inherit;"></li>`);
                // 모바일로 보기 버튼
                var btn_asMobile = this._util_DOM_fromString(`
                    <a  class="btn btn-green fcWhite"
                        style="line-height:24px;"
                        title="모바일">

                            모바일버전
                    </a>`);
                btn_asMobile.addEventListener('click', (new this.AsMobile(video)).onClick);
                btnGroup.appendChild(btn_asMobile);
                // 다운로드 버튼
                var btn_download = this._util_DOM_fromString(`
                    <a  class="btn btn-red fcWhite"
                        style="line-height:24px;"
                        title="다운로드">

                            다운로드 예약
                    </a>`);
                btn_download.addEventListener('click', (new this.Download(video)).onClick);
                btnGroup.appendChild(btn_download);
                // ----------------
                let buttonContainer = video.querySelector('ul.mt5');
                buttonContainer.appendChild(document.createElement('li'));
                buttonContainer.appendChild(btnGroup);
            }
        }

        static _util_DOM_fromString(html) {
            let template = document.createElement('template');
            template.innerHTML = html.trim();
            return template.content.firstChild;
        }

        static AutoLearn = class {
            constructor(videos) {
                return this.onClick;
            }

            onClick() {
                alert('Not supported yet');
                console.log('autolearn');
            }
        };

        static AsMobile = class {
            constructor(video) {
                this.video = video;

                this.document = this.__proto__.constructor.document;
                this.window = this.document.defaultView.window;
                this.f = this.document.courseForm;

                this.hiddenFrame = this.createHiddenFrame();
                this.lessonElementId  = undefined;
                this.lessonContentsId = undefined;

                this.getLessonElementId = this.getLessonElementId.bind(this);
                this.onClick = this.onClick.bind(this);
                this.onAuthSuccess = this.onAuthSuccess.bind(this);

                this.onLoad = this.onLoad.bind(this);

                return this;
            }

            createHiddenFrame() {
                let iframe;
                iframe = document.createElement('iframe');
                iframe.name = 'hiddenFrame_download';
                iframe.style.position = 'absolute';
                iframe.style.opacity = '0';
                iframe.style.pointerEvents = 'none';
                return iframe;
            }

            onClick(evt) {
                this.getLessonElementId();

                this.window.lessonObject.lessonElementId  = this.lessonElementId;
                this.window.lessonObject.lessonContentsId = this.lessonContentsId;
                this.window.$.ajax({
                    type: "POST",
                    url: "/Otp.do?cmd=courseAuthCheck",
                    data: {
                        "otpDTO.courseId": this.f["courseDTO.courseId"].value
                    },
                    dataType: "json",
                    success: this.onAuthSuccess
                });
            }

            getLessonElementId() {
                let function_string, arguments_array;
                function_string = this.video.innerHTML.match(/viewStudyContents\([^)]+\)/)[0];
                arguments_array = function_string.replace(/(viewStudyContents\(|\))/, '').split(',');

                this.lessonElementId  = arguments_array[0].replace(/'/g, "");
                this.lessonContentsId = arguments_array[1].replace(/'/g, "");
            }

            onAuthSuccess(data) {
                let url, mobile_url;

                if (data.retVal != "Y") {
                    userOTPcheck();
                    return;
                }
                
                url = `/Lesson.do?cmd=viewStudyContentsForm&studyRecordDTO.lessonElementId=${
                        this.lessonElementId
                    }&studyRecordDTO.lessonContentsId=${
                        this.lessonContentsId
                    }&courseDTO.courseId=${
                        this.f["courseDTO.courseId"].value
                    }&menuId=menu_00099&pus=N&pcr=N&pre=N`;

                mobile_url = `/MLesson.do?cmd=viewStudyContentsForm&studyRecordDTO.lessonElementId=${
                        this.lessonElementId
                    }&studyRecordDTO.lessonContentsId=${
                        this.lessonContentsId
                    }&courseDTO.courseId=${
                        this.f["courseDTO.courseId"].value
                    }`;

                this.window.studyWindow = window.open(mobile_url, this.hiddenFrame.name);
                this.window.studyWindow.addEventListener('load', this.onLoad);
            }

            onLoad(evt) {
                // Do nothing
                console.log(` * As mobile`);
            }
        };

        static Download = class {
            constructor(video) {
                this.video = video;
                this.asMobile = new CourseForm.WeekLesson.AsMobile(this.video);

                this.onClick = this.onClick.bind(this);
                return this;
            }

            onClick() {
                this.button = this.video.querySelector('a[title="다운로드"]');
                this.button.innerText = '다운로드 준비중...';
                this.asMobile.onClick();

                new Promise((resolve, reject) => {
                    let intervalId;
                    intervalId = setInterval(() => {
                        if (this.asMobile.window.hasOwnProperty('studyWindow')) {
                            if (this.asMobile.window.studyWindow.hasOwnProperty('StudyRecordDTO')) {
                                if (this.asMobile.window.studyWindow.StudyRecordDTO.hasOwnProperty('lessonElementDTO')) {
                                    clearInterval(intervalId);
                                    resolve(this);
                                }
                            }
                        }
                    }, 200);
                }).then(that => {
                    let file_url;

                    file_url = `http://cdn.dongguk.ac.kr${that.asMobile.window.studyWindow.StudyRecordDTO.lessonElementDTO.mobileFileUrl}`;
    
                    that.button.setAttribute('href', file_url);
                    that.button.setAttribute('target', '_blank');
                    that.button.removeEventListener('click', that.onClick);
                    that.asMobile.window.studyWindow.removeEventListener('load', that.onLoad);
                    that.asMobile.window.studyWindow.close();

                    that.button.innerText = '다운로드 준비완료';
                });
            }
        };


        
        /**
         * 학습하기

        static lessonObject = new Object();
        static viewStudyContents(lessonElementId, lessonContentsId, windowWidth, windowHeight, learningControl, lessonCnt) {
            var f = this.document.courseForm;

            if (learningControl == "date") {
                if (lessonCnt == -1) {
                    alert("학습시간이 아직 시작되지않았습니다.");
                    return;
                }
            }
            lessonObject.lessonElementId = lessonElementId;
            lessonObject.lessonContentsId = lessonContentsId;
            lessonObject.windowWidth = windowWidth;
            lessonObject.windowHeight = windowHeight;


            $.ajax({
                type: "POST",
                url: "/Otp.do?cmd=courseAuthCheck",
                data: {
                    "otpDTO.courseId": f["courseDTO.courseId"].value
                },
                dataType: "json",
                success: function (data) {
                    if (data.retVal == "Y") {
                        certificationCompleted();
                    } else {
                        userOTPcheck();
                    }
                }
            });
        }

        //학습창
        static certificationCompleted() {

            var f = document.courseForm;

            var lessonElementId = lessonObject.lessonElementId;
            var lessonContentsId = lessonObject.lessonContentsId;
            var windowWidth = lessonObject.windowWidth;
            var windowHeight = lessonObject.windowHeight;

            var url = "/Lesson.do?cmd=viewStudyContentsForm&studyRecordDTO.lessonElementId=" + lessonElementId + "&studyRecordDTO.lessonContentsId=" + lessonContentsId + "&courseDTO.courseId=" + f["courseDTO.courseId"].value;
            url += "&menuId=menu_00099"
            url += "&pus=N&pcr=N&pre=N";

            let url = `/Lesson.do?cmd=viewStudyContentsForm&studyRecordDTO.lessonElementId=${lessonElementId}&studyRecordDTO.lessonContentsId=${lessonContentsId}&courseDTO.courseId=${f["courseDTO.courseId"].value}&menuId=menu_00099&pus=N&pcr=N&pre=N`
            let mobile_url = `/MLesson.do?cmd=viewStudyContentsForm&studyRecordDTO.lessonElementId=${lessonElementId}&studyRecordDTO.lessonContentsId=${lessonContentsId}&courseDTO.courseId=${f["courseDTO.courseId"].value}`

            // 창크기 값이 없는 경우

            winWidth = 1024;
            winHeight = 768+45;

            if (!studyWindow || studyWindow.closed) {
            } else {
                alert("이미 학습중인 학습창이 있습니다.\n학습창을 먼저 닫으세요.");
                studyWindow.focus();
                return;
            }

            if (studyWindow != null && studyWindow.open == true) {
                //	alert("이미 학습중인 학습창이 있습니다.\n학습창을 먼저 닫으세요.");
                //	return false;
            }
            var top = ((screen.availHeight - winHeight) / 2 + 40);
            var left = ((screen.availWidth - winWidth) / 2);


        }

        */
    };
};