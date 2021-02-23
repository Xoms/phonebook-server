const Contact = require('./Contact');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {
    Types: { ObjectId },
} = require('mongoose');
const errorHandler = require('../helpers/errorHandler');


class ContactController {    

    //API
    getContacts = async (req, res) => {
        try {            
            const data = await Contact.find();
            res.json(data);
        } catch (err) {
            errorHandler(err, 500);
        };
    }

    getContactById = async (req, res) => {
        const {
            params: { contactId },
        } = req;
        
         try {            
            const contact = await Contact.findById(contactId);           
            
            if (!contact) {
                return res.status(404).json({ "message":"Not found" });
            }
            
            res.json(contact);
            
        } catch (err) {
            errorHandler(err, 500);
        }; 
    
    }

    createContact = async (req, res) =>{
        const { body, avatarURL } = req;
        
        try {
            const data = { ...body };
            avatarURL && (data.avatarURL = avatarURL);
            const createdContact = await Contact.create(data);

            res.status(201).json(createdContact);
        } catch (err) {
            errorHandler(err, 500);
        }
    }

    deleteContact = async (req, res) => {
        const {
            params: { contactId },
        } = req;

        try {
            const deletedContact = await Contact.findByIdAndDelete(contactId);
            res.status(200).json({ "message":"Contact deleted" });

            if (!deletedContact) {
                return res.status(404).json({ "message":"Not found" });
            }

        } catch (err) {
            errorHandler(err, 500);
        }        
    };

    updateContact = async (req, res) => {
        const {
            body,
            avatarURL,
            params: { contactId },
        } = req;

        try {
            const data = { ...body };
            avatarURL && (data.avatarURL = avatarURL);
            const updatedContact = await Contact.findByIdAndUpdate(contactId, data, {
                new: true,
            });
            if (!updatedContact) {
                return res.status(404).json({ "message":"Not found" });
            }

            res.json(updatedContact);
        } catch (err) {
            errorHandler(err, 500, res);
        }

    };

    //validation middlewares
    validateCreateContact(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string().required(),
            surname: Joi.string().required(),
            phone: Joi.string().required(),
            description: Joi.string().allow(''),
        });
        console.log("new user body: \n", req.body);
        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {            
            return res.status(400).send(validationResult.error);
        }
        next();
    }

    validateUpdateContact(req, res, next) {
        const validationRules = Joi.object({
            name: Joi.string(),
            surname: Joi.string(),
            phone: Joi.string(),
            description: Joi.string().allow(''),
        });

        const validationResult = validationRules.validate(req.body);

        if (validationResult.error) {
            return res.status(400).send(validationResult.error);
        }
        next();
    }

    validateContactId = (req, res, next) => {
        const {
            params: { contactId },
        } = req;

        if (!ObjectId.isValid(contactId)) {
            return res.status(400).json({ "message":"Your id is not valid" });
        }

        /* OR
        const validationRules = Joi.object({
            contactId: Joi.objectId().required
        });
        const validationResult = validationRules.validate({contactId});

        if (validationResult.error) {
            return res.status(400).send(validationResult.error);
        }
        */
        
        next();
    }
}

module.exports = new ContactController();