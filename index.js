const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const INTERVAL = (parseInt(process.env.CHECK_INTERVAL_MINUTES) || 5) * 60 * 1000;

const URLS_FILE = path.join(__dirname, "urls.json");
const STATE_FILE = path.join(__dirname, "state.json");

const bot = new TelegramBot(TOKEN, { polling: true });

function loadURLs() {
  return JSON.parse(fs.readFileSync(URLS_FILE, "utf-8"));
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return {};
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function fetchContent(entry) {
  const { data } = await axios.get(entry.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 15000,
  });
  const $ = cheerio.load(data);
  const el = $(entry.selector);
  if (entry.type === "html") return el.html()?.trim() || "";
  return el.text()?.trim() || "";
}

async function checkAll() {
  const urls = loadURLs();
  const state = loadState();

  for (const entry of urls) {
    try {
      const content = await fetchContent(entry);
      if (!content) continue;

      const prev = state[entry.url];
      if (prev && prev !== content) {
        const msg =
          `🔔 *Mudança detectada!*\n\n` +
          `📌 *${entry.name}*\n` +
          `🔗 ${entry.url}\n\n` +
          `Antes: \`${prev.substring(0, 200)}\`\n` +
          `Agora: \`${content.substring(0, 200)}\``;
        await bot.sendMessage(CHAT_ID, msg, { parse_mode: "Markdown" });
      }
      state[entry.url] = content;
    } catch (err) {
      console.error(`Erro ao checar ${entry.name}: ${err.message}`);
    }
  }
  saveState(state);
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `✅ Bot ativo! Monitorando ${loadURLs().length} URL(s).\n` +
      `Intervalo: ${INTERVAL / 60000} minutos.\n\n` +
      `Comandos:\n/status - ver URLs monitoradas\n/check - forçar checagem agora\n/chatid - ver seu chat ID`
  );
});

bot.onText(/\/chatid/, (msg) => {
  bot.sendMessage(msg.chat.id, `Seu Chat ID: \`${msg.chat.id}\``, {
    parse_mode: "Markdown",
  });
});

bot.onText(/\/status/, (msg) => {
  const urls = loadURLs();
  const state = loadState();
  let text = `📊 *Monitorando ${urls.length} URL(s):*\n\n`;
  for (const u of urls) {
    const val = state[u.url];
    text += `• *${u.name}*\n  Valor atual: \`${val ? val.substring(0, 100) : "ainda não checado"}\`\n\n`;
  }
  bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
});

bot.onText(/\/check/, async (msg) => {
  bot.sendMessage(msg.chat.id, "⏳ Checando agora...");
  await checkAll();
  bot.sendMessage(msg.chat.id, "✅ Checagem concluída!");
});

console.log("🤖 Bot iniciado! Monitorando mudanças...");
checkAll();
setInterval(checkAll, INTERVAL);
