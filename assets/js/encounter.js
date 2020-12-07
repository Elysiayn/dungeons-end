// Fighter Card Variables
var fighters = {
    human: {
        imgUrl: "./assets/images/image1.jpg",
        title: "Human Fighter",
        description: "Fighter 1"
    },
    orc: {
        imgUrl: "./assets/images/image2.jpg",
        title: "Orc Fighter",
        description: "Fighter 2"
    },
    aasimar: {
        imgUrl: "./assets/images/image3.jpg",
        title: "Aasimar Fighter",
        description: "Fighter 3"
    },
    elf: {
        imgUrl: "./assets/images/image4.jpg",
        title: "Elf Fighter",
        description: "Fighter 4"
    },
} 
var monsters = {
    aboleth: "https://bit.ly/37Tt45t",
    animated_armor: "https://www.aidedd.org/dnd/images/animated-armor.jpg",
    brass_dragon_wyrmling: "https://bit.ly/36LrCCP",
    brown_bear: "https://bit.ly/36JyvUT",
    bugbear: "https://bit.ly/2JPNrbk",
    copper_dragon_wyrmling: "https://bit.ly/2IhBsmh",
    death_dog: "https://bit.ly/3gfw1AN",
    dire_wolf: "https://bit.ly/3oqb6Oq",
    dryad: "https://bit.ly/3qx2nMb",
    ghoul: "https://bit.ly/39LnggT",
    giant_eagle: "https://bit.ly/3lM5g8n",
    giant_hyena: "https://bit.ly/2VKqitj",
    giant_octopus: "https://bit.ly/37x2b6Q",
    giant_spider: "https://bit.ly/37IfVMc",
    giant_toad: "https://bit.ly/33KEyXG",
    giant_vulture: "https://bit.ly/33PI6ro",
    harpy: "https://bit.ly/2JCEvpK",
    hippogriff: "https://bit.ly/2VK70Eo",
    imp: "https://bit.ly/3mOxlgq",
    lion: "https://bit.ly/39Nn9Bk",
    quasit: "https://bit.ly/3osPRvy",
    specter: "https://bit.ly/3lMPWZh",
    spy: "https://bit.ly/36JjHWm",
    swarm_of_quippers: "https://bit.ly/2L1dIUr",
    tiger: "https://bit.ly/36Qqz4B"
};

// used in the run function to slowly decrease user's chance of running away
var runOdds =10;

//Pull Value from localStorage
var selected = localStorage.getItem("race");

// grab the race and image of the Fighter selected on index.html
let raceObj
if (selected === "elf") {
    raceObj = fighters.elf

} else if (selected === "human") {
    raceObj = fighters.human

} else if (selected === "aasimar") {
    raceObj = fighters.aasimar

} else if (selected === "orc") {
    raceObj = fighters.orc
}

var gameState = {
    user: {
        name: "",
        hp: 50, // determined by player selected
        ap: 0, // determined by roll 
        armor: 8, // determined by player selected
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
        challenge_rating: 0,
        attacks: []
    },

}
var combatLog = document.getElementById("combat-info");

var currentScores = localStorage.getItem("scores")
if (!currentScores) {
    currentScores= [];
} else {
    currentScores = JSON.parse(currentScores)
}
console.log(gameState.user.name)
var imageCard = document.getElementById("player-image");
// console.log(imageCard);
imageCard.innerHTML = "<img class='style' style='width:200px;height:300px;' src=" + raceObj.imgUrl + "\>"


// var playerTitle = document.createElement("span");
// playerTitle.textContent = gameState.user.name

// imageCard.append(playerTitle);

// tempObj.imgUrl

/*var playerInfo = [{
    name: " ",
    score: 0
}
]*/

var damageDealt = 0;
var healthPotCount = 4;

var min = Math.ceil(1);
var max = Math.floor(20);
var monsterHit = Math.floor(Math.random() * (max - min + 1) + min);


//this function pulls a random monster based on the player's current level
var monsterRandomizer = function (playerLevel) {
    fetch(
        "https://www.dnd5eapi.co/api/monsters?challenge_rating=" + playerLevel
    )
    .then(function(response){
    response.json().then(function(data){

    var randomMonster = data.results[Math.floor(Math.random() * data.results.length)]
    
        monsterSummoner(randomMonster.index);

    })
})
}


// this takes the monster from the monsterRandomizer function and gets the stats for it from the api

