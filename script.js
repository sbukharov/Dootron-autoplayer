// ==UserScript==
// @name         DooTron script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Sergey, Karl helped
// @match        https://dootron.com/hilo
// @grant        for personal use only :^)
// ==/UserScript==

var _2C = "/assets/hilo/poker/0.png";
var _2D = "/assets/hilo/poker/1.png";
var _2H = "/assets/hilo/poker/2.png";
var _2S = "/assets/hilo/poker/3.png";

var _3C = "/assets/hilo/poker/4.png";
var _3D = "/assets/hilo/poker/5.png";
var _3H = "/assets/hilo/poker/6.png";
var _3S = "/assets/hilo/poker/7.png";

var _4C = "/assets/hilo/poker/8.png";
var _4D = "/assets/hilo/poker/9.png";
var _4H = "/assets/hilo/poker/10.png";
var _4S = "/assets/hilo/poker/11.png";

var _5C = "/assets/hilo/poker/12.png";
var _5D = "/assets/hilo/poker/13.png";
var _5H = "/assets/hilo/poker/14.png";
var _5S = "/assets/hilo/poker/15.png";

var _6C = "/assets/hilo/poker/16.png";
var _6D = "/assets/hilo/poker/17.png";
var _6H = "/assets/hilo/poker/18.png";
var _6S = "/assets/hilo/poker/19.png";

var _7C = "/assets/hilo/poker/20.png";
var _7D = "/assets/hilo/poker/21.png";
var _7H = "/assets/hilo/poker/22.png";
var _7S = "/assets/hilo/poker/23.png";

var _8C = "/assets/hilo/poker/24.png";
var _8D = "/assets/hilo/poker/25.png";
var _8H = "/assets/hilo/poker/26.png";
var _8S = "/assets/hilo/poker/27.png";

var _9C = "/assets/hilo/poker/28.png";
var _9D = "/assets/hilo/poker/29.png";
var _9H = "/assets/hilo/poker/30.png";
var _9S = "/assets/hilo/poker/31.png";

var _10C = "/assets/hilo/poker/32.png";
var _10D = "/assets/hilo/poker/33.png";
var _10H = "/assets/hilo/poker/34.png";
var _10S = "/assets/hilo/poker/35.png";

var JC = "/assets/hilo/poker/36.png";
var JD = "/assets/hilo/poker/37.png";
var JH = "/assets/hilo/poker/38.png";
var JS = "/assets/hilo/poker/39.png";

var QC = "/assets/hilo/poker/40.png";
var QD = "/assets/hilo/poker/41.png";
var QH = "/assets/hilo/poker/42.png";
var QS = "/assets/hilo/poker/43.png";

var KC = "/assets/hilo/poker/44.png";
var KD = "/assets/hilo/poker/45.png";
var KH = "/assets/hilo/poker/46.png";
var KS = "/assets/hilo/poker/47.png";

var AC = "/assets/hilo/poker/48.png";
var AD = "/assets/hilo/poker/49.png";
var AH = "/assets/hilo/poker/50.png";
var AS = "/assets/hilo/poker/51.png";



var safe_high_cards = [AC,AD,AH,AS, KC,KD,KH,KS, QC,QD,QH,QS];
var safe_low_cards = [_2C,_2D,_2H,_2S, _3C,_3D,_3H,_3S, _4C,_4S,_4H,_4S];


const CONST_BET_VALUE = 101; //the amount you want to bet per round
const DECISION_DELAY = 2500; //amount of time in ms between deciding what to do next (Don't set too low because dootron can be slow)
const CONST_CLICKSPEED = 500; //ms

// Safety feature - max number of executions for test
var CONST_MAX_LOOPS = 100;
// Safety feature - the lowest you want your bank to go
var CONST_MIN_BANK = 1000;


