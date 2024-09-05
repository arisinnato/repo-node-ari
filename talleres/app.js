const express = require('express')
const wiki = require('./wiki')

const app = express()

const port = 8000

app.use('/wiki', wiki)

app.listen(port, ()=>{
    console.log(`Aplicación funcionando en localhost:${port}`)
})