import { LightningElement,track,wire,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import fetchContact from '@salesforce/apex/ContactsList.fetchContact';
import getDomainName from '@salesforce/apex/ContactsList.getDomainName';


//import getLink from '@salesforce/apex/GenerateFlowLink.getLink';

const actions = [
  { label: 'Open Flow', name: 'flow_details'}
  // , 
  // { label: 'Edit', name: 'edit'}, 
  // { label: 'Delete', name: 'delete'}
];

const dataTablecolumns = [{
    label: 'First Name', 
    fieldName: 'FirstName',
    sortable : true, 
    type: 'text'
  },
  {
    label : 'Last Name',
    fieldName : 'LastName',
    type : 'text',
    sortable : true
  },
  {
    label: 'Email',
    fieldName: 'Email',
    type: 'Email',
    sortable: true
  },
  {
    label: 'Phone',
    fieldName: 'Phone',
    type: 'phone',
    sortable: true
  },
  {
    type: 'button',
    typeAttributes: {
        rowActions: actions,
        menuAlignment: 'right',
        label: 'View Details',
        title: 'View Details',
        name: 'viewDetails',
        value: 'viewDetails',
        variant: 'brand',
        class: 'scaled-down'
    }
  }
]

export default class LwcMyTestLazy extends NavigationMixin (LightningElement) {
    @track myurl;
    @api recordId;
    @api FlowNamePicklist;
    @track results=[];
    @track columns = dataTablecolumns;
    @track sortBy='FirstName';
    @track sortDirection='asc';
    @api objectApiName;
    @track currenObjectName;
    @track currenRecordId;

  
    @track openmodel = false;
    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 

    @wire(fetchContact,{field : '$sortBy',sortOrder : '$sortDirection'}) contactList({error, data}) {
      if(data)
        this.results=Object.assign([], data);
      if(error)
        console.log(error);
    }

    @wire (getDomainName) dmnName;

    
    updateColumnSorting(event){
      let fieldName = event.detail.fieldName;
      let sortDirection = event.detail.sortDirection;

      this.sortBy = fieldName;
      this.sortDirection = sortDirection;
    }

    handleRowActions(event){
      console.log('called...');
      //let actionName = event.getParam('action').name;
      /*if ( actionName === 'viewDetails') {
        alert('i');
      } */
      let actionName = event.detail.action.name;

      console.log('actionName ====> ' + actionName);

      let row = event.detail.row;
      

      let currenRecordId= row.Id;
      let my_domain = this.dmnName.data;

      //let Flow_Name=this.FlowName;
      let flow_picklist = this.FlowNamePicklist;
      this.currenRecordId = this.recordId;
        this.currenObjectName = this.objectApiName;

      console.log('FlowName------' + this.FlowName);

       this.myurl = my_domain + '/flow/' + flow_picklist + '?recordId=' + currenRecordId;
      //console.log('url ====> '+JSON.stringify(this.myurl));
      this.openmodal();

      //let myurl = 'https://rameshpdextara-dev-ed--c.visualforce.com/flow/ContactDetails?FirstName=' + row.FirstName + '&LastName=' + row.LastName + '&Email=' + row.Email + '&Phone=' + row.Phone;

      //let myurl = my_domain + '/flow/ContactDetails?FirstName=' + row.FirstName + '&LastName=' + row.LastName + '&Email=' + row.Email + '&Phone=' + row.Phone;
      // if(actionName === 'viewDetails')
      // {
      //     console.log('my url is -->'+myurl);
      //     this[NavigationMixin.Navigate]({
      //     attributes: {
      //       url: myurl     
      //     }
      //   });
      // }
      console.log('opening..');
      //window.open(myurl);
      console.log('opened..');


  }
}