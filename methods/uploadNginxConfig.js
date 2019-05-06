const fs = require('fs')
const path = require('path')

module.exports = async function uploadNginxConfig(conn, filename) {
    const sftp = await Promise.promisify(conn.sftp, { multiArgs: false, context: conn })()
    const res = await Promise.promisify(sftp.fastPut, { multiArgs: false, context: sftp })(
        filename,
        path.join('/etc/nginx/sites-enabled', path.basename(filename))
    )
    return res
}
