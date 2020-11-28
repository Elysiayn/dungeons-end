var inputEl = document.getElementById("player-name");


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
            damageDiceRoll(data.actions[2].damage[0].damage_dice);

        })
    }
    )
}

var damageDiceRoll = function(damageDice) {

    var damageInfo = damageDice.split(/[d,+]/);
    var damageMultiplier = parseInt(damageInfo[0]);
    var damageValue = parseInt(damageInfo[1]);
    var damageBonus = parseInt(damageInfo[2]);


    console.log(damageInfo);
    console.log(damageValue);
    console.log(damageMultiplier);
    console.log(damageBonus);

    var damageDealt = (damageMultiplier * (Math.ceil(Math.random()*damageValue)) + damageBonus)

    console.log(damageDealt);

}


monsterSummoner("bearded-devil");
