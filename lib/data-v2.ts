export type StepCategory = 'research' | 'prototyping' | 'code' | 'planning' | 'workflow';

export interface CategoryInfo {
  label: string;
  color: string;
}

export const CATS: Record<StepCategory, CategoryInfo> = {
  research:    { label: "Research", color: "var(--cat-research)" },
  prototyping: { label: "Prototyping", color: "var(--cat-proto)" },
  code:        { label: "Code", color: "var(--cat-code)" },
  planning:    { label: "Planning", color: "var(--cat-plan)" },
  workflow:    { label: "Workflow", color: "var(--cat-flow)" },
};

export const TOOLS = ["Claude.ai", "Claude Code", "Figma Make", "AI Studio"];

export type StepKind = 'simple' | 'build';

export interface Phase {
  n: number;
  title: string;
  tool: string;
  action: string;
  checkpoint: string;
  task: string;
  prompt: string;
}

export interface AuthorExample {
  type: 'image' | 'link';
  url: string;
  label?: string;
}

export interface Step {
  id: string;
  title: string;
  subtitle: string;
  cat: StepCategory;
  tool: string;
  kind: StepKind;
  effort: string;
  layer: number;
  state: string;
  doable: string;
  promise: string;
  usedWhen: string;
  toolName: string;
  defaultTask: string;
  prompt?: string;
  howto?: string[];
  checkpoint?: string;
  related: string[];
  notes: string[];
  result?: { label: string };
  author?: string;
  authorExample?: AuthorExample;
  phases?: Phase[];
  nextPath?: string;
  levelUp?: string[];
  effortLevel?: 'quick' | 'iterative' | 'project';
}

