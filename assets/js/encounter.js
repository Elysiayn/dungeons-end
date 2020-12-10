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
    death_dog: "https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/265/387/315/636252768823194310.jpeg",
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
var runOdds = 10;

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
        hp: 50,
        ap: 0, // determined by roll 
        armor: 8,
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
combatLog.classList.add("log");

var currentScores = localStorage.getItem("scores")
if (!currentScores) {
    currentScores = [];
} else {
    currentScores = JSON.parse(currentScores)
}

var imageCard = document.getElementById("player-image");

imageCard.innerHTML = "<img class='style' style='width:100%;height:auto;' src=" + raceObj.imgUrl + "\>"

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
        .then(function (response) {
            response.json().then(function (data) {

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
        .then(function (response) {
            response.json().then(function (data) {
                var cleanUrl = data.name.split(" ").join("-")

                gameState.enemy.name = data.name;

                monsterImageAPI(cleanUrl);


                gameState.enemy.hp = data.hit_points;


                gameState.enemy.armor = data.armor_class;


                gameState.enemy.xp = data.xp;

                // duergar has an enlarge ability for it's first move causing it not fall in line with our current code. This if statment causes it to summon a new monster to replace it
                if (data.index === "duergar") {
                    var duergarCombatInfo = document.createElement("p");
                    duergarCombatInfo.textContent = "Duergar ran away!"
                    combatLog.prepend(duergarCombatInfo);

                    monsterRandomizer(gameState.user.level);
                }

                if (data.actions[0].name === "Multiattack") {

                    var attackInfo = {};

                    attackInfo.name = data.actions[0].name;
                    attackInfo.damageDice = 0;
                    gameState.enemy.attacks.push(attackInfo);

                    var count = 1;
                    for (i = 0; i < data.actions[0].options.from[0].length; i++) {

                        var attackInfo = {};

                        attackInfo.name = data.actions[count].name;
                        attackInfo.damageDice = data.actions[count].damage[0].damage_dice;
                        attackInfo.hitBonus = data.actions[count].attack_bonus;

                        gameState.enemy.attacks.push(attackInfo);
                        count++;
                    }
                } else {
                    // var needed on all parts to keep the function from overwriting other array elements
                    var attackInfo = {};

                    attackInfo.name = data.actions[0].name;
                    attackInfo.damageDice = data.actions[0].damage[0].damage_dice;
                    attackInfo.hitBonus = data.actions[0].attack_bonus;

                    gameState.enemy.attacks.push(attackInfo);
                }
            })
        })
}

// I think we may need to wrap the hitDiceRoll and damageDiceRoll in a while loop to continue these functions until the monster dies. However, doing so may prevent the other list of options. So, we will actually want to have that be in the while loop, then just call on these functions conditionally. 

// What're the 3-4 options that a user can choose from, and are those options available with each round or is it per battle?

// this calcualtes the damage done by the user and the monster when they land an attack

var damageDiceRoll = function (damageDice) {

    var damageInfo = damageDice.split(/[d,+]/);
    var damageMultiplier = parseInt(damageInfo[0]);
    var damageValue = parseInt(damageInfo[1]);
    if (parseInt(damageInfo[2])) {
        var damageBonus = parseInt(damageInfo[2]);
    } else {
        var damageBonus = 0;
    }

    damageDealt = ((damageMultiplier * (Math.ceil(Math.random() * damageValue))) + damageBonus)

}

// this determines if the user hits the monster and represent the fight button
var hitDiceRoll = function () {

    var toHit = Math.floor(Math.random() * (max - min + 1) + min);

    if (toHit < 6) {
        var userFailedAttackInfo = document.createElement("p");
        userFailedAttackInfo.textContent = "You've failed to strike the " + gameState.enemy.name + "."
        combatLog.prepend(userFailedAttackInfo);

    } else if (toHit >= 6) {
        var userAttackInfo = document.createElement("p");
        userAttackInfo.textContent = "You've dealt the " + gameState.enemy.name + " a mighty blow!"
        combatLog.prepend(userAttackInfo);

        damageDiceRoll(gameState.user.attack);

        gameState.enemy.hp = gameState.enemy.hp - damageDealt;

        var combatUpdate = document.createElement("p");
        combatUpdate.textContent = gameState.enemy.name + " now has " + gameState.enemy.hp + " HP remaining.";
        combatLog.prepend(combatUpdate);
    }

    endGame();
    // if statement is here to check if the monster is alive and before it attacks 
    if (gameState.enemy.hp > 0) {
        monsterAttack();
    }
    return toHit;
}

// this allows the player to take a dodge action and temperarily increase their armor to hopefully avoid a strike from the monster
var playerDodge = function (event) {

    // Logs Dodge action by Player
    var playerCombatDodge = document.createElement("p");
    playerCombatDodge.textContent = "You took the dodge action!";
    combatLog.prepend(playerCombatDodge);

    gameState.user.armor = gameState.user.armor + 5;


    monsterAttack();

    gameState.user.armor = gameState.user.armor - 5;
}

//this will allow the player to run away
var playerRun = function (event) {

    // Logs Run action by Player
    var playerCombatRun = document.createElement("p");
    playerCombatRun.textContent = gameState.user.name + " attempts to run away";
    combatLog.prepend(playerCombatRun);

    // calculates a number to determine if the user runs away they more they run the lower runOdds goes decreasing their chances of getting away. This should allow the users to run away from fight but not be able to run away from every tough monster holding out for weaker ones.
    // if they fail to run the monster attacks if they succeed it summons a new monster
    runChance = Math.ceil(Math.random() * (10 - 1) + runOdds)

    if (runChance < 10) {

        playerCombatRun.textContent = gameState.user.name + " failed to run away from " + gameState.enemy.name + ".";
        combatLog.prepend(playerCombatRun);

        monsterAttack();
    } else {

        playerCombatRun.textContent = gameState.user.name + " ran away from " + gameState.enemy.name + "." + " " + gameState.user.name + "'s ability to run away has diminshed slightly!";
        combatLog.prepend(playerCombatRun);

        monsterRandomizer(gameState.user.level);
        runOdds--;
    }
}

var healthPot = function () {

    var logPotion = document.createElement("p");
    var potionDrink = 10;

    // runs if the user has more then one health potion remaining
    if (healthPotCount > 1) {

        gameState.user.hp = gameState.user.hp + potionDrink;

        logPotion.textContent = gameState.user.name + " uses a health potion to restore 10HP! " + gameState.user.name + " has " + healthPotCount + " potions left.";
        combatLog.prepend(logPotion);

        healthPotCount--;

        monsterAttack();

        //runs if they have just one remaining to keep proper grammar 
    } else if (healthPotCount === 1) {

        gameState.user.hp = gameState.user.hp + potionDrink;

        logPotion.textContent = gameState.user.name + " uses a health potion. You have " + healthPotCount + " potion left.";
        combatLog.prepend(logPotion);

        healthPotCount--;

        monsterAttack();
        //runs if there is no health potions remaining 
    } else {

        logPotion.textContent = gameState.user.name + " is out of potions.";
        combatLog.prepend(logPotion);
    }
}

// this will grab an image of the monster
var monsterImageAPI = function (monsterName) {
    fetch("https://api.open5e.com/monsters/" + monsterName.toLowerCase())
        .then(function (response) {

            response.json().then(function (data) {

                var cleanMonster = monsterName.split("-").join("_").toLowerCase();

                var monsterImage = document.getElementById("monster-image");
                monsterImage.innerHTML = "<img class='style' style='width:100%;height:auto;' src=" + monsters[cleanMonster] + ">";
                var monsterTitle = document.createElement("span");
                monsterTitle.textContent = data.name.toUpperCase();
                monsterTitle.classList.add("card-title");
                monsterImage.append(monsterTitle);
                var monsterType = document.createElement("p");
                monsterType.textContent = data.type.toUpperCase();
                monsterType.classList.add("card-content");

                monsterImage.append(monsterType);

            })
        })
};

// this rolls to see if the monter hits the user 
var monsterStrike = function () {

    monsterHit = Math.floor(Math.random() * (max - min + 1) + min);
}

// this is the function to determine if the monster hit and if so what to do about it
var monsterAttack = function () {

    //checks if the monster has the mulitattack feature
    var logMonsterAttack = document.createElement("p");
    var logUserHpAfterMonsterHit = document.createElement("p");

    if (gameState.enemy.attacks[0].name === "Multiattack") {

        // this will run if the monster has a multiattack feature but only one basic attack. Allowing it to strike twice. the monsterstike function being inside the for loop forces it to have to check to see if it hits with each attack
        if (gameState.enemy.attacks.length < 3) {
            for (i = 0; i < gameState.enemy.attacks.length; i++) {
                monsterStrike();
                if (monsterHit < gameState.user.armor) {

                    logMonsterAttack.textContent = gameState.enemy.name + " failed to strike you!";
                    combatLog.prepend(logMonsterAttack);

                } else {

                    damageDiceRoll(gameState.enemy.attacks[1].damageDice);

                    logMonsterAttack.textContent = gameState.enemy.name + " hits you with " + gameState.enemy.attacks[1].name + " dealing " + damageDealt + " damage!";
                    combatLog.prepend(logMonsterAttack);

                    gameState.user.hp = gameState.user.hp - damageDealt;

                    logUserHpAfterMonsterHit.textContent = gameState.user.name + " has " + gameState.user.hp + " health remaining!";
                    combatLog.prepend(logUserHpAfterMonsterHit);

                    endGame();
                }
            }
        } else {
            // this will run through all other monster attacks if they have multiattack and more then one base ability
            for (i = 1; i < gameState.enemy.attacks.length; i++) {
                monsterStrike();
                if (monsterHit < gameState.user.armor) {

                    logMonsterAttack.textContent = gameState.enemy.name + " failed to strike you!";
                    combatLog.prepend(logMonsterAttack);

                } else if (monsterHit >= gameState.user.armor) {

                    damageDiceRoll(gameState.enemy.attacks[i].damageDice);

                    logMonsterAttack.textContent = gameState.enemy.name + " hits you with " + gameState.enemy.attacks[i].name + " dealing " + damageDealt + " damage!";
                    combatLog.prepend(logMonsterAttack);

                    gameState.user.hp = gameState.user.hp - damageDealt;


                    logUserHpAfterMonsterHit.textContent = gameState.user.name + " has " + gameState.user.hp + " health remaining!";
                    combatLog.prepend(logUserHpAfterMonsterHit);
                    endGame();
                }
            }
        }
    } else {
        // this will run if the monster does not have multiattack, it will use its first ability
        monsterStrike();
        if (monsterHit < gameState.user.armor) {

            logMonsterAttack.textContent = gameState.enemy.name + " failed to strike you!";
            combatLog.prepend(logMonsterAttack);

        } else if (monsterHit >= gameState.user.armor) {

            damageDiceRoll(gameState.enemy.attacks[0].damageDice);

            logMonsterAttack.textContent = gameState.enemy.name + " hits you with " + gameState.enemy.attacks[0].name + " dealing " + damageDealt + " damage!";
            combatLog.prepend(logMonsterAttack);

            gameState.user.hp = gameState.user.hp - damageDealt;

            logUserHpAfterMonsterHit.textContent = gameState.user.name + " has " + gameState.user.hp + " health remaining!";
            combatLog.prepend(logUserHpAfterMonsterHit);

            endGame();
        }
    }
}

monsterRandomizer(gameState.user.level);
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {});
});

// Health Potion Modal //
$(document).ready(function () {
    $('.modal').modal();
})

var logEndGame = document.createElement("p");
var logExp = document.createElement("p");

// function used to check if the user or enemies' heatlh falls below zero
var endGame = function () {

    if (gameState.enemy.hp <= 0) {
        logEndGame.textContent = gameState.enemy.name + " has been slain!";
        combatLog.prepend(logEndGame);

        gameState.user.xp = gameState.user.xp + gameState.enemy.xp;
        logExp.textContent = gameState.user.name + " earned " + gameState.enemy.xp + " XP from killing " + gameState.enemy.name + "!";
        combatLog.prepend(logExp);

        monsterRandomizer(gameState.user.level);

    } else if (gameState.user.hp <= 0) {
        console.log("You have perished");

        //store xp/score and character name in local store send user to highscore screen
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

var loadUser = function () {

    var storedUser = (localStorage.getItem("user"));

    if (!storedUser) {

        return false;
    }

    gameState.user = JSON.parse(storedUser);
}

var createHighScores = function (playerRanks) {

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