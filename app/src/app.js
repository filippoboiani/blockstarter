'use strict';


// 3rd-party dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const jsonfile = require("jsonfile");
const exec = require('child_process').exec;
const config = require("../resources/config");
//const reactViews = require('express-react-views');

// web3 dependency 
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider());


// Application config
// Change it with the config file info
const LOCAL_APP_PORT = 8080;
const PUBLIC_APP_PORT = process.env.PUBLIC_APP_PORT || LOCAL_APP_PORT;

// ====== uncomment this when you have docker set up
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || 27017;


// MongoDB connection
const MONGO_URL = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/dev';
global.db = mongoose.createConnection(MONGO_URL);

// Express middlewares
// parse application/x-www-form-urlencoded
// parse application/json
// parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// app.set('view engine', 'js');
// app.engine('js', reactViews.createEngine());
// app.use(express.static(__dirname + '/../views'));
app.use(express.static(__dirname + '/../client'));

// check blockchain client
// TODO: delete it when Docker is set up
// try {
//     if (!web3.net.listening)
//         throw false;
//
// } catch (error) {
//     console.log(`WARN: No blockchain client listening, started a ${config.client} client`);
//     console.log(path.resolve(__dirname, config.script));
//     exec(path.resolve(__dirname, config.script), function(error, stdout, stderr) {
//         console.log("TestRPC started");
//         if (error !== null) {
//             console.log('exec error: ' + error);
//         }
//     });
// }

// import the router 
require('./router.js')(app, web3);

app.listen(LOCAL_APP_PORT, () => {
    console.log("\n\n\n");
    console.log("   ÛÛÛÛÛÛÛÛÛ                                             ÛÛÛÛÛÛÛÛÛÛ");
    console.log("  ÛÛÛ°°°°°ÛÛÛ                                           °°ÛÛÛ°°°°°Û");
    console.log(" ÛÛÛ     °°°  ÛÛÛÛÛÛÛÛ   ÛÛÛÛÛÛ  ÛÛÛÛÛ ÛÛÛÛ ÛÛÛÛÛÛÛÛ     °ÛÛÛ  Û ° ");
    console.log("°ÛÛÛ         °°ÛÛÛ°°ÛÛÛ ÛÛÛ°°ÛÛÛ°°ÛÛÛ °ÛÛÛ °°ÛÛÛ°°ÛÛÛ    °ÛÛÛÛÛÛ   ");
    console.log("°ÛÛÛ    ÛÛÛÛÛ °ÛÛÛ °°° °ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ  °ÛÛÛ °ÛÛÛ    °ÛÛÛ°°Û   ");
    console.log("°°ÛÛÛ  °°ÛÛÛ  °ÛÛÛ     °ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ  °ÛÛÛ °ÛÛÛ    °ÛÛÛ °   Û");
    console.log(" °°ÛÛÛÛÛÛÛÛÛ  ÛÛÛÛÛ    °°ÛÛÛÛÛÛ  °°ÛÛÛÛÛÛÛÛ °ÛÛÛÛÛÛÛ     ÛÛÛÛÛÛÛÛÛÛ");
    console.log("  °°°°°°°°°  °°°°°      °°°°°°    °°°°°°°°  °ÛÛÛ°°°     °°°°°°°°°° ");
    console.log("                                            °ÛÛÛ                   ");
    console.log("                                            ÛÛÛÛÛ                  ");
    console.log("\n\n\n");
    console.log(`App started on port ${LOCAL_APP_PORT}`);
});
