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