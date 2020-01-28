import { LightningElement, api, wire, track } from 'lwc';

import getFieldsList from '@salesforce/apex/AccountsForWebComponent.getFieldsList';
import getsObjectWithOffset from '@salesforce/apex/AccountsForWebComponent.getsObjectWithOffset';
import getDomainName from '@salesforce/apex/AccountsForWebComponent.getDomainName';

const my_columns = [];
const my_columns1 = [];
export default class DynaTable extends LightningElement {
    @track myurl;
    @api recordId;
    @api FlowName;
    @track sortBy;
    @track sortDirection;
    @track currenObjectName;
    @track currenRecordId;

    @track columns;
    @track columns1;
    @track ComboBoxOptions = [10,50,100];
    @api showDetails = false;
    @api SortOrder;
    @api sObject = this.sObject;
    @api Fields = this.Fields;
    @api LIMIT = this.LIMIT;
    @track act_data;
    @api OrderBy;

    @track paginationRange = [];
    @track totalRecords;

    @track value = '10';
    @track offset = '0';
    @track PageNumber = '1';
    @track isLoaded = false;
    @track StartingRecord = '1';
    @track EndingRecord = '10';

    @track ready = false;

    @track openmodel = false;
    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 

    get options() {
        return [
            { label: '10', value: '10' },
            { label: '50', value: '50' },
            { label: '100', value: '100' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.offset = 0;
        this.StartingRecord = '1';
        this.PageNumber = 1;
        this.EndingRecord = this.value;
    }

    handleChange1(event) {
        this.sortBy = event.detail.value;
    }

    handleNext(event) {

        this.offset = parseInt(this.offset) + parseInt(this.value);
        this.PageNumber = parseInt(this.PageNumber) + 1;
        this.StartingRecord = parseInt(this.StartingRecord) + parseInt(this.value);
        this.EndingRecord = parseInt(this.EndingRecord) + parseInt(this.value);
        this.isLoaded = false;
        
}

    handlePrevious(event){
        if(parseInt(this.offset) !== 0){
        this.offset = parseInt(this.offset) - parseInt(this.value);
        this.StartingRecord = parseInt(this.StartingRecord) - parseInt(this.value);
        this.EndingRecord = parseInt(this.EndingRecord) - parseInt(this.value);
        this.isLoaded = false;
        }
        this.PageNumber = parseInt(this.PageNumber) - 1;
        
        if(parseInt(this.PageNumber) === 0){
            this.offset = 0;
            this.PageNumber = 1;
        }
    }


    getSelectedName() {
        console.log('Row Selected');
    }

    @wire (getsObjectWithOffset, {sobj : '$sObject', Fields : '$Fields', OrdBy : '$OrderBy', LIM: '$value', offset : '$offset'}) sObjectWithOffset({data,error}){
        if(data){
            console.log(data);
            
        }
        if(error){

        }
    }
    @wire (getDomainName) dmnName;

    @wire (getFieldsList, {sobj : '$sObject', Fields : '$Fields', OrdBy : '$OrderBy', LIM : '$value', offset : '$offset'}) FieldsList({data,error}){
        
        if(data){

            var Fields = this.Fields;
            var arr = Fields.split(",");
            var FieldLabels = data.FieldLabels;
            var FieldTypes = data.FieldTypes;

            console.log('FieldLabels------->>>>>' +FieldLabels);

            this.totalRecords = data.RecordCount;
            this.TotalPageNumbers = Math.ceil(parseInt(this.totalRecords)/parseInt(this.value));

            this.act_data = data.FieldValueSobjectList;  
            this.isLoaded = true;
            

            for(let i=0;i<FieldLabels.length;i++){
                if(this.SortOrder===true){
                console.log('SortOrder ---->>>>' +this.SortOrder);
                let lab = {label : FieldLabels[i], fieldName : arr[i], type : FieldTypes[i], sortable: true};
                    my_columns.push(lab);
                }

                else if(this.SortOrder===false){
                    console.log('SortOrder ---->>>>' +this.SortOrder);
                let lab = {label : FieldLabels[i], fieldName : arr[i], type : FieldTypes[i], sortable: false};
                    my_columns.push(lab);
                }
            }
            let labFlow = {type: 'button', typeAttributes: {
                label: 'view Details' ,variant:'brand'
            }};
            my_columns.push(labFlow);
            
            this.columns = my_columns;

            for(let i=0;i<FieldLabels.length;i++){
                let lab = {label : FieldLabels[i], value: arr[i]};
                
                    my_columns1.push(lab);
            }

            this.columns1 = my_columns1;

            
      

        }
        if(error){
            console.log(error);
        }

    }

    handleSortdata(event){

        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(event.detail.fieldName, event.detail.sortDirection);

    }

    sortData(fieldname, direction) {
    
        let parseData = JSON.parse(JSON.stringify(this.act_data));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            return isReverse * ((x > y) - (y > x));
        });

        this.act_data = parseData;

    }

    handleRowActions(event) {
        console.log('called...');
      
      let actionName = event.detail.action.name;

      console.log('actionName ====> ' + actionName);

      let row = event.detail.row;
      

      let currenRecordId= row.Id;
      let my_domain = this.dmnName.data;

      //let Flow_Name=this.FlowName;
      let flow_picklist = this.FlowName;
      this.currenRecordId = this.recordId;
        this.currenObjectName = this.objectApiName;

      console.log('FlowName------' + this.FlowName);

       this.myurl = my_domain + '/flow/' + flow_picklist + '?recordId=' + currenRecordId;
      //console.log('url ====> '+JSON.stringify(this.myurl));
      this.openmodal();

      
      console.log('opening..');
      //window.open(myurl);
      console.log('opened..');


  }
}