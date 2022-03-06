var clickedCards = [];


function clickCard(card){
    if(clickedCards.length > 1){
        clickedCards.pop().classList.remove("focus");
    }
    card.classList.add("focus");
    clickedCards.unshift(card);
}