var monsterSummoner = function (monster) {
    
    fetch(
        "https://www.dnd5eapi.co/api/monsters/" + monster 
    )
    .then(function(response){
        response.json().then(function(data) {
            var cleanUrl = data.name.split(" ").join("-")
            //console.log(data.name);
            gameState.enemy.name = data.name;
            console.log("Line 135", data);
            monsterImageAPI(cleanUrl);

            //console.log(data.hit_points);
            gameState.enemy.hp = data.hit_points;

            //console.log(data.armor_class);
            gameState.enemy.armor = data.armor_class;

            //console.log(data.xp);
            gameState.enemy.xp = data.xp;
            
            if (data.index === "duergar") {
                var duergarCombatInfo = document.createElement("p");
                duergarCombatInfo.textContent = "Duergar ran away!"
                combatLog.append(duergarCombatInfo);
                console.log("line 182", "duergar ran away")
                monsterRandomizer(gameState.user.level);
            }

            

            if (data.actions[0].name === "Multiattack") {
            //console.log(data.actions[0].name);
            /*console.log(data.actions[0].options.from[0]);*/

            var attackInfo = {};

            attackInfo.name = data.actions[0].name;
            attackInfo.damageDice = 0;
            gameState.enemy.attacks.push(attackInfo); 
            
            //debugger;

            var count = 1;
            for( i= 0; i < data.actions[0].options.from[0].length; i++ ){
                
                var attackInfo = {};

                attackInfo.name = data.actions[count].name;  
                attackInfo.damageDice = data.actions[count].damage[0].damage_dice;
                attackInfo.hitBonus = data.actions[count].attack_bonus;

                gameState.enemy.attacks.push(attackInfo);
                count ++;
            }
                
            } else{
                
                // var needed on all parts to keep the function from overwriting other array elements
                var attackInfo = {};

                attackInfo.name = data.actions[0].name;
                attackInfo.damageDice = data.actions[0].damage[0].damage_dice;
                attackInfo.hitBonus = data.actions[0].attack_bonus;

                gameState.enemy.attacks.push(attackInfo);
                
            }
           // console.log(gameState.enemy.attacks)
        })
    }
    )
}


// I think we may need to wrap the hitDiceRoll and damageDiceRoll in a while loop to continue these functions until the monster dies. However, doing so may prevent the other list of options. So, we will actually want to have that be in the while loop, then just call on these functions conditionally. 

// What're the 3-4 options that a user can choose from, and are those options available with each round or is it per battle?

// this calcualtes the damage done by the user and the monster when they land an attack

var damageDiceRoll = function(damageDice) {

    var damageInfo = damageDice.split(/[d,+]/);
    var damageMultiplier = parseInt(damageInfo[0]);
    var damageValue = parseInt(damageInfo[1]);
    if(parseInt(damageInfo[2])){
    var damageBonus = parseInt(damageInfo[2]);
    } else {
        var damageBonus = 0;
    }

    /*console.log(damageInfo);
    console.log(damageValue);
    console.log(damageMultiplier);
    console.log(damageBonus);*/

    damageDealt = ((damageMultiplier * (Math.ceil(Math.random()*damageValue))) + damageBonus)

    // console.log(damageDealt);

}


// this determines if the user hits the monster and represent the fight button

var hitDiceRoll = function() {
    
    var toHit = Math.floor(Math.random() * (max - min + 1) + min);
    

    if (toHit < 6) {
        var userFailedAttackInfo = document.createElement("p");
                userFailedAttackInfo.textContent = "You've failed to strike the " + gameState.enemy.name + "."
                combatLog.appendChild(userFailedAttackInfo);
        console.log("line 272", "You've failed to strike the " + gameState.enemy.name + ".");
    } else if (toHit >= 6) {
        var userAttackInfo = document.createElement("p");
                userAttackInfo.textContent = "You've dealt the " + gameState.enemy.name + " a mighty blow!"
                combatLog.appendChild(userAttackInfo);
        console.log("line 277", "You've dealt the " + gameState.enemy.name + " a mighty blow!")

        damageDiceRoll(gameState.user.attack);
        
        gameState.enemy.hp = gameState.enemy.hp - damageDealt;

        var combatUpdate = document.createElement("p");
        combatUpdate.textContent = gameState.enemy.name + " now has " + gameState.enemy.hp + " hp remaining."
        combatLog.append(combatUpdate);

        console.log("Line 287", gameState.enemy.name + " now has " + gameState.enemy.hp + " hp remaining.")
    }

    // if (toHit + str + profBonus > monsterArmor) {
    //     damageDiceRoll();
    // } else {
        
    // }

    
    endGame();
    // if statement is here to check if the monster is alive and before it attacks 
    if (gameState.enemy.hp > 0) {
    monsterAttack();
    }
    return toHit;    
}

