const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI
var uniqueValidator = require('mongoose-unique-validator')

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
        .then(() => {
            console.log('connected to MongoDB')
        })
        .catch((error) => {
            console.log('error connecting to MongoDB: ', error.message)
        })

const personScheme = new mongoose.Schema({
    name: {type: String, required: true, unique: true, minlength: 3},
    number: {type: String, required: true, unique: true, minlength: 8}
})

personScheme.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personScheme.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personScheme)