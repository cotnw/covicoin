const needle = require('needle')
require('dotenv').config()
const token = process.env.BEARER_TOKEN
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent"

function createCustomTweetObject(text, tweetIdString) {
    const tweetId = tweetIdString
    const tweetText = text.toLowerCase();
    const searchKeywords = ['oxygen', 'ventilator', 'fabiflu', 'remdesivir', 'favipiravar', 'tocilizumab', 'plasma', 'icu', 'icu beds', 'hospital beds', 'rt pcr', 'acterma', 'covid test', 'itolizumab', 'fapvir', 'faviblu', 'flugard', 'fevindo', 'araflu', 'avigan', 'favilow', 'favipill', 'cipvir']
    const cities = ["gurgaon", "noida", "dehradun", "delhi", "kanpur", "mumbai", "kolkata", "bangalore", "chennai", "hyderabad", "pune", "ahmedabad", "surat", "lucknow", "jaipur", "cawnpore", "mirzapur", "nagpur", "ghaziabad", "indore", "vadodara", "vishakhapatnam", "bhopal", "chinchvad", "patna", "ludhiana", "agra", "kalyan", "madurai", "jamshedpur", "nasik", "faridabad", "aurangabad", "rajkot", "meerut", "jabalpur", "thane", "dhanbad", "allahabad", "varanasi", "srinagar", "amritsar", "aligarh", "bhiwandi", "gwalior", "bhilai", "haora", "ranchi", "bezwada", "chandigarh", "mysore", "raipur", "kota", "bareilly", "jodhpur", "coimbatore", "dispur", "jhunjhunu", "guwahati", "solapur", "trichinopoly", "hubli", "jalandhar", "bhubaneshwar", "bhayandar", "moradabad", "kolhapur", "thiruvananthapuram", "saharanpur", "warangal", "salem", "malegaon", "kochi", "gorakhpur", "shimoga", "tiruppur", "guntur", "raurkela", "mangalore", "nanded", "cuttack", "chanda", "dehra dun", "durgapur", "asansol", "bhavnagar", "amravati", "nellore", "ajmer", "tinnevelly", "bikaner", "agartala", "ujjain", "jhansi", "ulhasnagar", "davangere", "jammu", "belgaum", "gulbarga", "jamnagar", "dhulia", "gaya", "jalgaon", "kurnool", "udaipur", "bellary", "sangli", "tuticorin", "calicut", "akola", "bhagalpur", "sikar", "tumkur", "quilon", "muzaffarnagar", "bhilwara", "nizamabad", "bhatpara", "kakinada", "parbhani", "panihati", "latur", "rohtak", "rajapalaiyam", "ahmadnagar", "cuddapah", "rajahmundry", "alwar", "muzaffarpur", "bilaspur", "mathura", "kamarhati", "patiala", "saugor", "bijapur", "brahmapur", "shahjanpur", "trichur", "barddhaman", "kulti", "sambalpur", "purnea", "hisar", "firozabad", "bidar", "rampur", "shiliguri", "bali", "panipat", "karimnagar", "bhuj", "ichalkaranji", "tirupati", "hospet", "aizawl", "sannai", "barasat", "ratlam", "handwara", "drug", "imphal", "anantapur", "etawah", "raichur", "ongole", "bharatpur", "begusarai", "sonipat", "ramgundam", "hapur", "uluberiya", "porbandar", "pali", "vizianagaram", "puducherry", "karnal", "nagercoil", "tanjore", "sambhal", "shimla", "ghandinagar", "shillong", "port blair", "gangtok", "kohima", "itanagar", "panaji", "daman", "kavaratti", "panchkula", "kagaznagar"]
    
    const keyWordsArray = []
    searchKeywords.forEach(keyword => {
        if(tweetText.toLowerCase().includes(keyword)) {
            keyWordsArray.push(keyword)
        }
    })
    
    let tweetPlace = 'none'
    cities.forEach(city => {
        if(tweetText.toLowerCase().includes(city)) {
            tweetPlace = city
        }
    })
    
    if(keyWordsArray.length != 0) {
        return {
            success: true, 
            data: {
                tweet_id: tweetId,
                helped: false,
                place: tweetPlace,
                items: keyWordsArray,
                embed_html: '',
                skipped: false
            }
        }
    } else {
        return {
            success: false, 
            data: {
                tweet_id: tweetId,
                helped: false,
                place: tweetPlace,
                items: keyWordsArray,
                embed_html: '',
                skipped: false
            }
        }
    }
    
}

