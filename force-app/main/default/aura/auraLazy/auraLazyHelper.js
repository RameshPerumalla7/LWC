({
    getData : function(component){
        var action = component.get("c.getAccountRecords");
        action.setParams({
            "initialRows" : component.get("v.initialRows")
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var toastReference = $A.get("e.force:showToast");
            if(state == "SUCCESS"){
                var accountWrapper = response.getReturnValue();
                if(accountWrapper.success){
                    component.set("v.totalRows",accountWrapper.totalRecords);  
                    
                    var accountList = accountWrapper.accountsList;
                    accountList.forEach(function(account){
                        account.accountName = '/'+account.Id;
                    });
                    component.set("v.accountData",accountList);
                    toastReference.setParams({
                        "type" : "Success",
                        "title" : "Success",
                        "message" : accountWrapper.message,
                        "mode" : "dismissible"
                    });
                    toastReference.fire();
                }
                else{ 
                    toastReference.setParams({
                        "type" : "Error",
                        "title" : "Error",
                        "message" : accountWrapper.message,
                        "mode" : "sticky"
                    }); 
                    toastReference.fire();
                }
            }
            else{ 
                toastReference.setParams({
                    "type" : "Error",
                    "title" : "Error",
                    "message" : 'An error occurred during Initialization '+state,
                    "mode" : "sticky"
                });
                toastReference.fire();
            }
        });
        $A.enqueueAction(action);
    },
    
    loadData : function(component){
        return new Promise($A.getCallback(function(resolve){
            var limit = component.get("v.initialRows");
            var offset = component.get("v.currentCount");
            var totalRows = component.get("v.totalRows");
            if(limit + offset > totalRows){
                limit = totalRows - offset;
            }
            var action = component.get("c.loadAccountRecords");
            action.setParams({
                "rowLimit" :  limit,
                "rowOffset" : offset
            });
            action.setCallback(this,function(response){
                var state = response.getState();
                var newData = response.getReturnValue();
                newData.forEach(function(account){
                    account.accountName = '/'+account.Id;
                });
                resolve(newData);
                var currentCount = component.get("v.currentCount");
                currentCount += component.get("v.initialRows");
                component.set("v.currentCount",currentCount);
            });
            $A.enqueueAction(action);
        }));
    }
})
 
 
