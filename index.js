import fs from 'fs'
import * as dotenv from 'dotenv'
import TelegramApi from 'node-telegram-bot-api'
import {data} from './data.js'

dotenv.config();
process.env["NTBA_FIX_350"] = 1;

const bot = new TelegramApi(process.env.TOKEN, {polling: true});

bot.setMyCommands([
  {command: '/start', description: 'Start'},
  {command: '/order', description: 'Order'}
])

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  const url = process.env.URL;
  const stream = fs.createReadStream('img/smartum.png')

  return bot.sendPhoto(
    chatId,
    stream,
    {caption: data.startText,
    reply_markup: {
      keyboard: [
        [{text: 'Репетиторство', web_app: {url}}],
        [{text: 'Курси з розвитку інтелекту', web_app: {url}}],
        [{text: 'Записатися на безкоштовне пробне заняття', web_app: {url}}]
      ]
    }},
    {filename: 'smartum.png', contentType: 'image/png'},
  )
})

bot.on('message', async msg => {
  const chatId = msg.chat.id;

  if (msg?.web_app_data?.data) {
    try {
      const webData = JSON.parse(msg?.web_app_data?.data)

      await bot.sendMessage(chatId, data.finalText)
      await bot.sendMessage(process.env.ADMIN_ID, `Name: ${webData.name} ${webData.surname}\nAge: ${webData.age}\nGrade: ${webData.grade}\nSubject: ${webData.subject}\nTheme: ${webData.action}\nTel: ${webData.tel}\nUsername: @${msg.chat.username}`)
    } catch(err) {
      console.log(err) 
    }
  }
})
