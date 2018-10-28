//imports
const Discord = require('discord.js');
const {
    RichEmbed,
    Client
} = require('discord.js');
const Functions = require('./functions.js');
const fn = new Functions();
require('dotenv').config();
const client = new Discord.Client();
const embed = new RichEmbed();
const prefix = "s!";
let selectedSlime;

client.on('ready', () => {
    client.user.setActivity('in green pastures!', {
        type: 'PLAYING'
    });
});

client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'start':
                return new Promise((fulfill, reject) => {
                    fn.doesRanchExist(msg.guild.id).then((res) => {
                        if (res == true) {
                            fulfill(msg.channel.send(`There's already a lovely ranch for this server! Go pet your slimes :) \n\n Want to start over? type \`s! resetranch\` then \`!s start\` to start a new one :)`));
                        } else if (res == false) {
                            embed
                                .setTitle(`Welcome! Let's start a new ranch!`)
                                .setColor(0xFFFFFF)
                                .setDescription(`Welcome to Slimerancher Discord edition! \n Let's start with a nice name for your awesome new ranch! \n\n Type \`s! nameranch [name_of_your_ranch]\` and press enter`)
                            fulfill(msg.channel.send(embed));
                        }
                    }, reject)
                });

            case 'setname':
                return new Promise((fulfill, reject) => {
                    let ranchName = args.join(" ")
                    fn.addRanchToDB(ranchName, msg.guild.id).then((res) => {
                        if (res) {
                            fulfill(msg.channel.send(`**Congrats!** You are now a real slime rancher, and proud owner of *${ ranchName }!* \n Good luck out there :) \n ps. you got some starting cash to buy some food ;)`));
                        } else if (res == false) {
                            fulfill(msg.channel.send(`There's already a ranch for this server, silly! Go pet your slimes ;)`));
                        } else {
                            fulfill(msg.channel.send(`Something went wrong while adding your ranch, please try again later :)`))
                        }
                    }, reject)
                })

            case 'reset':
                return new Promise((fulfill, reject) => {
                    fn.resetRanch(msg.guild.id, args.join(" ")).then((res) => {
                        if (res) {
                            fulfill(msg.channel.send(`Your ranch has been reset and renamed to ${ args.join(" ") }`))
                        }
                    }, reject)
                })

            case 'ranch':
                return new Promise((fulfill, reject) => {
                    fn.getRanchInfo(msg.guild.id).then((res) => {
                        if (res) {
                            let ranchName = res.ranchName
                            fn.getSlimeInfoForRanch(res.slimes).then((res) => {
                                embed
                                    .setTitle(`Here's a summary of ${ ranchName }`)
                                    .setColor(0x42372D)
                                    .setDescription(res);
                                fulfill(msg.channel.send(embed));
                            })
                        } else {
                            fulfill(msg.channel.send(`Couldn't get ranch info at this time. Try again later ;)`));
                        }
                    }, reject)
                })

            case 'find':
            return new Promise((fulfill, reject) => {
                fn.getRandomSlime(msg.guild.id).then((res) => {
                    if(res != {}){
                        embed
                            .setTitle(`Congrats! You found a ${ res.name }`)
                            .setColor(res.color)
                            .setThumbnail(`attachment://${ res.img }.png`)
                            .setDescription(`Welcome this **adorable** ${ res.name } to your ranch! \n\n For more info about this cutie type \`s! info ${ res.name } \n\` Now go pet this slimy boi!`);
                        fulfill(msg.channel.send({
                            embed,
                            files: [{
                                attachment: `Data/img/${ res.img }.png`,
                                name: `${ res.img }.png`
                            }]
                        }))
                    }else{
                        reject(msg.channel.send(`Something went wrong trying to get a slime, try again later! :)`));
                    }
                })
            })

            case 'foods':
            return new Promise((fulfill, reject) => {
                fn.getFoodInfo().then((res) => {
                    if(res != {}){
                        fulfill(msg.channel.send({
                            'embed': {
                                title: `Available foods are the following (feeding system = work in progress)`,
                                color: 0xE05E6B,
                                description: res.join(",\n")
                            }
                        }));
                    }else{
                        reject(msg.channel.send(`Something went wrong trying to get food info, try again later! :)`));
                    }
                })
            })

            case 'getplorts':
                return new Promise((fulfill, reject) => {
                    fn.getPlorts(msg.guild.id).then((res) => {
                        embed
                            .setTitle(`Plort inventory`)
                            .setColor(0x42372D)
                            .setDescription(res)
                        fulfill(msg.channel.send(embed));
                    })
                })

            case 'info':
                return new Promise((fulfill, reject) => {
                    fn.getSlimeInfo(args.join(" ")).then((res) => {
                        if (res != undefined) {
                            let url = `attachment://${ res.img }.png`;
                            embed
                                .setTitle(`The ${ res.name }`)
                                .setColor(res.color)
                                .setDescription(res.info)
                                .setThumbnail(url);
                            fulfill(msg.channel.send({
                                embed,
                                files: [{
                                    attachment: `Data/img/${ res.img }.png`,
                                    name: `${ res.img }.png`
                                }]
                            }));
                        }
                    }, reject);
                })
        }
    }
});

client.login(process.env.TOKEN);