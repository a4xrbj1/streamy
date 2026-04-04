const readline = require('node:readline');

const input = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
});

input.on('line', (line) => {
    process.stdout.write(`[${new Date().toISOString()}] ${line}\n`);
});

input.on('close', () => {
    process.exit(0);
});
