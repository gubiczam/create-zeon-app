import { ask } from "./prompts.js";
import { scaffold } from "./scaffold.js";
export async function run() {
  const defaultName = process.argv[2];
  const answers = await ask(defaultName);
  await scaffold(answers);
}
