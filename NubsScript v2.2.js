var config = {
    mainTitle: { label: '*** Nubs27\'s Smart Script for Crash ***', type: 'title' },
    auto: { label: '', value: 'Script', type: 'radio', options: [
           { value: 'Script', label: 'Script'},
           { value: 'Player', label: 'Player'} ]},
    bet: { label: 'Base Bet', value: currency.minAmount, type: 'number' },
    lossTitle: { label: 'Stop When ', type: 'title' },
    stop: { label: 'Coins Lost >', value: 1, type: 'number' },
    end: { label: 'Minutes >', value: 250, type: 'number' },
    profit: { label: 'Profit >', value: 100, type: 'number' },
};
const PayOuts = [1.13, 1.17, 1.23, 1.27, 1.33, 1.36, 1.44, 1.48, 1.51, 1.53];
const FindPayOuts = [1.25, 1.51, 2, 2.5, 3, 4, 6];
var MultiplierArray = [1.50, 2.00, 2.50, 3.00, 5.00, 10.00, 100.00];
var PayOutPercents = [];
var PayOutConfidence = [];
var Array2Filter = [];
var FilteredArray = [];
var ScriptHistory = [];
var History = [];
var RoundsPlayed = 0;
var RoundsViewed = 0;
var LastGameID = 1;
var CurrentGameID = LastGameID + 1;
var MinimumBet = currency.minAmount;
var MaxBet = (currency.amount / 10);
var CurrentMultiplier = PayOuts[9];
var LastMultiplier = PayOuts[9];
var MaxLossesEncountered = 5;
var LargestMulitplier = 2;
var BaseBet = config.bet.value;
var CurrentBet = BaseBet;
var LastBet = BaseBet;
var LastShrek = CurrentGameID;
var LastTrain = CurrentGameID;
var LargestBet = BaseBet * 2;
var LastResult = "Won";
var CoinLost = 0;
var Losses = 0;
var Wins = 0;
var Red = 0;
var Green = 0;
var StartTime = new Date();
var EndTime = new Date();
var TimeDiff = (EndTime - StartTime);
var StartBalance = currency.amount;
var EndBalance = 0;
var Profit = 0;
var ProfPerMin = 0;
var NetProfit = 0;
var DisplayGreeting = "False";
var GotHistory = "False";
var BetYet = "False";
var LoggedBetData = "False";
var GameInfoLogged = "False";
var StrategyFound = "False";
var IsPlaying = "False";
var UpdateBets = "False";
var LastGame = History[0];
var LastCrash = 0;
var PrevCashOut = 0;
var WonAmount = 0;
var FindThisMultiplier = 1;
var FindShouldHave = 2;
var ThisAverage = 1;
var HistorySlice = 50;
var Paused = "True";
var IndexMax = PayOutConfidence[0];
var MaxIndex = 0;
var GetNumber = 0;

