FROM node:10-alpine
# add support for Build tools
RUN apk add --no-cache git bash make gcc g++ python

ENV TZ=Asia/Saigon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN yarn install

# copy to source
COPY . .

EXPOSE 4000
CMD ["node", "index.js"]
