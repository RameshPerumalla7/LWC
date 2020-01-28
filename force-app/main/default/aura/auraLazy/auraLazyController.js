({
    onInit : function(component,event,helper){
        component.set("v.accountColums",
                      [
                          {
                              label : 'Name',
                              fieldName : 'accountName',
                              type : 'url',
                              typeAttributes:{label:{fieldName:'Name'},target:'_blank'}
                          },
                          {
                              label : 'Account Source',
                              fieldName : 'AccountSource',
                              type : 'text',
                          },
                          {
                              label : 'Rating',
                              fieldName : 'Rating',
                              type : 'text',
                          }
                      ]);
        helper.getData(component);
    },
    
    handleLoadMore : function(component,event,helper){
        if(!(component.get("v.currentCount") >= component.get("v.totalRows"))){
            event.getSource().set("v.isLoading", true); 
            helper.loadData(component).then(function(data){ 
                var currentData = component.get("v.accountData");
                var newData = currentData.concat(data);
                component.set("v.accountData", newData);
                event.getSource().set("v.isLoading", false); 
            });
        }
        else{
            component.set("v.enableInfiniteLoading",false);
            event.getSource().set("v.isLoading", false);
            var toastReference = $A.get("e.force:showToast");
            toastReference.setParams({
                "type":"Success",
                "title":"Success",
                "message":"All Account records are loaded",
                "mode":"dismissible"
            });
            toastReference.fire();
        }
    },
    
})