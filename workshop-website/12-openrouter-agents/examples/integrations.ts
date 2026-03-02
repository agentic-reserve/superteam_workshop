/**
 * Platform Integration Examples
 * Shows how to use the agent with different platforms
 */

import { createAgent, type Agent } from './agent.js';
import { defaultTools } from './tools.js';

// ============================================================================
// 1. HTTP API Server (Express)
// ============================================================================

export function createHTTPServer() {
  const express = require('express');
  const app = express();
  app.use(express.json());

  // Store agents per session
  const sessions = new Map<string, Agent>();

  app.post('/chat', async (req, res) => {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Get or create agent for this session
    let agent = sessions.get(sessionId);
    if (!agent) {
      agent = createAgent({
        apiKey: process.env.OPENROUTER_API_KEY!,
        model: 'openrouter/auto',
        tools: defaultTools,
      });
      sessions.set(sessionId, agent);
    }

    try {
      const response = await agent.sendSync(message);
      res.json({
        response,
        history: agent.getMessages(),
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.delete('/chat/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const agent = sessions.get(sessionId);
    if (agent) {
      agent.clearHistory();
      sessions.delete(sessionId);
    }
    res.json({ success: true });
  });

  app.listen(3000, () => {
    console.log('🚀 HTTP API running on http://localhost:3000');
  });
}

// ============================================================================
// 2. Discord Bot
// ============================================================================

export function createDiscordBot() {
  const { Client, GatewayIntentBits } = require('discord.js');

  const discord = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // One agent per channel
  const agents = new Map<string, Agent>();

  discord.on('ready', () => {
    console.log(`🤖 Discord bot logged in as ${discord.user?.tag}`);
  });

  discord.on('messageCreate', async (msg) => {
    // Ignore bot messages
    if (msg.author.bot) return;

    // Only respond to mentions or DMs
    if (!msg.mentions.has(discord.user!) && msg.channel.type !== 'DM') return;

    // Get or create agent for this channel
    let agent = agents.get(msg.channelId);
    if (!agent) {
      agent = createAgent({
        apiKey: process.env.OPENROUTER_API_KEY!,
        model: 'openrouter/auto',
        tools: defaultTools,
      });
      agents.set(msg.channelId, agent);
    }

    // Show typing indicator
    await msg.channel.sendTyping();

    try {
      const response = await agent.sendSync(msg.content);
      await msg.reply(response);
    } catch (error) {
      await msg.reply(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  discord.login(process.env.DISCORD_TOKEN);
}

// ============================================================================
// 3. Telegram Bot
// ============================================================================

export function createTelegramBot() {
  const TelegramBot = require('node-telegram-bot-api');

  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
  const agents = new Map<number, Agent>();

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    // Handle commands
    if (text === '/start') {
      bot.sendMessage(chatId, '👋 Hello! I\'m an AI assistant. Ask me anything!');
      return;
    }

    if (text === '/clear') {
      const agent = agents.get(chatId);
      if (agent) {
        agent.clearHistory();
        agents.delete(chatId);
      }
      bot.sendMessage(chatId, '🗑️ Conversation cleared!');
      return;
    }

    // Get or create agent
    let agent = agents.get(chatId);
    if (!agent) {
      agent = createAgent({
        apiKey: process.env.OPENROUTER_API_KEY!,
        model: 'openrouter/auto',
        tools: defaultTools,
      });
      agents.set(chatId, agent);
    }

    try {
      // Send "typing..." action
      bot.sendChatAction(chatId, 'typing');

      const response = await agent.sendSync(text);
      bot.sendMessage(chatId, response);
    } catch (error) {
      bot.sendMessage(chatId, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  console.log('🤖 Telegram bot started');
}

// ============================================================================
// 4. Slack Bot
// ============================================================================

export function createSlackBot() {
  const { App } = require('@slack/bolt');

  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  const agents = new Map<string, Agent>();

  app.message(async ({ message, say }) => {
    // Get or create agent for this channel
    let agent = agents.get(message.channel);
    if (!agent) {
      agent = createAgent({
        apiKey: process.env.OPENROUTER_API_KEY!,
        model: 'openrouter/auto',
        tools: defaultTools,
      });
      agents.set(message.channel, agent);
    }

    try {
      const response = await agent.sendSync(message.text);
      await say(response);
    } catch (error) {
      await say(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  app.start(process.env.PORT || 3000);
  console.log('⚡️ Slack bot is running!');
}

// ============================================================================
// 5. WebSocket Server (Real-time streaming)
// ============================================================================

export function createWebSocketServer() {
  const { WebSocketServer } = require('ws');

  const wss = new WebSocketServer({ port: 8080 });
  const agents = new Map<string, Agent>();

  wss.on('connection', (ws) => {
    const sessionId = Math.random().toString(36).substring(7);
    console.log(`🔌 Client connected: ${sessionId}`);

    // Create agent for this connection
    const agent = createAgent({
      apiKey: process.env.OPENROUTER_API_KEY!,
      model: 'openrouter/auto',
      tools: defaultTools,
    });

    // Hook into streaming events
    agent.on('stream:delta', (delta) => {
      ws.send(JSON.stringify({ type: 'delta', content: delta }));
    });

    agent.on('tool:call', (name, args) => {
      ws.send(JSON.stringify({ type: 'tool_call', name, args }));
    });

    agent.on('error', (error) => {
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    });

    agents.set(sessionId, agent);

    ws.on('message', async (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === 'chat') {
        await agent.send(message.content);
        ws.send(JSON.stringify({ type: 'done' }));
      }

      if (message.type === 'clear') {
        agent.clearHistory();
        ws.send(JSON.stringify({ type: 'cleared' }));
      }
    });

    ws.on('close', () => {
      agents.delete(sessionId);
      console.log(`🔌 Client disconnected: ${sessionId}`);
    });
  });

  console.log('🔌 WebSocket server running on ws://localhost:8080');
}

// ============================================================================
// 6. CLI with Rich Output
// ============================================================================

export async function createCLI() {
  const readline = await import('readline');
  const chalk = (await import('chalk')).default;

  const agent = createAgent({
    apiKey: process.env.OPENROUTER_API_KEY!,
    model: 'openrouter/auto',
    tools: defaultTools,
  });

  // Colorful event hooks
  agent.on('thinking:start', () => {
    console.log(chalk.yellow('\n🤔 Thinking...'));
  });

  agent.on('tool:call', (name, args) => {
    console.log(chalk.blue(`🔧 Using ${name}:`), args);
  });

  agent.on('stream:delta', (delta) => {
    process.stdout.write(chalk.green(delta));
  });

  agent.on('stream:end', () => {
    console.log('\n');
  });

  agent.on('error', (err) => {
    console.error(chalk.red('❌ Error:'), err.message);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.bold.cyan('🤖 OpenRouter Agent CLI'));
  console.log(chalk.gray('Type your message (Ctrl+C to exit)\n'));

  const prompt = () => {
    rl.question(chalk.bold('You: '), async (input) => {
      if (!input.trim()) {
        prompt();
        return;
      }

      if (input.toLowerCase() === '/clear') {
        agent.clearHistory();
        console.log(chalk.yellow('🗑️  Conversation cleared\n'));
        prompt();
        return;
      }

      await agent.send(input);
      prompt();
    });
  };

  prompt();
}

// ============================================================================
// Run specific integration
// ============================================================================

const integration = process.argv[2];

switch (integration) {
  case 'http':
    createHTTPServer();
    break;
  case 'discord':
    createDiscordBot();
    break;
  case 'telegram':
    createTelegramBot();
    break;
  case 'slack':
    createSlackBot();
    break;
  case 'websocket':
    createWebSocketServer();
    break;
  case 'cli':
    createCLI();
    break;
  default:
    console.log('Usage: tsx integrations.ts [http|discord|telegram|slack|websocket|cli]');
}
