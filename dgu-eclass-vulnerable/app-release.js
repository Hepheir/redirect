'use-strict';class ListWrapper{static selectors={listBox:'div#listBox',listContent:'div#listBox div.listContent',element:'div#listBox div.listContent dl.element'}static getElements(ref_document){cls=ListWrapper;let nodeList,nodeArray,elemArray;nodeList=ref_document.querySelectorAll(cls.selectors.listBox);nodeArray=Array.from(nodeList);elemArray=nodeArray.map(elem=>new ListWrapper.Elements(elem));return elemArray;}}ListWrapper.Elements=class{constructor(element_node){this.node=element_node;this.title=element_node.querySelector('h4.f14').innerText.replace(/[\s][\s]+/g,'');this.buttonBox=element_node.querySelector('ul.btnBox');this.getIdsByFlag=this.getIdsByFlag.bind(this);this.appendButton=this.appendButton.bind(this);}static _getIdsByFlag(node,id_name,id_flag){let reg=new RegExp(`'${id_flag}_[^']+'`,'g');let matched,matched_found;if(!(id_name instanceof Array))id_name=new Array(id_name);matched=node.innerHTML.match(reg);matched_found=(matched !=null);let ret_obj=new Object();try{for(let i=0;i<id_name.length;i++)ret_obj[id_name[i]]=(matched_found)?matched[i].replace(/'/g,''):null;}catch(err){ret_obj=null;console.log(matched,err);}return ret_obj;}getIdsByFlag(id_name,id_flag){let obj=ListWrapper.Elements._getIdsByFlag(this.node,id_name,id_flag);for(let key in obj)this[key]=obj[key];return obj !=null;}appendButton(innerText,attributes){let li=document.createElement('li');let a=document.createElement('a');let iconType=attributes.hasOwnProperty('icon')?attributes.icon:'icon-list-color';delete attributes.icon;a.className='btn small';a.innerHTML=`<i class="${iconType}"></i>${innerText}`;for(let attr in attributes)a.setAttribute(attr,attributes[attr]);li.appendChild(a);this.buttonBox.appendChild(li);}}class Form{static name='?';static fetch(){let err=`[@Form]Error:'Sub_Class_of_Form.fetch()' was not Overriden`;console.log(err);throw err;}static main=undefined;static load(formClass,main){console.log(`[@${formClass.name}]Load.`);if(formClass.name==Form.name){let err=`[@Form]Error:'Sub_Class_of_Form.name' was not Overriden`;console.log(err);throw err;}formClass.main=main;formClass.document=main.document;}static fetch_from_main(formClass,main){formClass.load(formClass,main);formClass.fetch();}}class ReportForm extends Form{static name='ReportForm';static fetch(){let isStudyActivityPage=!this.document.reportForm.hasOwnProperty('reportSubmitDTO.submitStatus');if(isStudyActivityPage){console.log(`[@ReportForm]*Fetch for '학습 활동/과제'`);this.fetch_studyActivity();}}static fetch_studyActivity(){let elements=this.document.querySelectorAll('div#listBox div.listContent dl.element');for(let elem of elements){let buttonBox=elem.querySelector('ul.btnBox');let matched=elem.innerHTML.match(/REPT_[^']+/);if(matched){let reportInfoId=matched[0];buttonBox.innerHTML+=`<li><a class="btn small" onclick="javascript:viewReportList('${reportInfoId}','N');"><i class="icon-list-color"></i>제출정보보기(수강생전원)</a></li>`;}}}}// static name='LessonForm';// LessonForm.viewList.fetch();//}// LessonForm.viewList=class{// let elements,isFound;// console.log('[@LessonForm.viewList]*Found elements are:',elements);// LessonForm.viewList.updateTable(elem);//}// let thead_tr,tbody_trs;// tbody_trs=table.querySelectorAll('tbody tr');// Array.from(tbody_trs).forEach(tr=>{//});// let checkBox,td;// td=document.createElement('th');//}// td=document.createElement('td');// checkBox=document.createElement('input');// td.appendChild(checkBox);//}// tr.appendChild(td);class Main{constructor(){this.frame=undefined;this.document=undefined;this.formTypes={lessonForm:undefined,referenceForm:undefined,reportForm:ReportForm,courseForm:CourseForm,etestForm:undefined,attendForm:undefined,forumForm:undefined,researchForm:undefined,teamactForm:undefined};this.init=this.init.bind(this);this.exit=this.exit.bind(this);this.refresh=this.refresh.bind(this);this.renewDocument=this.renewDocument.bind(this);this.detectPageType=this.detectPageType.bind(this);this.init();}init(){console.log('[@Main]Initialize.');this.frame=document.querySelector('frame[name="main"]');if(!this.frame){console.log(document);throw `Error:Couldn't grab<frame>from the document.`;}this.frame.addEventListener('load',this.renewDocument);document.title='!'+document.title;this.renewDocument();}exit(){console.log('[@Main]Unload.');this.frame.removeEventListener('load',this.renewDocument);document.title=document.title.replace(/^!/,'');}refresh(){try{this.document.querySelector('form').submit();}catch(err){console.log(`[@Main]*Failed to refresh after unloading.\n`,err);if(confirm('확인을 누르시면 창이 새로고침 됩니다.'))location.reload();}}renewDocument(){console.log('[@Main]Renew Page.');this.frame=document.querySelector('frame[name="main"]');this.document=this.frame.contentDocument;this.detectPageType();}detectPageType(){console.log('[@Main]Detect page types:');let formName,form;for(formName in this.formTypes){form=this.document[formName];if(form){console.log(`[@Main]*found '${formName}'.`);try{this.formTypes[formName].fetch_from_main(this.formTypes[formName],this);}catch(err){console.log(`[@Main]*'${formName}' page is not supported yet.\n`,err);}}}}}var main=new Main();