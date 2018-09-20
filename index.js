//imports
const Discord = require('discord.js');
const {RichEmbed, Client} = require('discord.js');
const availableSlimes = require('./Data/Slimes.json');
const food = require('./Data/Foods.json');
require('dotenv').config();

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
            msg.channel.send({
                "embed": {
                    title: "Available foods are the following",
                    color: 0xE05E6B,
                    description: foods.join(",\n")
                }
            });
        break;

        case 'info':
            let requestedSlime;
            for(let i = 0; i < Object.keys(availableSlimes).length; i++){
                if(availableSlimes[i].name.toLowerCase() == args.join(" ").toLowerCase()){
                    requestedSlime = availableSlimes[i]
                }
            }
            let url = "http://www.jesseboogaard.com/botimg/" + requestedSlime.img + ".png"
            embed
                .setTitle("The " + requestedSlime.name)
                .setColor(requestedSlime.color)
                .setDescription(requestedSlime.info)
                .setThumbnail(url);
            msg.channel.send(embed);
        break;
        }
    }
});

client.login(process.env.TOKEN);