var apis = require('./apiRoutes');
var routes = require('./routes');

module.exports = (app, passport) => {
  
  app.use('/', routes);
  app.use('/api', apis);

}

