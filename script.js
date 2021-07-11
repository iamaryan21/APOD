const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// API
const count = 15;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favourites = {};

function createDOM(page){
    const currentArray = page === 'results' ? resultArray : Object.values(favourites);
    //forEach condition can only be used with an array but favourites is a JS object. Object.values() returns an array of a given object's property.

    currentArray.forEach((result) => {
        
        //Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        
        //Link element
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View in full screen.'
        link.target = '_blank';
        
        //Image element
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA APOD'
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        
        //Save Item Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results')
        {
            saveText.textContent = 'Add To Saved Items';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        }
        else
        {
            saveText.textContent = 'Remove From Saved Items';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }

        //Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        //Footer Content
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        const date = document.createElement('strong');
        date.textContent = `Date: ${result.date}  `;

        const resultCopyright = result.copyright === undefined ? 'Not Available' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `    Copyright: ${resultCopyright}`;

        //Appending all the contnet
        card.append(link,cardBody);

        //Using append attribute, we can add more than 1 container while with appendChild, we can add only 1 container.

        link.appendChild(image);
        cardBody.append(cardTitle, saveText, cardText, footer);
        footer.append(date, copyright);

        imagesContainer.appendChild(card);
        console.log(card);
    });
}
function updateDOM(page){
    
    //Get Favourites from localStorage
    if(localStorage.getItem('nasaFavourites'))
    {
        //JSON.parse() changes data from string to JavaScript object.

        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
    }

    //Remove all elements appended to the container previously. Done for resetting the page.
    imagesContainer.textContent = '';
    createDOM(page);

    //window.scrollTo is used for scrolling to the top of the page everytime the page reloads.
    window.scrollTo({ top: 0, behavior: 'instant'});
}

// Asynchronous Fetch Request to get photos

async function getNasaPictures() {
    try{
        const response = await fetch(apiURL);
        resultArray = await response.json();
       // console.log(resultArray);
        updateDOM('results');
    }catch (error){
        console.log(error);
    }
}

//Add to saved items.
function saveFavourite(imageURL)
{
    //Loop through the results array
    resultArray.forEach((item) => {
        if(item.url.includes(imageURL) && !favourites[imageURL]){
            favourites[imageURL] = item;
            //Show Save confirmation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            //Set favourites in local storage.
            //JSON.stringify() converts JavaScript object to string as JSON stroes data in string format only.
            localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        }
    });
}

function removeFavourite(imageURL){
    if(favourites[imageURL]) {
        delete favourites[imageURL];
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

//Run the function when the page loads
getNasaPictures();