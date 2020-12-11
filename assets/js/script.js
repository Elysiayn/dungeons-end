// Fighter Card Variables

// Click Handler function calls generated fighter card function
var selectedRace
var dataName = $(".fighter-button").on("click",function(e) {
    selectedRace = e.target.getAttribute("dataName");
    localStorage.setItem("race", selectedRace);
});

var generateFighterCard = function(dataName) {
    //DOM manipulation to append img 
    img.attr(src.fighters.dataName.imgURL)
}

var inputEl = document.getElementById("player-name");

var gameState = {
    user: {
        name: "",
        hp: 50, // determined by player selected
        ap: 0, // determined by roll 
        armor: 10, // determined by player selected
        xp: 0,
        level: 1,
        attack: "2d6+5"
    },
    enemy: {
        name: "",
        hp: 0,
        ap: 0,
        armor: 0,
        xp: 0,
        challenge_rating: 0
    },
}
var inputEl = document.getElementById("player-name");

var playerInfo = [{
    name: " ",
    score: 0
}
]

// Modal Activation Trigger
var grabName = function() {

        var beginModal = document.querySelector('.modal');
        var instances = M.Modal.init(beginModal);
        var getModal = M.Modal.getInstance(beginModal);
        getModal.open();

        var modalParaEl = document.querySelector(".modal-text");
        var name = inputEl.value.trim();

    if ((name === "")||(!selectedRace )){ 
        modalParaEl.textContent = "Brave Adventurer, I need to know your name and fighter before you continue. So I may tell all of your bravery.";
    }else {
        gameState.user.name = name
        modalParaEl.textContent = "Be wary, " + gameState.user.name + "." + " As you fight your way to the Dungeon's End, you will face ferocious monsters. While each monster may vary in power, remain vigilant, as any of these foes could be your demise.";
    }
}
//Modal End

var beginAdventure = function(event) {

    if((gameState.user.name === "") || (!selectedRace) ) {
        return;
    }
    window.location.href = "./encounter.html";

    saveUser(); 
};

var startBtn = document.getElementById('start-button');
startBtn.addEventListener("click", grabName);

var playerName = document.getElementById('player-name')
playerName.addEventListener("keydown", e =>{
    if(e.keyCode === 13){
        document.getElementById('start-button').click();
    }
});
document.getElementById("continue").addEventListener("click", beginAdventure);

var adventureEl = document.getElementById('modal1')
adventureEl.addEventListener("keydown", e =>{
    if(e.keyCode === 13){
        document.getElementById('continue').click();
    }
});

document.addEventListener("click", generateFighterCard);

var saveUser = function () {
    localStorage.setItem("user", JSON.stringify(gameState.user))
}

$(document).ready(function() {
    $('.sidenav').sidenav() 
});