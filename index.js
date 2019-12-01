require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

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
    Person.find({})
        .then(returnedPersons => {
            notes = returnedPersons.map(person => person.toJSON())
            res.json(notes)
        })
})

app.get('/info', (req, res) => {
    const numberOfPersons = notes.length
    const date = new Date()
    res.send(
        `<p>Phonebook has info for ${numberOfPersons} people</p> <p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(returnedPerson => {
            if (returnedPerson) {
                res.json(returnedPerson.toJSON)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    console.log("Here!")
    console.log(notes)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    const name = body.name
    const number = body.number
    if((name===undefined || number===undefined)) {
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

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(savedPerson => {
        console.log("Saved a person")
        notes = notes.concat(savedPerson.toJSON())
        res.json(notes)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})