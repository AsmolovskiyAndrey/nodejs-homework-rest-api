/* eslint-disable no-undef */
const { Contacts } = require("../db/contactModel");
const { WrongParametrError } = require("../helpers/errors");

const getContacts = async () => {
  const contacts = await Contacts.find({});
  return contacts;
};

const getContactById = async (id) => {
  const contact = await Contacts.findById(id);

  if (!contact) {
    throw new WrongParametrError(`No contact with id ${id}`);
  }
  return contact;
};

const addContact = async ({ topic, text }) => {
  const addContact = new Contacts({ topic, text });
  await addContact.save();
};

const changeContactById = async (id, { topic, text }) => {
  await Contacts.findByIdAndUpdate(id, { $set: { topic, text } });
};

const deleteContactById = async (id) => {
  const contact = await Contacts.findById(id);
  if (!contact) {
    throw new WrongParametrError(
      `Delete imposibble - No contact with id ${id}`
    );
  }

  await Contacts.findByIdAndRemove(id);
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  changeContactById,
  deleteContactById,
};
