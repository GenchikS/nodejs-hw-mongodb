import ContactCollection from "../db/models/Contact.js";

//  вся логіка запитів 
export const getContacts = () => ContactCollection.find();
export const getContactById = (contactId) => ContactCollection.findById(contactId);
export const postContacts = (body) => ContactCollection.create(body);
export const patchContact = (contactId, body) =>
  ContactCollection.findOneAndUpdate({ _id: contactId }, body, {
    new: true,
  }); // new: true поренути оновлений об'єкт
export const deleteContactById = (contactId) =>
  ContactCollection.findOneAndDelete({ _id: contactId });  
