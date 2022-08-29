import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

function searchCountries(e) {
  const inputValue = e.target.value.trim().toLowerCase();
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  if (inputValue.length > 0) {
    fetchCountries(inputValue)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        } else if (countries.length > 1) {
          renderAllCountries(countries);
        } else {
          renderCountry(countries);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return console.log(error);
      });
  }
}
function renderAllCountries(country) {
  const markup = country
    .map(country => {
      return `<li><img src='${country.flags.svg}' width='40'/><p>${country.name.official}</p></li>`;
    })
    .join('');
  countryInfo.innerHTML = '';
  countryList.innerHTML = markup;
}

function renderCountry(country) {
  const markup = country
    .map(country => {
      return `<img src='${country.flags.svg}' width='100'/><p>${
        country.name.official
      }</p>
<p>Capital: ${country.capital}</p><p>Population: ${
        country.population
      }</p><p>Languages: ${Object.values(country.languages)}</p>`;
    })
    .join('');
  countryList.innerHTML = '';
  countryInfo.innerHTML = markup;
}

searchInput.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);
