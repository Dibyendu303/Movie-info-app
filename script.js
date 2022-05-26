const APIKEY = "627a19347ef253b473136dc21edb9995";
const APIURL_TV = `https://api.themoviedb.org/3/tv/popular?api_key=${APIKEY}&language=en-US&page=1`;
const APIURL_MOVIE = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`;

const IMGPATH = "https://image.tmdb.org/t/p/w342";
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const mainBody = document.querySelector("main");
const extraInfo = document.querySelector(".extraInfo");
const closeInfo = document.querySelector("#close-info");
const extraInfoContainer = document.querySelector(".extraInfo-container");
const searchInfo = document.querySelector(".searchInfo");
const closeSearch = document.querySelector("#close-search");
const searchHeading = document.querySelector(".extraInfo-container .heading");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(searchInput.value);
    searchMovies(searchInput.value);
    searchInput.value = "";
})

async function getGenreList() {
    const URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&language=en-US`;
    try {
        const resp = await fetch(URL);
        const respData = await resp.json();
        return respData.genres;
    } catch (error) {

    }
}

async function getMovieListByGenre(genreIDs) {
    const API_URL_GENRE = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&with_original_language=en&with_genres=${genreIDs}`;
    try {
        const resp = await fetch(API_URL_GENRE);
        const respData = await resp.json();
        // console.log(respData.results);
        return respData;
    } catch (error) {
        console.log(error);
    }
}

async function getMovieListBySearch(searchText) {
    const API_URL_SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${searchText}&page=1&with_original_language=en&include_adult=false`;
    try {
        const data = await fetch(API_URL_SEARCH);
        const respData = await data.json();
        // console.log(respData.results);
        return respData;
    } catch (error) {
        console.log(error);
    }
}


async function createContainer(genre) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML = `
        <span class="heading">${genre.name}</span>
        <div class="arrow"><i id="arrowBtn" class="fa-solid fa-angle-right"></i></div>
        <div class="movie-list"></div>`;

    const movieList = container.querySelector(".movie-list");

    const respData = await getMovieListByGenre(genre.id);
    respData.results.forEach((data) => {
        const movie = document.createElement("div");
        movie.classList.add("movie");

        const imgSrc = IMGPATH + data.poster_path;
        movie.innerHTML = `
        <img src="${imgSrc}" alt="">
        <div class="movie-info">
            <h3>${data.original_title}</h3>
            <span>${data.vote_average}</span>
        </div>        `;

        movie.addEventListener("click", () => {
            // console.log(data.original_title);
            showMovieInfo(data);
            extraInfo.classList.add("active");
        });

        movieList.appendChild(movie);
    })
    const arrowBtn = container.querySelector("#arrowBtn");
    arrowBtn.addEventListener("click", () => {
        showMore();
    })

    let index = 0;
    function showMore() {
        index++;
        if (index > 6) {
            index = 0;
        }
        movieList.style.transform = `translateX(${-324 * index}px)`;
    }

    mainBody.appendChild(container);
}

closeInfo.addEventListener("click", () => {
    extraInfo.classList.remove("active");

})


function showMovieInfo(data) {
    const imgSrc = IMGPATH + data.poster_path;
    extraInfoContainer.innerHTML = `
    <div class="imageArea">
        <img class="extraInfo-img"" src="${imgSrc}"
            alt="">
        <div class="info">
            <span class="info-title">${data.original_title}</span>
            <span>IMDB Rating: <small>${data.vote_average}</small></span>
            <span>Release date: <br> <small>${data.release_date}</small></span>
        </div>
    </div>
    <div class="movie-desc">${data.overview}</div>`;
}

async function createAllContainers() {
    const genreList = await getGenreList();
    genreList.forEach((genre) => {
        createContainer(genre);
    })
}
createAllContainers();

const searchMovieList = document.querySelector(".search-movie-list");
async function searchMovies(search) {
    searchInfo.classList.add("active");
    searchHeading.innerText = `Search results for "${search}"`;

    const respData = await getMovieListBySearch(search);
    // console.log(respData);
    searchMovieList.innerHTML = "";
    respData.results.forEach((data) => {
        // console.log(data.original_title);
        const movie = document.createElement("div");
        movie.classList.add("movie");

        const imgSrc = IMGPATH + data.poster_path;
        movie.innerHTML = `
        <img src="${imgSrc}" alt="">
        <div class="movie-info">
            <h3>${data.original_title}</h3>
            <span>${data.vote_average}</span>
        </div>        `;

        movie.addEventListener("click", () => {
            // console.log(data.original_title);
            showMovieInfo(data);
            extraInfo.classList.add("active");
        });

        searchMovieList.appendChild(movie);
    })
    // mainBody.appendChild(container);
}

closeSearch.addEventListener("click", () => {
    searchInfo.classList.remove("active");
})