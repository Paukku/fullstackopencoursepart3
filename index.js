const { response } = require('express')
const express = require('express')
const app = express()

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5434534"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6523122"
    },
]

app.use(express.json())

const generateID = () => {
    const maxId = Math.floor(Math.random() * 2000)
    return maxId
  }

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (reg, res) => {
    const id = Number(reg.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }
    else {
        res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (reg, res) => {
    const id = Number(reg.params.id)
    console.log(id)
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
  })

  app.get('/info', (reg, res) => { 
    res.send(`<p>Phonebook has info for ${persons.length} people.</p>` + new Date())
  })
  
  app.post('/api/persons', (reg, res) => {
    const body = reg.body
    const sameName = persons.filter(person => person.name === body.name).length

    if(!body.name || !body.number) {
        return res.status(400).json({error: 'Name or number missing'})
    }

    if(sameName > 0) {
        return res.status(400).json({error: 'Name must be unique'})
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    res.json(persons)
  })


  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })