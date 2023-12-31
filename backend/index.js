/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Index file for server controllers
 */

'use strict';

import express from 'express';
import * as users from './controllers/users-controller.js';
import * as matchups from './controllers/matchups-controller.js';
import * as picks from './controllers/picks-controller.js';

const router = express.Router();

router.use('/users', users.router);
router.use('/matchups', matchups.router);
router.use('/picks', picks.router);

export { router }