const express = require('express')
const bodyParse = require('body-parser')

const app = express()

const port = 3003

app.use(bodyParse.json());

 
app.listen(port, ()=>{
    console.log(`Servidor iniciado en el puerto ${port}`)
})

const tareas = [
    {
        id: 1,
        title: "Hacer tarea",
        descripcion: "Hacer tarea",
        estatus: true
    },
    {
        id: 2,
        title: "Hacer tarea 2",
        descripcion: "Hacer tarea 2",
        estatus: true
    }

]

app.get('/tareas', (req, res)=>{

    res.status(200).json(tareas)
})

app.get('/tareas/:id', (req, res)=>{
    console.log("Id: ", req.params.id)
    const tarea = tareas.find(t => t.id == req.params.id)
    if(tarea)
        res.status(200).json({tarea: tarea})
    else
        res.status(400).json({mensaje: "Tarea no encontrada"})
})

app.post('/agregar', (req, res)=>{
    const {title, descripcion, estatus} = req.body
    

})


