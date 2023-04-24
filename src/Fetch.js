const $ = require('jquery');
const axios = require('axios');
const cheerio = require('cheerio');
export const proxy = 'https://tracker-proxy.herokuapp.com'

export const main = (lookupName,lookupPlatform) => axios.get(`${proxy}/https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}`)
export const matches = (lookupName,lookupPlatform) => axios.get(`${proxy}/https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}/mmr-history`)
export const seasons = (lookupName,lookupPlatform) => axios.get(`${proxy}/https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}/seasons`)


