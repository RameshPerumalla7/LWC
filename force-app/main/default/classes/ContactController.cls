public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        List<Contact> ContactList = [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WHERE Name != null
            ];
        system.debug('ContactList------->>>>>>>' + ContactList);
            return ContactList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WHERE Name LIKE :key AND Name != null
            LIMIT 10
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Contact getSingleContact() {
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            LIMIT 1
        ];
    }

  @AuraEnabled (cacheable=true)
  public static List<Contact> wireContactsByAccountId(String accountId) {
    return ContactController.getContactsByAccountId(accountId);
  }

  @AuraEnabled
  public static List<Contact> getContactsByAccountId(String accountId) {
    try {
      return [
        SELECT
          Name,
          Email,
          Phone,
          Id
        FROM
        Contact  
        WHERE
        Id =: accountId      
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getAccountOptionsCache() {
    Map<String, Object> optionsCache = new Map<String, Object>();
    List<Contact> aggList = new List<Contact>([
        SELECT Id, Name, Title, Phone, Email
        FROM Contact
        WHERE Name != null
        // LIMIT 10
    ]);
    List<Map<String, Object>> items = new List<Map<String, Object>>();
    for (Contact ar : aggList) {
      Map<String, Object> option = new Map<String, Object>{
        'value' => (String)ar.get('Id'),
        'label' => (String)ar.get('Name')
      };
      items.add(option);
    }
    optionsCache.put('items', items);
    return optionsCache;
  }
}



  