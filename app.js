const app = require("express")();
const cors = require('cors'); 
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

app.use(cors());

var port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var uf = require('./api/routes');

app.use('/api/uf/', uf.router);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port, () => {
    console.log(`API server started on: ${port}`);
});