//Функции
function debounce(fn, debounceTime) {
  let timeout;
  return function (...args) {
    const callee = () => fn.call(this, ...args);
    clearTimeout(timeout);
    timeout = setTimeout(callee, debounceTime);
  };
}

function createNewElement(tag, className, content = "") {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  element.textContent = content;
  return element;
}

//Инпут, селект и контейнер карточек
const searchInput = document.querySelector(".search__input");
const searchList = document.querySelector(".search__list");
const cardContainer = document.querySelector(".card-container");

// url https://api.github.com/search/repositories?q=
// props: name     owner.login     stargazers_count

//Fetch and render select
searchInput.addEventListener(
  "input",
  debounce((event) => {
    if (event.keyCode === 32) return;
    if (document.querySelector(".search__item")) {
      while (searchList.firstChild) {
        searchList.removeChild(searchList.firstChild);
      }
    }
    if (!searchInput.value) {
      while (searchList.firstChild) {
        searchList.removeChild(searchList.firstChild);
      }
      return;
    }
    fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`)
      .then((response) => response.json())
      .then((data) => {
        const reposArr = data.items.slice(0, 5);
        reposArr.forEach((repo) => {
          const list = createNewElement("li", "search__item", repo.name);
          const repoInfo = {
            repoName: repo.name,
            repoOwner: repo.owner.login,
            repoStars: repo.stargazers_count,
          };
          list.setAttribute("data-info", JSON.stringify(repoInfo));
          searchList.appendChild(list);
        });
      });
  }, 300)
);

searchList.addEventListener("click", (event) => {
  const card = createNewElement("div", "card");
  const cardInfo = createNewElement("div", "card__info");
  //Name
  const cardName = createNewElement(
    "p",
    null,
    `Name: ${JSON.parse(event.target.dataset.info).repoName}`
  );
  cardInfo.appendChild(cardName);
  //Owner
  const cardOwner = createNewElement(
    "p",
    null,
    `Owner: ${JSON.parse(event.target.dataset.info).repoOwner}`
  );
  cardInfo.appendChild(cardOwner);
  //Stars
  const cardStars = createNewElement(
    "p",
    null,
    `Stars: ${JSON.parse(event.target.dataset.info).repoStars}`
  );

  cardInfo.appendChild(cardStars);
  card.appendChild(cardInfo);
  cardContainer.appendChild(card);
  //Button
  const closeButton = document.createElement("button");
  closeButton.insertAdjacentHTML(
    "afterbegin",
    `<svg
              width="46"
              height="42"
              viewBox="0 0 46 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4" />
              <path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4" />
            </svg>`
  );
  card.appendChild(closeButton);

  searchInput.value = "";

  while (searchList.firstChild) {
    searchList.removeChild(searchList.firstChild);
  }
});

cardContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) button.closest("div").remove();
});
