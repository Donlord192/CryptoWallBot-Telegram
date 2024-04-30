const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// API Endpoint для получения курсов криптовалют
const cryptoAPIEndpoint = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd';

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
    const btcPrice = cryptoData.bitcoin.usd;
    const ethPrice = cryptoData.ethereum.usd;
    const usdtPrice = cryptoData.tether.usd;

    const message = `💹Текущие курсы криптовалют💹:
    🟠BTC (Bitcoin): $${btcPrice}

    🔷ETH (Ethereum): $${ethPrice}

    🟢USDT (Tether): $${usdtPrice}`;

    bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Ошибка при получении курсов криптовалют:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении курсов криптовалют. Пожалуйста, попробуйте еще раз.');
  }
});