(function() {
    'use strict';
    window.onload = function() {
        setTimeout(function(){

            //betting button
            var btn_start = document.getElementsByClassName("btn btn-link state-start").item(0);
            //cashout button
            var btn_cash = document.getElementsByClassName("btn btn-link award-withdraw").item(0);
            //bet entry box
            var input_bet = document.getElementById("stake");
            //TRX balance span
            var output_trx_balance = document.getElementById("navbarNav").childNodes[1].childNodes[1].childNodes[0].childNodes[1].childNodes[0];
            //bet high button
            var btn_bet_high = document.getElementsByClassName("btn btn-link btn-high").item(0);
            //bet low button
            var btn_bet_low = document.getElementsByClassName("btn btn-link btn-low").item(0);
            //button to cashout
            var btn_cashout = document.getElementsByClassName("btn btn-link award-withdraw").item(0);


            let numloops = 0;
            //CAUTION - SET TIMEOUT JUST DELAYS THE EXECUTIOn - the loop runs several times, making the same decision, then executes it later.
            //need to implement a queue or something to wait for it to finish processing the first action before doing the next one
            playHiLoLoop();


        function playHiLoLoop() {
            if (!(numloops < CONST_MAX_LOOPS && parseFloat(output_trx_balance.innerHTML) > CONST_MIN_BANK))
                return;
            //make sure the game has loaded before doing anything
            if (document.getElementsByClassName("loading-card-face").length == 0) {
            //give enough time for the cards to flip
                setTimeout(function(){
                    console.log("Starting loop "+numloops+" - bank has  "+output_trx_balance.innerHTML);

                    //set bet value to const
                    input_bet.value = CONST_BET_VALUE;

                    //check card, if no card, click bet
                    if (btn_bet_high.hasAttribute("disabled")){
                        //set bet value to const
                        input_bet.value = CONST_BET_VALUE;
                        clickAny(btn_start);
                    } else {
                        //check card
                        var current_card = getCurrentCard();

                        let safecard = false;

                        for (let i in safe_high_cards) {
                            if (safe_high_cards[i] == getBackgroundURL(current_card)) {
                                safecard = true;
                            }
                        }
                        for (let i in safe_low_cards) {
                            if (safe_low_cards[i] == getBackgroundURL(current_card)) {
                                safecard = true;
                            }
                        }

                        //if current card is in safe_high or safe_low collection, bid accordingly
                        if (safecard) {
                            console.log("ITS A SAFE CARD");
                            if (shouldIBetHigh()) {
                                console.log("Betting high");
                                clickBetHigh();
                            } else {
                                console.log("Betting low");
                                clickBetLow();
                            }

                        } //else if you can cash out, cash out
                        else if (!safecard && !btn_cashout.hasAttribute("disabled")) {
                            console.log("ITS A DANGEROUS CARD, I'M CASHING OUT");
                            console.log("ABOUT TO CALL clickAny(btn_cashout)");
                            clickAny(btn_cashout);
                        } //else bid accordingly
                        else {

                            console.log("ITS A DANGEROUS CARD BUT ITS THE FIRST ROUND SO I HAVE TO BET");
                            if (shouldIBetHigh()) {
                                console.log("Betting high");
                                clickBetHigh();
                            } else {
                                console.log("Betting low");
                                clickBetLow();
                            }

                        }




                    }
                    //console.log(btn_bet_low);
                },DECISION_DELAY); //TIME BETWEEN BID DECISIONS
            }
            console.log("Finished loop "+numloops);
            numloops++;
            setTimeout(playHiLoLoop,DECISION_DELAY);
        }
        }, 3000);
    }
})();


function shouldIBetHigh(){
    var high_bet_pot_elem = document.getElementsByClassName("stage-high-pot").item(0);
    var low_bet_pot_elem = document.getElementsByClassName("stage-low-pot").item(0);
    var high_bet = parseFloat(high_bet_pot_elem.innerHTML);
    var low_bet = parseFloat(low_bet_pot_elem.innerHTML);

    if (low_bet == 0) { low_bet = 9999999}
    if (high_bet == 0) { high_bet = 9999999}

    return (high_bet < low_bet);
    //look at high and low payout numbers, return up/down based on the lowest of the two

}

function clickBetHigh() {
    setTimeout(function(){
        var buttontoclick = document.getElementsByClassName("btn btn-link btn-high").item(0);
        simulateclick(buttontoclick);
    },CONST_CLICKSPEED)
}

function clickBetLow() {
    setTimeout(function(){
        var buttontoclick = document.getElementsByClassName("btn btn-link btn-low").item(0);
        simulateclick(buttontoclick);
    },CONST_CLICKSPEED)
}


function clickAny(anybtn) {
    setTimeout(function(){
        simulateclick(anybtn);
    },CONST_CLICKSPEED)
}

function getCurrentCard() {
    let cards = document.getElementsByClassName("ng-tns-c11-1 ng-trigger ng-trigger-cards ng-star-inserted");
    return cards.item(cards.length-1);
}

function getBackgroundURL(elem) {
    return elem.style.backgroundImage.substr(5).slice(0, -2);
}

function simulateclick(elm) {
     var evt = document.createEvent('MouseEvents');
     evt.initMouseEvent('click', true, true, null, 0, 1, 1, 1, 1, false, false, false, false, 0, null);
     elm.dispatchEvent(evt);
}

