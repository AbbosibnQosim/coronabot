

const Telegraf = require('telegraf')
const session = require('telegraf/session')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const fs = require('fs')
const api = require('covid19-api');
const COUNTRIES_LIST = require('./HelpCountries');
const Markup = require('telegraf/markup');

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
const menu = new TelegrafInlineMenu('Tilni tanglang. Выберите язык')
menu.manual('UZ', 'uz', {root:true});
menu.manual('RU', 'ru', {joinLastRow:true,root:true});
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




bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
  Давлат : ${data[0][0].country}
  ⚡️Умумий зарарланганлар сони ➖ ${data[0][0].cases}
  ⚡️Соғайганлар ➖ ${data[0][0].recovered}
  ⚡️Вафот этганлар ➖ ${data[0][0].deaths}

  Исталган давлат статистикасини олиш учун - номини инглиз тилида ёзилишини киритинг!
  `;
    ctx.reply(formatData);
  } catch (err) {
    console.log(err);
    ctx.reply('Сиз киритмоқчи булган давлат номи аниқланмади. Илтимос /help га мурожаат қилинг.');
    // ctx.reply(dataActiveCases[0][0].cases);
    // ⚡️Хозирда даволанаётган беморлар ➖ ${data[0][0].active_cases[0].currently_infected_patients}
  }
});



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
      ctx.reply(
    `RURU Ассалом Алайкум ${ctx.chat.first_name}!
Коронавирус статистикасини - инглиз тилида мамлакат номини киритинг ва статистикани олинг.

/help буйруғи билан мамлакатларнинг тўлиқ рўйхатини куришингиз мумкин RURU.
`,
    Markup.keyboard([
      ['Uzbekistan', 'Russia'],
      ['US', 'China'],
    ])
      .resize()
      .extra()
  )
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
      ctx.reply(
    `Ассалом Алайкум ${ctx.chat.first_name}!
Коронавирус статистикасини - инглиз тилида мамлакат номини киритинг ва статистикани олинг.

/help буйруғи билан мамлакатларнинг тўлиқ рўйхатини куришингиз мумкин.
`,
    Markup.keyboard([
      ['Uzbekistan', 'Russia'],
      ['US', 'China'],
    ])
      .resize()
      .extra()
  )
    }

    console.log('another callbackQuery happened', ctx.callbackQuery.data.length, ctx.callbackQuery.data, ctx.session.lang);
  }
  


  return next()
})





startup()