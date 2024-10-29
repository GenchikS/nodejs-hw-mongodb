import ContactCollection from "../db/models/Contact.js";

//  вся логіка запитів 
export const getContacts = () => ContactCollection.find();
export const getContactById = id => ContactCollection.findById(id);