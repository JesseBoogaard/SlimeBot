//imports
const Discord = require('discord.js');
const {RichEmbed, Client} = require('discord.js');
const availableSlimes = require('./Data/Slimes.json');
const food = require('./Data/Foods.json');
const SlimeDB = require('./db.js');
const Functions = require('./functions.js');
const ranch = new SlimeDB();
const fn = new Functions();
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
            return new Promise((fulfill, reject) => {
                ranch.doesRanchExist(msg.guild.id).then((res) => {
                    if(res == true){
                        fulfill(msg.channel.send("There's already a lovely ranch for this server! Go pet your slimes :) \n\n Want to start over? type `!s resetranch` then `!s start` to start a new one :)"));
                    }else if(res == false){
                        embed
                        .setTitle("Welcome! Let's start a new ranch!")
                        .setColor(0xFFFFFF)
                        .setDescription("Welcome to Slimerancher Discord edition! \n Let's start with a nice name for your awesome new ranch! \n\n Type `!s nameranch [name_of_your_ranch]` and press enter")
                        fulfill(msg.channel.send(embed));
                    }
                }, reject)
            });

        case 'nameranch':
            return new Promise((fulfill, reject) => {
                let ranchName = args.join(" ")
                ranch.addRanchToDB(ranchName, msg.guild.id).then((res) => {
                    if(res){
                        fulfill(msg.channel.send("**Congrats!** You're now a real slime rancher, and proud owner of *" + ranchName + "!* \n Good luck out there :) \n ps. you got some starting cash to buy some food ;)"));
                    }else{
                        fulfill(msg.channel.send("Sadly something went wrong while creating your beautiful ranch :( \n try again in a bit, please!"));
                    }
                }, reject)
            })

        case 'resetranch':
            ranch.resetRanch(msg.guild.id)
        break;

        case 'ranch':
            return new Promise((fulfill, reject) => {
                ranch.getRanchInfo(msg.guild.id).then((res) => {
                    if(res){
                        console.log(res);
                        let str = "**Slimes:** \n\n";
                        fn.getSlimeInfoByID(res).then((result) => {
                            result.forEach((slime) => {
                                str = str + slime.name + "s: "+ slime.amount + " \n";
                            })
                            embed
                            .setTitle("Here's a summary of your lovely ranch!")
                            .setColor(0x42372D)
                            .setDescription(str);
                            fulfill(msg.channel.send(embed));
                        });
                    }else{
                        fulfill(msg.channel.send("Couldn't get ranch info at this time. Try again later ;)"));
                    }
                }, reject)
            })

        case 'find':
            let randomKey = Object.keys(availableSlimes)[Math.floor(Math.random() * Object.keys(availableSlimes).length)]
            let newSlime = availableSlimes[randomKey]
            embed
            .setTitle("Congrats! You found a " + newSlime.name)
            .setColor(newSlime.color)
            .setDescription("Welcome this **adorable** " + newSlime.name + " to your ranch! \n\n For more info about this cutie type `!s info " + newSlime.name + "` \n Now go pet this slimy boi!");
            return new Promise((fulfill, reject) => {
                ranch.registerNewSlime(newSlime.id, msg.guild.id).then((res) => {
                    if(res){
                        fulfill(msg.channel.send(embed));
                    }else{
                        fulfill("Something went wrong adding this cutie to your ranch :( Better luck next time");
                    }
                }, reject);
            })

        case 'foods':
            let foods = [];
            for(let i = 0; i < Object.keys(food).length; i++){
                foods.push(food[i].name);
            }
            msg.channel.send({
                "embed": {
                    title: "Available foods are the following (feeding system = work in progress)",
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
            let url = "attachment://" + requestedSlime.img + ".png"
            embed
            .setTitle("The " + requestedSlime.name)
            .setColor(requestedSlime.color)
            .setDescription(requestedSlime.info)
            .setThumbnail(url);
            msg.channel.send({ embed, files: [{ attachment: "Data/img/" + requestedSlime.img + ".png", name: requestedSlime.img + ".png" }] });
        break;
        }
    }
});

client.login(process.env.TOKEN);