const justify = (text) => {
  let words = text.split(" ").filter(function (value, index, arr) {
    return value.length;
  });

  let linesList = [];
  let result = "";
  let line = [words.shift()];

  for (let i = 0; i <= words.length; i++) {
    const word = words[i];
    if ((line.join(" ") + " " + word).length <= 80) {
      line.push(word);
    } else {
      linesList.push(line.join(" "));
      line = [word];
    }
  }

  for (let i = 0; i < linesList.length; i++) {
    

    var singleLine = linesList[i].split("");
    
    var done = true;
    let count = 0;
    let diff = 80 - singleLine.length;
    let space = "";
    while (done) {
      space = space.concat(" ");
      for (let j = 0; j < singleLine.length; j++) {
        if (singleLine[j] === space) {
          singleLine[j] = singleLine[j].concat(" ");
         
          count++;

          if (diff === count) {
           
            done = false;
            break;
          }
        }
        if (singleLine.length === 80) {
          done = false;
          break;
        }
      }
    }

    result += singleLine.join("") + "\n";
   

  }

  return result;
};

module.exports = justify;

