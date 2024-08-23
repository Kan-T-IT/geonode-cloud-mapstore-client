FROM node:20.16.0

COPY ./ /geonode-mapstore-client
WORKDIR /geonode-mapstore-client/geonode_mapstore_client/client/

RUN cp .env.sample .env

ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm update
RUN npm install --legacy-peer-deps

EXPOSE 8081