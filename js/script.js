var clickedCards = [];
var focusedCard;
var lastHoveredCard;

document.addEventListener("keydown",tabListener);


//alle functies alleen events dus addEventListener voor alle events
function init(){
    var cardPositions = document.getElementsByClassName("cardPosition");
    var cards = document.getElementsByClassName("card");

    for(i in cardPositions){
        cardPositions.item(i).addEventListener("mouseenter",cardFocus);
        cardPositions.item(i).addEventListener("mouseleave",cardUnfocus);
    }

    for(i in cards){
        cards.item(i).addEventListener("click",clickCard);
        cards.item(i).addEventListener("focus",tabFocus);
        cards.item(i).addEventListener("focusout",tabUnfocus);
    }
}

function tabListener(event){
    // console.log("tabListener");
    if(event.code === "Enter"){
        turnCard(focusedCard);
    }
}

function tabUnfocus(event){

    var card = event.currentTarget;
    // console.log("tabUnfocus");

    // console.log(card);
    card.classList.remove("focus");
    
    focusedCard = undefined;
}

function tabFocus(event){

    var card = event.currentTarget;
    // console.log("tabFocus");
    // console.log(card);
    // console.log(lastHoveredCard);
    card.classList.add("focus");
    focusedCard = card;
    
    if(typeof lastHoveredCard !== 'undefined' && lastHoveredCard != focusedCard){
        // console.log(lastHoveredCard.parentElement);
        lastHoveredCard.parentElement.addEventListener("mousemove",returnMouseFocus,true);
        lastHoveredCard.classList.remove("focus");
    }
}

function returnMouseFocus(event){
    // console.log("returnMouseFocus");
    // console.log(event.currentTarget);
    event.currentTarget.dispatchEvent(new Event("mouseenter"));
    event.currentTarget.removeEventListener("mousemove",returnMouseFocus,true);
}

function cardFocus(event){
    // console.log("cardFocus");
    // console.log(event.currentTarget);
    // console.log(event.target);
    if(event.currentTarget === event.target){

        var card = event.currentTarget.firstElementChild;
        card.classList.add("focus");
        
        focusedCard = card;
        lastHoveredCard = card;
        card.focus();
    }
}

function cardUnfocus(event){
    // console.log("cardUnfocus");
    // console.log(event.currentTarget);
    // console.log(event.target);
    if(event.currentTarget === event.target){

        event.currentTarget.firstElementChild.classList.remove("focus");
        focusedCard = undefined;
        lastHoveredCard = undefined;
    }
}

function clickCard(event){
    if(event.currentTarget === event.target){
        var card = event.currentTarget;
        // console.log("clickCard");
        // console.log(card);
        turnCard(card);
    }
}

function turnCard(card){
    if(clickedCards.length > 1){
        clickedCards.pop().classList.remove("shown");
    }
    card.classList.add("shown");
    clickedCards.unshift(card);
}