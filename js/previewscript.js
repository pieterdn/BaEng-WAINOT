var tableArray = [];
var widthCurrent = 0;
var heightCurrent = 0;

window.addEventListener("load",function(){
    // document.spelgenerator.width.addEventListener("change",changeBoard);
    // document.spelgenerator.height.addEventListener("change",changeBoard);
    document.spelgenerator.dimensions.addEventListener("change",changeBoard);
    document.getElementById("memoryRefresh").addEventListener("click",boardRefresh);
    document.getElementById("memoryShuffle").addEventListener("click",boardReshuffle);
    document.getElementById("memoryReveal").addEventListener("click",revealAllCards);

    let dimensions = document.spelgenerator.dimensions.value;
    const dimvalues = dimensions.split("x");

    let width = dimvalues[0];
    let height = dimvalues[1];
    let memprev = document.getElementById("memoryPreview");

    if(width*height%2 == 1){
        width -= 1;
    }

    widthCurrent = width;
    heightCurrent = height;

    let table = document.createElement("table");
    table.setAttribute("id","table");
    memprev.appendChild(table);

    for(let i = 0; i < height; i++){
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for(let j = 0; j < width; j++){
            let num = j+width*i;

            let td = createTextCard(i, j, ((num - j%2)/2).toString());

            //vind geen betere manier
            tableArray[num] = td;
        }
    }
    let shuffledArray = [...tableArray];
    shuffledArray = shuffle(shuffledArray);
    for(let i = 0; i < height; i++){
        let tr = document.getElementById("table").childNodes.item(i);
        for(let j = 0; j < width; j++){
                let td = shuffledArray[j + i*width];
                tr.appendChild(td);
        }
    }
});

function createTextCard(x, y, name){
    let td = document.createElement("td");
    let div = document.createElement("div");
    let p = document.createElement("p");
    
    p.classList.add("img");


    p.appendChild(document.createTextNode(name));


    div.setAttribute("id", x.toString() + "_" + y.toString());
    div.classList.add("card");
    
    div.classList.add(name.toString());
    
    div.setAttribute("tabindex","0");
    

    td.classList.add("cardPosition");

    td.appendChild(div);
    div.appendChild(p); 
    return td;
}

function changeBoard(event){
    let dimensions = document.spelgenerator.dimensions.value;
    const dimvalues = dimensions.split("x");

    let width = dimvalues[0];
    let height = dimvalues[1];

    if(width*height%2 == 1){
        return;
    }else{
        widthCurrent = width;
        heightCurrent = height;
    }
    clickedCards = [];
    
    let table = document.getElementById("table");
    let prevHeight = table.childNodes.length;
    for(let i = 0; i < prevHeight; i++){
        table.removeChild(table.lastChild);
    }

    for(let i = 0; i < height; i++){
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for(let j = 0; j < width; j++){
            let num = j+width*i;
            tableArray[num] = createTextCard(i, j, ((num - j%2)/2).toString());
        }
    }
    tableArray.length = width*height;

    let shuffledArray = [...tableArray];
    shuffle(shuffledArray);

    for(let i = 0; i < height; i++){
        let tr = table.childNodes.item(i);
        for(let j = 0; j < width; j++){
            let td = shuffledArray[j + i*width];
            tr.appendChild(td);
        }
    }
    addCardEventListeners();
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function boardRefresh(event){
    let cards = document.getElementsByClassName("card");
    clickedCards = [];
    for(let i = 0; i < cards.length; i++){
        let card = cards.item(i);
        card.classList.remove("shown");
        if(card.classList.contains("correct")){
            card.setAttribute("tabindex","0");
        }
        card.classList.remove("correct");
    }
}

function boardReshuffle(event){
    boardRefresh();
    setTimeout(function(){
        let table = document.getElementById("table");
        let width = widthCurrent;
        let height = heightCurrent;
        let shuffledArray = [...tableArray];
        shuffle(shuffledArray);

        for(let i = 0; i < height; i++){
            let tr = table.childNodes.item(i);
            for(let j = 0; j < width; j++){
                tr.removeChild(tr.lastChild);
            }

        }

        for(let i = 0; i < height; i++){
            let tr = table.childNodes.item(i);
            for(let j = 0; j < width; j++){
                let td = shuffledArray[j + i*width];
                tr.appendChild(td);
            }
        }
    },1000);
}

function revealAllCards(){
    let cards = document.getElementsByClassName("card");
    clickedCards = [];
    for(let i = 0; i < cards.length; i++){
        let card = cards.item(i);
        if(!card.classList.contains("shown"))
            card.classList.add("shown");
        if(!card.classList.contains("correct"))
            card.classList.add("correct");

        card.removeAttribute("tabindex","0");
    }
}