const path = require('path')
const fs = require('fs')
const NginxConfFile = require('nginx-conf').NginxConfFile

const CONF_CACHE_DIR = path.join(__dirname, '../', 'nginx_conf_cache')

module.exports = function createNginxConfig(domains, dstPort, dstHost='127.0.0.1') {
    const filename = path.join(CONF_CACHE_DIR, `${domains[0]}.conf`)
    try { fs.mkdirSync(CONF_CACHE_DIR) } catch (err) {}
    try { fs.writeFileSync(filename, '') } catch (err) {}
    return new Promise((resolve, reject) => {
        NginxConfFile.create(filename, (err, conf) => {
            if (err) return reject(err)

            // conf.nginx._add('map', '$http_upgrade $connection_upgrade')
            // console.log(conf.nginx)
            // conf.nginx['map '].add('default', 'upgrade')
            // conf.nginx['map '].add(`''`, 'close')
            conf.nginx._addVerbatimBlock('map $http_upgrade $connection_upgrade', `\ndefault upgrade;\n''      close;\n`)
            
            conf.nginx._add('server')
            conf.nginx.server._add('listen', '80')
            conf.nginx.server._add('server_name', domains.join(' '))
            
            conf.nginx.server._add('location', '/')
            conf.nginx.server.location._add('proxy_pass', `http://${dstHost}:${dstPort}`)
            conf.nginx.server.location._add('proxy_set_header', `Host ${domains[0]}`)
            conf.nginx.server.location._add('proxy_pass_request_headers', 'on')
            conf.nginx.server.location._add('proxy_set_header', 'Upgrade $http_upgrade')
            conf.nginx.server.location._add('proxy_set_header', 'Connection $connection_upgrade')


            conf.flush()

            conf.on('flushed', () => {
                resolve(filename)
            })

            conf.on('error', err => {
                reject(err)
            })
        })
    })
}
