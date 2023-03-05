const fs = require("fs").promises;
const path = require("path");
const uniqid = require("uniqid");

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async (req, res, next) => {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));
    res.status(200).json({ contacts });
  } catch (err) {
    const error = new Error("List no finded...");
    error.status = 404;
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const userId = req.params.contactId;
  const data = JSON.parse(await fs.readFile(contactsPath));

  const [postById] = data.filter((item) => item.id === userId);

  if (!postById) {
    const error = new Error("Id not found");
    error.status = 404;
    return next(error);
  }
  res.json({ postById });
};

const addContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = {
    id: uniqid(),
    name,
    email,
    phone,
  };
  const data = JSON.parse(await fs.readFile(contactsPath));
  const newData = [...data, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(newData));
  res.status(201).json({ newContact });
};

const removeContact = async (req, res, next) => {
  const userId = req.params.contactId;
  const data = JSON.parse(await fs.readFile(contactsPath));
  const isIdOk = data.find((item) => item.id === userId);
  if (isIdOk) {
    const newData = data.filter((item) => item.id !== userId);
    await fs.writeFile(contactsPath, JSON.stringify(newData));
    res.status(200).json({ message: "contact deleted" });
    return;
  }
  const error = new Error("Contact not finded...");
  error.status = 404;
  next(error);
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
