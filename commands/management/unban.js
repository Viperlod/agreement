const moment = require("moment");
const Enmap = require("enmap");
require("moment-duration-format");
const { adminrole } = require("../../config/constants/roles.json");
const { channelLog } = require("../../config/constants/channel.json");

module.exports = {
  name: "unban",
  category: "management",
  aliases: [],
  usage: "<User ID>",
  description: "Unban a user from the server",
  run: async (client, msg, args, prefix, command) => {
    message.delete();
    if (!msg.member.roles.cache.has(adminrole))
      return msg.reply(
        "I'm sorry but you have to be an administrator to use this command!"
      );
    const warnsDB = new Enmap({ name: "warns" });
    if (args[0] && !client.users.cache.get(args[0])) {
      await client.users.fetch(args[0]).catch((err) => err);
    }
    const user = client.users.cache.get(args[0]);
    if (!user) return msg.reply("Please insert the user you want to unban.");
    warnsDB.ensure(user.id, { points: 0, warns: {} });
    client.guilds.cache
      .get(serverID)
      .members.unban(user.id, `unbanning admin - ${msg.author.tag}`)
      .catch((err) => err);
    const clearedWarnsLog = client.channels.cache.get(channelLog);
    const em = new MessageEmbed()
      .setTitle("Unbanned")
      .setColor("GREEN")
      .addField("Manager", `${msg.author.tag} (${msg.author.id})`)
      .addField("User", `${user.tag} (${user.id})`);
    await clearedWarnsLog.send(em);
    return msg.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(`I have successfully unbanned **${user.tag}**!`),
      ],
    });
  },
};
