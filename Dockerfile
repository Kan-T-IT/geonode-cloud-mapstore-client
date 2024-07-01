FROM node:16-alpine AS builder

RUN apk update
RUN apk add git

# Set working directory
WORKDIR /app

# App files
COPY . /app
RUN git submodule update --init --recursive

# install node modules
WORKDIR /app/geonode_mapstore_client/client
RUN npm install --legacy-peer-deps

# compile for development
RUN npm run compile

### 2) Publish
# nginx is serving the frontend site
FROM nginx:1.25.3-alpine

COPY ./geonodestatics/static /usr/share/nginx/html/static

COPY --from=builder /app/geonode_mapstore_client/static/fonts /usr/share/nginx/html/static/fonts
COPY --from=builder /app/geonode_mapstore_client/static/mapstore /usr/share/nginx/html/static/mapstore
COPY --from=builder /app/geonode_mapstore_client/static/mapstorestyle /usr/share/nginx/html/static/mapstorestyle

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]