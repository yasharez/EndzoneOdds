/**
 * Yashar Zafari
 * 12/06/2023
 * 
 * Model file for matchups collection in MongoDB
 */

'use strict';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

import mongoose from 'mongoose';

console.log(process.env.MONGODB_CONNECT_STRING);

// Connect to database
mongoose.connect(process.env.MONGODB_CONNECT_STRING);
const db = mongoose.connection;

// Confirm conection
db.once('open', (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Connection successful');
    };
});