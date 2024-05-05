const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// API Endpoint для получения курсов криптовалют
const cryptoAPIEndpoint = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,ethereum-classic,solana,tron,litecoin,ton-crystal&vs_currencies=usd';

const token = '6516910330:AAHWl3iIVa5FMj8m2VMh3I7AZV6eZORAH84';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Чтобы узнать курсы криптовалют, нажмите на кнопку ниже:', {
    reply_markup: {
      keyboard: [
        [{ text: 'Курсы криптовалют💹' }],
        [{ text: 'Пожертвования💰' }]
      ],
      resize_keyboard: true,
    },
  });
});

bot.onText(/Пожертвования💰/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Вы можете сделать пожертвование (USDT TRC20) на адрес: TDkMqnph4VWzgcEL3i5V4PJqWJ3hTbWuR6');
});

bot.onText(/Курсы криптовалют💹/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await axios.get(cryptoAPIEndpoint);
    const cryptoData = response.data;
    let message = '💹Текущие курсы криптовалют💹:\n\n';

    if (cryptoData.bitcoin) {
      message += `<a href="https://bitcoin.org/">🟠BTC</a> (Bitcoin): $${cryptoData.bitcoin.usd}\n\n`;
    }
    if (cryptoData.ethereum) {
      message += `<a href="https://ethereum.org/">🔷ETH</a> (Ethereum): $${cryptoData.ethereum.usd}\n\n`;
    }
    if (cryptoData.tether) {
      message += `<a href="https://tether.to/">🟢USDT</a> (Tether): $${cryptoData.tether.usd}\n\n`;
    }
    if (cryptoData['ethereum-classic']) {
      message += `<a href="https://ethereumclassic.org/">🟣ETC</a> (Ethereum Classic): $${cryptoData['ethereum-classic'].usd}\n\n`;
    }
    if (cryptoData.solana) {
      message += `<a href="https://solana.com/">🟡SOL</a> (Solana): $${cryptoData.solana.usd}\n\n`;
    }
    if (cryptoData.tron) {
      message += `<a href="https://tron.network/">🔴TRX</a> (TRON): $${cryptoData.tron.usd}\n\n`;
    }
    if (cryptoData.litecoin) {
      message += `<a href="https://litecoin.org/">🔵LTC</a> (Litecoin): $${cryptoData.litecoin.usd}\n\n`;
    }

    bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true });
  } catch (error) {
    console.error('Ошибка при получении курсов криптовалют:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении курсов криптовалют. Пожалуйста, попробуйте еще раз.');
  }
});