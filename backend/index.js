/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Index file for server controllers
 */

'use strict';

import express from 'express';
import * as users from './controllers/users-controller';
import * as matchups from './controllers/matchups-controller';
import * as picks from './controllers/picks-controller';

const router = express.Router();

router.use('/users', users.router);
router.use('/matchups', matchups).router;
router.use('/picks', picks.router);

export { router }