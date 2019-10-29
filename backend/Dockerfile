# build our images/containers
# docker build -t backend .
# docker run -p 4321:3000 backend
# use node 10 image
FROM node:10

# Create app directory 
WORKDIR /usr/src/app

# Install app dependencies for caching
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source inside docker image (dockerignore is used to not copy dist and node_modules)
COPY . .

#for our typescript project
# build our project -> creates dist ?make sure tsconfig.joson rootDir is "." = root
RUN npm run build

#copy the config(yml) folder for database, etc
COPY config ./dist/
#copy over into container
# COPY wait-for-it.sh ./dist/

#change working directory
WORKDIR ./dist


# expose app port
EXPOSE 3000
# our sun commands (change it for production when in production)
CMD ["npm", "run", "start"]