var clickedCards = [];
var focusedCard;
var lastHoveredCard;

document.addEventListener("keydown",tabListener);



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
    if(event.code === "Enter"){
        turnCard(focusedCard);
    }
}

function tabUnfocus(event){

    var card = event.currentTarget;
    card.classList.remove("focus");
    
    focusedCard = undefined;
}

function tabFocus(event){

    var card = event.currentTarget;
    card.classList.add("focus");
    focusedCard = card;
    
    if(typeof lastHoveredCard !== 'undefined' && lastHoveredCard != focusedCard){
        lastHoveredCard.parentElement.addEventListener("mousemove",returnMouseFocus,true);
        lastHoveredCard.classList.remove("focus");
    }
}

function returnMouseFocus(event){
    event.currentTarget.dispatchEvent(new Event("mouseenter"));
    event.currentTarget.removeEventListener("mousemove",returnMouseFocus,true);
}

function cardFocus(event){
    if(event.currentTarget === event.target){
        var card = event.currentTarget.firstElementChild;
        card.classList.add("focus");
        focusedCard = card;
        lastHoveredCard = card;
        card.focus();
    }
}

function cardUnfocus(event){
    if(event.currentTarget === event.target){

        event.currentTarget.firstElementChild.classList.remove("focus");
        focusedCard = undefined;
        lastHoveredCard = undefined;
    }
}

function clickCard(event){
    if(event.currentTarget === event.target){
        var card = event.currentTarget;
        turnCard(card);
    }
}

function turnCard(card){ 
    if(!card.classList.contains("shown")){
        card.classList.add("shown");
        clickedCards.unshift(card);
        if(clickedCards.length > 1){
            checkCards();
        }
    }
}

function checkCards(){
    var card1Classes = [];
    var card2Classes = [];
    var card1 = clickedCards[0];
    var card2 = clickedCards[1];
    for(var i = 0; i < card1.classList.length; i++){
        card1Classes[i] = card1.classList.item(i);
    }
    for(var i = 0; i < card2.classList.length; i++){
        card2Classes[i] = card2.classList.item(i);
    }

    card1Classes = arrayRemove(card1Classes,"card");
    card2Classes = arrayRemove(card2Classes,"card");
    
    if(card1Classes[0] === card2Classes[0]){
        clickedCards[0].classList.add("correct");
        clickedCards[1].classList.add("correct");
        clickedCards.length = 0;
    }else{

        var weg1 = clickedCards[0];
        var weg2 = clickedCards[1];
        clickedCards.length = 0;

        setTimeout(function(){
        weg1.classList.remove("shown");
        weg2.classList.remove("shown");
        },1000);
    }
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}