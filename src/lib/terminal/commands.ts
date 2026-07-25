/**
 * Command engine for the homepage terminal. Pure functions — the
 * component owns rendering, focus, and side effects (navigation,
 * the barrel roll, clearing). `help` lists only the real commands;
 * everything else is left for visitors to discover.
 */

export type TerminalAction =
	| { type: "navigate"; href: string }
	| { type: "clear" }
	| { type: "barrel-roll" }

export interface CommandOutcome {
	output: string[]
	action?: TerminalAction
}

export const SECTIONS = [
	"advising",
	"building",
	"investing",
	"writing",
	"connecting",
] as const

const FILES: Record<string, string[]> = {
	resume: [
		"doug rogers — engineer, founder, advisor",
		"",
		"25+ years building products",
		"multiple startups, two exits",
		"YC & Techstars alum",
		"accelerator director",
		"",
		"rapid prototyping & MVPs",
		"idea validation & ICP identification",
		"0 → 1 product development",
		"customer empathy (the real kind)",
	],
	"experience.log": [
		"25+ years building products",
		"multiple startups, two exits",
		"YC & Techstars alum",
		"accelerator director",
	],
	"strengths.txt": [
		"rapid prototyping & MVPs",
		"idea validation & ICP identification",
		"0 → 1 product development",
		"customer empathy (the real kind)",
	],
}

const FORTUNES = [
	"revenue over pitch decks, every time.",
	"it's not how many mistakes you make. it's how many you don't make twice.",
	"still shipping.",
	"customer empathy — the real kind.",
	"side projects happen when i can't sleep.",
]

const CAREER_LOG = [
	"a7f3c21 feat: DubPrime — fintech (Techstars JPM '24)",
	"d94e10b feat: GAIuS (gaius.fyi)",
	"5b82fd0 feat: exit #2",
	"c3a91e4 feat: Y Combinator (W15)",
	"98d2b7a feat: exit #1",
	"e61f04c fix: don't make the same mistake twice",
	"0000001 init: start shipping (25+ years ago)",
]

const HELP: string[] = [
	"available commands:",
	"  help            this list",
	"  ls              what doug.is",
	"  open <section>  go there",
	"  cat <file>      read something",
	"  clear           wipe the screen",
	"",
	"…plus a few things this help doesn't mention.",
]

function usageOpen(): string[] {
	return [`usage: open <section> — one of: ${SECTIONS.join(", ")}`]
}

function openSection(arg: string | undefined): CommandOutcome {
	const section = arg?.toLowerCase()
	if (!section || !SECTIONS.includes(section as (typeof SECTIONS)[number])) {
		return { output: usageOpen() }
	}
	return {
		output: [`opening /${section} …`],
		action: { type: "navigate", href: `/${section}` },
	}
}

function catFile(arg: string | undefined): CommandOutcome {
	if (!arg) return { output: ["usage: cat <file> — try 'ls'"] }
	const name = arg.toLowerCase()
	if (name === "pitchdeck.pdf") {
		return { output: ["cat: pitchdeck.pdf: 404 — revenue speaks louder."] }
	}
	const contents = FILES[name]
	if (!contents) return { output: [`cat: ${arg}: no such file — try 'ls'`] }
	return { output: contents }
}

export function runCommand(rawInput: string): CommandOutcome {
	const input = rawInput.trim()
	if (!input) return { output: [] }

	const lower = input.toLowerCase()
	const [word, ...args] = input.split(/\s+/)
	const command = word.toLowerCase()

	// Easter eggs first — most are full-phrase matches.
	if (lower === "do a barrel roll") {
		return { output: ["🥁 nailed it."], action: { type: "barrel-roll" } }
	}
	if (lower === "sudo hire doug") {
		return {
			output: ["permission granted.", "redirecting to /connecting …"],
			action: { type: "navigate", href: "/connecting" },
		}
	}
	if (command === "sudo") {
		return {
			output: [
				"guest is not in the sudoers file. this incident will be reported.",
			],
		}
	}
	if (command === "rm") {
		return { output: ["nice try. my robots have backups."] }
	}
	if (command === "git") {
		if (args[0]?.toLowerCase() === "log") return { output: CAREER_LOG }
		return { output: ["git: try 'git log'"] }
	}
	if (command === "vim" || command === "vi" || command === "nano") {
		return {
			output: [
				"you are now trapped in vim. (:q to escape — you'd be surprised how many can't.)",
			],
		}
	}
	if (command === ":q" || command === ":q!" || command === ":wq") {
		return { output: ["you escaped. muscle memory intact."] }
	}
	if (command === "uptime") {
		return { output: ["25+ years, still shipping."] }
	}
	if (command === "brew") {
		if (lower === "brew install sleep") {
			return {
				output: ["Error: sleep conflicts with side-projects. resolve manually."],
			}
		}
		return { output: ["brew: unknown formula. (try 'brew install sleep')"] }
	}
	if (command === "fortune") {
		return {
			output: [FORTUNES[Math.floor(Math.random() * FORTUNES.length)]],
		}
	}

	// Real commands.
	switch (command) {
		case "help":
			return { output: HELP }
		case "ls":
			return {
				output: [
					SECTIONS.map((s) => `${s}/`).join("  "),
					Object.keys(FILES).sort().join("  "),
				],
			}
		case "open":
		case "cd":
			return openSection(args[0])
		case "cat":
			return catFile(args[0])
		case "clear":
			return { output: [], action: { type: "clear" } }
		case "whoami":
			return { output: ["guest. but doug.is doug — that's the whole domain."] }
		case "echo": {
			const echoed = args
				.join(" ")
				.replace(/\$STATUS/g, "still shipping.")
			return { output: [echoed] }
		}
		default:
			return {
				output: [`command not found: ${word} — try 'help'`],
			}
	}
}

// Tab completion for the real commands only — completing easter eggs
// would spoil the discovery.
const COMPLETABLE = ["help", "ls", "open", "cat", "clear"]

export function completeInput(rawInput: string): string | null {
	const input = rawInput.replace(/^\s+/, "")
	if (!input) return null
	const parts = input.split(/\s+/)

	if (parts.length === 1) {
		const matches = COMPLETABLE.filter((c) => c.startsWith(parts[0]))
		return matches.length === 1 ? matches[0] : null
	}

	const command = parts[0].toLowerCase()
	const partial = parts[parts.length - 1].toLowerCase()
	let candidates: string[] = []
	if (command === "open" || command === "cd") candidates = [...SECTIONS]
	if (command === "cat") candidates = Object.keys(FILES)
	const matches = candidates.filter((c) => c.startsWith(partial))
	if (matches.length !== 1) return null
	return [...parts.slice(0, -1), matches[0]].join(" ")
}
