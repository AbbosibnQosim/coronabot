

const Telegraf = require('telegraf')
const session = require('telegraf/session')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const fs = require('fs')



const firebase = require('firebase');
const app = firebase.initializeApp({
    apiKey: "AIzaSyAphdjlrzfCM3N2-zyH3zrDLunn32GmG1s",
    authDomain: "bottelegram-444f4.firebaseapp.com",
    databaseURL: "https://bottelegram-444f4.firebaseio.com",
    projectId: "bottelegram-444f4",
    storageBucket: "bottelegram-444f4.appspot.com",
    messagingSenderId: "250005157546",
    appId: "1:250005157546:web:4ec0b66d4637ada94b42d3",
    measurementId: "G-1YNK4B2LH8"
});
const ref = firebase.database().ref();
const sitesRef = ref.child("users");
const menu = new TelegrafInlineMenu('Tilni tanglang')
menu.manual('RU', 'ru', {root:true});
menu.manual('UZ', 'uz', {root:true});
menu.setCommand('start');


const bot = new Telegraf('1138236059:AAGn2HA22HKGpjT_I4T0yuyXAN0Y1rWp0h8');

bot.use(menu.init({
  backButtonText: 'Ortga',
  mainMenuButtonText: 'Asosiy menyuga'
}))
bot.use(session())




async function startup() {
  await bot.launch()
  console.log(new Date(), 'Bot started as', bot.options.username)
}
bot.use((ctx, next) => {
 
    
 
  if (ctx.callbackQuery) {
    if(ctx.callbackQuery.data=='ru')
    {
      ctx.deleteMessage();
      sitesRef.push().set({
        user_id: ctx.chat.id,
        first_name: ctx.chat.first_name,
        last_name:ctx.chat.last_name
      });
      ctx.session.lang=0;
      ctx.reply("Hello ru");
    }
    else if(ctx.callbackQuery.data=='uz')
    {
      ctx.deleteMessage();
      sitesRef.push().set({
        user_id: ctx.chat.id,
        first_name: ctx.chat.first_name,
        last_name:ctx.chat.last_name
      });
      ctx.session.lang=1;
      ctx.reply("Hello uz");
    }

    console.log('another callbackQuery happened', ctx.callbackQuery.data.length, ctx.callbackQuery.data, ctx.session.lang);
  }
  


  return next()
})





startup()