//console.log("Look at me!", hitDiceRoll());


// this allows the player to take a dodge action and temperarily increase their armor to hopefully avoid a strike from the monster

var playerDodge = function (event) {
    console.log("You took the dodge action");
    gameState.user.armor = gameState.user.armor + 5;
    //console.log(gameState.user.armor);

    monsterAttack();
    
    gameState.user.armor = gameState.user.armor -5;
    //console.log(gameState.user.armor);

    
}

//this will allow the player to run away

var playerRun = function (event) {
    console.log(gameState.user.name + " attempts to run away");
    

    // calculates a number to determine if the user runs away they more they run the lower runOdds goes decreasing their chances of getting away. This should allow the users to run away from fight but not be able to run away from every tough monster holding out for weaker ones.
    // if they fail to run the monster attacks if they succeed it summons a new monster
    runChance = Math.ceil(Math.random() * (10 - 1) +  runOdds)
    console.log(runOdds)
    console.log(runChance)
    if (runChance < 10) {
    
    console.log(gameState.user.name + " failed to run away from " + gameState.enemy.name + ".");
    monsterAttack();
    } else {
        console.log(gameState.user.name + " ran away from " +gameState.enemy.name + ".");
        monsterRandomizer(gameState.user.level);
        runOdds --;
    }


    
}

var healthPot = function () {
    
    var potionDrink = 10;

    if(healthPotCount > 1 ){
        
        gameState.user.hp = gameState.user.hp + potionDrink;

        console.log(gameState.user.name + " uses a health potion. You have " + healthPotCount + " potions left.")
        console.log(potionDrink)
        healthPotCount--;
        
        monsterAttack();

    } else if (healthPotCount === 1) {
        
        gameState.user.hp = gameState.user.hp + potionDrink;

        console.log(potionDrink)
        console.log(gameState.user.name + " uses a health potion. You have " + healthPotCount + " potion left.")
        healthPotCount--;
    
        monsterAttack();
    } else {
        console.log(gameState.user.name + " is out of potions.")
    }

    
}

// this will grab an image of the monster

var monsterImageAPI = function(monsterName) {
    fetch("https://api.open5e.com/monsters/" + monsterName.toLowerCase())
    .then(function(response) {
        
        response.json().then(function(data) {
            console.log("HIIIIIIIIIIIII", data);
            var cleanMonster = monsterName.split("-").join("_").toLowerCase();
            console.log(monsters[cleanMonster]);
            var monsterImage = document.getElementById("monster-image");
            monsterImage.innerHTML = "<img class='style' style='width:200px;height:300px;' src=" + monsters[cleanMonster] + ">";
            var monsterTitle = document.createElement("span");
            monsterTitle.textContent = data.name.toUpperCase();
            monsterImage.append(monsterTitle);
            var monsterType = document.createElement("p");
            monsterType.textContent = data.type.toUpperCase();
            //
            monsterImage.append(monsterType);
            // console.log(data.results[1].img_main);
        })
    })
};


// this rolls to see if the monter hits the user 

var monsterStrike =  function() { 
    
    monsterHit = Math.floor(Math.random() * (max - min + 1) + min);
    //console.log(monsterHit)

}

// this is the function to determine if the monster hit and if so what to do about it