export const STEPS: Step[] = [
  {
    id: "transcribe",
    title: "Transcribe an interview in minutes",
    subtitle: "Audio or notes → clean transcript with insights",
    cat: "research", tool: "Claude.ai", kind: "simple", effort: "5 min", layer: 0,
    state: "avail",
    doable: "Turn an hour of raw interview into a structured summary with quotes.",
    promise: "You stop spending your evening on transcription — you get the summary while your coffee is brewing.",
    usedWhen: "After every user call, when you need to quickly extract the essence.",
    toolName: "Claude.ai",
    defaultTask: "I have a recording of an interview with a user of our app. Need to extract pain points, quotes, and unexpected insights.",
    prompt: "Here is a transcript of a user interview. Please:\n1. Short summary (5 sentences)\n2. 3–5 key pain points, each with a direct quote\n3. Unexpected insights I might have missed\n\nTranscript:\n{task}",
    howto: [
      "Paste the transcript or dictated notes directly into the chat.",
      "You'll get a summary, pain points with quotes, and a list of insights.",
      "Ask to regroup it into your own note format.",
    ],
    checkpoint: "If the summary has at least one quote you'd want to share with the team — **it worked**.",
    related: ["cluster", "notes-structure"],
    notes: [
      "Works with notes too — you don't need a perfect transcript.",
      "Ask it to keep the original language so quotes stay authentic.",
    ],
    result: { label: "interview-summary-anya.md" },
  },
  {
    id: "cluster",
    title: "Cluster feedback into themes",
    subtitle: "A pile of scattered responses → tidy themes with weight",
    cat: "research", tool: "Claude.ai", kind: "simple", effort: "8 min", layer: 1,
    state: "avail",
    doable: "Group hundreds of responses into themes and see what hurts most often.",
    promise: "You see patterns instead of a wall of text — and walk into the sync already with a conclusion.",
    usedWhen: "When a lot of feedback has piled up from different channels and you need to prioritise.",
    toolName: "Claude.ai",
    defaultTask: "Collected feedback from support, app stores, and a survey. I want to understand the main themes.",
    prompt: "Here is a list of user feedback. Group it into 5–7 themes. For each: name, how many responses, 2 representative quotes, likely cause.\n\nFeedback:\n{task}",
    howto: [
      "Paste all the feedback as one list — format doesn't matter.",
      "You'll get themes sorted by frequency.",
      "Ask it to flag themes that contradict each other.",
    ],
    checkpoint: "If a theme appeared that you hadn't thought of — **it worked**.",
    related: ["transcribe", "copy-variants"],
    notes: [
      "Add product context — the clusters will be more accurate.",
      "You can immediately ask for a draft slide with conclusions.",
    ],
    result: { label: "feedback-themes-q2.md" },
  },
  {
    id: "copy-variants",
    title: "Generate copywriting variants",
    subtitle: "One headline → ten directions by tone",
    cat: "workflow", tool: "Claude.ai", kind: "simple", effort: "6 min", layer: 1,
    state: "avail",
    doable: "Get a dozen text variants for a button, screen, or push notification — in different tones.",
    promise: "You stop getting stuck on wording — you pick from ready directions and refine.",
    usedWhen: "When you need to quickly run through microcopy variants and feel out the right tone.",
    toolName: "Claude.ai",
    defaultTask: "Writing text for an empty state in the tasks section. Want variants: encouraging, neutral, playful.",
    prompt: "Write 10 text variants for [UI element]. Context: [product, audience]. Give 3 variants each in tones: calm, playful, direct. Each — up to 8 words.\n\nContext:\n{task}",
    howto: [
      "Describe the element and audience in a few sentences.",
      "You'll get variants grouped by tone.",
      "Pick 2–3 and ask to refine just those.",
    ],
    checkpoint: "If there's a variant you wouldn't be embarrassed to put in the mockup — **it worked**.",
    related: ["critique", "cluster"],
    notes: [
      "Add a 'brand voice' example — and the hits will be more on point.",
      "Ask it to keep the length within a button label.",
    ],
  },
  {
    id: "prototype",
    title: "Quick clickable prototype",
    subtitle: "Flow description → working prototype in the browser",
    cat: "prototyping", tool: "Figma Make", kind: "build", effort: "25 min", layer: 2,
    state: "avail",
    doable: "Build a clickable flow prototype without handing off to developers.",
    promise: "You show a working flow instead of static screens — and tests become honest.",
    usedWhen: "When you need to test a scenario with real people before investing a sprint.",
    toolName: "Figma Make",
    author: "That's how Marina built an onboarding in an evening instead of a week of sign-offs.",
    defaultTask: "I want a clickable prototype of a three-step onboarding: welcome → goal selection → first screen.",
    phases: [
      {
        n: 1, title: "Describe the flow in words", tool: "Claude.ai",
        action: "First talk through the scenario in text: screens, transitions, what the user sees at each step. This is your brief for generation.",
        checkpoint: "You have a list of screens and transitions between them.",
        task: "Describe the three-screen onboarding in plain language.",
        prompt: "Help structure a prototype flow. Scenario: [description]. Give a list of screens, for each — elements and where buttons lead.\n\nScenario:\n{task}",
      },
      {
        n: 2, title: "Generate screens", tool: "Figma Make",
        action: "Paste the description into Figma Make and ask it to build the screens. Refine one screen at a time — it's more manageable.",
        checkpoint: "You can see screens you can click between.",
        task: "Build three screens from the description and connect them with transitions.",
        prompt: "Create a prototype of three screens from the description below. Make the buttons clickable between screens.\n\nDescription:\n{task}",
      },
      {
        n: 3, title: "Refine and share", tool: "Figma Make",
        action: "Walk through the flow as a user. Everything that snags — fix with targeted edits, not a full rebuild.",
        checkpoint: "You can walk through the whole scenario without dead ends.",
        task: "Fix the transitions where I get stuck.",
        prompt: "In the prototype I get stuck on [screen]. The button [name] leads nowhere — connect it to [screen].\n\nMy task:\n{task}",
      },
    ],
    nextPath: "When you're happy with the prototype — ask <span class='np-tool'>Claude Code</span> to turn it into a real component you can hand off to dev.",
    related: ["dashboard", "internal-tool"],
    notes: [
      "Don't try to do everything in one prompt — build screen by screen.",
      "Keep real product copy — the test will be more honest.",
    ],
  },
  {
    id: "critique",
    title: "Design critique of your own screen",
    subtitle: "Mockup screenshot → structured breakdown",
    cat: "workflow", tool: "Claude.ai", kind: "simple", effort: "7 min", layer: 1,
    state: "avail",
    doable: "Get a fresh perspective on your mockup before taking it to review.",
    promise: "You walk into review prepared — weak spots already found and fixed.",
    usedWhen: "Before showing a mockup to the team or stakeholders.",
    toolName: "Claude.ai",
    defaultTask: "I want a critique of a task list screen: hierarchy, readability, what's not working.",
    prompt: "Look at this mockup as a demanding design lead. Give a breakdown: hierarchy, readability, accessibility, ambiguities. For each issue — why and what to do.\n\nMy task:\n{task}\n\n[attach screenshot]",
    howto: [
      "Attach the mockup screenshot directly in the chat.",
      "You'll get a breakdown by criteria with recommendations.",
      "Ask it to prioritise: what to fix first.",
    ],
    checkpoint: "If it found a problem you hadn't noticed — **it worked**.",
    related: ["copy-variants", "prototype"],
    notes: [
      "Give context: who the screen is for and what the main action is.",
      "Ask it to separate 'fact' from 'subjective opinion'.",
    ],
  },
  {
    id: "dashboard",
    title: "Build a dashboard with real data",
    subtitle: "CSV or description → live dashboard with charts",
    cat: "prototyping", tool: "AI Studio", kind: "build", effort: "35 min", layer: 3,
    state: "avail",
    doable: "Build a dashboard on real data to check whether it's actually needed.",
    promise: "You validate the dashboard idea on live numbers before writing a ticket for the team.",
    usedWhen: "When you need to quickly show what analytics would look like on real data.",
    toolName: "AI Studio",
    defaultTask: "I have a CSV of events. I want a dashboard: active users, retention, top events.",
    phases: [
      {
        n: 1, title: "Prepare the data", tool: "Claude.ai",
        action: "Show a sample of your data and describe which metrics matter. Agree on the metrics first, then build.",
        checkpoint: "You have a list of metrics and know which fields map to them.",
        task: "Describe the CSV structure and which metrics I want to see.",
        prompt: "Here is a sample of my data. What metrics and charts make sense for a dashboard? Suggest a structure.\n\nData:\n{task}",
      },
      {
        n: 2, title: "Generate the dashboard", tool: "AI Studio",
        action: "Upload the data and ask it to build the dashboard from the agreed structure. Start with 2–3 key charts.",
        checkpoint: "You can see charts built from your real numbers.",
        task: "Build a dashboard with the main metrics.",
        prompt: "Build a dashboard from this data. Charts: [list]. Add a date filter.\n\nMy task:\n{task}\n\n[attach file]",
      },
      {
        n: 3, title: "Verify and refine", tool: "AI Studio",
        action: "Cross-check the numbers against what you know about the product. If something looks odd — ask how the metric was calculated.",
        checkpoint: "The numbers match your sense of reality.",
        task: "Explain how retention is calculated and fix it if needed.",
        prompt: "Explain the formula for the 'retention' metric in the dashboard. If it's calculated differently from 7-day retention — rebuild it.\n\nMy task:\n{task}",
      },
    ],
    nextPath: "Once the dashboard proves its value — ask <span class='np-tool'>Claude Code</span> to turn it into a permanent internal tool the whole team can access.",
    related: ["prototype", "internal-tool"],
    notes: [
      "Anonymise data before uploading.",
      "Don't trust numbers blindly — always verify the formulas.",
    ],
  },
  {
    id: "internal-tool",
    title: "Your own internal tool",
    subtitle: "Repetitive task → a small app for the team",
    cat: "code", tool: "Claude Code", kind: "build", effort: "60 min", layer: 4,
    state: "avail",
    doable: "Build a real mini-app the team opens via a link.",
    promise: "You turn 'it would be nice to have a tool' into an actual tool — without filing a request with dev.",
    usedWhen: "When a routine repeats every week and spreadsheets no longer cut it.",
    toolName: "Claude Code",
    defaultTask: "I want a tool where the team marks mockup statuses and sees overall progress.",
    phases: [
      {
        n: 1, title: "Describe what it should do", tool: "Claude.ai",
        action: "Write out the tool's job in a few paragraphs: who the user is, what actions they take, what gets stored.",
        checkpoint: "You have a short plain-language description of the tool.",
        task: "Describe a tool for tracking mockup statuses.",
        prompt: "Help me write a brief for a small internal tool. Idea: [description]. Give a list of screens and data.\n\nIdea:\n{task}",
      },
      {
        n: 2, title: "Build the first version", tool: "Claude Code",
        action: "Pass the description to Claude Code and ask for a working skeleton. Run it locally and see the result immediately.",
        checkpoint: "The tool opens and performs the main action.",
        task: "Build the skeleton from the description and run it locally.",
        prompt: "Build a small web app from this brief. Start with a skeleton of the main screen.\n\nBrief:\n{task}",
      },
      {
        n: 3, title: "Ship it to the team", tool: "Claude Code",
        action: "Once it works locally — ask it to deploy and give you a link. Share with the team and collect first edits.",
        checkpoint: "A colleague opened it via the link and used it.",
        task: "Deploy and give a shareable link for the team.",
        prompt: "Deploy this app and give a link that can be shared with the team.\n\nMy task:\n{task}",
      },
    ],
    nextPath: "Next you can add auth and a database — ask <span class='np-tool'>Claude Code</span> to wire up persistence so data doesn't get lost.",
    related: ["dashboard", "ds-automation"],
    notes: [
      "Start with the smallest version that delivers value.",
      "Don't be scared of code — describe in words what should happen.",
    ],
  },
  {
    id: "ds-automation",
    title: "Automate design system routine",
    subtitle: "Manual token sync → one script",
    cat: "code", tool: "Claude Code", kind: "build", effort: "45 min", layer: 4,
    state: "avail",
    doable: "Automate moving tokens from Figma into code — no manual copying.",
    promise: "You stop checking colours by hand — the script keeps design and code in sync.",
    usedWhen: "When the design system is growing and manual sync is eating up hours.",
    toolName: "Claude Code",
    defaultTask: "I want a script that takes tokens from a Figma export and generates CSS variables.",
    phases: [
      {
        n: 1, title: "Show the input and output format", tool: "Claude.ai",
        action: "Show an example of your exported tokens and what the result should look like in code. A clear example = a precise script.",
        checkpoint: "You have a 'before' and 'after' example.",
        task: "Describe the token format and the desired CSS output.",
        prompt: "I have tokens in [format]. I want CSS variables in [format] as output. How do I do this with a script?\n\nExample:\n{task}",
      },
      {
        n: 2, title: "Build the script", tool: "Claude Code",
        action: "Ask Claude Code to write the script and run it on your example. Compare the result with what you expected.",
        checkpoint: "The script produces correct CSS on the test file.",
        task: "Write the script and run it on the example.",
        prompt: "Write a script that converts tokens to CSS variables following the example above. Show the result on a test file.\n\nMy task:\n{task}",
      },
    ],
    nextPath: "Next — hook the script to CI so it runs automatically on every token update.",
    related: ["internal-tool", "prototype"],
    notes: [
      "Keep a fresh export example handy.",
      "Test the result on one component before rolling out to the whole system.",
    ],
  },
  {
    id: "research-plan",
    title: "Research plan in half an hour",
    subtitle: "Product question → ready interview guide",
    cat: "planning", tool: "Claude.ai", kind: "simple", effort: "10 min", layer: 2,
    state: "avail",
    doable: "Put together a research plan and interview guide without starting from a blank page.",
    promise: "You go into research with a structure, not the anxiety of 'where do I even start'.",
    usedWhen: "When you have a product question but no time to write out a full methodology.",
    toolName: "Claude.ai",
    defaultTask: "Need to understand why users drop off during onboarding. Need a plan and an interview guide.",
    prompt: "Write a research plan. Question: [what I want to understand]. Give: hypotheses, method, who to recruit, interview guide with 6–8 questions.\n\nContext:\n{task}",
    howto: [
      "Describe exactly what you want to understand and why.",
      "You'll get hypotheses, a method, and an interview guide.",
      "Ask it to remove leading questions.",
    ],
    checkpoint: "If the guide is ready to take to the first call with almost no edits — **it worked**.",
    related: ["transcribe", "notes-structure"],
    notes: [
      "Describe your constraints: how many people and how much time you have.",
      "Ask it to check the questions for bias.",
    ],
  },
  {
    id: "notes-structure",
    title: "Turn notes into structure",
    subtitle: "Chaos of thoughts → a tidy decision map",
    cat: "planning", tool: "Claude.ai", kind: "simple", effort: "6 min", layer: 1,
    state: "avail",
    doable: "Bring scattered notes into a structure where the next step is visible.",
    promise: "You see structure where there was just chaos — and know what to tackle first.",
    usedWhen: "After a workshop or brainstorm, when notes are scattered and need to be gathered.",
    toolName: "Claude.ai",
    defaultTask: "I have raw notes from a workshop. I want to group them into themes and extract decisions and open questions.",
    prompt: "Here are raw notes from a workshop. Group into themes. List separately: decisions made, open questions, next steps.\n\nNotes:\n{task}",
    howto: [
      "Paste the notes as-is — even in fragments.",
      "You'll get themes, decisions, and open questions separately.",
      "Ask for a draft follow-up email to the team.",
    ],
    checkpoint: "If a clear next step surfaced from the notes — **it worked**.",
    related: ["research-plan", "cluster"],
    notes: [
      "Don't clean up notes before pasting — the model can handle the chaos.",
      "Ask it to flag where information is missing to make a decision.",
    ],
  },
  {
    id: "figma-plugin-generator",
    title: "Design a Figma Plugin with AI",
    subtitle: "Raw plugin idea → structured spec & starting prompt for Claude Code",
    cat: "planning", tool: "Claude.ai", kind: "simple", effort: "10 min", layer: 2,
    state: "avail",
    doable: "Turn a raw Figma plugin idea into a structured spec with folder layout, manifest config, and a ready-to-run Claude Code prompt.",
    promise: "You will turn your raw automation idea into a structured plugin spec and get a ready-to-use starting prompt to kick off coding.",
    usedWhen: "Useful at the very beginning, when you want to write your own Figma plugin but don't know where to start with files, which APIs to call, and what permissions to set in the manifest.",
    toolName: "Claude.ai",
    defaultTask: "I want to write a Figma plugin that reads the variants of a selected component, analyzes their properties, and generates markdown documentation from them using the Claude API.",
    prompt: `You are an experienced systems architect and Senior developer of Figma plugins.
I want to create a Figma plugin. Help me translate my raw idea into a structured Technical Specification (spec) and formulate the very first step to kick off code generation.

Here is my plugin idea: {task}

Please generate the following:
1. **Architectural Structure**: Describe the project folder layout and list the files needed for this plugin (e.g., manifest.json, code.ts, ui.html, tsconfig.json).
2. **Manifest Configuration**: Write the exact JSON for manifest.json, specifying correct parameters (UI sizing, networkAccess permissions if external APIs are needed).
3. **Figma API Scenario**: Describe exactly which Figma API objects (e.g., ComponentSetNode, Selection, TextNode) and methods the plugin needs to access to achieve my goal.
4. **Starting Prompt for Code**: Formulate ONE clear, detailed prompt for Claude Code that I can copy and run in my terminal to make Claude Code immediately generate a working skeleton of this plugin (with esbuild and TypeScript configured).

Keep the structure concise and focus on the very first step of development.`,
    howto: [
      "Describe your plugin idea in a few sentences — what it does and what it automates.",
      "You'll get a folder structure, manifest.json, Figma API breakdown, and a Claude Code prompt.",
      "Copy the Claude Code prompt and run it in your terminal to bootstrap the project.",
    ],
    checkpoint: "If you receive a ready-to-use folder structure and a specific prompt for Claude Code to bootstrap the codebase — **it worked**.",
    authorExample: {
      type: "link",
      url: "https://github.com/example/figma-doc-plugin",
      label: "Example Spec & Structure for a Documentation Plugin",
    },
    related: ["internal-tool", "notes-structure"],
    notes: [
      "Save the generated spec to a README.md in your new project so Claude always has context during development.",
      "Run `npx -y create-figma-plugin` if you prefer the standard Figma boilerplate over manual setup.",
    ],
    levelUp: [
      "⚡ Save the generated spec to a `README.md` file in your new project so the AI always has the context during development.",
      "⚡ Run `npx -y create-figma-plugin` in your terminal if you prefer using the standard Figma boilerplate instead of creating files manually.",
    ],
  },
];

