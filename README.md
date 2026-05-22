# 🔔 Telegram Alerta Bot

Bot que monitora qualquer site e te avisa no Telegram quando algo muda — preço, conteúdo, disponibilidade.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## O que faz?

Você configura uma lista de URLs + seletores CSS. O bot visita cada página periodicamente, extrai o conteúdo e, se mudou desde a última checagem, manda uma mensagem no Telegram.

**Sem servidor. Sem banco de dados. Roda no seu PC ou em qualquer VPS de R$ 10/mês.**

## Casos de uso

| Cenário | Como usar |
|---|---|
| 🛒 **Alerta de promoção** | Monitore o preço de um produto na Amazon, Mercado Livre, Kabum |
| 💼 **Vaga de emprego nova** | Monitore a página de vagas de uma empresa |
| 🏛️ **Mudança em site de governo** | Concursos, editais, resultados |
| 📦 **Produto em estoque** | Saiba quando um item esgotado volta ao estoque |
| 📰 **Notícia nova** | Monitore títulos de portais de notícia |
| 🏠 **Imóvel novo** | Monitore listagens em sites de imóveis |

## Setup rápido (5 minutos)

### 1. Crie seu bot no Telegram

1. Abra o Telegram e fale com o [@BotFather](https://t.me/BotFather)
2. Envie `/newbot`, escolha nome e username
3. Copie o **token** que ele te dá

### 2. Descubra seu Chat ID

1. Fale com o [@userinfobot](https://t.me/userinfobot) no Telegram
2. Ele responde com seu Chat ID (número)

### 3. Configure o bot

```bash
git clone https://github.com/SEU_USUARIO/telegram-alerta-bot.git
cd telegram-alerta-bot
npm install
cp .env.example .env
```

Edite `.env`:
```
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=987654321
CHECK_INTERVAL_MINUTES=5
```

### 4. Configure as URLs para monitorar

Edite `urls.json`:
```json
[
  {
    "name": "Fone Bluetooth - Amazon",
    "url": "https://www.amazon.com.br/dp/B09V3KXJPB",
    "selector": ".a-price-whole",
    "type": "text"
  }
]
```

- **name**: nome amigável (aparece na notificação)
- **url**: página para monitorar
- **selector**: seletor CSS do elemento (use F12 no navegador para encontrar)
- **type**: `text` (só texto) ou `html` (HTML interno)

### 5. Rode

```bash
node index.js
```

Abra o Telegram e mande `/start` pro seu bot. Pronto!

## Comandos do bot

| Comando | O que faz |
|---|---|
| `/start` | Mostra status e instruções |
| `/status` | Lista URLs monitoradas e valores atuais |
| `/check` | Força uma checagem imediata |
| `/chatid` | Mostra seu Chat ID |

## Rodar 24/7

Para manter o bot rodando permanentemente, use PM2:

```bash
npm install -g pm2
pm2 start index.js --name alerta-bot
pm2 save
pm2 startup
```

## Como encontrar o seletor CSS

1. Abra a página no Chrome
2. Clique com botão direito no elemento → **Inspecionar**
3. No painel Elements, clique com botão direito no elemento → **Copy** → **Copy selector**
4. Cole no campo `selector` do `urls.json`

## Tecnologias

- **Node.js** — runtime
- **node-telegram-bot-api** — integração Telegram
- **axios** — requisições HTTP
- **cheerio** — parsing HTML (como jQuery no servidor)

## Licença

MIT — use como quiser.
