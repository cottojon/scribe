FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Add node dependencies to path and build using Angular CLI. Also remove source files.
ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN ng build --prod && rm -R src 

EXPOSE 8080
CMD [ "npm", "start" ]