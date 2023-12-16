/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Controller file for users collection in MongoDB
 */

'use strict';

import express from 'express';
import * as users from '../models/users-model';
import { Strings, ErrorCodes } from '../constants';

const router = express.Router();

// Create a user
router.post('/', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else if (!validate_post_attributes(req.body)) {
        // Incorrect attributes sent
        res.status(400).json({
            'Error': ErrorCodes['400']
        });
    } else {
        users.createUser(
            req.body.first_name,
            req.body.last_name,
            req.body.sub
        )
        .then(user => {
            res.status(201).json(user);
        });
    }
});

// Get all users
router.get('/', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        const filter = {};
        users.findUsers(filter)
        .then(users => {
            res.status(200).json(users);
        });
    }
});

// Get user by ID
router.get('/:id', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        users.findUserByID(req.params.id)
        .then(user => {
            if (user !== null) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    'Error': ErrorCodes['404_user']
                });
            }
        });
    }
});

// Get user by sub
router.post('/sub', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        const filter = { sub: req.body.sub };
        users.findUsers(filter)
        .then(user => {
            if (user !== null) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    'Error': ErrorCodes['404_user']
                });
            }
        });
    }
});

// Edit a user
router.put('/:id', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else if (!validate_put_attributes(req.body)) {
        // Invalid body attributes
        res.status(400).json({
            'Error': ErrorCodes['400']
        });
    } else {
        users.editUser(
            req.body.first_name,
            req.body.last_name,
            req.body.sub,
            req.body.wins,
            req.body.ties_2nd,
            req.body.ties_3rd
        )
        .then(modifiedCount => {
            if (modifiedCount !== 1) {
                // No user found
                res.status(404).json({
                    'Error': ErrorCodes['404_user']
                });
            } else {
                users.findUserByID(req.params.id)
                .then(user => {
                    res.status(200).json(user);
                });
            }
        });
    }
});

// Delete a user
router.delete('/:id', (req, res) => {
    users.deleteUserByID(req.params.id)
    .then(deletedCount => {
        if (deletedCount !== 1) {
            res.status(404).json({
                'Error': ErrorCodes['404_user']
            });
        } else {
            res.status(204).end();
        }
    });
});

/*------------------------------Helper functions------------------------------*/

/**
 * Validates all attributes sent in request body. Used in POST
 * @param {Object} reqBody The request body object
 * @returns True if attributes are valid, false otherwise
 */
function validate_post_attributes(reqBody) {
    // Unpack variables from body
    const reqBodyArr = [
        reqBody.first_name,
        reqBody.last_name,
        reqBody.sub
    ];

    // Check if length of body is equal to required attributes
    if (reqBodyArr.length !== 3) {
        return false;
    }
    // Check if all required attributes are present
    if (reqBodyArr.some(attr => attr === undefined)) {
        return false;
    }
    // Confirm type of string values
    if (reqBodyArr.some(attr => typeof attr !== 'string')) {
        return false;
    }
    // Attributes are all present and valid
    return true;
}

/**
 * Validates all attributes sent in request body. Used in PUT
 * @param {Object} reqBody The request body object
 * @returns True if attributes are valid, false otherwise
 */
function validate_put_attributes(reqBody) {
    // Unpack variables from body
    const reqBodyArr = [
        reqBody.first_name,
        reqBody.last_name,
        reqBody.sub,
        reqBody.wins,
        reqBody.ties_2nd,
        reqBody.ties_3rd
    ];

    const reqBodyNumArr = reqBodyArr.slice(3);

    // Check if length of body is equal to required attributes
    if (reqBodyArr.length !== 6) {
        return false;
    }
    // Check if all required attributes are present
    if (typeof reqBodyArr[0] !== 'string' || typeof reqBodyArr[1] !== 'string' || typeof reqBodyArr[2] !== 'string') {
        return false;
    }
    // Confirm type of string values
    if (reqBodyNumArr.some(attr => typeof attr !== 'number')) {
        return false;
    }
    // Attributes are all present and valid
    return true;
}

export { router };