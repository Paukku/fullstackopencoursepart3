const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'User name must be at least 3 letter']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2}-\d{6}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'User phone number required']
  }
})

numberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Number', numberSchema)