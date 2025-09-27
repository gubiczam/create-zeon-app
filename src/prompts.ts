import prompts from "prompts";
export type Answers = {
  name: string;
  template: "minimal"|"islands";
  css: "none"|"tailwind";
  git: boolean;
  pm: "pnpm"|"yarn"|"npm";
};
export async function ask(defaultName?: string): Promise<Answers> {
  const r = await prompts([
    { type: "text", name: "name", message: "Project name", initial: defaultName ?? "my-zeon-app" },
    { type: "select", name: "template", message: "Template", choices: [
      { title: "minimal", value: "minimal" },
      { title: "islands", value: "islands" }
    ], initial: 0 },
    { type: "select", name: "css", message: "CSS", choices: [
      { title: "none", value: "none" },
      { title: "tailwind", value: "tailwind" }
    ], initial: 0 },
    { type: "toggle", name: "git", message: "Initialize git?", initial: true, active: "yes", inactive: "no" }
  ]);
  const ua = process.env.npm_config_user_agent ?? "";
  const pm: Answers["pm"] = ua.includes("pnpm") ? "pnpm" : ua.includes("yarn") ? "yarn" : "npm";
  return { ...r, pm };
}
