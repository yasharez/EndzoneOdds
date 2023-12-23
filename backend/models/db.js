/**
 * Yashar Zafari
 * 12/06/2023
 * 
 * Database file to connect to MongoDB
 */

'use strict';

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: __dirname+'/./../.env' });

import mongoose from 'mongoose';

// Connect to database
// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGODB_CONNECT_STRING);
const db = mongoose.connection;

// Confirm conection
db.once('open', (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Connection successful');
    }
});

export { mongoose };