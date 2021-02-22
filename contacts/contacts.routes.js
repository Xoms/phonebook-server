const { Router } = require('express');
const ContactsController = require('./contacts.controller');
const upload = require('../utils/multer.config');
const minifyImages = require('../utils/imagemin');

const router = Router();

router.get(
    '/',
    ContactsController.getContacts
);

router.get(
    '/:contactId',
    ContactsController.validateContactId,
    ContactsController.getContactById
);

router.post(
    '/',
    upload.single('avatar'),
    minifyImages,
    ContactsController.validateCreateContact,
    ContactsController.createContact
);

router.delete(
    '/:contactId',
    ContactsController.validateContactId,
    ContactsController.deleteContact
);

router.patch(
    '/:contactId',
    upload.single('avatar'),
    minifyImages,
    ContactsController.validateContactId,
    ContactsController.validateUpdateContact,
    ContactsController.updateContact
);


module.exports = router;