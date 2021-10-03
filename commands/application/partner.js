const { partnermanagerrole } = require("../../config/constants/roles.json");
const { partnerChannel } = require("../../config/constants/channel.json");
const Discord = require("discord.js");
module.exports = {
  name: "partner",
  description: "",
  category: "application",
  usage: "[accept|deny]",
  run: async (message, data) => {
    if (message.channel.type !== "dm") {
      message.delete();
      const Application = new Discord.MessageEmbed()
        .setTitle("Application")
        .setDescription("Please check your DM's for the application");
      message.channel
        .send({embeds: [Application]})
    }
    const filter1 = (m) => m.author.id === message.author.id;
    const cancel = new Discord.MessageEmbed()
      .setTitle("Cancelled")
      .setDescription("You successfully cancelled this application");
    const outOfTime = new Discord.MessageEmbed()
      .setTitle("Cancelled")
      .setDescription(
        "You were inactive for too long, so this form was cancelled."
      );
    const tooManyChars = new Discord.MessageEmbed()
      .setTitle("Cancelled")
      .setDescription(
        "Your response was too long, so this form was cancelled."
      );
    const success = new Discord.MessageEmbed()
      .setTitle("Success")
      .setDescription(
        "You successfully submitted your application\nIf you don't recieve a response then most likely you have been denied"
      );
    const questions = [
      "How many members does your server have?",
      "How many Bots does your server have?",
      "Is your server NSFW?",
      "Does your server break discord's TOS in any way?",
      "Does your server name or image contain vulgar or inappropriate terms/images",
      "Is your server meme orientated?",
      "Does your server promote anything illegal?",
      "How active is the owner of the server?",
      "What is your server about?",
      "How old is your server?",
      "Send a permanent invite link to your server",
      "How visible is your partnership channel",
      "If you would like to say something else you can type it here",
    ];

    const questionEmbed = new Discord.MessageEmbed();
    responses = [];
    if (data.args[0] == "defaultvalues") {
      for (i = 0; i < questions.length; i++) {
        responses.push("default value lol");
      }
    }
    let exitFlag = false,
      skip = responses.length > 0;
    const author = message.author;
    for (i = 0; i < questions.length; i++) {
      if (skip) break;
      questionEmbed.setTitle(`Question ${i + 1}`);
      questionEmbed.setDescription(questions[i]);
      const m = await author.send({ embed: questionEmbed });
      await m.channel
        .awaitMessages(filter1, {
          time: 5 * 60000,
          max: 1,
          errors: ["time"],
        })
        .then((resp) => {
          if (resp.first().content.toLowerCase() === "cancel") {
            author.send({embeds: [cancel]});
            exitFlag = true;
          }
          if (responses.join("").length + resp.first().content.length > 4096) {
            author.send({embeds: [tooManyChars]});
            exitFlag = true;
          }
          responses.push(resp.first());
        })
        .catch((collected) => {
          if (collected.length) return;
          message.channel.send({ embed: outOfTime });
          exitFlag = true;
        });
      if (exitFlag) return;
    }
    if (exitFlag) return;
    message.author.send(success).then(() => {
      const dataEmbed = new Discord.MessageEmbed().setTitle(
        `Application Submitted by ${message.author.tag}`
      );
      body = "";
      for (i = 0; i < responses.length; i++) {
        body += `${questions[i]} ${responses[i]}\n`;
      }
      body = body.trim(); // remove extra whitespace (extra \n at the end)
      dataEmbed.setDescription(body);
      message.client.channels.cache
        .get(partnerChannel)
        .send({ embed: dataEmbed, split: true });
    });
    if (!data.args.length) return;
    if (data.args[0] === "decline") {
      if (!message.member.roles.cache.has(partnermanagerrole))
        return message.channel.send(
          "you dont' have permission to use this command"
        );
      let User = message.mentions.users.first();
      if (!User)
        return message.channel.send("Please provide a user for me to decline");
      User.send(
        "Your application to " + message.guild.name + " got declined..."
      );
    }

    if (data.args[0] === "accept") {
      if (!message.member.roles.cache.has(partnermanagerrole))
        return message.channel.send(
          "you dont' have permission to use this command"
        );
      let User = message.mentions.users.first();
      if (!User)
        return message.channel.send("Please provide a user for me to accept");
      User.send(
        ":tada: Your application to " + message.guild.name + " got accepted!"
      );
    }
  },
};