// Welcome the Player to the Script
console.clear();
function main () {    
engine.on('GAME_STARTING', function () {
    if (DisplayGreeting == "False") {
        log.info('     Nubs27s Smart Script for Crash');
        log.info("      ****************");
        log.info("See Web Console for more Information (Press F12)");
        console.log('%c~~~~~~~~~~~~~~~~~ Nubs27\'s Smart Script for Crash ~~~~~~~~~~~~~~~~~','color:Purple; font-weight:bold');
        console.log('%cScript Start Time: ' + StartTime,'color:Purple; font-weight:200');
        console.log('  %cWelcome ' + userInfo.name, 'color:Purple; font-weight:bold');
        console.log('  %cYour Starting Balance is: ' + StartBalance + ' ' + currency.currencyName, 'color:Purple; font-weight:bold');
        if (config.auto.value == 'Player') {
            if (config.bet.value > (currency.amount / 20000)) {
                log.info('[WARNING]: Script Recommends a bankroll of at least ' + (BaseBet * 20000) + '' + currency.currencyName + ' for the Base Bet you provided');
                log.info('[WARNING]: Script Recommends a bankroll of at least ' + (BaseBet * 20000) + '' + currency.currencyName + ' for the Base Bet you provided');
                log.info('[WARNING]: Script Recommends a bankroll of at least ' + (BaseBet * 20000) + '' + currency.currencyName + ' for the Base Bet you provided');
            }
            if (config.stop.value > currency.amount) {
                MaxBet = (currency.amount / 10);
                config.stop.value = currency.amount * 0.95;
                console.log('%c[WARNING]: Stop Loss Updated to ' + config.stop.value, 'color:Orange; font-weight:bold');
            }
        }else{
            betupdate();
        }
        console.log('  %cBase Bet: ' + BaseBet + ' Maximum Bet: ' + MaxBet, 'color:Purple; font-weight:bold');
        console.log('  %cYour Stoppers are: Coin Lost > ' + config.stop.value + '; Minutes > ' + config.end.value + '; Profit > ' + config.profit.value, 'color:Purple; font-weight:bold');
        console.log('%c~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~','color:Purple; font-weight:bold');
    }
    DisplayGreeting = "True";
    if (GotHistory == "False") {
        getnanohistory();
        GotHistory = "True";
    //    console.log(ScriptHistory);
        LastShrek = CurrentGameID;
        LastTrain = CurrentGameID;
    }
    console.log(' ----------------------------');
    CurrentGameID = (LastGameID + 1);
    console.log('[Round ID]: ' + CurrentGameID);
    if (StrategyFound == "False") {
        strategy();
    }
    checkstoppers();
//Get last 5 rounds & analize
    CurrentBet = BaseBet;
    MaxIndex = Math.floor(Math.random() * MaxIndex);
    CurrentMultiplier = GetNumber;
    CurrentBet = ((CoinLost + (BaseBet * Losses)) / (CurrentMultiplier - 1));
});
function getnanohistory() {
    History = engine.getHistory();
    for (i = 0; i < History.length; i++) {
        ScriptHistory.push(History[i].crash / 100);
        RoundsViewed++;
    }
}
function strategy() {
// Is there a Payout with a 80% Confidence or Higher? If not, pause.
    findconfidence();
// Which Payout has highest confidence based upon history & math?
    findlargestindex();
//    console.log('[Index] ' + '(' + MaxIndex + ')' + ' PayOut: ' + FindPayOuts[MaxIndex] + ' [Largest Confidence] ' + PayOutConfidence[MaxIndex]);
//    console.log(' PayOut ' + FindPayOuts[MaxIndex] + '; Confidence Level ' + PayOutConfidence[MaxIndex] + ' %');
    GetNumber = FindPayOuts[MaxIndex];
// Randomize the PayOut
    randompayout();
//    console.log('[Get Number] is: ' + GetNumber);
    if (MaxIndex == 0 && Losses == 6) {
        Paused = "True";
    }
    checkforstreaks();
    StrategyFound = "True";
// Which Payout has highest confidence based upon streakiness of rounds?
}
function randompayout() {
    GetNumber = GetNumber * 100;
    if (Losses < 3) {
        GetNumber = Math.floor(Math.random() * GetNumber) + 115;
    }else{
        GetNumber = Math.floor(Math.random() * GetNumber) + 133;
    }
    GetNumber = GetNumber / 100;
    if (isNaN(GetNumber)) {
        GetNumber = Math.floor(Math.random() * 198) + 151;
        GetNumber = GetNumber / 100;
    }
}
function checkforstreaks() {
    threeafterthree();
    shrek();
}
function shrek() {
    if (Green > 3 && LastResult == "Won") {
        CurrentBet = BaseBet;
        CurrentMultiplier = 2.14;
    }
    if (Green > 3 && LastResult == "Lost") {
        CurrentBet = ((CoinLost + (BaseBet * Losses)) / (CurrentMultiplier - 1));
        CurrentMultiplier = 2.14;
    }
}
function threeafterthree () {
    if (ScriptHistory[0] < 3.00 && ScriptHistory[1] < 3.00 && ScriptHistory[2] < 3.00) {
        if ((CurrentGameID - LastTrain) > 15 && (CurrentGameID - LastShrek > 10)) {
            if (LastResult == "Won") {
                CurrentBet = BaseBet * 2;
                CurrentMultiplier = 2.14;
            }
            if (LastResult == "Lost") {
                CurrentMultiplier = Math.floor(Math.random() * 288) + 211;
                CurrentMultiplier = CurrentMultiplier / 100;
                CurrentBet = ((CoinLost + CurrentBet) / (CurrentMultiplier - 1));
            }
            console.log('NonStreak of PayOut 3x. Going for it');
        }
    }
}
function findconfidence() {
    PayOutConfidence = [];
    for (i = 0; i < PayOutPercents.length; i++) {
        if (PayOutPercents[i] < 100) {
            PayOutConfidence[i] = (100 - PayOutPercents[i]);
            PayOutConfidence[i] = Math.abs(PayOutConfidence[i]);
            PayOutConfidence[i] = (PayOutConfidence[i] + 25);
        }else if (PayOutPercents[i] == 100) {
            PayOutConfidence[i] = 25;
        }else{
            PayOutConfidence[i] = 0;
        }
        if (i > 3) {
            PayOutConfidence[i] = (PayOutConfidence[i] - 25);
        }
        if (i > 5) {
            PayOutConfidence[i] = (PayOutConfidence[i] - 25);
        }
        if (PayOutConfidence[i] < 0) {
            PayOutConfidence[i] = 0;
        }
    }
}
function findlargestindex() {
    IndexMax = PayOutConfidence[0];
    MaxIndex = 0;
    for (var i = 1; i < PayOutConfidence.length; i++) {
        if (PayOutConfidence[i] >= IndexMax) {
            MaxIndex = i;
            IndexMax = PayOutConfidence[i];
        }
    }
}
engine.on('GAME_BET', function(player) {
    checkbet();
    if (BetYet == "False") {
        engine.bet(CurrentBet, CurrentMultiplier);
        console.log("[Betting] " + CurrentBet.toFixed(7) + " at " + CurrentMultiplier + "x");
    }
    BetYet = "True";
});
function checkbet() {
    MinimumBet = currency.minAmount;
//Check bet against player bankroll --- For what parameters???
//Check bet against site bankroll  - is there enough to win all we want?
    if (CurrentBet < BaseBet) {
        CurrentBet = BaseBet;
    }
    if (CurrentBet < MinimumBet) {
        CurrentBet = MinimumBet;
    }      
    if (CurrentBet > MaxBet) {
        CurrentBet = MaxBet;
    }
    if (CurrentBet > LargestBet) {
        LargestBet = CurrentBet;
    }
}
engine.on('GAME_ENDED', function (data) {
    RoundsViewed++;
    History = engine.getHistory();
    LastGame = History[0];
    LastCrash = (LastGame.crash / 100);
    PrevCashOut = LastCrash;
    LastGameID = LastGame.gameId;
    if (GameInfoLogged == "False") {
        loglastcrash();
    }
    updateplayer();
    updatescript();
    CurrentGameID = CurrentGameID.toString();
    if (CurrentGameID.endsWith('0')) {
        console.log('%cv1.9~~~~~~~~~~ Update Completed ~~~~~~~~~~','color:blue;');
        log.info('~~~~~Update Completed ~~~~~');
    }
    BetYet = "False";
    StrategyFound = "False";
    LoggedBetData = "False";
    Paused = "False";
});
function loglastcrash() {
    if (PrevCashOut > LargestMulitplier) {
        LargestMulitplier = PrevCashOut;
    }
    if (PrevCashOut < 2.01) {
        Red++;
        Green = 0;
        if (Red == 6) {
            LastTrain = CurrentGameID;
            console.log('Logging Round ' + CurrentGameID + ' as H Train');
        }
    }else{
        Green++;
        Red = 0;
        if (Green == 6) {
            LastShrek = CurrentGameID;
            console.log('Logging Round ' + CurrentGameID + ' as Shrek');
        }
    }
    if (ScriptHistory.unshift(PrevCashOut) > 999) ScriptHistory.shift();
//Check for if round was played
    if (LastGame.wager > 0) {
        LastGame.wager = CurrentBet;
        IsPlaying = "True";
        winorlose();
        RoundsPlayed++;
        LastBet = CurrentBet;
        LastMultiplier = CurrentMultiplier;
    }else{
        LastResult = "Not Played";
    }
}
function winorlose () {
    if (LastGame.cashedAt) {
        WonAmount = ((CurrentBet * CurrentMultiplier) - CoinLost - CurrentBet);
        Profit = Profit + WonAmount;
        LastResult = "Won";
        Wins++;
        Losses = 0;
        CoinLost = 0;
        log.info("[Profit] " + WonAmount);
        console.log('%c[Result] Round Won. ' + 'Net Profit of ' + WonAmount.toFixed(7),'color:green');
    }else{
        LastResult = "Lost";
        Losses++;
        Wins = 0;
        CoinLost = CoinLost + CurrentBet;
        console.log('%c[Result] Round ' + LastResult,'color:red');
        log.info('Round Lost');
    }
    if (Losses > MaxLossesEncountered) {
        MaxLossesEncountered = Losses;
        console.log("Encountered Streak of " + Losses + " Losses Before Win");
    }
    if (Losses > 2) {
        console.log('%c[Coin Lost] Cumulative Since Last Win: ' + CoinLost.toFixed(7),'color:red');
    }
}
function updatescript() {
    for (i = 0; i < MultiplierArray.length; i++) {
        FindThisMultiplier = MultiplierArray[i];
        FindMultiplierHistory();
        PayOutPercents[i] = ThisAverage;
    }
    if (UpdateBets == "True" && LastResult == "Won") {
        betupdate();
        UpdateBets = "False";
    }
//    console.log(PayOutPercents);
}
function FindMultiplierHistory() {
    FindThisMultiplier = (FindThisMultiplier - 0.01);
    Array2Filter = ScriptHistory.slice(0,[HistorySlice]);
    FilteredArray = Array2Filter.filter(function (e) {
        return e > FindThisMultiplier;
        });
    FindThisMultiplier = (FindThisMultiplier + 0.01);
    DisplayTimesSeen();
    findpercents();
}
function DisplayTimesSeen() {
    FindShouldHave = (Array2Filter.length / FindThisMultiplier);
    FindShouldHave = (FindShouldHave * 100);

    FindShouldHave = Math.round(FindShouldHave);
    FindShouldHave = (FindShouldHave / 100);
    CurrentGameID = CurrentGameID.toString();
    if (CurrentGameID.endsWith('0')) {
        console.log("PayOuts " + FindThisMultiplier + "x & Higher " + Math.round(FindShouldHave) + " times. There were " + FilteredArray.length);
    }
}
function findpercents() {
    ThisAverage = FilteredArray.length / Math.round(FindShouldHave);
    ThisAverage = (ThisAverage * 100);
    ThisAverage = Math.round(ThisAverage);
}
function updateplayer() {
    EndBalance = currency.amount;
    NetProfit = EndBalance - StartBalance;
    var ProfitPercent = (NetProfit / StartBalance) * 100;
    EndTime = new Date();
    TimeDiff = ((EndTime - StartTime) / 1000 )/ 60;
    ProfPerMin = (Profit / TimeDiff);
    CurrentGameID = CurrentGameID.toString();
    if (CurrentGameID.endsWith('0')) {
        console.log(" ");
        console.log('%c~~~~~~~~~~ NubsScript Update ~~~~~~~~~~','color:blue;font-weight:bold');
        console.log("Viewed " + RoundsViewed + " Played " + RoundsPlayed + " Rounds in " + TimeDiff.toLocaleString('en') + " minutes");
        console.log("Base Bet: " + BaseBet +  " "  + currency.currencyName + " Highest Bet: " + LargestBet.toFixed(7) + " " + currency.currencyName);
        console.log("Begining Bank " + StartBalance.toFixed(7) + " Current Bank " + currency.amount.toFixed(7) + " " + currency.currencyName);
        console.log("Session Net Profit " + NetProfit.toFixed(7) + ' ' + currency.currencyName + " or " + ProfitPercent.toFixed(2) + "% ");
        console.log("Profit Per Minute " + ProfPerMin.toFixed(7) + ' ' + currency.currencyName);
        console.log("Highest PayOut Seen: " + LargestMulitplier + "x");
        console.log("In the last " + HistorySlice + " rounds there was: ");
        log.info(" ");
        log.info('~~~~~  NubsScript Update  ~~~~~');
        log.info("Viewed " + RoundsViewed + " Played " + RoundsPlayed + " Rounds in " + TimeDiff.toLocaleString('en') + " minutes");
        log.info("Base Bet: " + config.bet.value +  " "  + currency.currencyName + " Highest Bet: " + LargestBet + " " + currency.currencyName);
        log.info("Begining Bank " + StartBalance.toFixed(7) + " Current Bank " + currency.amount.toFixed(7) + " " + currency.currencyName);
        log.info("Session Net Profit " + NetProfit.toFixed(7) + ' ' + currency.currencyName + " or " + ProfitPercent.toFixed(2) + "% ");
        log.info("Profit Per Minute " + ProfPerMin.toFixed(7) + ' ' + currency.currencyName);
        log.info("Highest PayOut Seen: " + LargestMulitplier + "x");
    }
    if (CurrentGameID.endsWith('10') && RoundsViewed > 50) {
        UpdateBets = "True";
    }
}
function checkstoppers() {
    if (TimeDiff > config.end.value && LastResult == "Won") {
        log.info("Stopped Due to User Parameters (Minutes)");
        console.log("Stopped Due to User Parameters (Minutes)");
        engine.stop();
    }
    if (Profit > config.profit.value && LastResult == "Won") {
        log.info("Stopped Due to User Parameters (Profit)");
        console.log("Stopped Due to User Parameters (Profit)");
        engine.stop();
    }
    if (CoinLost > config.stop.value) {
        log.info("Stopping Due to User Parameters");
        console.log("Stopping Due to User Parameters (Coin Lost)");
        engine.stop();
    }
}
function betupdate() {
    BaseBet = currency.amount / 25000;
    MaxBet = (currency.amount / 10);
    config.stop.value = currency.amount * 0.95;
    console.log('%c[WARNING]: Stop Loss Updated to ' + config.stop.value, 'color:Orange; font-weight:bold');
    console.log('%c[WARNING]: Base Bet Updated to ' + BaseBet, 'color:Orange; font-weight:bold');
}
}