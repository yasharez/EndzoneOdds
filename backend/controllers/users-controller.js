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

export { router };