/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Controller file for picks collection in MongoDB
 */

'use strict';

import express from 'express';
import * as picks from '../models/picks-model.js';
import { Strings, ErrorCodes } from '../constants.js';

const router = express.Router();

// Create a pick
router.post('/', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        picks.createPick(
            req.body.matchup_id,
            req.body.user_id,
            req.body.pick
        )
        .then(pick => {
            res.status(201).json(pick);
        });
    }
});

// Get all picks
router.get('/', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        const filter = {};
        picks.findPicks(filter)
        .then(picks => {
            res.status(200).json(picks);
        });
    }
});

// Get picks by ID
router.get('/:id', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        picks.findPickByID(req.params.id)
        .then(pick => {
            if (pick !== null) {
                res.status(200).json(pick)
            } else {
                res.status(404).json({
                    'Error': ErrorCodes['404_pick']
                });
            }
        });
    }
});

// Get picks by matchup ID
router.get('/matchups/:id', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        const filter = { matchup_id: req.params.id }
        picks.findPicks(filter)
        .then(picks => {
            if (picks !== null) {
                res.status(200).json(picks)
            } else {
                res.status(404).json({
                    'Error': ErrorCodes['404_matchup']
                });
            }
        });
    }
});

// Edit a pick
router.put('/:id', (req, res) => {
    const accepts = req.accepts([Strings.JSON]);
    if (!accepts) {
        // No compatible MIME type
        res.status(406).json({
            'Error': ErrorCodes['406']
        });
    } else {
        picks.editPick(
            req.params.id,
            req.body.matchup_id,
            req.body.user_id,
            req.body.pick,
            req.body.correct
        )
        .then(modifiedCount => {
            if (modifiedCount !== 1) {
                // No pick found
                res.status(404).json({
                    'Error': ErrorCodes['404_pick']
                });
            } else {
                picks.findPickByID(req.params.id)
                .then(pick => {
                    res.status(200).json(pick);
                });
            }
        });
    }
});

// Delete a pick
router.delete('/:id', (req, res) => {
    picks.deletePickByID(req.params.id)
    .then(deletedCount => {
        if (deletedCount !== 1) {
            res.status(404).json({
                'Error': ErrorCodes['404_pick']
            });
        } else {
            res.status(204).end();
        }
    });
});

export { router };