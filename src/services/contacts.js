import ContactCollection from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

//  вся логіка запитів 
export const getContacts = async ({ page = 1, perPage = 3, sortBy = "_id", sortOrder = "asc", filter  }) => {  //  додатково дублюємо дефолтні налаштування
  const query = ContactCollection.find();
  
  const skip = (page - 1) * perPage;

  if (filter.userId) {
    query.where('userId').equals(filter.userId); //  фільтрує лише ті контакти, які додав певний user
  }

  const data = await ContactCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder }); // додаємо до пошуку параметри skip - номер сторінки, perPage - кількість об'єктів
  
  // const totalItems = (await ContactCollection.find()).length;
  const totalItems = await ContactCollection
    .find()
    .merge(query)
    .countDocuments();  //  повертає відразу кількість, без виклику об'єкта та методу length
  // console.log(totalItems);  // перевірка
  const paginationData = calculatePaginationData({ totalItems, page, perPage });


  return { data, totalItems, ...paginationData };
};


export const getContactById = (id) => ContactCollection.findById(id);
export const postContacts = (body) => ContactCollection.create(body);
export const patchContact = (id, body) =>
  ContactCollection.findOneAndUpdate({ _id: id }, body, {
    new: true,
  }); // new: true поренути оновлений об'єкт
export const deleteContactById = (id) =>
  ContactCollection.findOneAndDelete({ _id: id });  
