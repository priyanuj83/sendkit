import { Command } from 'commander';

type TelegramResponse = {
    ok: boolean;
    result: {
      message_id: number;
      };
      description: string;
};


const program = new Command();

program
    .name("sendkit")
    .description("Sendkit tutorial CLI")
    .command("telegram")
    .description("Send a telegram message")
    .argument("<chatID>", "Telegram chat ID")
    .argument("<message>", "Message text to send")
    .action(async (chatID: string, message: string) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.error("Missing TELEGRAM_BOT_TOKEN environment variable");
            process.exit(1);
        }

        if (!chatID) {
            console.error("Missing Telegram chat ID.");
            process.exit(1);
        }

        if (!message) {
            console.error("Missing Telegram message text.");
            process.exit(1);
        }

        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatID,
                    text: message,
                }),
            }
        );

        const data = (await response.json()) as TelegramResponse;
        if (!response.ok || !data.ok) {
            const detail = data.description ?? response.statusText;
            console.error(`Telegram API request failed: ${detail}`);
            process.exit(1);
        }

        const messageID = data.result?.message_id;
        console.log(`Send Telegram message to chat ${chatID}.`);

        if (messageID !== undefined) {
            console.log(`Telegram message ID: ${messageID}`);
        }
    });

program.parseAsync(process.argv);