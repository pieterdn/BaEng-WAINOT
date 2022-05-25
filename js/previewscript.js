var tableArray = [];
var widthCurrent = 0;
var heightCurrent = 0;
var curReveal = 0;

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
    table.id = "previewtable";
    memprev.appendChild(table);

    for(let i = 0; i < height; i++){
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for(let j = 0; j < width; j++){
            let num = j+width*i;
            let td = createTextCard(i, j, Math.floor(((num - (i+j)%2)/2)).toString(),width);

            //vind geen betere manier
            tableArray[num] = td;
        }
    }
    let shuffledArray = [...tableArray];
    shuffledArray = shuffle(shuffledArray);
    for(let i = 0; i < height; i++){
        let tr = document.getElementById("previewtable").childNodes.item(i);
        for(let j = 0; j < width; j++){
                let td = shuffledArray[j + i*width];
                tr.appendChild(td);
        }
    }
});

function createTextCard(x, y, name,width){
    let td = document.createElement("td");
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.classList.add("img");
    p.appendChild(document.createTextNode(name));
    div.setAttribute("id", x.toString() + "_" + y.toString());
    div.classList.add("card");
    
    if(width > 4){
        let wrapper = document.getElementById("wrapper");
        let style = getComputedStyle(wrapper);
        maxWidth = style.maxWidth.replace("px","");

        let cardwidth = (maxWidth-((parseInt(width)+5) * 21))/parseInt(width);
        let cardheight = cardwidth*0.75;
        let widthstring = cardwidth.toString();
        let heightstring = cardheight.toString();
        div.style.width = widthstring + ("px");
        div.style.height = heightstring + ("px");
    }

    div.classList.add(name.toString());
    div.setAttribute("tabindex","0");
    td.classList.add("cardPosition");

    td.appendChild(div);
    div.appendChild(p);
    return td;
}

function changeBoard(){
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
    
    let table = document.getElementById("previewtable");
    let prevHeight = table.childNodes.length;
    for(let i = 0; i < prevHeight; i++){
        table.removeChild(table.lastChild);
    }

    for(let i = 0; i < height; i++){
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for(let j = 0; j < width; j++){
            let num = j+width*i;
            console.log("width:"+width.toString() +" i:"+ i.toString() +" j:"+ j.toString() + " num:" + num.toString() + " " + Math.floor(((num - j%2)/2)).toString());
            console.log(Math.floor(((num - (i+j)%2)/2)).toString());
            tableArray[num] = createTextCard(i, j, (Math.floor((num - (i+j)%2)/2)).toString(),width);
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
    if(curReveal == 1)
        revealAllCards();
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
    curReveal = 0;
}

function boardReshuffle(event){
    boardRefresh();
    setTimeout(function(){
        let table = document.getElementById("previewtable");
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
    curReveal = 1;
}

function refreshPreviewImages(){
    let imgs = [];
    Array.from(document.getElementById("hiddenImages").childNodes).forEach( el => imgs.push(el.value));

    imgs.sort((a, b) => a.slice(a.length - 1, a.length).localeCompare(b.slice(b.length - 1, b.length)));

    if(currentGametype == "paren")
        refreshParenPreviewImages(imgs);
    else if(currentGametype == "uniek")
        refreshUniekPreviewImages(imgs);
    else if(currentGametype == "text")
        refreshTextPreviewImages(imgs);
    
}

function refreshParenPreviewImages(imgs){
    let onlyTheseOnes = [];

    imgs.forEach(function(img){
        Array.from(document.getElementsByClassName(img.split("?")[1]))
            .forEach(function(div){
                onlyTheseOnes.push(div);
                let imgEl = document.createElement("img");
                imgEl.classList += "img";
                imgEl.src = "./media/" + img.split("?")[0];
                div.removeChild(div.firstChild);
                div.appendChild(imgEl);
            });
    });
    removeUnwantedImages(onlyTheseOnes);

}

function refreshUniekPreviewImages(imgs){
    let prevClass = undefined;
    let onlyTheseOnes = [];

    imgs.forEach(function(img){
        //tweede uniek
        let div;
        if(prevClass == img.split("?")[1] && prevClass !== undefined){
            div = document.getElementsByClassName(img.split("?")[1])[1];
        }
        //eerste uniek
        else{
            div = document.getElementsByClassName(img.split("?")[1])[0];
        }
        onlyTheseOnes.push(div);

        let imgEl = document.createElement("img");
        imgEl.classList += "img";
        imgEl.src = "./media/" + img.split("?")[0];
        div.removeChild(div.firstChild);
        div.appendChild(imgEl);

        prevClass = img.split("?")[1];
    });

    removeUnwantedImages(onlyTheseOnes);
}

function refreshTextPreviewImages(imgs){
    let onlyTheseOnes = [];
    imgs.forEach(function(img){
        let divImg = document.getElementsByClassName(img.split("?")[1])[0];
        onlyTheseOnes.push(divImg);
        let divText = document.getElementsByClassName(img.split("?")[1])[1];
        onlyTheseOnes.push(divText);

        let text = document.getElementById(img.split("?")[0] + "?text").value;

        let imgEl = document.createElement("img");
        imgEl.classList += "img";
        imgEl.src = "./media/" + img.split("?")[0];
        divImg.removeChild(divImg.firstChild);
        divImg.appendChild(imgEl);

        let textEl = document.createElement("p");
        textEl.classList += "img";
        textEl.innerText = text;
        divText.removeChild(divText.firstChild);
        divText.appendChild(textEl);
    });
    
    removeUnwantedImages(onlyTheseOnes);
}

function removeUnwantedImages(onlyTheseOnes){
    for(let i = 0; i < tableArray.length; i++){
        let div = tableArray[i].firstChild;
        if(!onlyTheseOnes.includes(div)){
            let p = document.createElement("p");
            p.innerText = div.classList[1];
            p.classList += "img";
            div.removeChild(div.firstChild);
            div.appendChild(p);
        }
    }
}