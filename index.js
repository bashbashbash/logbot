//const Discord = require('discord.js')
import Discord from 'discord.js'
import LogEntry from './logEntry.js'
import LogsHeader from './logsHeader.js'
const TOKEN = process.env.TOKEN
if(!TOKEN) {
    console.error("Token is undefined: set env token");
}

const client     = new Discord.Client()
const logsheader = new LogsHeader()
const TOTAL_LOG_COUNT = 99

client.once('ready', () => {
    client.targetChannel = client.channels.cache.find(
        channel => channel.name === "zacks-test"
    )

    client.targetChannel.send("The logbot is online")
    console.log('logbot is online!')
    
})

client.on('message', (message) => {
    const prefix = '!log'

    if (!message.content.startsWith(prefix) || message.author.bot) return
    writeToLogs(message.content)
})

function writeToLogs(messageContent) {
    let logentry     = parseMessage(messageContent)
    let success = processLog(logentry)
    if(success) {
        // var fs = require("fs")
        // fs.appendFile('log.txt', messageContent, function(err) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     // Read the newly written file and print all of its content on the console
        //     fs.readFile('log.txt', function (err, data) {
        //         if (err) {
        //             return console.error(err);
        //         }
        //         console.log("Asynchronous read: \n" + data.toString());
        //     });
        // });
        var i
        for(i of logsheader.logEntries) {
            console.log(i)
        }
    }
}

function processLog(logentry) {
    var success = false;
    if(logsheader.count > TOTAL_LOG_COUNT) {
        console.log("logs are full - see administrator")
    } else {
        logsheader.count += 1
        console.log(logsheader.logEntries.push(logentry))
        success = true
    }

    return success
}

const LogType = { "LOG": 1, "SLAP": 2, "TERROR": 3 };
Object.freeze(LogType)

function getLogType(type) {
    switch (type.toLowerCase().trim()) {
        case "slap":
            return LogType.SLAP
        case "terror":
            return LogType.TERROR
        default:
            return LogType.LOG
    }
}
function parseMessage(content) {
    const words = content.split(" ")
    if(words.length > 3) {
        var i;
        var text = ""
        for (i = 2; i < words.length; i++) {
            text += words[i] + " "
        }
        return new LogEntry(1, getLogType(words[1]), new Date(), text)
    }
    return null
}

client.login(TOKEN)