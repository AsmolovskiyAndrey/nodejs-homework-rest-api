const {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
  updateStatusContact,
} = require("../services/contactService");

const getContactsController = async (req, res) => {
  const owner = req.user._id;
  const { page = 1, limit = 20, favorite } = req.query;
  // limit = +limit > 100 ? 100 : +limit; //* ограничения не больше 10ти (если пришло больше) и к числу
  const skip = (+page - 1) * +limit;

  const contacts = await getContacts(owner, { skip, limit }, favorite);
  res.json({ page, limit, favorite, contacts });
};

const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const owner = req.user._id;
  const contactById = await getContactById(id, owner);
  res.json({ contactById });
};

const addContactController = async (req, res) => {
  const { name, email, phone } = req.body;
  const owner = req.user._id;
  await addContact({ name, email, phone }, owner);
  res.json({ status: "contact added" });
};

const updateContactController = async (req, res) => {
  const { name, email, phone } = req.body;
  const id = req.params.contactId;
  const owner = req.user._id;
  await updateContactById(id, { name, email, phone }, owner);

  res.json({ status: "contact changed" });
};

const deleteContactController = async (req, res) => {
  const id = req.params.contactId;
  const owner = req.user._id;
  await deleteContactById(id, owner);
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
  updateContactController,
  deleteContactController,
  updateStatusContactController,
};
