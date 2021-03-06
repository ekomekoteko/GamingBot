const discord = require('discord.js');
const bot = new discord.Client();
const prefix = "g!"
const fs = require('fs');
const moment = require('moment');
const YTDL = require('ytdl-core');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
const symbols = ["⭕", "🔵", "🔶", "⬜", "❤", "🔺", "💠", "🔻"];
const wsymbol = ["💎", "💠", "🔸", "🔻", "🔴", "⭕", "❌", "🚫"];
var profanities = require('profanities');
const servers = {};
const active = new Map();

bot.login(process.env.BOT_TOKEN);
function toggleProfanity(guild) {
    // 1 = on, -1 = off
    if (!serverData[guild.id]) serverData[guild.id] = {
        prof: 1,
    }
    else {
        var prof = serverData[guild.id].prof;
        serverData[guild.id].prof = prof * -1;
    }
    fs.writeFile('Storage/serverData.json', JSON.stringify(serverData), (err) => {
        if (err) console.log(err);
    }) 
}

function roll(message) {
    var chance = Math.floor(Math.random() * 5) + 1;
    var slot1 = Math.floor(Math.random() * symbols.length);
    var slot2 = Math.floor(Math.random() * symbols.length);
    var slot3 = Math.floor(Math.random() * symbols.length);
    var slot4 = Math.floor(Math.random() * symbols.length); 
    var slot5 = Math.floor(Math.random() * symbols.length);
    var slot6 = Math.floor(Math.random() * symbols.length);
    var slot7 = Math.floor(Math.random() * symbols.length);
    var slot8 = Math.floor(Math.random() * symbols.length);
    var slot9 = Math.floor(Math.random() * symbols.length);
    var diamonds = userData[message.author.id].diamonds;
    if (diamonds < 100) {
        var n = 100 - diamonds;
        const slots = {
                "embed": {
                "title": "Slot Machine",
                "description": "**You need 💎x" + n + " more to use the slot machine!**",
                "color": 5375
                }
            }
            message.channel.send(slots);
        }
    else {
        // If slots 4, 5, and 6 are the same then they win.
        if (chance == 4) {
            var ran = Math.floor(Math.random() * 151) + 49;
            var middle = Math.floor(Math.random() * symbols.length);
            const slots = {
                "embed": {
                "title": "Slot Machine",
                "description": "**You spend 💎x100 on the slot machine...**",
                "color": 5375,
                "fields": [
                    {
                    "name": "==========================",
                    "value": "| " + symbols[slot1] + " | " + symbols[slot2] + " | " + symbols[slot3] + " |"
                    },
                    {
                    "name": "==========================",
                    "value": "| " + symbols[middle] + " | " + symbols[middle] + " | " + symbols[middle] + " | <<<"
                    },
                    {
                    "name": "==========================",
                    "value": "| " + symbols[slot7] + " | " + symbols[slot8] + " | " + symbols[slot9] + " |"
                    },
                    {
                    "name": "==========================",
                    "value": "**And you win! You get 💎x" + ran + "! Also, you get your 💎x100 back.**"
                    }
                ]
                }
            }
            message.channel.send(slots);
            userData[message.author.id].diamonds = diamonds + ran;
        }
        else {
            const slots = {
                "embed": {
                "title": "Slot Machine",
                "description": "**You spend 💎x100 on the slot machine...**",
                "color": 5375,
                "fields": [
                    {
                    "name": "==========================",
                    "value": "| " + symbols[slot1] + " | " + symbols[slot2] + " | " + symbols[slot3] + " |"
                    },
                    {
                    "name": "==========================",
                    "value": "| " + symbols[slot4] + " | " + symbols[slot5] + " | " + symbols[slot6] + " | <<<"
                    },
                    {
                    "name": "==========================",
                    "value": "| " + symbols[slot7] + " | " + symbols[slot8] + " | " + symbols[slot9] + " |"
                    },
                    {
                    "name": "==========================",
                    "value": "**And you lose. Better luck next time.**"
                    }
                ]
                }
            }
            userData[message.author.id].diamonds = diamonds - 100;
            message.channel.send(slots);
        }
    }
}
function spin(message) {
    var diamonds = userData[message.author.id].diamonds;
    if (diamonds < 200) {
        var n = 200 - diamonds;
        const slots = {
                "embed": {
                "title": "Wheel of Diamonds",
                "description": "**You need 💎x" + n + " more to spin the wheel!**",
                "color": 5375
                }
            }
            message.channel.send(slots);
    }
    else {
        var reward = Math.floor(Math.random() * wsymbol.length);
        var slot1 = reward - 1;
        var slot3 = reward + 1;
        var slot4 = reward + 2;
        var slot5 = reward + 3;
        var slot6 = reward + 4;
        var slot7 = reward + 5;
        var slot8 = reward + 6;
        if (slot1 < 0) {
            slot1 = 7;
        }


        if (slot3 > 7) {
            slot3 = 0;
            slot4 = 1;
            slot5 = 2;
            slot6 = 3;
            slot7 = 4;
            slot8 = 5;
        }
        if (slot4 > 7) {
            slot4 = 0;
            slot5 = 1;
            slot6 = 2;
            slot7 = 3;
            slot8 = 4;
        }
        if (slot5 > 7) {
            slot5 = 0;
            slot6 = 1;
            slot7 = 2;
            slot8 = 3;
        }
        if (slot6 > 7) {
            slot6 = 0;
            slot7 = 1;
            slot8 = 2;
        }
        if (slot7 > 7) {
            slot7 = 0;
            slot8 = 1;
        }
        if (slot8 > 7) {
            slot8 = 0;
        }

        var d = "";
        if (reward == 0) {
            d = "Awesome! You get 💎x100 and your initial 💎x200!";
            userData[message.author.id].diamonds = diamonds + 100;
        }
        else if (reward == 1) {
            d = "Nice! You got 💎x50 and your initial 💎x200!";
            userData[message.author.id].diamonds = diamonds + 50;
        }
        else if (reward == 2) {
            d = "So close! You only get your initial 💎x200!";
        }
        else if (reward == 3) {
            d = "You only get 💎x150 but it could be worse!";
            userData[message.author.id].diamonds = diamonds - 50;
        }
        else if (reward == 4) {
            d = "You only get 💎x100 back.";
            userData[message.author.id].diamonds = diamonds - 100;
        }
        else if (reward == 5) {
            d = "You only get 💎x50 back.";
            userData[message.author.id].diamonds = diamonds - 150;
        }
        else if (reward == 6) {
            d = "You only get 💎x25 back.";
            userData[message.author.id].diamonds = diamonds - 175;
        }
        else if (reward == 7) {
            d = "Unlucky! You don't get anything!";
            userData[message.author.id].diamonds = diamonds - 200;
        }
            
        const wheel = {
            "embed": {
            "title": "Wheel of Diamonds",
            "description": "**You spend 💎x200 on the wheel...**",
            "color": 5375,
            "fields": [
            {
                "name": "================",
                "value": "================"
                },
                {
                "name": "---------vv-----------",
                "value": "| " + wsymbol[slot1] + " | " + wsymbol[reward] + " | " + wsymbol[slot3] + " |"
                },
                {
                "name": "| " + wsymbol[slot8] + " | 🌀 | " + wsymbol[slot4] + " |",
                "value": "| " + wsymbol[slot7] + " | " + wsymbol[slot6] + " | " + wsymbol[slot5] + " |"
                },
                {
                "name": "-----------------------",
                "value": "================"
                },
            {
                "name": "================",
                "value": "**" + d + "**"
                }
            ]
            }
        }
        message.channel.send(wheel);
    }
}
//Listners
bot.on('guildMemberAdd', member => {
    
    if (member.guild.id == "240986416555884548") {
        bot.channels.get(member.guild.systemChannelID).send('Welcome to the server ' + member.user + '! Make sure to check your DMs! Have a great time!');
        //var role = member.guild.roles.find('name', 'Member');
        //member.addRole(role);
        const data = {
            "embed": {
            "title": "**Read our rules!**",
            "description": "Make sure to go *[here](https://docs.google.com/document/d/1bPV3zuHWpyLUck_n7J6z1jt2IY-wBPUS6O-46x-hMGc/edit?usp=sharing)* or go to #rules to see our rules. Do this before doing anything else! If you want to apply for donator, type g/donator to visit the form!",
            "color": 6655,
            "image": {}
            }
        };
        member.user.sendMessage(data);
        member.user.send("_**Ranks**_");
        member.user.send("Ranks are a huge part of our server and you should understand how they work. The color next to the rank info is the color that people with the rank will have.");
        const owner = {
            "embed": {
                "title": " _**Leader**_ ",
                "description": "The most powerful rank in the server. Messing with them is the worst idea in the world.",
                "color": 65295,
                "image": {}
                }
            }
        const admin = {
            "embed": {
                "title": " _**Commander**_ ",
                "description": "The second most powerful rank in the server. Respect and listen to them just like with Leaders.",
                "color": 16714752,
                "image": {}
                }
            };
        const premium = {
            "embed": {
                "title": " _**Premium**_ ",
                "description": "A prestige rank on our server. More abilities than members.",
                "color": 4886754,
                "image": {}
                }
        };
        const disciplined = {
            "embed": {
                "title": " _**Disciplined**_ ",
                "description": "People with this rank has been breaking some rules. You better make sure you are not this rank.",
                "color": 2884612,
                "image": {}
                }
        };
        const test = {
            "embed": {
                "title": " _**Member**_ ",
                "description": "Pretty straightforward. This is the rank that most people have and is the default rank.",
                "color": 7309969,
                "image": {}
                }
        };
        
        member.user.sendMessage(disciplined);
        member.user.sendMessage(test);
        member.user.sendMessage(premium);
        member.user.sendMessage(admin);
        member.user.sendMessage(owner);
    }
    else {
        bot.channels.get(member.guild.systemChannelID).send('Welcome to the server ' + member.user + '! Have a great time!');
    }
});
bot.on('guildMemberRemove', member => {
    bot.channels.get(member.guild.systemChannelID).send('**' + member.user.username + '** has left the server. Come back soon.');
});


