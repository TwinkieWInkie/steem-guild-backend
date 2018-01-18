/**
 * This is an example of the popular auto voting bot in Steem called randowhale
 * This bot will upvote a random vote to anyone who send it 2 STEEM or SBD, the random vote weights
 * between 1% to 5% and it will send back the money if the user sent less or didn't put a correct
 * link in memo of transaction. 
 * 
 * Feel free to send me a fat tip in Steemit if you found it useful ;-)
 * https://steemit.com/@p0o
 */

// change the line below to include the library from npm package:
// const SteemBot = require('steem-bot').default
// or:
// import SteemBot from 'steem-bot';
const SteemBot = require('steem-bot').default;

const username = 'earthnation';
// we only use active key here since we need to transfer back the money
// using postingKey for posting comment is not necessary since if it's not available steem-bot automatically pick activeKey
const activeKey = '5K8jDimY1BmHMSQJXJXYjghk8omHxoERhsAKbdMCoqxNRZabVUm'; // Use environment variables instead of hardcoding to be safer
const postingKey = '5J4dKErHyb7GuTrHCNjqsGYHuo1tLd9xFV61QZYRBwmK9947AdD';
// helper function to identify if memo has a valid steemit link 
function isValidSteemitLink(link) {
  return link.indexOf('steemit.com') > -1;
}

const bot = new SteemBot({username, postingKey, activeKey});

bot.onDeposit(username, handleDeposit);

function handleDeposit(data, responder) {
    console.log('received');
  // Only vote if user sent equal or more than 2 Steem or SBD and has a valid Steemit link in memo
  if (parseFloat(data.amount) >= 0.01 &&  isValidSteemitLink(data.memo)) {
    // generate a float number between 1 and 5
    const fee = parseFloat(data.amount) / 10;
    const devFee = fee / 10 * 2;

    let leftovers = parseFloat(data.amount) - fee;
      
    // First, pay our respect to the god
    console.log('starting payments');
      console.log(parseFloat(devFee));
    sendTo('conet', 1);
    // Then, we bow to the underworld
    
    sendTo('treeplanter', 0.25);
    //sendTo('qustodian', 1);
    sendTo('iamgrootbot', 0.005);
    sendTo('steemthat', 0.03);
    
    responder.upvote(30);

    if (leftovers < 2.1) {
        sendTo('steemlike', leftovers);
        return;
    } 
    if (leftovers > 2.1 && leftovers < 17) {
        sendTo('minnowbooster', leftovers);
        return;
    }


    if (data.amount > 22) {
        sendTo('buildawhale'. leftovers / 10 * 70);
        sendTo('booster', leftovers / 10 * 30);
    }
    
    if (leftovers > 0) {
      responder.sendSteem(
        leftovers,
        'Sending back the leftovers ;) '
      ); 
    }

    function sendTo(to, amount) {
        if (leftovers < amount) 
            return false;

        responder.forwardTransfer(to, parseFloat(amount));
        leftovers = leftovers - amount;
    }
    
  } else {
    // We are good people. Just send back the money if is less than 2 or doesn't have the right memo.
    if (data.amount.indexOf('STEEM') > -1) {
      responder.sendSteem(
        data.amount,
        'Sending back the money, should be at least 2 STEEM or SBD with a valid steemit link in memo'
      );
    } else {
      responder.sendSbd(
        data.amount,
        'Sending back the money, should be at least 2 STEEM or SBD with a valid steemit link in memo'
      );
    }
  }
}

bot.start();

function convert2VotingWeight(votingPercentage) {
      return Math.min(Math.floor(votingPercentage.toFixed(2) * 100), 10000);
}

