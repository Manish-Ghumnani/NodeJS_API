const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const index = require('./routes/index');


app.use(bodyParser.json());
app.use('/api', index);
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'some error occured!' })
});


// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080);

console.log('Node app is running on port 8080');
/**
 * Export the Express app so that it can be used by Chai
 */
module.exports = app;

