'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var userAgent = require('express-useragent');
var clientID = require('./clientID');
var checkKey = require('./checkKey');
var evaluation = require('./evaluation');
evaluation.filepath = process.env.OPENSHIFT_DATA_DIR || '.';
var app = express();
var sha1 = require('sha1');
var fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(userAgent.express());
app.use(clientID());

app.options('*', cors());
app.set('trust proxy',true);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.HOST || '127.0.0.1');
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/evaluation', function(req, res){
    var checked = evaluation.check(req.body);
    if(checked.acceptable){
        var id = evaluation.persist(req.body);
        res.status(201).json({
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

app.post('/import', function(req, res){
    var key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        if(req.body){
            evaluation.persistAll(req.body);
            res.status(200).json({
                text: 'Daten erfolgreich importiert',
                entries: req.body.length
            });
        }else{
            res.status(400).json({error: 'invalid data provided'});
        }
    }else{
        res.status(403).json({error: 'inavlid access key provided'});
    }
});

app.get('/evaluation', function(req, res){
    var key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        res.status(200).json(evaluation.load());
    }else{
        res.status(403).json({error: 'inavlid access key provided'});
    }
});

app.delete('/evaluation/:id', function(req, res){
    var id = req.params.id || req.query.id;
    var key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        res.status(200).json({deleted: evaluation.remove(id)});
    }else{
        res.status(403).json({error: 'invalid access key provided'});
    }
});

app.get('/evaluation/:id', function(req, res){
    var id = req.params.id || req.query.id;
    var key = req.query.key || req.body.key;
    if(key && key.length >= 0 && key.length <= 50 && checkKey(key)){
        res.status(200).json(evaluation.find(id));
    }else{
        res.status(403).json({error: 'invalid access key provided'});
    }
});

console.log('start node js server');
app.listen(app.get('port'), app.get('ip'), function () {
    console.log('server listening on');
    console.log('http://'+app.get('ip')+':'+app.get('port')+'/');
});

