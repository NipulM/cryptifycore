import alphabetLetters from "../json_files/alphabet.json";
import words from "../json_files/words.json";
import copyIcon from "../images/copy.png";
import checkIcon from "../images/check-mark.png";
import errorIcon from "../images/error.png";
import { cipherConv, calcCorrectShift } from "./model";
import { renderObject, renderPopup } from "../js/view/render";

const data = { alphabetLetters, words };
const images = { copyIcon, checkIcon, errorIcon };
const clearButton = document.querySelector(".clear-button");

clearButton.addEventListener("click", function (event) {
  event.preventDefault();
  const inputField = document.querySelector(".cipher-input");
  inputField.value = "";
});

document.getElementById("currentYear").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("copy-icon")) {
      copyText(event.target);
    }
  });
});

function copyText(clickedElement) {
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
    .catch(() => {
      const errorObject = {
        image: images.errorIcon,
        status: 403,
        str: "Issue Detected!",
      };
      renderPopup(errorObject);
    });
}

var cipherForm = document.getElementById("cipherForm");
document.getElementById("currentYear").textContent = new Date().getFullYear();

const userInput = document.querySelector(".cipher-input");
const submit = document.querySelector(".cipher-submit");

userInput.addEventListener("input", function () {
  if (userInput.value.trim() !== "") {
    submit.style.visibility = "visible";
    submit.style.opacity = 1;

    clearButton.style.visibility = "visible";
    clearButton.style.opacity = 1;
  } else {
    submit.style.visibility = "hidden";
    submit.style.opacity = 0;

    clearButton.style.visibility = "hidden";
    clearButton.style.opacity = 0;
  }
});

cipherForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var userInput = document.querySelector(".cipher-input").value;
  var cipherText = document.querySelector(".cipher-text");
  var spinner = document.querySelector(".lds-ring");
  var cardContainer = document.querySelector(".card-container");

  if (userInput.trim() == "") {
    const errorObject = {
      image: images.errorIcon,
      status: 403,
      str: "Invalid Input!",
    };
    renderPopup(errorObject);
  } else {
    cipherText.classList.add("display-none");
    spinner.classList.remove("display-none");
    clearButton.style.visibility = "hidden";
    cardContainer.innerHTML = "";

    setTimeout(() => {
      cipherText.classList.remove("display-none");
      cipherText.classList.remove("cipher-text-before");
      cipherText.classList.add("cipher-text-after");
    }, 2500);

    converter(userInput, data)
      .then((sortedArray) => {
        setTimeout(() => {
          spinner.classList.add("display-none");

          let objectStatus = "decrypt";

          let object = {
            sortedArray,
            objectStatus,
          };

          renderObject(object, images);
        }, 2500);
        document.querySelector(".cipher-input").value = "";
        submit.style.visibility = "hidden";
      })
      .catch(() => {
        const errorObject = {
          image: images.errorIcon,
          status: 403,
          str: "Issue Detected!",
        };
        renderPopup(errorObject);
      });
  }
});

async function converter(userInput, data) {
  const conversions = await cipherConv(userInput, data);
  const sortedArray = await calcCorrectShift(data.words, conversions);
  return sortedArray;
}
