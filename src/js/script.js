import alphabetLetters from "../json_files/alphabet.json";
import words from "../json_files/words.json";
import copyIcon from "../images/copy.png";
import refreshIcon from "../images/refresh.png";
import { renderObject, renderPopup } from "./view/render";
import checkIcon from "../images/check-mark.png";
import errorIcon from "../images/error.png";
import getAllIcon from "../images/getall.png";
import { cipherConv as encryptFunction, calcCorrectShift } from "./model";

const data = { alphabetLetters, words };
const images = { copyIcon, refreshIcon, checkIcon, errorIcon, getAllIcon };

var cipherForm = document.getElementById("cipherForm");
document.getElementById("currentYear").textContent = new Date().getFullYear();

const userInput = document.querySelector(".user-input");
const submit = document.querySelector(".submit");
const numInput = document.querySelector(".num-input ");
const clearButton = document.querySelector(".clear-button");

let userString = "";
let submitCounter = 0;

export const getAll = async function () {
  document.querySelector(".lds-ring").classList.remove("display-none");
  document.querySelector(".buttons-index").innerHTML = "";
  document.querySelector(".card").classList.add("display-none");

  const conversions = await encryptFunction(userString, data);
  const sortedArray = await calcCorrectShift(data.words, conversions)
    .then((sortedArray) => {
      setTimeout(() => {
        document.querySelector(".lds-ring").classList.add("display-none");
        document.querySelector(".user-input").classList.remove("display-none");
        document
          .querySelector(".plain-text-before")
          .classList.remove("plain-text-before");
        document.querySelector(".plain-text").classList.add("plain-text-after");
        document.querySelector(".index").classList.remove("index");

        let objectStatus = "encrypt";

        let object = {
          sortedArray,
          objectStatus,
        };

        renderObject(object, images);
      }, 2500);
      // console.log(sortedArray);
    })
    .catch(() => {
      const errorObject = {
        image: images.errorIcon,
        status: 403,
        str: "Issue Detected!",
      };
      renderPopup(errorObject);
    });
};

clearButton.addEventListener("click", function (event) {
  event.preventDefault();
  const inputField = document.querySelector(".user-input");
  inputField.value = "";
});

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("try-again")) {
      tryAgain();
    }
    if (event.target.classList.contains("copy-icon")) {
      copyText(event.target);
    }
    if (event.target.classList.contains("get-all")) {
      getAll();
    }
  });
});

// copies the text (encrypted) to the clipboard
const copyText = function (clickedElement) {
  const textToCopy =
    clickedElement.parentNode.querySelector("#matchText").innerText;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      const renderPopupObject = {
        image: images.checkIcon,
        status: 200,
        str: "Text copied!",
      };
      renderPopup(renderPopupObject);
    })
    .catch((e) => {
      const errorObject = {
        image: images.errorIcon,
        status: 403,
        str: "Issue Detected!",
      };
      console.log(e);
      renderPopup(errorObject);
    });
};

const tryAgain = function () {
  const buttonsAfter = document.querySelector(".buttons-index");
  const card = document.querySelector(".card");
  const userInput = document.querySelector(".user-input");

  buttonsAfter.classList.add("display-none");
  card.classList.add("display-none");
  userInput.classList.remove("display-none");
};

userInput.addEventListener("input", function () {
  if (userInput.value.trim() !== "") {
    submit.style.visibility = "visible";
    submit.style.opacity = 1;

    clearButton.style.visibility = "visible";
    clearButton.style.opacity = 1;

    numInput.style.visibility = "visible";
    numInput.style.opacity = 1;
  } else {
    submit.style.visibility = "hidden";
    submit.style.opacity = 0;

    clearButton.style.visibility = "hidden";
    clearButton.style.opacity = 0;

    numInput.style.visibility = "hidden";
    numInput.style.opacity = 0;
  }
});

cipherForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var userInputText = document.querySelector(".user-input").value;
  var userShift = +document.querySelector(".input-number").value;
  var spinner = document.querySelector(".lds-ring");
  var userInputField = document.querySelector(".user-input");
  var cardContainer = document.querySelector(".card-container");

  userString = userInputText;

  if (userInputText.trim() == "" || !Number.isInteger(userShift)) {
    console.log(Number.isInteger(userShift));
    const errorObject = {
      image: images.errorIcon,
      status: 403,
      str: "Invalid Input!",
    };
    renderPopup(errorObject);
  } else {
    submitCounter++;

    document.querySelector(".card-container").classList.add("index");

    if (submitCounter > 1) {
      if (document.querySelector(".plain-text-after")) {
        document
          .querySelector(".plain-text-after")
          .classList.remove("plain-text-after");
        document
          .querySelector(".plain-text")
          .classList.add("plain-text-before");
      }
    }

    cardContainer.innerHTML = "";
    document.querySelector(".user-input").value = "";

    submit.style.visibility = "hidden";
    clearButton.style.visibility = "hidden";
    numInput.style.visibility = "hidden";

    spinner.classList.remove("display-none");
    userInputField.classList.add("display-none");

    setTimeout(() => {
      spinner.classList.add("display-none");
    }, 1500);

    cipherConv(userInputText, userShift, data.alphabetLetters)
      .then((arr) => {
        let decryptText = arr.cipherStr;
        let userShift = arr.shiftNumber;

        // reduced the timeout from 2.5s to 1.5s
        setTimeout(() => {
          renderString(decryptText, userShift, images);
        }, 1500);
      })
      .catch((e) => {
        const errorObject = {
          image: images.errorIcon,
          status: 403,
          str: "Issue Detected!",
        };
        console.log(e);
        renderPopup(errorObject);
      });
  }
});

async function cipherConv(userInput, shiftNumber, alphabetLetters) {
  let alphabetData = alphabetLetters;
  let userInputArr = userInput.split("");
  let cipherArr = [];

  // instead of storing it in an array, could have simply stored it in a variable as a string, welp wtv
  let decodeArr = userInputArr.map((char) => {
    const lettersArray = alphabetData.items.map((item) => item.word);
    if (lettersArray.includes(char.toLowerCase())) {
      let item = alphabetData.items.find(
        (item) => item.word === char.toLowerCase()
      );
      if (item) {
        let index = item.index;

        let newIndex = (index + shiftNumber - 1) % 26;

        let newItem = alphabetData.items.find(
          (item) => item.index === newIndex + 1
        );
        if (newItem) {
          cipherArr.push(
            char === char.toUpperCase()
              ? newItem.word.toUpperCase()
              : newItem.word
          );
        }
      }
    } else {
      cipherArr.push(char);
    }
  });

  // console.log(cipherArr.join(""));
  let cipherStr = cipherArr.join("");

  // Chose to return an object, just bcz its easier to iterate through the values.
  return { cipherStr, shiftNumber };
}

// this is where the manipulation happens
async function renderString(str, userShift, imgObject) {
  var cardContainer = document.querySelector(".card-container");
  var copyImg = imgObject.copyIcon;
  var refreshImg = imgObject.refreshIcon;

  const card = `
                <div class="card">
                  <img src="${copyImg}" class="copy-icon" alt="Copy to clipboard">
                  <div class="card-content">
                    <p>Decrypted Text: <span id="matchText">${str}</span></p>
                    <p>Shift Number: <span id="cipherConverter">${userShift}</span></p> 
                  </div>
                </div>
                <div class="buttons-index">
                  <button class="get-all" type="button">
                    <img src="${getAllIcon}" alt="Get All">
                    Get All
                  </button>
                  <button class="try-again" type="button">
                    <img src="${refreshImg}" alt="Try Again">
                    Try again
                  </button>
                </div>
                  `;

  cardContainer.insertAdjacentHTML("afterbegin", card);
}

// (https://codepen.io/madhan_s/details/KKxZgZQ) - Number input (codepen)
(function () {
  window.inputNumber = function (el) {
    var min = $(el).attr("min") || false;
    var max = $(el).attr("max") || false;

    var els = {};

    els.dec = $(el).prev();
    els.inc = $(el).next();

    $(el).each(function () {
      init($(this));
    });

    function init(el) {
      els.dec.on("click", decrement);
      els.inc.on("click", increment);

      function decrement() {
        var value = el[0].value;
        value--;
        if (!min || value >= min) {
          el[0].value = value;
        }
      }

      function increment() {
        var value = el[0].value;
        value++;
        if (!max || value <= max) {
          el[0].value = value;
        }
      }
    }
  };
})();

inputNumber($(".input-number"));
