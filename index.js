const path = require('path')

global.requireYML = require('require-yml')
global.sleep = require('sleep-promise')
global.Promise = require('bluebird')
global.CONFIG = requireYML(path.join(__dirname, 'config.yml'))

console.log(CONFIG)

const createNginxConfig = require('./methods/createNginxConfig')
const uploadNginxConfig = require('./methods/uploadNginxConfig')
const forwardSite = require('./methods/forwardSite')

for (let site of CONFIG.sites) {
    console.log(site)
    forwardSite(site)
}