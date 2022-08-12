const modal = document.getElementById("modal");
const modalShow = document.getElementById("modal-show");
const modalClose = document.getElementById("modal-close");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteUrlEl = document.getElementById("website-url");
const websiteNameEl = document.getElementById("website-name");
const bookmarkContainer = document.querySelector(".container");

let bookmarks = [];

const showModal = () => {
  modal.classList.add("modal-show");
  websiteNameEl.focus();
};

const closeModal = () => modal.classList.remove("modal-show");

// Validate form
const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please fill out both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid webadress");
    return false;
  }
  //   Valid
  return true;
};

// Fetch bookmarks from localstorage

const fetchBookmarks = function () {
  if (localStorage.getItem("bookmarks"))
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  else {
    bookmarks = [
      {
        name: "Jacinto Design",
        url: "https://jacinto.design",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

const buildBookmarks = () => {
  bookmarkContainer.textContent = "";
  bookmarks.map((bookmark) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fa-solid", "fa-trash");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

    // Favicon / Link container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarkContainer.appendChild(item);
  });
};

const deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, i) => {
    bookmark.url === url ? bookmarks.splice(i, 1) : null;
  });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) return false;

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

// Event Listeners

// Modal Open
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  e.target === modal ? modal.classList.remove("modal-show") : null;
});

bookmarkForm.addEventListener("submit", storeBookmark);

// On load
fetchBookmarks();
