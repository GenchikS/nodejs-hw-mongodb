import ContactCollection from "../db/models/Contact.js";

//  вся логіка запитів 
export const getContacts = () => ContactCollection.find();
export const getContactById = id => ContactCollection.findById(id);
export const postContacts = (body) => ContactCollection.create(body);
export const patchContact = (id, body) => ContactCollection.findOneAndUpdate({ _id: id }, body, { new: true });