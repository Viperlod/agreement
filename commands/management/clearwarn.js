const moment = require("moment");
const Enmap = require("enmap");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { adminrole } = require("../../config/constants/roles.json");
const { channelLog } = require("../../config/constants/channel.json");

module.exports = {
  name: "clearwarn",
  category: "management",
  aliases: [],
  usage: "<User ID> <Case ID>",
  description: "Clear a warning of a user",
  run: async (client, msg, args, prefix, command) => {
    msg.delete();
    let Prohibited = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Prohibited User`)
      .setDescription(`You have to be an administrator to use this command!`);
    let insertID = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Error`)
      .setDescription(`Please insert the ID of the case you want to clear`);
    let includeuser = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Error`)
      .setDescription(
        `Please include the user in which you want to unban, please note if they were banned they will be unbanned`
      );
    let wrongid123 = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle(`Error`)
      .setDescription(
        `"I could not find a case with this ID, please make sure you filled it in correctly (case senstive)"`
      );
    if (!msg.member.roles.cache.has(adminrole)) return msg.reply(Prohibited);
    const warnsDB = new Enmap({ name: "warns" });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch((err) => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return msg.reply(includeuser);
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    const caseID = args[1];
    if (!caseID) return msg.reply(insertID);
    if (!warnsDB.get(user.id).warns[caseID]) return msg.reply(wrongid123);
    const casePoints = warnsDB.get(user.id).warns[caseID].points;
    const caseReason = warnsDB.get(user.id).warns[caseID].reason;
    const newPoints = warnsDB.get(user.id).points - casePoints;
    warnsDB.delete(user.id, `warns.${caseID}`);
    warnsDB.set(user.id, newPoints, "points");
    const userBanned = warnsDB.get(user.id).points < 5;
    if (userBanned) {
      client.guilds.cache
        .get(user.id)
        .members.unban(user.id, `${msg.author.tag} - warnings cleared`)
        .catch((err) => err);
    }
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const em = new MessageEmbed()
      .setTitle("Warning cleared")
      .setColor("GREEN")
      .addField("Adminstrator", `${msg.author.tag} (${msg.author.id})`)
      .addField("User", `${user.tag} (${user.id})`)
      .addField("Case ID", `\`${caseID}\``)
      .addField("Case Points", `\`${parseInt(casePoints).toLocaleString()}\``)
      .addField("Case Reason", `\`${caseReason}\``)
      .addField("Unbanned?", userBanned ? "Yes" : "No")
      .setFooter(`By: ${msg.author.tag}`);
    await clearedWarnsLog.send({embeds: [em]});
    return msg.channel
      .send({
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setDescription(
              `I have successfully cleared warning **${caseID}** from **${user.tag}**!`
            ),
        ],
      })
  },
};
