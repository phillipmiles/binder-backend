# NOT A REAL README

# Crtical deployment failure
## bcrypt
For some reason bcrypt started causing CPU issues when the module was included into the js file. Replaced to argon2 seems to work fine.
## node-gyp (bcypt - argon2)
Some npm modules use node-gyp to set some system variables during the npm install phase of deployment. By default the correct permissions aren't set to allow this to happen on elastic beanstalk.

To fix this. Include a .npmrc file in the root directory with the line unsafe-perm=true to force npm to run node-gyp as root, preventing permission denied errors in AWS with npm@5.




# DB
## config
Look at .sequelizerc file.
http://docs.sequelizejs.com/manual/migrations.html

npx sequelize db:seed:all


// TODO::: GOT TO STOP TRYING TO CONNECT/OPEN/REQUEST A WEBSOCKET WHEN NOT LOGGED IN!!!