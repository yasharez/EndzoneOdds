/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Controller file for matchups collection in MongoDB
 */

'use strict';

import express from 'express';
import * as matchupsModel from '../models/matchups-model';

const router = express.Router();

// Get all matchups
router.get('/', (req, res) => {

});