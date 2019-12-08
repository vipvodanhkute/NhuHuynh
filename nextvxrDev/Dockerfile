FROM node:10.15-alpine

RUN ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN yarn config set registry https://npm.vexere.net

#RUN yarn

# Get args from compose
ARG ENV=production
ARG NODE_ENV=production
ARG PORT=3000

# Parse to env
ENV ENV=$ENV
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT

# Install packages
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn

# Bundle app source
COPY . /usr/src/app
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
