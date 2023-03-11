const { Contacts } = require("../db/contactModel");
const { ValidationError } = require("../helpers/errors");

const getContacts = async () => {
  const contacts = await Contacts.find({})
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contacts.findById(id);

  if (!contact) {
    throw new ValidationError(`No contact with id ${id}`);
  }
  return contact;
};

const addContact = async ({ name, email, phone }) => {
  const addContact = new Contacts({ name, email, phone });
  await addContact.save();
};

const updateContactById = async (id, { name, email, phone }) => {
  await Contacts.findByIdAndUpdate(id, { $set: { name, email, phone } });
};

const deleteContactById = async (id) => {
  const contact = await Contacts.findById(id);
  if (!contact) {
    throw new ValidationError(`Delete imposibble - No contact with id ${id}`);
  }

  await Contacts.findByIdAndRemove(id);
};

const updateStatusContact = async (id, { favorite }) => {
  const contact = await Contacts.findById(id);
  if (!contact) {
    throw new ValidationError(
      `Update Status imposibble - No contact with id ${id}`
    );
  }

  await Contacts.findByIdAndUpdate(id, { $set: { favorite } });
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
  updateStatusContact,
};
