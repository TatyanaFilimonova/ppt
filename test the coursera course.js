'use strict';

const app = require('express')();
const http = require('http');
const fs = require('fs');

const page = fs.readFileSync('./page.html').toString();

app.get('/',(req, res)=>{
    res.setHeader('Set-Cookie', ['server_name=df_server; Max-Age=+3000', 'http=only; HttpOnly; SameSite=Strict']);
    res.setHeader('Content-Type', 'text/html');
    res.end(page);
})

app.get('/print', (req, res) =>{
    console.log(req.headers);
    res.end('OK');
})

app.listen(3000);