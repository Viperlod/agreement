const { MessageEmbed } = require("discord.js");
const { channelLog } = require("../config/constants/channel.json")

module.exports = (client) => {
	client.on("channelDelete", async(channel) => {
    let logs = await client.channels.cache.get(channelLog);
        if(channel.type === "text"){
        	let embed = new MessageEmbed()
            .setTitle("Channel Deleted")
            .setColor("GREEN")
            .setDescription(`A channel was deleted.`)
            .addField("Channel Name", channel.name, true)
            .addField("Channel ID", channel.id, true);
            if(channel.topic){ 
                embed.addField("Channel Topic", channel.topic)
            }
            embed.addField("NSFW", channel.nsfw)
            return logs.send(embed);
        }
    })
}