const createNginxConfig = require('./createNginxConfig')
const uploadNginxConfig = require('./uploadNginxConfig')
const tunnel = require('reverse-tunnel-ssh')

module.exports = function forwardSite(site) {
    const conn = tunnel({
        host: CONFIG.host,
        username: CONFIG.username,
        password: CONFIG.password,
        dstHost: '0.0.0.0',
        dstPort: site.dst || 0,
        srcPort: site.src || site.dst
    }, (err, clientConnection) => {})

    conn.on('forward-in', async function (port) {
        console.log(`Forwarding from ${CONFIG.host}:` + port)
    })
    
    conn.on('ready', async () => {
        let filename = await createNginxConfig(site.domains, site.dst)
        try {
            await uploadNginxConfig(conn, filename)
        } catch (err) {
            console.log(`Can't upload nginx config`, err)
        }
    })
}