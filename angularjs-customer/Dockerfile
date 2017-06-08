FROM node

CMD [ "npm", "install", "-g", "@angular/cli" ]

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

CMD [ "npm", "start" ]