const mongoose = require('mongoose')

inputArguments = process.argv

if ( inputArguments.length < 3) {
    console.log(
        "Give password as an argument"
    )
    process.exit(1)
}

const password = inputArguments[2]

const url = `mongodb+srv://ankkuli:${password}@cluster0-xo3ca.mongodb.net/phoneBook?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true})

const personScheme = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personScheme)


if ( inputArguments.length === 3 ) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else if ( inputArguments.length === 5 ) {
    const person = new Person({
        name: inputArguments[3],
        number: inputArguments[4]
    })
    person.save().then( () => {
        console.log('Person saved')
        mongoose.connection.close()
    })
} else {
    console.log('Wrong number of arguments')
    process.exit(1)
}