import { useState, useEffect } from 'react'
import axios from 'axios' 

const apiKey = import.meta.env.VITE_WEATHER_KEY

const Countries = ({ countries, handleShow, weather }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length === 1) {
    const country = countries[0]

    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>

        <h3>languages:</h3>

        <ul>
          {Object.values(country.languages).map(language =>
            <li key={language}>
              {language}
            </li>
          )}
        </ul>

        <img
          src={country.flags.png}
          alt={`flag of ${country.name.common}`}
          width="150"
        />

        {weather && (
          <div>
            <h2>Weather in {country.capital[0]}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <p>Wind {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {countries.map(country =>
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShow(country)}>
            Show
            </button>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0]
      const capital = country.capital[0]

      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
        )
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [filteredCountries])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const handleShow = (country) => {
  setSearch(country.name.common)
}

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />

      <Countries 
      countries={filteredCountries}
      handleShow={handleShow} 
      weather={weather}
      />
    </div>
  )
}

export default App