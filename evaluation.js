'use strict';

var filename = 'evaluation.json';
var filepath = '.';
var path = require('path');
var resource = r => path.join(filepath, filename);
var fs = require('fs');
var id = require('shortid');


function persist(evaluation){
    var current = load();
    evaluation.date = new Date();
    evaluation.id = id.generate();
    current.push(evaluation);
    persistAll(current);
}

function persistAll(all){
    fs.writeFileSync(resource(), JSON.stringify(all), {flag: 'w'});
}

function load(){
    return fs.existsSync(resource()) ? JSON.parse(fs.readFileSync(resource(), {flag: 'r', encoding: 'utf8'})) : [];
}

function remove(id){
    var current = load();
    var updated = current.filter(el => el.id !== id);
    var removed = current.length !== updated.length;
    if(removed) persistAll(updated);
    return removed;
}

function find(id){
    var current = load();
    var index = current.findIndex(el => el.id === id);
    return index >= 0 ? current[index] : null;
}

function check(evaluation){
    if(!evaluation || !evaluation.course || !evaluation.satisfaction) return false;
    var isValidCourse = ['mi','mt','tub'].indexOf(evaluation.course.toLowerCase()) >= 0;
    var isValidSatisfaction = +evaluation.satisfaction >= 1 && +evaluation.satisfaction <= 3;
    var errors = [];
    if(!isValidCourse) errors.push('Kein gültiger Studiengang! Diese Evaluation ist zum Beispiel nicht für Masterstudenten');
    if(!isValidSatisfaction) errors.push('Keine gültige Bewertung. Mindestens die Bewertung muss gesendet werden');
    return {
        acceptable: isValidCourse && isValidSatisfaction,
        errors: errors
    };
}

module.exports = {
    filename: filename,
    filepath: filepath,
    find: find,
    remove: remove,
    persist: persist,
    persistAll: persistAll,
    load: load,
    check: check,
};