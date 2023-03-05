const express = require("express");

const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const { addValidation, putValidation } = require("../../middlleware/validator");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", addValidation, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", putValidation, updateContact);

module.exports = router;
