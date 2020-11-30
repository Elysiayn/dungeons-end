var inputEl = document.getElementById("player-name");


var beginAdventure = function(event) {
    console.log("Hooray!");
};

document.getElementById("start-button").addEventListener("click", beginAdventure);

var monsterRandomizer = function () {
    fetch(
        "https://www.dnd5eapi.co/api/monsters?challenge_rating=1,2,3,4,5"
    )
    .then(function(response){
    response.json().then(function(data){

    var randomMonster = data.results[Math.floor(Math.random() * data.results.length)]
    
        monsterSummoner(randomMonster.index);

    })
})
}


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
            console.log(data.actions[0].name);
            console.log(data.actions[0].damage[0].damage_dice);
            console.log(data.actions[0].attack_bonus);
            damageDiceRoll(data.actions[0].damage[0].damage_dice);

        })
    }
    )
}

// I think we may need to wrap the hitDiceRoll and damageDiceRoll in a while loop to continue these functions until the monster dies. However, doing so may prevent the other list of options. So, we will actually want to have that be in the while loop, then just call on these functions conditionally. 

// What're the 3-4 options that a user can choose from, and are those options available with each round or is it per battle?

var hitDiceRoll = function() {
    min = Math.ceil(1);
    max = Math.floor(20);
    var toHit = Math.floor(Math.random() * (max - min + 1) + min);

    if (toHit + str + profBonus > monsterArmor) {
        damageDiceRoll();
    } else {
        // I am not sure what the else would be. What happens if you don't beat the target's armor value?
    }

    return toHit;    
}
console.log("Look at me!", hitDiceRoll());

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


monsterRandomizer();
