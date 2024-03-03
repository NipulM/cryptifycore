import alphabetLetters from "../json_files/alphabet.json";
import words from "../json_files/words.json";
import copyIcon from "../images/copy.png";

const data = { alphabetLetters, words };
const images = { copyIcon };

document.getElementById("currentYear").textContent = new Date().getFullYear();
document.querySelector(".lds-ring").classList.add("display-none");
// document.querySelector(".cipher-text").classList.add("display-none");
document.querySelector(".cipher-text").classList.add("cipher-text-before");
// document.querySelector(".cipher-text").classList.add("cipher-text-after");

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
      alert("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
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
  } else {
    submit.style.visibility = "hidden";
    submit.style.opacity = 0;
  }
});

cipherForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var userInput = document.querySelector(".cipher-input").value;
  var cipherText = document.querySelector(".cipher-text");
  var spinner = document.querySelector(".lds-ring");
  var cardContainer = document.querySelector(".card-container");

  // Checks whether the user has inputted something - and also I need to implement a functionality to verify if the Num imput is an integer (to do that there should be a small message pop up for all errors and clipboard messages)
  if (userInput.trim() == "") {
    console.log("Please enter a valid input");
  } else {
    cipherText.classList.add("display-none");
    spinner.classList.remove("display-none");
    cardContainer.innerHTML = "";

    setTimeout(() => {
      cipherText.classList.remove("display-none");
      cipherText.classList.remove("cipher-text-before");
      cipherText.classList.add("cipher-text-after");
    }, 2500);

    // Calls the converter function and manages the promise
    converter(userInput, data, images)
      .then((sortedArray) => {
        // Here this accesses the sortedArray
        // console.log(sortedArray);
        setTimeout(() => {
          spinner.classList.add("display-none");
          renderArray(sortedArray, images);
        }, 2500);

        // Clears input and hides the submit button
        document.querySelector(".cipher-input").value = "";
        submit.style.visibility = "hidden";
      })
      .catch((error) => {
        // Handles errors, if any
        console.error("Error in converter:", error);
      });
  }
});

async function converter(userInput, data, images) {
  // Purpose of this function is to get all of cipher conversions
  async function cipherConv(userInput) {
    // this code block is used in two places (script.js), which is not really ideal at all. (Something that can be improved)
    // async function fetchLetters() {
    //   try {
    //     const responseLetters = await fetch("json_files/alphabet.json");
    //     const data = await responseLetters.json();
    //     return data;
    //   } catch (e) {
    //     console.log(`Error reading data.json: ${e}`);
    //   }
    // }

    // calls the above function
    let alphabetData = data.alphabetLetters;
    let userInputArr = userInput.split("");

    let multiObject = {};

    // this code block is also used in two places (script.js), which is not really ideal at all. (Something that can be improved)
    for (let i = 0; i <= 25; i++) {
      let cipherConv = {};
      cipherConv.text = userInputArr
        .map((char) => {
          if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
            let isUpperCase = char === char.toUpperCase();
            let alphabetIndex = alphabetData.items.findIndex(
              (item) => item.word.toLowerCase() === char.toLowerCase()
            );
            let newIndex = (alphabetIndex + i) % 26;
            let newChar = isUpperCase
              ? alphabetData.items[newIndex].word.toUpperCase()
              : alphabetData.items[newIndex].word;
            return newChar;
          }
          return char;
        })
        .join("");
      cipherConv.index = i;
      multiObject[`cipherConv${i}`] = cipherConv;
    }

    // returns the object containing all of conversions
    return multiObject;
  }

  // Stores the conversions in a variable
  const conversions = await cipherConv(userInput);
  //   console.log(conversions);

  // This function handles finding the correct shift. It checks if the words in the text match real ones. To do this, a list of the 3000 most common English words is stored in the root folder. These words are then stored in a JSON file using Python, which allows to find matching words.
  // async function fetchData() {
  //   try {
  //     const response = await fetch("json_files/words.json");
  //     const data = await response.json();
  //     return data;
  //   } catch (e) {
  //     console.log(`Error reading data.json: ${e}`);
  //   }
  // }

  let alphabetWords = data.words;
  //   let userInputArr = userInput.split("");

  const sortedArray = await calcCorrectShift(alphabetWords, conversions);

  // this is where the check happens and creates the final sorted array, which contains the highest possibility of being the Caesar cipher method or the used shift.
  async function calcCorrectShift(alphabetWords, conversions) {
    let updatedObject = {};
    const wordsArr = alphabetWords.items;

    let index = 0;
    for (const key in conversions) {
      let textArr = conversions[key].text.split(" ");
      let text = `${conversions[key].text}`;
      let matches = 0;

      // Checks for words like that to ensure the user understands the percentage of correctness.
      for (let j = 0; j < textArr.length; j++) {
        if (wordsArr.includes(textArr[j])) {
          matches++;
        }
      }
      let percentage = +((matches / textArr.length) * 100).toFixed(2);

      updatedObject[`cipherCon${index}`] = {
        text,
        matches,
        index,
        percentage,
      };
      index++;
    }

    const sortedArray = Object.values(updatedObject);
    sortedArray.sort((a, b) => b.matches - a.matches);

    return sortedArray;
  }

  return sortedArray;
  //   console.log(sortedArray);
}

// This is where the manipulation happens
async function renderArray(array, imageObj) {
  let cardContainer = document.querySelector(".card-container");
  let copyIcon = imageObj.copyIcon;

  const addCard = function (array) {
    const addCard = `
                    <div class="card">
                      <img src="${copyIcon}" class="copy-icon" alt="Copy to clipboard" onclick="copyText(this)">
                      <div class="card-content">
                        <p>Decrypted Text: <span id="matchText">${array.text}</span></p>
                        <p>Legitimacy Score: <span id="matchPercentage">${array.percentage}%</span></p>
                        <p>Shift Number: <span id="cipherConverter">${array.index}</span></p>
                      </div>
                    </div>
                    `;

    cardContainer.insertAdjacentHTML("beforeend", addCard);
  };

  for (let i = 0; i < array.length; i++) {
    // If the cards are legitimate, they will have a green box shadow, otherwise, they will be displayed as normal cards
    if (array[i].percentage > 30) {
      addCard(array[i]);
      document.querySelector(".card").classList.add("correct");
    } else {
      addCard(array[i]);
    }
  }
}
