const express = require('express');
const cons = require('consolidate');
const port  =  8080;
let app = express();
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};
app.use(allowCrossDomain);
app.engine('html', cons.swig);
// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/client/view');
app.use(express.static('views'));

require('./routes.js')(app);
app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});
