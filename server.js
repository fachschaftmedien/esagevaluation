/**
 * created by NasskalteJuni
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userAgent = require('express-useragent');
const clientID = require('./clientID');
const checkKey = require('./checkKey');
const evaluation = require('./evaluation');
const app = express();
const port = process.env.PORT || 3000;
const sha1 = require('sha1');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(userAgent.express());
app.use(clientID());

app.options('*', cors());
app.set('trust proxy',true);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/evaluation', function(req, res){
    let checked = evaluation.check(req.body);
    if(checked.acceptable){
        let id = evaluation.persist(req.body);
        res.status(201).send({
            text: 'Daten erfolgreich gespeichert',
            id: id
        });
    }else{
        res.status(400).send({
            error: 400,
            text: checked.errors.reduce((str, current) => str + current + " ", "")
        });
    }
});

app.get('/evaluation', function(req, res){
    let key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        res.status(200).json(evaluation.load());
    }else{
        res.status(403).json({error: 'inavlid access key provided'});
    }
});

app.delete('/evaluation/:id', function(req, res){
    let id = req.params.id || req.query.id;
    let key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        res.status(200).json({deleted: evaluation.remove(id)});
    }else{
        res.status(403).json({error: 'invalid access key provided'});
    }
});

app.get('/evaluation/:id', function(req, res){
    let id = req.params.id || req.query.id;
    let key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        res.status(200).json(evaluation.find(id));
    }else{
        res.status(403).json({error: 'invalid access key provided'});
    }
});

console.log('start node js server');
app.listen(port, function () {
    console.log('server listening on port '+port);
});

