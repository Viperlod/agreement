const { supportrole } = require("../../config/constants/roles.json");
const { ticketCategory } = require("../../config/constants/channel.json");
module.exports = {
  name: "mark",
  description: "allows a moderater to mark a certain ticket",
  aliases: [],
  category: "ticket", 
  clientPermissions: [],
  userPermissions: [],
  run: async (client, message, data) => {

    let Prohibited = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle(`Error`)
    .setDescription(`You don't have enough permission to do that!`)

    if(!msg.member.roles.cache.has(supportrole)) {
      const m = await message.channel.send({ embeds: [Prohibited] });
      return setTimeout(() => m.delete(), 5000);
    }

    if(message.channel.parentID !== ticketCategory) {
      const m = await message.channel.send(':x: You can\'t do that here!');
      return setTimeout(() => m.delete(), 5000);
    }

    message.channel.setName(message.channel.name + " - 🚩 - " + message.author.username);

  }
}