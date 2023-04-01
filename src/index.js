import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 500;


const refs = {
    countryList: document.querySelector('.country-list'),
    searchInput: document.querySelector('#search-box'),
    countryCard: document.querySelector('.country-info'),
}

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
let searchQuery = '';

function onSearch() {
    clear();
    searchQuery = refs.searchInput.value.trim();

    if (searchQuery === '') {
        return;
    } else {
        fetchCountries(searchQuery)
            .then(countryNames => {
                console.log(countryNames);
                if (countryNames.length === 1) {
                    createCardMarkup(countryNames);
                } else if (countryNames.length > 1 && countryNames.length < 10) {
                    createListMarkup(countryNames);
                } else {
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                }
            })
            .catch(() => {
                Notiflix.Notify.failure('oops');
            })
    }
}


function clear() {
    refs.countryCard.innerHTML = '';
    refs.countryList.innerHTML = '';
}


function createListMarkup(countries) {
    console.log(countries);
    const listMarkup = countries
        .map(({ name, flags }) => {
            return `<li class="country-item">
                <img src="${flags.svg}" alt="${flags.alt}" class="flag" width="50"/>
                <span class="country-name">${name}<span>
             </li>`

        }).join('');

    refs.countryList.insertAdjacentHTML('afterbegin', listMarkup);
}


function createCardMarkup(countries) {
    console.log(countries);
    const cardMarkup = countries.map(({ name, capital, population, languages, flags }) => {
        return `
            <img class="flag-img" src="${flags.svg}" alt="Flag" width="60", height="30">
        <div>  
            <h2 class="country-title"> ${name}</h2>
            <p class="descr"><b>Capital:</b> ${capital}</p>
            <p class="descr"><b>Population:</b> ${population}</p>
            <p class="descr"><b>Languages:</b> ${languages[0].name}</p>
        </div> 
       `
    }).join(' ');

    refs.countryCard.insertAdjacentHTML('afterbegin', cardMarkup);
}
