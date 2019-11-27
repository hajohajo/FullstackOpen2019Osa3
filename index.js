const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

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
    },
    {
        id: 3,
        name: "Reino Removable",
        number: "0000000000"
    }

]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/info', (req, res) => {
    const numberOfPersons = notes.length
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${numberOfPersons} people</p> <p>${date}</p>`
    )
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

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const randId = Math.round(Math.random()*100000)
    const body = req.body
    console.log(body)
    const person = {
        id: randId,
        name: body.name,
        number: body.number
    }

    notes = notes.concat(person)
    res.json(notes)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)