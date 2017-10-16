/**
 * created by NasskalteJuni
 * Wrapping around File Storage
 */
const filename = './evaluation.json';
const fs = require('fs');
const id = require('shortid');

function persist(evaluation){
    let collected = load();
    evaluation.date = new Date();
    evaluation.id = id.generate();
    collected.push(evaluation);
    fs.writeFileSync(filename, JSON.stringify(collected));
}

function load(){
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}

function remove(id){
    let current = load();
    let updated = current.filter(el => el.id !== id);
    let removed = current.length !== updated.length;
    if(removed) fs.writeFileSync(filename, JSON.stringify(updated));
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
    find: find,
    remove: remove,
    persist: persist,
    load: load,
    check: check
};