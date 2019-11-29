const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

var morgan = require('morgan')
morgan.token('body', function (req){
    if(req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return " "
    }
})

app.use(bodyParser.json())
app.use(morgan(':method :url :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

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
    console.log("Here!")
    console.log(notes)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const randId = Math.round(Math.random()*100000)
    const body = req.body
    const name = body.name
    const number = body.number
    console.log("POST")
    console.log(body)
    if(!(name && number)) {
        return res.status(406).json({
            error: 'missing name or number'
        })
    }

    const existsAlready = notes.find(note => (note.name === name || note.number === number) )
    if(existsAlready) {
        return res.status(409).json({
            error: 'Name or number already in phonebook'
        })
    }

    const person = {
        id: randId,
        name: name,
        number: number
    }

    notes = notes.concat(person)
    res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})