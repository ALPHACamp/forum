
const handlebars = require('express-handlebars')

module.exports = {
  ifCond: function(a, b, options){
	    if(+a === +b) {
	      return options.fn(this);
	    }
	    return options.inverse(this);
  }
}
