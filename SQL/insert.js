const express = require("express");
const db = require('../db.js')
try {
    const data = await db.one('INSERT INTO words(eng, rus) VALUES($1, $2) RETURNING id', [req.body.eng, req.body.rus])
    console.log('Succesful insert!')
} 
catch(e) {
    console.log('Error!')
}