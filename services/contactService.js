const { Contacts } = require("../db/contactModel");
const { AppError } = require("../helpers/errors");

const getContacts = async (owner, { skip, limit }, favorite) => {
  try {
    if (favorite) {
      const contacts = await Contacts.find({ favorite: favorite, owner })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v");
      return contacts;
    } else {
      const contacts = await Contacts.find({ owner })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v");
      return contacts;
    }
  } catch (error) {
    throw new AppError(404, "This user has no saved contacts yet...");
  }
};

const getContactById = async (id, owner) => {
  const contact = await Contacts.findOne({ _id: id, owner });

  if (!contact) {
    throw new AppError(404, `User with id ${id} not found`);
  }
  return contact;
};

const addContact = async ({ name, email, phone }, owner) => {
  const addContact = new Contacts({ name, email, phone, owner });
  await addContact.save();
};

const updateContactById = async (id, { name, email, phone }, owner) => {
  const contact = await Contacts.findById(id);

  if (!contact) {
    throw new AppError(404, `Update imposibble - No contact with id ${id}`);
  }

  await Contacts.findByIdAndUpdate(
    { _id: id, owner },
    { $set: { name, email, phone } }
  );
};

const deleteContactById = async (id, owner) => {
  const contact = await Contacts.findById(id);
  if (!contact) {
    throw new AppError(404, `Delete imposibble - No contact with id ${id}`);
  }

  await Contacts.findOneAndDelete({ _id: id, owner });
};

const updateStatusContact = async (id, { favorite }) => {
  const contact = await Contacts.findById(id);
  if (!contact) {
    throw new AppError(
      400,
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