export const STEP_BY_ID = Object.fromEntries(STEPS.map(s => [s.id, s]));

export const EFFORT = {
  quick:     "one session",
  iterative: "iterative",
  project:   "multi-session project",
};

const EFFORT_BY_ID: Record<string, 'quick' | 'iterative' | 'project'> = {
  "transcribe": "quick", "cluster": "quick", "copy-variants": "quick",
  "prototype": "iterative", "critique": "quick", "dashboard": "iterative",
  "internal-tool": "project", "ds-automation": "project",
  "research-plan": "iterative", "notes-structure": "quick",
  "figma-plugin-generator": "quick",
};

STEPS.forEach(s => {
  s.effortLevel = EFFORT_BY_ID[s.id] || (s.kind === "build" ? "iterative" : "quick");
});

export interface CalibrationCard {
  id: string;
  name: string;
  role: string;
  pain: string;
  move: string;
  out: string;
  effort: 'quick' | 'iterative' | 'project';
  category: StepCategory;
  next: { wow: string; heard: string; skip: string };
}

export const CALIBRATION_CARDS: CalibrationCard[] = [
  {
    id: "anya",
    name: "Anya",
    role: "Product designer · fintech · 4 years",
    pain: "Spent the whole evening manually transcribing three interviews just to pull a few quotes for a sync.",
    move: "Dropped the recordings into Claude.ai and asked for a summary with pain points and quotes.",
    out: "Walked into the sync with ready insights — and for the first time didn’t finish her notes at midnight.",
    effort: "quick",
    category: "research",
    next: { wow: "masha", heard: "daryna", skip: "olena" }
  },
  {
    id: "masha",
    name: "Masha",
    role: "UI/UX · b2b SaaS · 6 years",
    pain: "PM wanted onboarding by Friday. Didn’t want to design three steps that might turn out to be unnecessary.",
    move: "Described three screens to Claude and asked for working HTML. Ran it with three people before opening Figma.",
    out: "Cut the first step before designing anything. Saved herself a day.",
    effort: "iterative",
    category: "prototyping",
    next: { wow: "olena", heard: "daryna", skip: "anya" }
  },
  {
    id: "daryna",
    name: "Daryna",
    role: "Senior designer · e-com · 3 years",
    pain: "Landing page for a niche startup. No copywriter, no industry knowledge, deadline tomorrow.",
    move: "Told Claude to be the head of marketing for this startup. Three iterations until the tone felt like hers.",
    out: "Hero section and four sections with a real voice. The design took an evening.",
    effort: "quick",
    category: "workflow",
    next: { wow: "olena", heard: "masha", skip: "anya" }
  },
  {
    id: "olena",
    name: "Olena",
    role: "Design lead · seed startup · 7 years",
    pain: "Found a spacing bug in prod on Friday evening. Developers unavailable until Monday.",
    move: "Opened Claude Code, found two Tailwind classes locally. Merged the PR herself.",
    out: "The team found out Monday at standup.",
    effort: "project",
    category: "code",
    next: { wow: "anya", heard: "masha", skip: "daryna" }
  }
];

export function lcFirst(str: string): string {
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : str;
}

export function genTask(step: Step, prev?: string): string {
  const title = lcFirst(step.title);
  const used = lcFirst(step.usedWhen.replace(/\.$/, ""));
  const doable = lcFirst((step.doable || "").replace(/\.$/, ""));
  const tool = step.toolName || step.tool;
  const pool = [
    `I want to ${title} — and do it today, not put it off.`,
    `I have a real task: ${used}. Help me figure out where to start.`,
    `Need to ${title}. Working with ${tool} and want a quick result.`,
    `Right now ${used} — I want to try doing this in one go.`,
    `Taking on ${title}. Walk me through it step by step as if I'm doing this for the first time.`,
    `My situation: ${used}. I want to do this cleanly and without any extra noise.`,
    doable ? `I want to ${doable} — for a real project, not a practice example.` : `I want to ${title} — and check the result right away.`,
    `Need to ${title}. Give me a clear plan: where to start and what's next.`,
  ];
  let pick = prev;
  let guard = 0;
  while (pick === prev && guard < 12) {
    pick = pool[Math.floor(Math.random() * pool.length)];
    guard++;
  }
  return pick || pool[0];
}