var monsterAttack = function () {
    
        //  console.log(gameState.enemy.attacks[0].name);
     
        //checks if the monster has the mulitattack feature

        if (gameState.enemy.attacks[0].name === "Multiattack"){
           // debugger;
           // var count = 1;
           
            
            // this will run if the monster has a multiattack feature but only one basic attack. Allowing it to strike twice. the monsterstike function being inside the for loop forces it to have to check to see if it hits with each attack
            if (gameState.enemy.attacks.length < 3 ) {
                for(i=0; i < gameState.enemy.attacks.length; i++ ) {                
                    monsterStrike();
                    if (monsterHit < gameState.user.armor) {
                        console.log(gameState.enemy.name + " failed to strike you!")
                    } else if (monsterHit>= gameState.user.armor){

                        

                        damageDiceRoll(gameState.enemy.attacks[1].damageDice);
                        console.log(gameState.enemy.name + " hits you with " + gameState.enemy.attacks[1].name + " dealing " + damageDealt + " damage!");
                        gameState.user.hp = gameState.user.hp - damageDealt;
                        console.log(gameState.user.name + " has " + gameState.user.hp + " health remaining!")
                        endGame();
                    }
                }
            } else {
                // this will run through all other monster attacks if they have multiattack and more then one base ability
            for ( i = 1; i < gameState.enemy.attacks.length; i++) {
                monsterStrike();
                if (monsterHit< gameState.user.armor) {
                    console.log(gameState.enemy.name + " failed to strike you!")
                } else if (monsterHit >= gameState.user.armor) {


                    damageDiceRoll(gameState.enemy.attacks[i].damageDice);
                    console.log(gameState.enemy.name + " hits you with " + gameState.enemy.attacks[i].name + " dealing " + damageDealt + " damage!");
                    gameState.user.hp = gameState.user.hp - damageDealt;
                    console.log(gameState.user.name + " has " + gameState.user.hp + " health remaining!")
                    endGame();
                }
                
            }}}
         else {
             // this will run if the monster does not have multiattack, it will use its first ability
            monsterStrike();
            if (monsterHit < gameState.user.armor) {
                console.log(gameState.enemy.name + " failed to strike you!")
            } else if (monsterHit >= gameState.user.armor){


                damageDiceRoll(gameState.enemy.attacks[0].damageDice);
                console.log(gameState.enemy.name + " hits you with " + gameState.enemy.attacks[0].name + " dealing " + damageDealt + " damage!");
                gameState.user.hp = gameState.user.hp - damageDealt;
                console.log(gameState.user.name + " has " + gameState.user.hp + " health remaining!");
                endGame();
            }
        }
    
}  

monsterRandomizer(gameState.user.level);
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
  });

// Health Portion Modal //
$(document).ready(function(){
    $('.modal').modal();
  })
  


  // function used to check if the user or enemies' heatlh falls below zero
var endGame = function() {

    if (gameState.enemy.hp <= 0) {
        console.log("The monster has been slain");
        gameState.user.xp = gameState.user.xp + gameState.enemy.xp;
        console.log (gameState.user.xp);
        monsterRandomizer(gameState.user.level);
        
    } else if(gameState.user.hp <= 0) {
        console.log("You have perished");
        //store xp/score and character name in local store send user to highscore screen
        /*playerInfo.name = gameState.user.name;
        playerInfo.score = gameState.user.xp;*/
        
        var playerInfo = {
            name: gameState.user.name,
            score: gameState.user.xp
        }
        
        createHighScores(playerInfo);
        window.location.href = "./highscore.html"

    } 


}

var saveUserScore = function () {
    localStorage.setItem("scores", JSON.stringify(currentScores))
}

var loadUser= function() {

    var storedUser = (localStorage.getItem("user"));

    if (!storedUser) {

        return false;
    }

    gameState.user = JSON.parse(storedUser);

    
}


/*var loadHighScores = function () {
    
    var storedScores = (localStorage.getItem("scores"))

    if (!storedScores){
        
        currentScores = [];
        return false;
    }

    storedScores = JSON.parse(storedScores);
    console.log(storedScores);
      

    storedScores.sort(compare);

    for (var i = 0; i < storedScores.length; i++) {
            createHighScores(storedScores[i]);
        }

}*/



var createHighScores = function(playerRanks) {

    currentScores.push(playerRanks);

    saveUserScore();
}

loadUser();
var playerTitle = document.createElement("span");
playerTitle.textContent = gameState.user.name.toUpperCase();
playerTitle.classList.add("card-title");
var playerRace = document.createElement("p");
playerRace.classList.add("card-content");





playerRace.textContent = selected.toUpperCase();
imageCard.append(playerTitle);
imageCard.append(playerRace);


 document.getElementById("attack-button").addEventListener("click", hitDiceRoll);
 document.getElementById("dodge-button").addEventListener("click", playerDodge);
 document.getElementById("run-button").addEventListener("click", playerRun);
 document.getElementById("demo-modal").addEventListener("click", healthPot);
 

