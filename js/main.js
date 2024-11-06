//	&#9206; up arrow
 
//https://developer.edamam.com/edamam-docs-recipe-api

let currentPage = 0;
let currentLink = "";
let nextPageLink = "";
let previousPageLinks = [];
let totalPages = 0;

function getLink(caller){

    switch(caller){
        case "nextBtn":
            if(nextPageLink){
                if(currentPage === previousPageLinks.length+1){
                    previousPageLinks.push(currentLink);
                }
                if(currentPage !== totalPages){
                    currentPage ++;
                }
                currentLink = nextPageLink;
                return nextPageLink;
            }
            return false;
        case "previousBtn":
            if(currentPage > 1) {
                currentPage --;
                return previousPageLinks[currentPage-1];
            }
            return false;
        case "searchBtn":
            currentPage = 1;
            previousPageLinks = [];
            const addedFilters = checkFilterSelection();
            const searchValue = "q=" + document.getElementById("searchField").value;
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
            
            if(response.status === 429){
                document.getElementById("recipesContainer").innerHTML = "<h2>Just nu är det högt tryck på servern. Vänta 1 minut och prova igen</h2>";
                throw new Error (`HTTP error code: ${response.status}, HTTP error message: Reached limit of more than 10 calls per minute.`);

            }
            else{
                console.log(`HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`);
                throw new Error (`HTTP error code: ${response.status}, HTTP error message: ${response.statusText}`);
            }

        }
            
        const data = await  response.json();
        return data;

    }catch(error){
        console.log(`Error: ${error.status}, ${error.message}`);
    }
}

function addRecipeCard(api_data){

    const hits = api_data.hits;
    
    const recipeCard = hits.map((element) => {

        return recipeData = `<article class="recipeBox"><a href="${element.recipe.url}">
            <img src="${element.recipe.image}" alt="Här ska det vara en bild">
            <section class="recipeSlideText">
                <h2>${element.recipe.label}</h2>
                <div class="recipeDetails">
                <p class="smallInfo divider"><span>${Math.round(element.recipe.calories)}</span> Calories</p>
                <p class="smallInfo divider"><span>${element.recipe.ingredients.length}</span> Ingredients</p>
                <p class="smallInfo">${showCookingTime(element.recipe.totalTime)}</p>
                </div>
            </section></a>
        </article>`
    }).join("");

    document.getElementById("recipesContainer").innerHTML = recipeCard;
    document.getElementById("pageNumber").innerText = `Page ${currentPage} of ${totalPages}`;
}

function checkFilterSelection(){
    const dietValuesArr = document.querySelectorAll("input[name=diet]");
    const allergiesFilterArr = document.querySelectorAll("input[name=health]");
    const mealTypeArr = document.querySelectorAll("input[name=mealType]");
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

    if(hours && minutes) return `<span>${hours}</span> h and <span>${minutes}</span> min`;
    else if (hours && !minutes) return `<span>${hours} h`;
    else if (!hours && minutes) return `<span>${minutes}</span> min`;
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
        
        totalPages = Math.ceil(data.count/20);
        addRecipeCard(data);
        }
    }
}