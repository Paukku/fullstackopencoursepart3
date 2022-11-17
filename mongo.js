const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]
const giveName = process.argv[3]
const giveNumber = process.argv[4]

const url =
  `mongodb+srv://Phonebook:${password}@cluster0.nelfhyy.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

if (process.argv3 === undefined) {
  console.log('phonebook:')
  Number.find({}).then(result => {
    result.forEach(num => {
      console.log(`${num.name} ${num.number}`)
    })
    mongoose.connection.close()
  })
}
else{
  console.log(process.argv3)
  const num = new Number({
    name: giveName,
    number: giveNumber,
  })

  num.save().then(() => {
    console.log(`added ${num.name} number ${num.number} to phonebook`)
    mongoose.connection.close()
  })
}