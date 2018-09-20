//imports
const Discord = require('discord.js');
const {RichEmbed, Client} = require('discord.js');
const availableSlimes = require('./Data/Slimes.json');
const food = require('./Data/Foods.json');
const SlimeDB = require('./db.js');
const ranch = new SlimeDB();
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
            if(ranch.doesRanchExist(msg.guild.id) == false){
                embed
                .setTitle("Welcome! Let's start a new ranch!")
                .setColor(0xFFFFFF)
                .setDescription("Welcome to Slimerancher Discord edition! \n Let's start with a nice name for your awesome new ranch! \n\n Type '!s nameranch [name_of_your_ranch]' and press enter")
                msg.channel.send(embed);
            }else{
                console.log(ranch.getRanchInfo(msg.guild.id))
                msg.channel.send("There's already a lovely ranch for this server called " + "! \n go pet your slimes :)");
            }
        break;

        case 'nameranch':
            let ranchName = args.join(" ")
            ranch.addRanchToDB(ranchName, msg.guild.id)
        break;

        case 'summary':
            //let ranchName = args.join(" ")
            ranch.getRanchInfo(msg.guild.id)
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