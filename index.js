const express = require('express')
const app = express()

let notes = [
    {
        id: 1,
        name: "Matti Meikäläinen",
        number: "0501234567"
    },
    {
        id: 2,
        name: "Minna Meikäläainen",
        number: "0507654321"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)