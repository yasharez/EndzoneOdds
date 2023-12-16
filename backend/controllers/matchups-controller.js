/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Controller file for matchups collection in MongoDB
 */

'use strict';

import express from 'express';
import * as matchups from '../models/matchups-model';
import { Strings, ErrorCodes } from '../constants';

const router = express.Router();

// Create a matchup
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
        matchups.createMatchup(
            req.body.home_team, 
            req.body.away_team, 
            req.body.spread, 
            req.body.season, 
            req.body.week
        )
        .then(matchup => {
            res.status(201).json(matchup);
        });
    }
});

// Get all matchups
router.get('/', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        // Set empty filter to get all matchups
        const filter = {};
        matchups.findMatchups(filter)
        .then(matchups => {
            res.status(200).json(matchups);
        });
    }
});

// Get matchup by ID
router.get('/:id', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        matchups.findMatchupByID(req.params.id)
        .then(matchup => {
            if (matchup !== null) {
                res.status(200).json(matchup);
            } else {
                res.status(404).json({
                    'Error': ErrorCodes['404_matchup']
                });
            }
        });
    }
});

// Get matchup by year
router.get('/year/:year', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        const filter = { season: req.params.year };
        matchups.findMatchups(filter)
        .then(matchups => {
            res.status(200).json(matchups);
        });
    }
});

// Get matchup by year and week
router.get('/year/:year/week/:week', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        const filter = {
            season: req.params.year,
            week: req.params.week
        };
        matchups.findMatchups(filter)
        .then(matchups => {
            res.status(200).json(matchups);
        });
    }
});

// Edit matchup
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
        matchups.editMatchup(
            req.params.id,
            req.body.home_team,
            req.body.away_team,
            req.body.home_score,
            req.body.away_score,
            req.body.spread,
            req.body.season,
            req.body.week
        )
        .then(modifiedCount => {
            if (modifiedCount !== 1) {
                // No matchup found
                res.status(404).json({
                    'Error': ErrorCodes['404_matchup']
                });
            } else {
                matchups.findMatchupByID(req.params.id)
                .then(matchup => {
                    res.status(200).json(matchup);
                });
            }
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
        reqBody.home_team, 
        reqBody.away_team, 
        reqBody.spread,
        reqBody.season,
        reqBody.week,
    ];

    const reqBodyNumArr = reqBodyArr.slice(2);

    // Check if length of body is equal to required attributes
    if (Object.keys(reqBody).length !== 5) {
        return false;
    }
    // Check if all required attributes are present
    if (reqBodyArr.some(attr => attr === undefined)) {
        return false;
    }
    // Check type of team names
    if (typeof reqBody.home_team !== 'string' || typeof reqBody.away_team !== 'string') {
        return false;
    }
    // Check type of numerical values
    if (reqBodyNumArr.every(attr => typeof attr !== 'number')) {
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
        reqBody.home_team,
        reqBody.away_team,
        reqBody.home_score,
        reqBody.away_score,
        reqBody.spread,
        reqBody.season,
        reqBody.week,
    ];

    const reqBodyNumArr = reqBodyArr.slice(2);

    // Check if length of body is equal to required attributes
    if (Object.keys(reqBody).length !== 7) {
        return false;
    }
    // Check if all required attributes are present
    if (reqBodyArr.some(attr => attr === undefined)) {
        return false;
    }
    // Check type of team names
    if (typeof reqBody.home_team !== 'string' || typeof reqBody.away_team !== 'string') {
        return false;
    }
    // Check type of numerical values
    if (reqBodyNumArr.every(attr => typeof attr !== 'number')) {
        return false;
    }
    // Attributes are all present and valid
    return true;
}