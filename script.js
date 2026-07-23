let newsData = {};
const apikey = "zYnI1NVO5Y27ZPn5stsk7S3nx8BLvN8CTprtvAmxhX9r2Mx6";

const homeUrl = `https://api.currentsapi.services/v1/latest-news?language=en&apiKey=${apikey}`;


async function getNews(url) {
    document.getElementById("loading").style.display = "flex";
    let response = await fetch(url);
    let data = await response.json();
    document.getElementById("loading").style.display = "none"
    if(data.news){
        newsData = data;
        breakingNews(newsData);
        displayNews(newsData);
    }
    else{
        console.log("No news found");
    }
}
getNews(homeUrl);


function breakingNews(data) {
    let ticker = document.querySelector(".ticker");
    ticker.innerHTML = "";

    for (let i = 0; i < Math.min(2, data.news.length); i++) {
        let p = document.createElement("p");
        p.id = "breaking";
        p.textContent = data.news[i].title;
        ticker.appendChild(p);
    }
}

function displayNews(data) {
    let newsLength = 0;
    let cardContainer = document.querySelector(".cards-container");
    document.querySelectorAll(".news-card").forEach(card => card.remove());
    data.news.forEach((d) => {

        if (d.image) {
            let div = document.createElement("div");
            div.classList.add("news-card");

            let img = document.createElement("img");
            img.src = d.image;
            div.appendChild(img);

            let div2 = document.createElement("div");
            div2.classList.add("card-content");

            let span = document.createElement("span");
            span.classList.add("news-date");
            span.textContent = new Date(d.published).toLocaleString();
            div2.append(span)

            let h3 = document.createElement("h3");
            h3.classList.add("news-title");
            h3.textContent = d.title;
            div2.append(h3)

            let p = document.createElement("p");
            p.classList.add("news-description");
            p.textContent = d.description;
            div2.append(p);

            let btndiv = document.createElement("div")
            btndiv.classList.add("card-btn");

            let readbtn = document.createElement("button");
            let a = document.createElement("a");
            readbtn.classList.add("read-btn");
            a.href = d.url;
            a.textContent = "Read More";
            readbtn.appendChild(a)

            let sharebtn = document.createElement("button")
            sharebtn.classList.add("share-btn");
            let icon = document.createElement("i");
            icon.className = "fa-solid fa-share";
            sharebtn.appendChild(icon);

            sharebtn.addEventListener("click", () => {
                if (navigator.share) {
                    navigator.share({
                        title: d.title,
                        text: d.description,
                        url: d.url
                    })
                        .then(() => console.log("News shared"))
                        .catch((error) => console.log(error));
                } else {
                    navigator.clipboard.writeText(d.url);
                    alert("News link copied!");
                }
            });

            btndiv.appendChild(readbtn);
            btndiv.appendChild(sharebtn);


            div.appendChild(div2);
            div.appendChild(btndiv);
            cardContainer.prepend(div);
            newsLength++;
        }
    })


    if (newsLength % 4 != 0) {
        document.querySelector(".no-more-news").style.display = "flex";
    }
    else {
        document.querySelector(".no-more-news").style.display = "none";
    }
}

function searchFunction() {
    let searchbtn = document.getElementById("searchbtn");
    let searchinput = document.getElementById("searchinput");

    searchbtn.addEventListener("click", () => {
        let searchValue = searchinput.value.trim();

        if (searchValue) {
            const searchUrl = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(searchValue)}&apiKey=${apikey}`;
            getNews(searchUrl);
            searchinput.value = "";
        }
    })
}
searchFunction();


const categories = document.querySelectorAll("#alllist li");

categories.forEach((category) => {
    category.addEventListener("click", () => {

        let categoryName = category.innerText.toLowerCase();

        const categoryUrl = `https://api.currentsapi.services/v1/latest-news?category=${categoryName}&apiKey=${apikey}`;


        getNews(categoryUrl);

    });
});


















