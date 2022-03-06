var clickedCards = [];
var focusedCard;


function cardFocus(cardPosition){
    var card = cardPosition.firstElementChild;
    if(typeof focusedCard !== 'undefined'){
        focusedCard.classList.remove("focus");
    }
    card.classList.add("focus");
    focusedCard =  card;
}

function cardUnfocus(cardPosition){
    if(typeof focusedCard !== 'undefined'){
        focusedCard.classList.remove("focus");
    }
    focusedCard = undefined;
}

function clickCard(card){
    if(clickedCards.length > 1){
        clickedCards.pop().classList.remove("shown");
    }
    card.classList.add("shown");
    clickedCards.unshift(card);
}