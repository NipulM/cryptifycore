export const cipherConv = async function (userInput, data) {
  let alphabetData = data.alphabetLetters;
  let userInputArr = userInput.split("");

  let multiObject = {};
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
  return multiObject;
};

export const calcCorrectShift = async function (alphabetWords, conversions) {
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
};
