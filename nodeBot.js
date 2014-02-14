// Create the configuration
var config = {
	channels: ["#appacademy"],
	server: "irc.foonetic.net",
	botName: "inspireBot",
	quote: ""
};

// Get the lib
var irc = require("irc");
var http = require('http');

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

// Listen for any message, say to him/her in the room
bot.addListener("message", function(from, to, text, message) {
	if ((text.toLowerCase().indexOf('inspire') > -1) || (text.toLowerCase().indexOf('wat') > -1)) {
		var textArr = text.split(" ");
		var name = textArr[textArr.length - 1];
		bot.say(config.channels[0], name + ", " + config.quote );
		getQuote();
	}
});

bot.addListener("join", function(channel, who) {
	// Welcome them in!
	bot.say(channel, who + ", " + config.quote);
	getQuote();
});

function getQuote () {

	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'www.iheartquotes.com',
	  path: '/api/v2/random.json'
	};

	callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    config.quote = JSON.parse(str).quote;
	  });
	}

	http.request(options, callback).end();
}