/**
 *  OMDb template
 *	Documentation: http://www.omdbapi.com/
 *  Generate an API key here: http://www.omdbapi.com/apikey.aspx
 */


/**
* According to documentation, you need at least 2 parameters when calling the API http://www.omdbapi.com/
* 1 Required parameter: apikey
* 2 Required parameter: One of the following i=, t= or s=
*
* 
* Example with parameter s=star trek
* http://www.omdbapi.com/?apikey=[yourkey]&s=star trek
*
* Example with parameter s=star trek AND y=2020
* http://www.omdbapi.com/?apikey=[yourkey]&s=star trek&y=2020
*
* Example with parameter s=star trek AND type=series
* http://www.omdbapi.com/?apikey=[yourkey]&s=star trek&type=series
*
*/
//let url = 'http://www.omdbapi.com/?apikey=[yourkey]=star trek';

//	&#9206; up arrow
 
//https://developer.edamam.com/edamam-docs-recipe-api

let currentPage = 0;
let currentLink = "";
let nextPageLink = "";
let previousPageLinks = [];

function getLink(caller){

    switch(caller){
        case "nextBtn":
            if(nextPageLink){
                if(currentPage === previousPageLinks.length){
                    previousPageLinks.push(currentLink);
                }
                currentLink = nextPageLink;
                currentPage ++;
                return nextPageLink;
            }
            break;
        case "previousBtn":
            if(previousPageLinks.length > 1) {
                currentPage --;
                return previousPageLinks[currentPage];
            }
            break;
        case "searchBtn":
            currentPage = 0;
            previousPageLinks = [];
            const addedFilters = checkFilterSelection();
            const searchValue = "&q=" + document.getElementById("searchField").value;
            const id = "app_id=3084edd9";
            const key="app_key=7114784343669c87f0effc510b0e4879";
            currentLink = `https://api.edamam.com/api/recipes/v2?type=any&beta=false&${id}&${key}&${searchValue}${addedFilters}`; 
            return currentLink;
        default:
            return false;
    }
}



async function fetchData(link){
    
    try{
        const response = await fetch(link);
        if(!response.ok) {
            
            throw new Error (`HTTP error code: ${response.error}, HTTP error message: ${response.statusText}`);
        }
            
        const data = await  response.json();
        return data;

    }catch(error){
        console.log(error, error.message);
    }
}

function addRecipeCard(api_data){

    const hits = api_data.hits;
    
    const recipeCard = hits.map((element) => {

        return recipeData = `<article class="recipeBox">
            <img src="${element.recipe.image}" alt="Här ska det vara en bild">
            <section class="recipeSlideText">
                <h2>${element.recipe.label}</h2>
                <p class="smallInfo divider"><span>${Math.round(element.recipe.calories)}</span> Calories</p>
                <p class="smallInfo divider"><span>${element.recipe.ingredients.length}</span> Ingredients</p>
                <p class="smallInfo">${showCookingTime(element.recipe.totalTime)}</p>
            </section>
        </article>`
    }).join("");

    document.getElementById("recipesContainer").innerHTML = recipeCard;
}

function checkFilterSelection(){
    const dietValuesArr = document.querySelectorAll(".filterSection input[name=diet]");
    const allergiesFilterArr = document.querySelectorAll(".filterSection input[name=health]");
    const mealTypeArr = document.querySelectorAll(".filterSection input[name=mealType]");
    let filterValues = "";

    dietValuesArr.forEach((selection) => {
        if (selection.checked === true) filterValues += "&diet=" + selection.value;
    });

    allergiesFilterArr.forEach((selection) => {
        if (selection.checked === true) filterValues += "&health=" + selection.value;
    });
    
    mealTypeArr.forEach((selection) => {
        if (selection.checked === true) filterValues += "&mealType=" + selection.value;
    });

    return filterValues;
}


function showCookingTime(time){
    const minutes = time % 60;
    const hours = Math.floor(time/60);

    if(hours && minutes) return `${hours} h and ${minutes} min`;
    else if (hours && !minutes) return `${hours} h`;
    else if (!hours && minutes) return `${minutes} min`;
    else return "n/a";
}

async function getRecipes(caller){
    const currentLink = getLink(caller);

    if(currentLink){
        const data = await fetchData(currentLink);
        
        if(!data.hits.length){
            const emptySearchErrorMessage = "<h2>No recipes found</h2>"
            document.getElementById("recipesContainer").innerHTML = emptySearchErrorMessage;
        } else 
        {
            if(data._links.next){
            nextPageLink = data._links.next.href;
            }
        
        addRecipeCard(data);
        }
    }
}

 function showHideMenu(e){
    const dropDownMenu = e.target.parentElement.children[1]
    if(dropDownMenu.style.display === ""){
        dropDownMenu.style.display = "block";
        console.log("show");
    } else {dropDownMenu.removeAttribute("style");
        console.log("test");
    }
 }