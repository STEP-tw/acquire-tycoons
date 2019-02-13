const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// app.use((req,res,))

app.use(express.static('public'));

module.exports = app;
