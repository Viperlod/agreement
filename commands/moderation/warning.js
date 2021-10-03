const moment = require("moment");
const Enmap = require("enmap");
require("moment-duration-format");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const makeID = require("../../events/caseid.js");
const { staffrole } = require("../../config/constants/roles.json");
const { channelLog } = require("../../config/constants/channel.json");

module.exports = {
  name: "warning",
  category: "moderation",
  aliases: [],
  usage: "<Case ID> <User ID>",
  description: "Get information about a case",
  run: async (client, msg, args, prefix, command) => {
    msg.delete();
    let Prohibited = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Prohibited User`)
      .setDescription(
        `You have to be in the moderation team to be able to use this command!`
      );
    let enabledms = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Error!`)
      .setDescription(
        `Please enable your dms with this server to that I can send you the information you requested!`
      );
    let caseidincorrect = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Error`)
      .setDescription(`Please do ${prefix}warning (caseid) (user id)`);
    let warninginfo = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle(`Success`)
      .setDescription(`I have sent you a dm with your requested information!`);
    const warnsDB = new Enmap({ name: "warns" });
    const user = client.users.cache.get(args[1]) || msg.member;
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const caseID = args[0];
    if (!warnsDB.get(user.id).warns[caseID]) return msg.reply(caseidincorrect);
    if (user.id == msg.member.id) {
      const em = new Discord.MessageEmbed()
        .setTitle(caseID)
        .setColor("GREEN")
        .addField("Reason", warnsDB.get(user.id).warns[caseID].reason)
        .addField("Date", warnsDB.get(user.id).warns[caseID].date);
      await msg.member.send(em).catch((err) => msg.reply(enabledms));
      await msg.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `I have sent you a dm with your requested information!`
            ),
        ],
      });
    } else {
      if (!msg.member.roles.cache.has(staffrole)) return msg.reply(Prohibited);
      const em = new Discord.MessageEmbed()
        .setTitle(caseID)
        .setColor(Color)
        .addField("Reason", warnsDB.get(user.id).warns[caseID].reason)
        .addField("Moderator ID", warnsDB.get(user.id).warns[caseID].moderator)
        .addField("Date", warnsDB.get(user.id).warns[caseID].date);
      await msg.member.send(em).catch((err) => msg.reply(enabledms));
      await msg.channel.send({
        embeds: [
          new MessageEmbed().setColor(Color).setDescription(warninginfo),
        ],
      });
    }
  },
};
