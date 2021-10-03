const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { staffrole } = require("../../config/constants/roles.json");
const { channelLog } = require("../../config/constants/channel.json");
const { serverID } = require("../../config/main.json");

module.exports = {
  name: "deletemsg",
  category: "moderation",
  aliases: ["delmsg"],
  usage: "<message link>",
  description: "Delete a message",
  run: async (client, message, args) => {
    message.delete();
    const server = client.guilds.cache.get(serverID);
    const warnLogs = server.channels.cache.get(channelLog);
    let invalidlink = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription("That isn't a valid message link!");
    let cantindmmessages = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription("I can't delete messages in DMs!");
    let otherserverisbad = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription("I can't delete messages in other servers!");
    let successfullydeleted = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(":white_check_mark: Successfully deleted! :white_check_mark:");
    let cantfindthechannel = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription("I couldn't find that channel");
    let cantfindthemessage = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription("I couldn't find that message");
    if (!args[0].includes("https://discord.com/channels/"))
      return message.channel.send({embeds: [invalidlink]});
    if (args[0].includes("@me")) return message.channel.send({embeds: [cantindmmessages]});
    const data = args[0].slice(29).split("/"); // remove the beginning of the URL, and split it into the IDs (guild/channel/message)
    if (data[0] !== message.guild.id)
      return message.channel.send({embeds: [otherserverisbad]});
    message.guild.channels
      .fetch(data[1])
      .then((channel) => {
        channel.messages
          .fetch(data[2])
          .then((msg) => {
            msg.delete().then(() => {
              message.channel
                .send({embeds: [successfullydeleted]})
            });
          })
          .catch((e) => {
            message.channel.send({embeds: [cantfindthemessage]});
          });
      })
      .catch((e) => {
        message.channel.send({embeds: [cantfindthechannel]});
      });
  },
};
