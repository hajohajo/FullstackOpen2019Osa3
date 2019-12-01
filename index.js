require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}

var morgan = require('morgan')
morgan.token('body', function (req){
    if(req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return " "
    }
})

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(returnedPersons => {
            notes = returnedPersons.map(person => person.toJSON())
            res.json(notes)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {

    Person.find({})
        .then( returnedPersons => {
            numberOfPersons = returnedPersons.length
            const date = new Date()
            res.send(
                `<p>Phonebook has info for ${numberOfPersons} people</p> <p>${date}</p>`
            )
        })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(returnedPerson => {
            if (returnedPerson) {
                res.json(returnedPerson.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const name = body.name
    const number = body.number

    const person = new Person({
        name: name,
        number: number
    })

    person.save()
        .then(savedPerson => {
        console.log("Saved a person")
        notes = notes.concat(savedPerson.toJSON())
        res.json(notes)
        })
        .catch(error=>next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})