import alphabetLetters from "../json_files/alphabet.json";
import copyIcon from "../images/copy.png";
import refreshIcon from "../images/refresh.png";

// console.log(copyIcon, refreshIcon);
const alphabetLetters = alphabetLetters;
const images = { copyIcon, refreshIcon };

var cipherForm = document.getElementById("cipherForm");
document.getElementById("currentYear").textContent = new Date().getFullYear();
document.querySelector(".lds-ring").classList.add("display-none");

const userInput = document.querySelector(".user-input");
const submit = document.querySelector(".submit");
const numInput = document.querySelector(".num-input ");
const clearButton = document.querySelector(".clear-button");
const buttonsAfter = document.querySelector(".buttons-index");

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
  });
});

// copies the text (encrypted) to the clipboard
const copyText = function (clickedElement) {
  const textToCopy =
    clickedElement.parentNode.querySelector("#matchText").innerText;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
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

// this task is already implemented in decode.js. need to devise a method to import it here

// function getAll() {
//   console.log("hi");
// }

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

  if (userInputText.trim() == "") {
    console.log("Please enter a valid input");
  } else {
    document.querySelector(".user-input").value = "";

    submit.style.visibility = "hidden";
    clearButton.style.visibility = "hidden";
    numInput.style.visibility = "hidden";

    spinner.classList.remove("display-none");
    userInputField.classList.add("display-none");

    setTimeout(() => {
      spinner.classList.add("display-none");
    }, 1500);

    cipherConv(userInputText, userShift, alphabetLetters)
      .then((arr) => {
        let decryptText = arr.cipherStr;
        let userShift = arr.shiftNumber;

        // reduced the timeout from 2.5s to 1.5s
        setTimeout(() => {
          renderString(decryptText, userShift, images);
        }, 1500);
      })
      .catch((err) => {
        console.error(
          `Failed to get the String Please try a different technique: ${err}`
        );
      });
  }
});

async function cipherConv(userInput, shiftNumber, alphabetLetters) {
  // this functionality is being used in two locations (decode.js), which isnt ideal (room for improvment)
  // async function fetchData() {
  //   try {
  //     const response = await fetch("json_files/alphabet.json");
  //     const data = await response.json();
  //     return data;
  //   } catch (e) {
  //     console.log(`Error reading data.json: ${e}`);
  //   }
  // }

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
                  <img src="${copyImg}" class="copy-icon" alt="Copy to clipboard" onclick="copyText(this)">
                  <div class="card-content">
                    <p>Decrypted Text: <span id="matchText">${str}</span></p>
                    <p>Shift Number: <span id="cipherConverter">${userShift}</span></p>
                  </div>
                </div>
                <div class="buttons-index">
                  <button class="try-again" type="button" onclick="tryAgain()">
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
