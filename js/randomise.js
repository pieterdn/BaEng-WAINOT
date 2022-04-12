
window.addEventListener("load",setImages);


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function setImages(){

  
    tdarray = Array.from(document.getElementsByClassName("cardPosition"));
    var tabel = document.getElementById("table");

    var rows = tabel.getElementsByTagName("tr");
    var height = rows.length;
    var width = rows[0].cells.length;

    console.log("dimentions: "+width+"x"+height);

    let shuffledArray = shuffle(tdarray);
    console.log(rows);
    for(let i=0; i<height; i++){
      let tr = rows[i];
      console.log(tr);
      for(let j=0;j<width;j++){
        tr.removeChild(tr.lastChild);
      }
    }

    for(let i = 0; i < height; i++){
      let tr = rows[i];
      for(let j = 0; j < width; j++){
          let td = shuffledArray[j + i*width];
          tr.appendChild(td);
      }
    }
    


    
}