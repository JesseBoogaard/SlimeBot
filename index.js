//imports
const Discord = require('discord.js');
const {RichEmbed, Client} = require('discord.js');
const availableSlimes = require('./Data/Slimes.json');
const food = require('./Data/Foods.json');

const client = new Discord.Client();
const embed = new RichEmbed();
const prefix = "!s";

client.on('ready', () => {
    client.user.setActivity('in green pastures!', {type: 'PLAYING'});
});

client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        switch(command){
        case 'start':
            embed
            .setTitle("Welcome! Let's start a new ranch!")
            .setColor(0xFFFFFF)
            .setDescription("Welcome to Slimerancher Discord edition! \n Let's start with a nice name for your awesome new ranch!")
            msg.channel.send(embed);
        break;

        case 'find':
            let randomKey = Object.keys(availableSlimes)[Math.floor(Math.random() * Object.keys(availableSlimes).length)]
            let newSlime = availableSlimes[randomKey]
            embed
            .setTitle("Congrats! You found a " + newSlime.name)
            .setColor(newSlime.color)
            .setDescription("A beautiful " + newSlime.name + " was added to your ranch! \n Go feed it!")
            msg.channel.send(embed)
        break;

        case 'foods':
            let foods = [];
            for(let i = 0; i < Object.keys(food).length; i++){
                foods.push(food[i].name);
            }
            embed
            .setTitle("Available foods are the following")
            .setColor(0xE05E6B)
            .setDescription(foods.join(",\n"));
            msg.channel.send(embed);
        break;

        case 'info':
            let slimeInfo;
            for(let i = 0; i < Object.keys(availableSlimes).length; i++){
                if(availableSlimes[i].name.toLowerCase() == args.join(" ").toLowerCase()){
                    slimeInfo = availableSlimes[i]
                }
            }
            embed
            .setTitle("The " + slimeInfo.name)
            .setColor(slimeInfo.color)
            .setDescription(slimeInfo.info)
            msg.channel.send(embed);
        break;
        }
    }
});

client.login('NDc5NzM0MTI1OTc3NDAzNDIy.DoKbbw.bAzLqjlhlpa045KkCsKOhRgJIf4');