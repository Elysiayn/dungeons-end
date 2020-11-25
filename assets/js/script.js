var inputEl = document.getElementById("player-name");
// var buttonEl = document.getElementById("start-button");

var beginAdventure = function(event) {
    console.log("Hooray!");
};

document.getElementById("start-button").addEventListener("click", beginAdventure);


var monsterSummoner = function (monster) {
    
    fetch(
        "https://www.dnd5eapi.co/api/monsters/" + monster 
    )
    .then(function(response){
        response.json().then(function(data) {
            console.log(data.name);
            console.log(data.hit_points);
            console.log(data.armor_class);
            console.log(data.xp);
            console.log(data.actions[2].name);
            console.log(data.actions[2].damage[0].damage_dice);
            console.log(data.actions[2].attack_bonus);

        })
    }
    )
}


monsterSummoner("bearded-devil");
