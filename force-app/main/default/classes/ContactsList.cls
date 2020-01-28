public with sharing class ContactsList {
    @AuraEnabled (Cacheable=true)
    public static List<Contact> fetchContactLocal(){

        List<contact> contactList = [SELECT Id, FirstName, LastName FROM CONTACT Order By FirstName ASC];

        return contactList;
    }
    @AuraEnabled (Cacheable=true)
    public static List<Contact> fetchContact(String field, String sortOrder){
        return Database.query('SELECT Id, FirstName, LastName,Email,Phone FROM Contact ORDER BY '+field+' '+sortOrder);
    }

    @AuraEnabled(Cacheable=true)
    public static String getDomainName(){
        String URL = URL.getSalesforceBaseUrl().toExternalForm();
        return URL;
    }
}