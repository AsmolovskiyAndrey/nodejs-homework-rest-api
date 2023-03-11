const {
  getContacts,
  getContactById,
  addContact,
  changeContactById,
  deleteContactById,
  updateStatusContact,
} = require("../services/contactService");

const getContactsController = async (req, res) => {
  const contacts = await getContacts();
  res.json({ contacts });
};

const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const contactById = await getContactById(id);
  res.json({ contactById });
};

const addContactController = async (req, res) => {
  const { name, email, phone } = req.body;
  await addContact({ name, email, phone });
  res.json({ status: "contact added" });
};

const changeContactController = async (req, res) => {
  const { name, email, phone } = req.body;
  const id = req.params.contactId;
  await changeContactById(id, { name, email, phone });

  res.json({ status: "contact changed" });
};

const deleteContactController = async (req, res) => {
  const id = req.params.contactId;
  await deleteContactById(id);
  res.json({ status: "contact deleted" });
};

const updateStatusContactController = async (req, res) => {
  const { favorite } = req.body;
  const id = req.params.contactId;
  await updateStatusContact(id, { favorite });
  res.json({ status: "contact changed type favorite" });
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  changeContactController,
  deleteContactController,
  updateStatusContactController,
};
