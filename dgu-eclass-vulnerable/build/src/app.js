class Main {
    constructor() {
        this.frame = undefined;
        this.document = undefined;

        this.formTypes = {
            lessonForm : LessonForm,
            referenceForm : undefined,
            reportForm : ReportForm,
            courseForm : undefined,
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