async function getRequest1(place) {

    const params = {
        'query': `${place} need (oxygen OR ventilator OR fabiflu OR remdesivir OR favipiravar OR tocilizumab OR plasma OR icu OR icu beds OR hospital beds OR rt pcr OR acterma OR covid test OR itolizumab OR fapvir OR faviblu OR flugard OR fevindo OR araflu OR avigan OR favilow OR favipill OR cipvir) -available`,
        'max_results': 90
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    const placeFilteredTweets = []

    const data = res.body.data

    data.forEach(tweet => {
        const resp = createCustomTweetObject(tweet.text, tweet.id)
        const tweet_url = `https://twitter.com/randomperson/status/${tweet.id}`
        if(tweet.text.includes('RT')) {
            const tweetTextUpdated = tweet.text.split('RT ')[1]
            if(resp.success) {
                const twt = resp.data
                twt['tweet_url'] = tweet_url
                twt['text'] = tweetTextUpdated
                placeFilteredTweets.push(twt)
            }
        } else {
            if(resp.success) {
                const twt = resp.data
                twt['tweet_url'] = tweet_url
                twt['text'] = tweet.text
                placeFilteredTweets.push(twt)
            }
        }
    })

    return { data: placeFilteredTweets, length: placeFilteredTweets.length }
}

async function getRequest2() {

    const params = {
        'query': 'need (oxygen OR ventilator OR fabiflu OR remdesivir OR favipiravar OR tocilizumab OR plasma OR icu OR icu beds OR hospital beds OR rt pcr OR acterma OR covid test OR itolizumab OR fapvir OR faviblu OR flugard OR fevindo OR araflu OR avigan OR favilow OR favipill OR cipvir) -available',
        'max_results': 90
    }

    const res = await needle('get', endpointUrl, params, {
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${token}`
        }
    })

    const generalFilteredTweets = []

    const data = res.body.data

    data.forEach(tweet => {
        const resp = createCustomTweetObject(tweet.text, tweet.id)
        const tweet_url = `https://twitter.com/randomperson/status/${tweet.id}`
        if(tweet.text.includes('RT')) {
            const tweetTextUpdated = tweet.text.split('RT ')[1]
            if(resp.success) {
                const twt = resp.data
                twt['tweet_url'] = tweet_url
                twt['text'] = tweetTextUpdated
                generalFilteredTweets.push(twt)
            }
        } else {
            if(resp.success) {
                const twt = resp.data
                twt['tweet_url'] = tweet_url
                twt['text'] = tweet.text
                generalFilteredTweets.push(twt)
            }
        }
        
    })

    return { data: generalFilteredTweets, length: generalFilteredTweets.length }
}

function stringArrayFinder(s, a) {
    bool = false
    a.forEach(element => {
        if(element.text == s) {
            bool = true
        }
    });
    return bool
} 

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

function getSessionTweets(userPlace, count) {
    let promise = new Promise(async(resolve, reject) => {
        const resp1 = await getRequest1(userPlace)
        const resp2 = await getRequest2()
        const resp = {placeSpecificTweets: resp1.data, generalTweets: resp2.data, count: resp1.length + resp2.length}
        const sessionTweets = []
        const finalSessionTweets = []
        const arrCount = count

        for(let i=0; i<50; i++) {
            if(!stringArrayFinder(resp.placeSpecificTweets[i].text, sessionTweets)) {
                sessionTweets.push(resp.placeSpecificTweets[i])
            }
            if(!stringArrayFinder(resp.generalTweets[i].text, sessionTweets)) {
                sessionTweets.push(resp.generalTweets[i])
            }
        }

        const shuffledFinalSessionTweets = shuffle(finalSessionTweets)

        for(let i=0; i<arrCount; i++) {
            shuffledFinalSessionTweets.push(sessionTweets[i])
        }

        resolve(shuffledFinalSessionTweets)
    })
    return promise
}

module.exports = getSessionTweets;
