# node-nginx-tunnel
Simple reverse ssh tunnel that also creates a nginx config

## Installation
```bash
git clone https://github.com/nordikafiles/node-nginx-tunnel
```

## Usage
```
cd node-nginx-tunnel
pm2 start index.js --name tunnel
```
Example config.yml:
```yaml
host: 8.8.8.8
username: root
password: password
sites:
  - src: 1234
    dst: 1234
    domains:
      - example.com
      - www.example.com
```