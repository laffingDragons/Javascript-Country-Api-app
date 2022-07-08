

function getCountries(url) {
    return new Promise((resolve, reject)=>{
        fetch(url).then(res=>{
            resolve(res);
        }).catch(err=>{
            console.log("Some error occured",err);
        })
    })
}



function renderView(data) {
    const currentDiv = document.getElementById("container");
    currentDiv.innerHTML = '';
    console.log(data);
    data.map(x=>stichCard(x));
};


// Make card and attach it to view
function stichCard(cardData){
    const newDiv = document.createElement("div");
    newDiv.className = 'card mt-4 animate__animated animate__slideInUp';
    const newContent = `
        <img src="${cardData.flags.svg ? cardData.flags.svg : ''} " alt="" srcset="" width="100%">
        <div class="card-title row space-between">${cardData.name.common ? cardData.name.common : ''} 
            <div class="restaurent-rating">${cardData.population ? cardData.population : ''}</div>
        </div>

        <div class="Eta row space-between">
        ${cardData.capital ? cardData.capital[0] : ''}
       
            <div class="card-tags">  ${cardData.timezones[0] ? cardData.timezones[0] : ''}
            </div>
        </div>
    `;
    newDiv.innerHTML = newContent;
    const currentDiv = document.getElementById("container");
    currentDiv.appendChild(newDiv);
}


//Function to render tags for filteration
function renderTags(){
    let countriesList = getDataInLocalStorage('countriesList');
    findContinent(countriesList).map(x=>{
        let newDiv = document.createElement('div');
        newDiv.className = 'tags animate__animated animate__slideInRight';
        newDiv.id = x;
        let content = x;
        newDiv.innerHTML = content;
        const currentDiv = document.getElementById('tags');
        currentDiv.appendChild(newDiv);

        creatClickEvent(x);
    });
}


//click event for filteration
function creatClickEvent(id){
    console.log("🚀 ~ file: script.js ~ line 65 ~ creatClickEvent ~ id", id);
    let currentTag = document.getElementById(id)
    currentTag.addEventListener('click', (ev)=>{
        let data = getDataInLocalStorage('countriesList');
        if(id !== "All"){
            data = _.filter(data, function(o) { return o.continents[0] === id; });
        };
        var elements = document.getElementsByClassName('active-tag');
        while(elements.length > 0){
            elements[0].classList.remove('active-tag');
        }
        currentTag.className = "active-tag tags"
        renderView(data);
    })
}



//map through all the countries and find continents
function findContinent(countriesList){
    return countriesList.reduce((acc, curr)=>{
        if(curr['continents'] && !acc.includes(curr['continents'][0])){
            acc.push(curr['continents'][0])
        }
        return acc
    }, ['All'])
}


// Listen to dom ready event and make an api  call 
document.addEventListener("DOMContentLoaded", ()=>{
    getCountries('https://restcountries.com/v3.1/all')
        .then(res=>res.text())
        .then(data=>{
            data = JSON.parse(data)
            data = _.sortBy(data, function(x){return x.name.common})
            setDataInLocalStorage('countriesList', data);
            renderView(data);
            renderTags();
        });
})

//FUcntion to set data in localstorage
function setDataInLocalStorage(key, data) {
    return  localStorage.setItem(key, JSON.stringify(data));
}

//FUcntion to get data in localstorage
function getDataInLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}


//Filter on search and debounce method starts here

const filterSearch = debounce(search, 300);

function search() {
    let word = document.getElementById('input-search').value.toLowerCase()
    console.log("🚀 ~input-search", word);
    let data = getDataInLocalStorage('countriesList');
    if(word){
        data = _.filter(data, function(o) { 
            let match = o.name.common.toLowerCase()
            return match.includes(word); 
        });
    };
    renderView(data);
}

function debounce(fn, t) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            search();
        }, t);
    }
}