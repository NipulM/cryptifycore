export const renderObject = async function (object, imageObj) {
  let array = object.sortedArray;
  let status = object.objectStatus;

  if (status == "decrypt") {
    let cardContainer = document.querySelector(".card-container");
    let copyIcon = imageObj.copyIcon;
    const addCard = function (array) {
      const addCard = `
                        <div class="card">
                          <img src="${copyIcon}" class="copy-icon" alt="Copy to clipboard" >
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
      if (array[i].percentage > 30) {
        addCard(array[i]);
        document.querySelector(".card").classList.add("correct");
      } else {
        addCard(array[i]);
      }
    }
  }

  if (status == "encrypt") {
    let cardContainer = document.querySelector(".card-container");
    let copyIcon = imageObj.copyIcon;
    const addCard = function (array, textType) {
      const addCard = `
                        <div class="card">
                          <img src="${copyIcon}" class="copy-icon" alt="Copy to clipboard" >
                          <div class="card-content">
                            <p>${textType}: <span id="matchText">${array.text}</span></p>
                            <p>Shift Number: <span id="cipherConverter">${array.index}</span></p>
                          </div>
                        </div>
                        `;

      cardContainer.insertAdjacentHTML("beforeend", addCard);

      if (array.index == 0) {
        cardContainer.lastElementChild.classList.add("original");
      }
    };

    for (let i = 0; i < array.length; i++) {
      if (i == 0) {
        addCard(array[i], "Original Text");
      } else {
        addCard(array[i], "Decrypted Text");
      }
    }
  }
};

export const renderPopup = function (object) {
  let container = document.querySelector(".popupContainer");
  let image = object.image;
  let popupStatus = object.status;
  let str = object.str;
  console.log(popupStatus);

  let popupMessage = `
                      <div class="popup">
                          <p><img src="${image}">${str}</p>
                      </div>
                      `;

  container.insertAdjacentHTML("afterbegin", popupMessage);
  if (popupStatus == 403) {
    document.querySelector(".popup").classList.add("error");
  }
  if (popupStatus == 200) {
    document.querySelector(".popup").classList.add("coppied");
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 2000);
};
