const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
        .then(() => {
            console.log('connected to MongoDB')
        })
        .catch((error) => {
            console.log('error connecting to MongoDB: ', error.message)
        })

const personScheme = new mongoose.Schema({
    name: String,
    number: String
})

personScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personScheme)