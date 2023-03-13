const express = require("express");
const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const { addValidation, putValidation } = require("../middlleware/validator");

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
  updateStatusContactController,
} = require("../controllers/contactsController");

// router.use("/:contactId", checkUserId); //! ID проверка по всем запросам с contactId

router.get("/", asyncWrapper(getContactsController));

router.get("/:contactId", asyncWrapper(getContactByIdController));

router.post("/", addValidation, asyncWrapper(addContactController));

router.delete("/:contactId", asyncWrapper(deleteContactController));

router.put("/:contactId", putValidation, asyncWrapper(updateContactController));

router.patch("/:contactId", asyncWrapper(updateStatusContactController));

module.exports = router;
