import ContactCollection from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

//  вся логіка запитів 
export const getContacts = async ({
  page = 1,
  perPage = 3,
  sortBy = '_id',
  sortOrder = 'asc',
  userId
}) => {
  //  додатково дублюємо дефолтні налаштування
  const query = ContactCollection.find();

  const skip = (page - 1) * perPage;

  
  const data = await ContactCollection.find()
    .where('userId').equals(userId) //  фільтрує лише ті контакти, які додав певний user
    .skip(skip) // додаємо до пошуку параметри skip - номер сторінки, perPage - кількість об'єктів
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // const totalItems = (await ContactCollection.find()).length;
  const totalItems = await ContactCollection.find()
    .where('userId').equals(userId)  //  добавляє довжину масиву лише з певним userId
    .merge(query)
    .countDocuments(); //  повертає відразу кількість, без виклику об'єкта та методу length
  // console.log(totalItems);  // перевірка
  const paginationData = calculatePaginationData({
    totalItems,
    page,
    perPage,
  });
  return { data, ...paginationData };
  // }
};


export const getContactById = async (id, userId) => {
  // const data = await ContactCollection.findById(id).where('userId').equals(userId); //  фільтрує лише ті контакти, які додав певний user
  
  //  спрощений варіант
    const data = await ContactCollection.find({ userId: userId }).findOne({ _id: id }); 
  // console.log(`data`, data);
  if (!data) {
    const data = await ContactCollection.find({ userId: id });
    return data;
  }
  return data;
};

export const postContacts = (body) => ContactCollection.create(body);


export const patchContact = async (id, userId, body) => {
  // const data = await ContactCollection.findById(id).where('userId').equals(userId);
  //  спрощений варіант
  const data = await ContactCollection.find({userId: userId,}).findOneAndUpdate({ _id: id }, body, { new: true }); // new: true поренути оновлений об'єкт
return data;
}; 


export const deleteContactById = async(id, userId) =>
{
  // return ContactCollection.findById(id).where('userId').equals(userId);

  return ContactCollection.find({ userId: userId }).findOneAndDelete({_id: id,});
}
