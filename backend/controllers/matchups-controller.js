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
        res.status(400).json({
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
        res.status(400).json({
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
        res.status(400).json({
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