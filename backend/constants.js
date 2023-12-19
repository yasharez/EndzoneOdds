/**
 * Yashar Zafari
 * 12/14/2023
 * 
 * String constants file to use in application
 */

'use strict';

const Strings = {
    'JSON': 'application/json'
}

const ErrorCodes = {
    '400': 'The request object is missing at least one of the required attributes, the attributes are of the wrong type, or extra attributes have been provided',
    '401': 'The provided JWT is missing or invalid',
    '403': 'The provided JWT does not correspond to the requested user',
    '404_user': 'No user with this user_id/sub exists',
    '404_matchup': 'No matchup with this matchup_id exists',
    '404_pick': 'No pick with this pick_id exists',
    '406': 'The requested MIME type is not supported by the API'
}

export { Strings, ErrorCodes }