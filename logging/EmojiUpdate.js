const { MessageEmbed } = require("discord.js");
const { channelLog } = require("../config/constants/channel.json")

module.exports = (client) => {
	client.on("emojiUpdate", async(oldEmoji, newEmoji) => {
    let logs = await client.channels.cache.get(channelLog);
        	let embed = new MessageEmbed()
            .setTitle("Emoji Updated")
            .setColor("GREEN")
            .setDescription(`A custom emoji was updated.`)
            if(oldEmoji.name !== newEmoji.name){
                embed.addField("Old Emoji Name", oldEmoji.name, true)
                embed.addField("New Emoji Name", newEmoji.name, true)
            }
            embed.addField("Emoji ID", oldEmoji.id, true) 
            return logs.send(embed);
    })
}