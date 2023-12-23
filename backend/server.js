/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * Server file for application
 */

'use strict';

// Import dependencies
import express from 'express';
import { router } from './index.js';
import bodyParser from 'body-parser';
import 'dotenv/config';

// Configure server
// eslint-disable-next-line no-undef
const PORT = process.env.PORT
const app = express();
app.use(bodyParser.json());
app.use('/', router);

// Display confirmation that server is running on port
app.listen(PORT, () => {
    console.log(`Server listening on port ${ PORT }...`);
});