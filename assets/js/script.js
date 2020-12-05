// Fighter Card Variables
// var fighters = {
//     human: {
//         imgUrl: "./assets/images/image1.jpg",
//         title: "Human Fighter",
//         description: ""
//     },
//     orc: {
//         imgUrl: "./assets/images/image2.jpg",
//         title: "Orc Fighter",
//         description: ""
//     },
//     aasimar: {
//         imgUrl: "./assets/images/image3.jpg",
//         title: "Aasimar Fighter",
//         description: ""
//     },
//     elf: {
//         imgUrl: "./assets/images/image4.jpg",
//         title: "Elf Fighter",
//         description: ""
//     },
// } 

// I don't think this function will work because of page scoping; however, we may be able to store what they've chosen in localStorage then pull that info down. 

// Click Handler function calls generated fighter card function
var selectedRace
var dataName = $(".fighter-button").on("click",function(e) {
    selectedRace = e.target.getAttribute("dataName");
    localStorage.setItem("race", selectedRace);
    console.log(selectedRace);
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

    var name = inputEl.value.trim();

    gameState.user.name = name

    var modalParaEl = document.querySelector(".modal-text");
    modalParaEl.textContent = "Be wary, " + gameState.user.name + "." + " As you fight your way to the Dungeon's End, you will face ferocious monsters. While each monster may vary in power, remain vigilant, as any of these foes could be your demise.";

}
//Modal End

var beginAdventure = function(event) {

    window.location.href = "./encounter.html";

    window.location.href = "./encounter.html"
   
    saveUser(); 

};

var startBtn = document.getElementById('start-button');
startBtn.addEventListener("click", grabName);

document.getElementById("continue").addEventListener("click", beginAdventure);
// document.getElementById("player-name").addEventListener("blur", grabName);
document.addEventListener("click", generateFighterCard);


// var selectedOpts = {
//     selectedImg = "ImgPath"
// }

var saveUser = function () {
    localStorage.setItem("user", JSON.stringify(gameState.user))
}