bot.on('message', message => {
    //Command Handler
    
    let args = message.content.slice(prefix.length).trim().split(' ');
    
    let cmd = args.shift().toLowerCase();
    

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.channel.type != 'text') return message.channel.send("Commands must be used in a server channel.");
    try {
        if (!fs.existsSync(__dirname + "/commands/" + cmd + ".js")) return message.channel.send("Unknown command. Type `g!help` to see a list of commands.");
        let commandFile = require(__dirname + "/commands/" + cmd + ".js");
        
        let client = bot;
        let ops = {
            active: active,
        }
        commandFile.run(message, args, client, ops);
    }
    catch (e) {
        console.log(e.stack);
    }


    //Currency
    if (message.channel.type == 'text') {
        var date = new Date();
        var time = date.getTime();
        let sender = message.author;
        let msg = message.content.toUpperCase;
            if (message.author.id === '478588483556999169') {
                return;
            }
            else {
                
                if (!userData[sender.id]) userData[sender.id] = {
                    diamonds: 0,
                    daily : "Not Collected"
                }

                var ran = Math.floor(Math.random() * 10) + 1;
                var diamonds = userData[sender.id].diamonds;
                userData[sender.id].diamonds = diamonds + ran;
            
                fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
                    if (err) console.log(err);
                }) 
            }
        
        var server = servers[message.guild.id];
        var dispatcher;
        if (message.content.startsWith(prefix + "diamonds")) {
            let sender = message.author;
            message.channel.send("**" + message.author.username + ",** You have 💎x" + userData[sender.id].diamonds + "!");
            
        }
        else if (message.content.startsWith(prefix + "daily")) {
            var date = new Date();
            var time = date.getTime();
            var day = date.getDay();
            var minutes = 1000 * 60;
            var hours = minutes * 60;
            var daily = userData[sender.id].daily;
            if (userData[sender.id].daily == "Not Collected") {
                var diamonds = userData[sender.id].diamonds;
                userData[sender.id].daily = time;
                userData[sender.id].diamonds += 100;
                message.channel.send("You have recieved your daily 💎x100!");
            }
            else if (time >= daily + (hours * 24)) {
                var diamonds = userData[sender.id].diamonds;
                userData[sender.id].daily = time;
                userData[sender.id].diamonds += 100;
                message.channel.send("You have recieved your daily 💎x100!");
            }
            else {
                var next = daily + (hours*24);
                var left = next - time;
                if (left / 3600000 > 1) {
                    var hour = left / 3600000;
                    var hr = Math.round(hour * 100) / 100
                    message.channel.send("You have already recieved your daily reward! You can receive it again in **" + hr + "** hours!"); 
                }
                else if (left / 60000 > 1) {
                    var minute = left / 60000;
                    var min = Math.round(minute * 100) / 100
                    message.channel.send("You have already recieved your daily reward! You can receive it again in **" + min + "** minutes!"); 
                }
                else {
                    var second = left / 1000;
                    var sec = Math.round(second * 100) / 100
                    message.channel.send("You have already recieved your daily reward! You can receive it again in **" + sec + "** minutes!"); 
                }
                
            }
        }
        else if (message.content.startsWith(prefix + "slots")) {
            roll(message);
        }
        else if (message.content.startsWith(prefix + "wheel")) {
            spin(message);
            
            
        }

        // Toggle Profanity
        else if (message.content.startsWith(prefix + "toggleprofanity")) {
            if (message.channel.type == 'text') {
                if (message.channel.guild.member(message.author).permissions.has('MANAGE_GUILD')) {
                    toggleProfanity(message.channel.guild);
                    var output = " "
                    if (serverData[message.channel.guild.id].prof == -1) {
                        output = "off"
                    }
                    else if (serverData[message.channel.guild.id].prof == 1) {
                        output = "on"
                    }
                    message.channel.send("Profanity has been toggled to **" + output + "**!");
                }
                else {
                    message.channel.send("You must have the **Manage Server** permission to execute this command!");
                }
            }
        }
       /* else if (message.content.startsWith(prefix + "help")) {
            message.channel.send("Check your DMs!")
		const help = {
			"embed": {
				"title": "__**Bot Features**__",
				"description": "**This bot has an automatic join and leave message, curse filter, and more! Here are the commands that I can execute!**",
				"color": 4886754,
				"footer": {
					"icon_url": "https://media.discordapp.net/attachments/415729242341507076/439987020853411844/ElectricDiamondCrop.png?width=676&height=676",
					"text": "Bot Created by @ᗴlectricↁiamond#1684"
				},
				"author": {
					"name": "Bot Information",
					"url": "",
					"icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
				},
				"fields": [
					{
						"name": "__**User**__",
						"value": "`help`, `uniqueid`"
					},
					
					{
						"name": "__**Fun**__",
						"value": "`8ball`, `number`, `fact`, `pun`"
					},
					{
						"name": "__**Currency**__",
						"value": "`diamonds`, `daily`, `slots`, `wheel`"
					},
					{
						"name": "**More features to come!**",
						"value": "Send me your suggestions so new features come out sooner!"
					}
				]
			}
		}
			message.author.send(help);
        }*/
    

    //Profanity
    if (message.channel.type == 'text') {   
        if (!serverData[message.guild.id]) serverData[message.guild.id] = {
            prof: 1,
            
        }
        fs.writeFile('Storage/serverData.json', JSON.stringify(serverData), (err) => {
            if (err) console.log(err);
        }) 
        if (serverData[message.guild.id].prof == 1) {
            var uppr = message.content.toUpperCase();
            var str = uppr.split(" ");
            if (message.channel.type == 'text') {
                if (message.guild.id == "415729604217798656") {
                    if (message.author.id === '478588483556999169') {
                        return;
                    }
                    else {
                        if (message.content.toUpperCase == "P SERVERS") {
                            message.channel.send(bot.guilds);
                        }
                    }
                }
                for (i = 0; i < str.length; i++) {
                    for (x = 0; x < profanities.length; x++) {
                        if (str[i] == profanities[x].toUpperCase()) {
                            if (message.author.id === '478588483556999169') {
                                return;
                            }
                            else if (message.author.id === '490674227976863765') {
                                return;
                            }
                            else {
                                    message.delete();
                                    message.channel.send("Whoa watch it " + message.author + "! Innapropriate language isn't allowed!");
                                    const p = message.guild.channels.find('name', 'profanity')
                                    if (!p) {
                                        message.channel.send('Error: A channel named "profanity" does not exist. Add one please.');
                                        return;
                                    }
                                    else {
                                        p.send('**' + message.author.username + '** has been using some bad language just now. They said ```' + message.content + '``` __**Bad Word:**__ ' + str[i]);
                                        return;
                                    }
                                    return;
                            }
                    
                        }
                    }
                }
            }
        }
    }
}
    
});
bot.on('guildCreate', guild => {
    guild.systemChannel.send("Hello I am **GamingBot!** Thanks for adding me to your server! Do __g!help__ to see what I can do!");
});
bot.on('ready', () => {
    console.log("Gaming launched!");
    bot.user.setGame('g!help');
    setInterval(function (){
        fs.readFile('Storage/userData.json', 'utf8', function(err, data) {
            fs.writeFile('Storage/backup.json', JSON.stringify(userData), (err) => {
                if (err) console.log(err);
            })
        });
        fs.readFile('Storage/serverData.json', 'utf8', function(err, data) {
            fs.writeFile('Storage/serverBackup.json', JSON.stringify(serverData), (err) => {
                if (err) console.log(err);
            })
        });
        
    }, 1000);
});
