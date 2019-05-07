const fs = require('fs')
const path = require('path')

module.exports = async function uploadNginxConfig(conn, filename) {
    const sftp = await Promise.promisify(conn.sftp, { multiArgs: false, context: conn })()
    await Promise.promisify(sftp.fastPut, { multiArgs: false, context: sftp })(
        filename,
        path.join('/etc/nginx/sites-enabled', path.basename(filename))
    )
    try {
        await Promise.promisify(conn.exec, { multiArgs: false, context: conn })('service nginx restart')
    } catch (err) {
        console.log(`Can't restart nginx. You need to restart it manually. `, err, )
    }
    return res
}
