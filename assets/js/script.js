var gameState = {
    user: {
        name: "",
        hp: 50, // determined by player selected
        ap: 0, // determined by roll 
        armor: 0, // determined by player selected
        xp: 0,
        level: 1
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

var grabName = function() {
    var beginModal = document.querySelector('.modal');
    var getModal = M.Modal.getInstance(beginModal);
    getModal.open();

    var name = inputEl.value.trim();

    gameState.user.name = name

    var modalParaEl = document.querySelector(".modal-text");
    modalParaEl.textContent = "Be wary, " + gameState.user.name + "." + " As you fight your way to the Dungeon's End, you will face ferocious monsters. While each monster may vary in power, remain vigilant, as any of these foes could be your demise.";

}

// Modal Activation Trigger
    // $(document).ready(function(){
    //     console.log(gameState.user.name);
    //     $('.modal').modal();
    //     $(".modal-text").append("Be wary," + gameState.user.name + "." + "As you fight your way to the Dungeon's End, you will face ferocious monsters. While each monster may vary in power, remain vigilant, as any of these foes could be your demise.")
    // });
// Modal End

// var inputEl = document.getElementById("player-name").value;


var beginAdventure = function(event) {
    window.location.href = "./encounter.html"
};

var startBtn = document.getElementById('start-button');
startBtn.addEventListener("click", grabName);

document.getElementById("continue").addEventListener("click", beginAdventure);
// document.getElementById("player-name").addEventListener("blur", grabName);

