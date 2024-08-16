import { words } from './words.js';

var userAnswer = [];
var boardRow = $(".Row-module_row__pwpBq");
var keyboard = $(".Key-module_key__kchQI").toArray();
const myMap = new Map();
var currentRow = 0;
var wait = false;
var isPlaying = true;
//default
var answer = ["A", "D", "I", "E", "U"];

//using https://random-word-api.herokuapp.com/word?length=5 API
/**
 *  $("#title").html("Loading...");
    fetch("https://random-word-api.herokuapp.com/word?length=5")
    .then((response) => response.json())
    .then((json) => {
        console.log(json[0]);
        answer = json[0].toUpperCase().split("");
        startGame();
        $("#title").html("Wordle");
    });
 */

//using imported words
$("#secret").html("&nbsp&nbsp&nbsp&nbsp&nbsp");
answer = getRandomItem(words);
console.log(answer);
$(".absolute").on("mouseenter", function() {
    console.log("test")
            $("#secret").html(answer);
});
$(".absolute").on("mouseleave", function() {
    console.log("test1")
    $("#secret").html("&nbsp&nbsp&nbsp&nbsp&nbsp");
});

//using .txt file


startGame();
$("#title").html("Wordle");



function getRandomItem(arr) {
    if (arr.length === 0) return undefined; // Handle empty array case
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].toUpperCase();
}

function startGame() {

    $(document).keydown(function (event) {
        takeInput(event.key);
    });
    keyboard.forEach(element => {
        element.addEventListener("click", function () {
            var key = element.getAttribute("data-key").toUpperCase();
            console.log(key);
            takeInput(key);
        })
    });
}

function takeInput(input) {
    if ((/^[aA-zZ]$/.test(input) && isPlaying) || ['←', '↵', 'Backspace', 'Enter'].includes(input)) {
        console.log(wait);
        if ((input === "Enter" || input === '↵') && !wait) {
            if(!isPlaying ) {
                location.reload();
            }
            if (userAnswer.length === 5) {

                wait = true;
                console.log(userAnswer);
                if (words.includes(userAnswer.join("").toLowerCase())) {
                    if (checkAnswer()) {
                        $("#title").html("You WIN! Press ENTER to play again").css("title");
                        $("#play-again").toggleClass("hidden");
                        // $(document).off('keydown');
                        isPlaying = false;
                    } else if (currentRow > 5) {
                        $("#title").html(`No LUCK! Answer is ${answer.join("")}`);
                        $("#play-again").toggleClass("hidden");
                    }
                    userAnswer = [];
                } else {
                    shakeElement(boardRow[currentRow]);
                }
                wait = false;
                //const reqeust = new Request(`https://api.dictionaryapi.dev/api/v2/entries/en/${userAnswer.join("")}`);

                // fetch(reqeust)
                //     .then((response) => {
                //         if (response.status === 200) {
                //             if (checkAnswer()) {
                //                 $("#title").html("You WIN!").css("title");
                //                 $("#play-again").toggleClass("hidden");
                //                 $(document).off('keydown');
                //             } else if (currentRow > 5) {
                //                 $("#title").html(`No LUCK! Answer is ${answer.join("")}`);
                //                 $("#play-again").toggleClass("hidden");
                //             }
                //             userAnswer = [];
                //         } else {
                //             shakeElement(boardRow[currentRow]);
                //         }

                //     }).finally(() => {
                //         wait = false;
                //     });

            } else {
                shakeElement(boardRow[currentRow]);
            }
        }
        else if (input === "Backspace" || input === '←') {
            var box = boardRow[currentRow].children[userAnswer.length - 1].children[0];
            userAnswer.pop();
            box.innerText = "";
            box.setAttribute("data-state", "empty");
        }
        else if (userAnswer.length < 5 && /^[aA-zZ]$/.test(input)) {

            userAnswer.push(input);
            var box = boardRow[currentRow].children[userAnswer.length - 1].children[0];
            box.classList.add('pop');

            // Remove the class after the animation is done to allow it to be triggered again
            box.addEventListener('animationend', () => {
                box.classList.remove('pop');
            }, { once: true });
            box.innerText = input.toUpperCase();
            box.setAttribute("data-state", "tbd");

        }
    }
}


function checkAnswer() {
    console.log(answer);
    var answerCopy = [...answer];



    for (let index = 0; index < answer.length; index++) {
        const answerChar = answer[index].toUpperCase();
        var box = boardRow[currentRow].children[index].children[0];
        var userChar = box.innerText;
        if (answerChar === userChar) {
            myMap.set(userChar, "correct");
            remove(answerCopy, userChar);
            box.setAttribute("data-state", "correct");
        } else {
            box.setAttribute("data-state", "absent");
            myMap.set(userChar, "absent");
        }
    }

    if (answerCopy.length === 0) {
        return true;
    }

    for (let index = 0; index < answer.length; index++) {
        const answerChar = answer[index].toUpperCase();
        var box = boardRow[currentRow].children[index].children[0];
        var userChar = box.innerText;
        if (answer.includes(userChar) && answerCopy.includes(userChar)) {
            myMap.set(userChar, "present");
            remove(answerCopy, userChar);
            box.setAttribute("data-state", "present");
        }
    }

    // for (let index = 0; index < answer.length; index++) {
    //     var box = boardRow[currentRow].children[index].children[0];
    //     var userChar = box.innerText;
    //     if (!answerCopy.includes(userChar)) {
    //         box.setAttribute("data-state", "absent");
    //         myMap.set(userChar, "absent");
    //     }

    // }

    keyboard.forEach(element => {
        var key = element.getAttribute("data-key").toUpperCase();
        if (myMap.has(key)) {
            element.setAttribute("data-state", myMap.get(key))
        }
    });
    currentRow++;
    return false;
}

function remove(array, char) {
    const index = array.indexOf(char);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

function shakeElement(element) {
    element.classList.add('shake');

    // Remove the class after the animation is complete
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500); // Match the duration of the animation in milliseconds
}