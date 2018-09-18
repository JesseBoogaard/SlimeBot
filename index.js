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
            let rk = Object.keys(availableSlimes)[Math.floor(Math.random() * Object.keys(availableSlimes).length)]
            let ns = availableSlimes[rk]
            embed
            .setTitle("Congrats! You found a " + ns.name)
            .setColor(ns.color)
            .setDescription("A beautiful " + ns.name + " was added to your ranch! \n Go feed it!")
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
        }
    }
});

client.login('NDc5NzM0MTI1OTc3NDAzNDIy.DoKbbw.bAzLqjlhlpa045KkCsKOhRgJIf4');