const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.gitgnore/.env') })

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const Number = require('./models/number')
const { response } = require('express')
//const { NOTFOUND } = require('dns')
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :body'))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Number.find({}).then(number => {
    res.json(number)
  })
})

app.get('/api/persons/:id', (reg, res) => {
  Number.findById(reg.params.id)
    .then(number => {
      if(number) {
        res.json(number)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (reg, res, next) => {
  console.log(reg.params.id)
  Number.findByIdAndRemove(reg.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (reg, res) => {
  res.send(`<p>Phonebook has info for ${Number.length} people.</p>` + new Date())
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if(body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'Name or number missing' })
  }

  const person = new Number({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savePerson => {
      res.json(savePerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (reg, res, next) => {
  const { name, number } = reg.body

  Number.findByIdAndUpdate(reg.params.id,
    { name, number },
    { new: true, runValidators: true, name: 'query' }
  )
    .then(updateNumber => {
      res.json(updateNumber)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${ PORT }`)
})