const {
  getContacts,
  getContactById,
  addContact,
  changeContactById,
  deleteContactById,
} = require("../services/contactService");

const getContactsController = async (req, res) => {
  const contacts = await getContacts();
  res.json({ contacts });
};

const getContactByIdController = async (req, res) => {
  const id = req.params.id;
  const post = await getContactById(id);
  res.json({ post, status: "success find" });
};

const addContactController = async (req, res) => {
  const { topic, text } = req.body;
  await addContact({ topic, text });
  res.json({ status: "success add" });
};

const changeContactController = async (req, res) => {
  const { topic, text } = req.body;
  const id = req.params.id;
  await changeContactById(id, { topic, text });

  res.json({ status: "success change" });
};

const deleteContactController = async (req, res) => {
  const id = req.params.id;
  await deleteContactById(id);
  res.json({ status: "deleted" });
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  changeContactController,
  deleteContactController,
};
