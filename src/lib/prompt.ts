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

/**
 * Display numbered choices and return the selected value.
 * Re-prompts on invalid input until a valid selection is made.
 * @param question - The question to display above the choices.
 * @param choices - Array of choice strings.
 * @returns The selected choice string.
 */
export async function askChoice(question: string, choices: string[]): Promise<string> {
  console.log(question);
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (choice !== undefined) {
      console.log(`  ${i + 1}. ${choice}`);
    }
  }

  for (;;) {
    const answer = await askQuestion('> ');
    const num = parseInt(answer.trim(), 10);

    if (!Number.isNaN(num) && num >= 1 && num <= choices.length) {
      const selected = choices[num - 1];
      if (selected !== undefined) {
        return selected;
      }
    }

    console.log(`Please enter a number between 1 and ${choices.length}.`);
  }
}
