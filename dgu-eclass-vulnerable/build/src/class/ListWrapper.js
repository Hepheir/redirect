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