'use strict';

let filename = 'evaluation.json';
let filepath = '.';
const path = require('path');
const resource = r => path.join(filepath, filename);
const fs = require('fs');
const id = require('shortid');


function persist(evaluation){
    let current = load();
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
    let current = load();
    let updated = current.filter(el => el.id !== id);
    let removed = current.length !== updated.length;
    if(removed) persistAll(updated);
    return removed;
}

function find(id){
    let current = load();
    let index = current.findIndex(el => el.id === id);
    return index >= 0 ? current[index] : null;
}

function check(evaluation){
    if(!evaluation || !evaluation.course || !evaluation.satisfaction) return false;
    let isValidCourse = ['mi','mt','tub'].indexOf(evaluation.course.toLowerCase()) >= 0;
    let isValidSatisfaction = +evaluation.satisfaction >= 1 && +evaluation.satisfaction <= 3;
    let errors = [];
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