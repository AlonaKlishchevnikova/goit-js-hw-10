import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  listEl: document.querySelector('.country-list'),
  cardEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onSerchInput, DEBOUNCE_DELAY));

function onSerchInput() {
  const trimmedValue = refs.inputEl.value.trim();
  refs.cardEl.innerHTML = '';
  refs.listEl.innerHTML = '';
  if (trimmedValue !== '') {
    fetchCountries(trimmedValue)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
       
          return;
        }
        if (countries.length <= 10) {
          renderCountriesList(countries);
          refs.cardEl.innerHTML = '';
        }

        if (countries.length === 1) {
          cardCountry(countries);
          refs.listEl.innerHTML = '';
        }
        if (countries.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
     
        return error;
      });
  }
};
function renderCountriesList(countries)
{refs.listEl.innerHTML = countries
            .map(country => {
              return `
  <li class="country-list__item">
    <img class="country-list__flags" src="${country.flags.svg}" alt="${country.name.official}" width="50" />
    <h2 class="country-list__name">${country.name.official}</h2>
  </li>
  `;
            })
            .join('');
};
function cardCountry(countries) {
   refs.cardEl.innerHTML = countries
            .map(country => {
              console.log(country);
              return `
    <div class="country-info__container">
      <div class="country-info__wrapper">
        <img class="country-info__flags" src="${country.flags.svg}" alt="${country.name.official
                }" width="100" />
        <h2 class="country-info__name">${country.name.official}</h2>
      </div>
      <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${country.capital
                }</p>
      <p class="country-info__population"><span class="country-info__weight">Population:</span> ${country.population
                }</p>
      <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
                  country.languages
                )}</p>
    </div>
  `;
            })
            .join('');
}
