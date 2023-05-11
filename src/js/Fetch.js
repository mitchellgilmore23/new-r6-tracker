const axios = require('axios');
export const proxy = 'https://tracker-proxy.herokuapp.com'

export default function () {
 const main = (lookupName,lookupPlatform) => axios.get(`${proxy}/https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}`)
 const matches = (lookupName,lookupPlatform) => axios.get(`${proxy}/https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}/mmr-history`)
 const seasons = (lookupName,lookupPlatform) => axios.get(`${proxy}/https://r6.tracker.network/profile/${lookupPlatform}/${lookupName}/seasons`)
return {main,matches,seasons}
}


