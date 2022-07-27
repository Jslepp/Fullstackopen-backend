require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')
const person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('build'))

app.use(requestLogger)

app.use(cors())

app.use(express.json())

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens[console.log(req.body)]
    ].join(' ')
  }))

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
    
  })
  app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })

  app.get('/info', (req, res) => {
    res.send("Phonebook has info for " +  `${persons.length}` + " people <br/>" +`${Date()}`)
    
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })
  
  app.post('/api/persons', (req,res) => {
    const body = req.body
    

    if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }
    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    if (persons.map(person => person.name).indexOf(body.name) !== -1) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = new Person( {
        name: body.name,
        number: body.number,
        id:  Math.floor(Math.random()*10000000)
    })
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })