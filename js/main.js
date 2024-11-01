/********************************************************************************* * 
 * WEB422 – Assignment 2 * 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. * 
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. * 
 * Name: Luwam Goitom-Worre     Student ID: 156652224   Date: October 18,2024 * 
 * ********************************************************************************/
let page = 1;
const perPage = 10;
const base = "https://movies-luwams-projects.vercel.app/"

function loadMovieData(title) {
    const url = title ? `${base}/api/movies?page=${page}&perPage=${perPage}&title=${encodeURIComponent(title)}` : `${base}/api/movies?page=${page}&perPage=${perPage}`;
    
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(data => updateTable(data))
        .catch(err => console.error(`failed to load movies: ${err}`));
}

function updateTable(data) {
    const body = document.querySelector("table tbody");
    if (!body) {
        return console.error("table body not found");
    }

    body.innerHTML = data.map(movie => createRow(movie)).join("");

    document.querySelector("#previous-page").disabled = page === 1;
    document.querySelector("#current-page").innerHTML = page;
    document.querySelector("#next-page").disabled = data.length < perPage;
}

function createRow({ _id, year = 'N/A', title = 'N/A', plot = 'N/A', rated = 'N/A', runtime = 0 }) {
    const hours = Math.floor(runtime / 60);
    const minutes = String(runtime % 60).padStart(2, '0');
    
    return `<tr data-id="${_id}">
            <td>${year}</td>
            <td>${title}</td>
            <td>${plot}</td>
            <td>${rated}</td>
            <td>${hours}:${minutes}</td>
            </tr>`;
}

function loadMovieDetails(movieId) {
    fetch(`/api/movies/${movieId}`)
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(movie => showMovieDetails(movie))
        .catch(err => console.error(`failed to load movie details: ${err}`));
}

function showMovieDetails(movie) {
    const { title, poster, directors, plot, cast, awards, imdb } = movie;
    const modalBody = document.querySelector("#detailsModal .modal-body");

    if (!modalBody) {
        return;
    }

    document.querySelector("#detailsModal .modal-title").textContent = title;
    modalBody.innerHTML = 
       `<img class="img-fluid w-100" src="${poster}" alt="${title}"><br><br>
        <strong>Directed By:</strong> ${directors.join(", ")}<br><br>
        <p>${plot}</p>
        <strong>Cast:</strong> ${cast.join(", ")}<br><br>
        <strong>Awards:</strong> ${awards.text}<br>
        <strong>IMDB Rating:</strong> ${imdb.rating} (${imdb.votes} votes)`;

    const modal = new bootstrap.Modal(document.querySelector("#detailsModal"));
    modal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    loadMovieData();

    document.querySelector("#previous-page").addEventListener("click", () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    document.querySelector("#next-page").addEventListener("click", () => {
        page++;
        loadMovieData();
    });

    document.querySelector("#searchForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.querySelector("#title").value.trim();
        loadMovieData(title);
    });

    document.querySelector("#clearForm").addEventListener("click", () => {
        document.querySelector("#title").value = '';
        loadMovieData();
    });

    document.querySelector("table tbody").addEventListener("click", (event) => {
        const row = event.target.closest("tr");
        if (row.dataset.id) {
            loadMovieDetails(row.dataset.id);
        }
    });
});
