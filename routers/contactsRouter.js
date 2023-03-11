const express = require("express");
const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const { addValidation, putValidation } = require("../middlleware/validator");

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  changeContactController,
  deleteContactController,
} = require("../controllers/contactsController");

router.get("/", asyncWrapper(getContactsController));

router.get("/:contactId", asyncWrapper(getContactByIdController));

router.post("/", addValidation, asyncWrapper(addContactController));

router.delete("/:contactId", asyncWrapper(deleteContactController));

router.put("/:contactId", putValidation, asyncWrapper(changeContactController));

module.exports = router;
