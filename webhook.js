const { WebhookClient, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'webhook',
    aliases: ['web'],
    execute(message, args, client) {
        const webHookID = '820149967469019157';
        const webHookToken = 'MnUHCzRrwtOSdfd_JiM-4a4WDlgY4fkNafhsDyqI3T7Jtu8JNaR7lNaOzfAprTvCrXv3';
        const webhookClient = new WebhookClient(webHookID, webHookToken);

        const embeded = new MessageEmbed()
            .setTitle('Hello')
            .setDescription('This is a description')
            .setColor('BLUE');

        webhookClient.send({
            username: 'I am a webhook',
            embeds: [embed]
        });
    }
}


