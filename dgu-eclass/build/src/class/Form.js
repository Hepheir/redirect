class Form {
    // MUST OVERRIDE
    static name = '?';
    static fetch() {
        let err = `[@Form] Error: 'Sub_Class_of_Form.fetch()' was not Overriden`;
        
        console.log(err);
        throw err;
    }

    // Static signatures
    static main = undefined;

    static load(formClass, main) {
        console.log(`[@${formClass.name}] Load.`);

        if (formClass.name == Form.name) {
            let err = `[@Form] Error: 'Sub_Class_of_Form.name' was not Overriden`;
        
            console.log(err);
            throw err;
        }

        formClass.main = main;
        formClass.document = main.document;
    }

    static fetch_from_main(formClass, main) {
        formClass.load(formClass, main);
        formClass.fetch();
    }
}