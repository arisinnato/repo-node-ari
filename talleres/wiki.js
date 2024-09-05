// Módulo de rutas
const express = require('express')
const router = express.Router()

// Ahora usamos nuestro router para crear las rutas
router.get('/', (req, res)=>{
    res.send("Wiki home page")
})

router.get('/about', (req, res)=>{
    res.send("Wiki about page")
})

module.exports = router