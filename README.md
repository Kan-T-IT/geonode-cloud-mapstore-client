# GeoNode MapStore Client for Kan

## Requirements
- git
- node v20.16.0

## Setup your local dev environment

Clone the repository recursively to use MapStore2 submodule.
You  may have to input your credentials several times if you dont use SSH clone

`git clone --recursive https://git.kan.com.ar/kan/geoexpressportal/geonode-mapstore-client.git -b 4.2.0-dev`

Move into the `geonode-mapstore-client/geonode_mapstore_client/client/` folder and add a `.env` file with the next variables on it.

```env
DEV_SERVER_PROTOCOL=http 
DEV_SERVER_HOSTNAME=localhost
DEV_TARGET_GEONODE_HOST=my-geonode-host.com
```
Make sure to replace the `DEV_TARGET_GEONODE_HOST` variable with your own.

Enable node to use a legacy and neccesary legacy OpenSSL provider.

`export NODE_OPTIONS=--openssl-legacy-provider`

Update and install dependencies and start the development server.

```bash
npm update
npm install --legacy-peer-deps
npm start
```
Now you have your dev server runing in http://localhost:8081, it will automatically reload itself to show you the changes you made in the code.