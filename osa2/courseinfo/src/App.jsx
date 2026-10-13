import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = (props) => {
  return (
    <div>
      filter shown whith:
      <input 
      value={props.filter}
      onChange={props.handleFilterChange}
      />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>
          name: 
          <input 
            value={props.newName}
            onChange={props.handleNameChange}
          />
        </div>

        <div>
          number:
          <input 
          value={props.newNumber}
          onChange={props.handleNumberChange}
           />
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.persons.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => props.removePerson(person)}>delete</button>
        </p>
      )}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}  

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {

      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (confirmReplace) {
        const changedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
        .update(existingPerson.id, changedPerson)
        .then(response => {
          setPersons(
            persons.map(person =>
              person.id !== existingPerson.id ? person : response.data
            )
          )
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Updated ${response.data.name}`)

          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })

         .catch(error => {
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            )

          setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

          setPersons(
            persons.filter(person => person.id !== existingPerson.id)
          )
        })
        

        return
      }

        return
      
    }

    const personObject = {
      name: newName,
      number: newNumber
    }


    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(`Added ${response.data.name}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
  })
    .catch(error => {
    setErrorMessage(error.response?.data?.error || 'Failed to add person')

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  })
}

  const removePerson = (person) => {
      if (window.confirm(`Delete ${person.name}?`)) {
        personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setNotificationMessage(`Deleted ${person.name}`)

          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
      }
    }

  const personsToShow = filter === ''
  ? persons
  : persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} />

      <ErrorNotification message={errorMessage} />

      <Filter
        filter={filter}
        handleFilterChange={(event) => setFilter(event.target.value)}
      />
      
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
      />
      <h2>Numbers</h2>
      
      <Persons 
      persons={personsToShow} 
      removePerson={removePerson}
      />

    </div>
  )

}

export default App