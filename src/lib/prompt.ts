import readline from 'readline';

/**
 * Ask a question via readline and return the answer.
 * @param prompt - The question to display.
 * @returns The user's answer.
 */
export function askQuestion(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
