/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Controller file for matchups collection in MongoDB
 */

'use strict';

// Import dependencies
import express from 'express';
import axios from 'axios';
import * as matchups from '../models/matchups-model.js';
import { Strings, ErrorCodes } from '../constants.js';

// Import dotenv/config
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
// Load environment variables
dotenv.config({ path: '../.env' });

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
            req.body.commence_time,
            req.body.spread, 
            req.body.season, 
            req.body.week
        )
        .then(matchup => {
            res.status(201).json(matchup);
        });
    }
});

// Create matchups for the week
router.post('/year/:year/week/:week', async (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        axios.post({
            baseURL: Strings['ODDS_ENDPOINT'],
            url: '/v4/sports/americanfootball_nfl/odds',
            params: {
                regions: 'us',
                oddsFormat: 'american',
                // eslint-disable-next-line no-undef
                apiKey: process.env.ODDS_API_KEY,
                markets: 'spreads',
                commenceTimeTo: req.body.commenceTimeTo,
                bookmakers: 'fanduel',
            },
        })
        .then(response => {
            console.log(response.data)
            console.log(response.status)
        })
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
            req.body.commence_time,
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

// Delete a matchup
router.delete('/:id', (req, res) => {
    matchups.deleteMatchupByID(req.params.id)
    .then(deletedCount => {
        if (deletedCount !== 1) {
            res.status(404).json({
                'Error': ErrorCodes['404_matchup']
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
        reqBody.home_team, 
        reqBody.away_team,
        reqBody.commence_time,
        reqBody.spread,
        reqBody.season,
        reqBody.week,
    ];

    // Separate the numerical values
    const reqBodyNumArr = reqBodyArr.slice(3);

    // Check if length of body is equal to required attributes
    if (reqBodyArr.length !== 6) {
        return false;
    }
    // Check if all required attributes are present
    if (reqBodyArr.some(attr => attr === undefined)) {
        return false;
    }
    // Check type of team names
    if (typeof reqBody.home_team !== 'string' || typeof reqBody.away_team !== 'string' || typeof reqBody.commence_time !== 'string') {
        return false;
    }
    // Check type of numerical values
    if (reqBodyNumArr.some(attr => typeof attr !== 'number')) {
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
        reqBody.commence_time,
        reqBody.home_score,
        reqBody.away_score,
        reqBody.spread,
        reqBody.season,
        reqBody.week,
    ];

    const reqBodyNumArr = reqBodyArr.slice(3);

    // Check if length of body is equal to required attributes
    if (reqBodyArr.length !== 8) {
        return false;
    }
    // Check if all required attributes are present
    if (reqBodyArr.some(attr => attr === undefined)) {
        return false;
    }
    // Check type of team names
    if (typeof reqBody.home_team !== 'string' || typeof reqBody.away_team !== 'string' || typeof reqBody.commence_time !== 'string') {
        return false;
    }
    // Check type of numerical values
    if (reqBodyNumArr.some(attr => typeof attr !== 'number')) {
        return false;
    }
    // Attributes are all present and valid
    return true;
}

export { router };