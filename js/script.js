var clickedCards = [];
var focusedCard;
var lastHoveredCard;

document.addEventListener("keydown",tabListener);

window.addEventListener("load",function (){
    addCardEventListeners();
});

function addCardEventListeners(){
    let cardPositions = document.getElementsByClassName("cardPosition");
    let cards = document.getElementsByClassName("card");

    for(i = 0; i < cardPositions.length;i++){
        cardPositions.item(i).addEventListener("mouseenter",cardFocus);
        cardPositions.item(i).addEventListener("mouseleave",cardUnfocus);
    }

    for(i = 0; i < cards.length;i++){
        cards.item(i).addEventListener("click",clickCard);
        cards.item(i).addEventListener("focus",tabFocus);
        cards.item(i).addEventListener("focusout",tabUnfocus);
    }
}

function tabListener(event){
    if(event.code === "Enter" && document.activeElement.classList.contains("card")){
        if(focusedCard != undefined)
            turnCard(focusedCard);
    }
}

function tabUnfocus(event){

    let card = event.currentTarget;
    card.classList.remove("focus");
    
    focusedCard = undefined;
}

function tabFocus(event){

    let card = event.currentTarget;
    card.classList.add("focus");
    focusedCard = card;
    
    if(lastHoveredCard != focusedCard){
        Array.from(document.getElementsByClassName("cardPosition")).forEach(function(element){
            // console.log(element);
            element.addEventListener("mousemove",returnMouseFocus,true);
        });
        if(typeof lastHoveredCard !== "undefined"){
            lastHoveredCard.classList.remove("focus");
        }
    }
}

function returnMouseFocus(event){
    document.activeElement.classList.remove("focus");

    event.currentTarget.dispatchEvent(new Event("mouseenter"));

    Array.from(document.getElementsByClassName("cardPosition")).forEach(function(element){
        element.removeEventListener("mousemove",returnMouseFocus,true);
    });

}

function cardFocus(event){
    // console.log("mouseeneter1");
    if(event.currentTarget === event.target){
        // console.log("mouseeneter2");
        // console.log(event.currentTarget);
        let card = event.currentTarget.firstElementChild;
        card.classList.add("focus");
        focusedCard = card;
        lastHoveredCard = card;
        //card.focus(); //<- misschien beter niet geforceerd focussen
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
        let card = event.currentTarget;
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
    let card1Classes = [];
    let card2Classes = [];
    let card1 = clickedCards[0];
    let card2 = clickedCards[1];
    for(let i = 0; i < card1.classList.length; i++){
        card1Classes[i] = card1.classList.item(i);
    }
    for(let i = 0; i < card2.classList.length; i++){
        card2Classes[i] = card2.classList.item(i);
    }

    card1Classes = arrayRemove(card1Classes,"card");
    card2Classes = arrayRemove(card2Classes,"card");
    
    if(card1Classes[0] === card2Classes[0]){
        clickedCards[0].classList.add("correct");
        clickedCards[0].removeAttribute("tabindex");
        clickedCards[1].classList.add("correct");
        clickedCards[1].removeAttribute("tabindex");
        clickedCards.length = 0;
    }else{

        let weg1 = clickedCards[0];
        let weg2 = clickedCards[1];
        clickedCards.length = 0;

        setTimeout(function(){
        weg1.classList.remove("shown");
        weg2.classList.remove("shown");
        },1000);
    }
    checkEnd();
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function checkEnd()
{
    // check if each card is turned over and correct
    if (document.getElementsByClassName("correct").length == document.getElementsByClassName("card").length)
        endOfGame();
}

function endOfGame()
{
    //window.alert("Game is done yay");
    // execute animation
    document.getElementById("canvas").hidden = false;
    loop();
}