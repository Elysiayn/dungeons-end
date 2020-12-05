


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

    var name = inputEl.value.trim();

    gameState.user.name = name

    var modalParaEl = document.querySelector(".modal-text");
    modalParaEl.textContent = "Be wary, " + gameState.user.name + "." + " As you fight your way to the Dungeon's End, you will face ferocious monsters. While each monster may vary in power, remain vigilant, as any of these foes could be your demise.";

}
//Modal End

var beginAdventure = function(event) {
    window.location.href = "./encounter.html"
   
    saveUser(); 
};

var startBtn = document.getElementById('start-button');
startBtn.addEventListener("click", grabName);

document.getElementById("continue").addEventListener("click", beginAdventure);
// document.getElementById("player-name").addEventListener("blur", grabName);

var saveUser = function () {
    localStorage.setItem("user", JSON.stringify(gameState.user))
}



