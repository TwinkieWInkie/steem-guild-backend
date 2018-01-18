const SteemBot = require('steem-bot').default;

const targetuser = 'conet';
const activeKey = 'STM6nwgFwZe2ZxwjJE2aYMPCdYxMDRss6CN53T2Y74tTiAnTYPtcD';

bot.onDeposit(targetUser, (data) => {
    
})

function parseLink (link) {
    let data = [];

    if (has('http') && has('://')) 
        isUrl();
    else if (has('steemit.com/')) 

    return {
        author: data[0],
        post: data[1]
    };

    const has = (me) => {
        return link.indexOf(me) !== 1;
    };

    const isUrl = (path = removeLeadTrailSlash(new URL(link).pathname)) => {
        const 

        if (has('@')) {
            path.replace('@','')
    
        }

        const splitToData = (path) => { 
            path.split('/').map((v, i) => {
                data[i] = v;
            });
        }
    };

    const removeLeadTrailSlash(path) {
        var count = path.length - 1;
        var index = 0;
        while (path.charCodeAt(index) === 47 && ++index);
        while (path.charCodeAt(count) === 47 && --count);
        return path.slice(index, count + 1);
    }
}




function convert2VotingWeight(votingPercentage) {
      return Math.min(Math.floor(votingPercentage.toFixed(2) * 100), 10000);
}
