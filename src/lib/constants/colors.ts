export const TRIGGER_COLORS = {
	Avoid: {
		bg: "rgba(var(--color-red), 0.1)",
		text: "rgba(var(--color-red), 0.9)",
		border: "rgba(var(--color-red), 0.3)",
		dot: "rgba(var(--color-red), 1)",
		disabled: {
			bg: "rgba(var(--color-foreground), 0.05)",
			text: "rgba(var(--color-foreground), 0.3)",
			border: "rgba(var(--color-foreground), 0.1)",
			dot: "rgba(var(--color-foreground), 0.3)",
		},
	},
	OK: {
		bg: "rgba(var(--color-green), 0.1)",
		text: "rgba(var(--color-green), 0.9)",
		border: "rgba(var(--color-green), 0.3)",
		dot: "rgba(var(--color-green), 1)",
		disabled: {
			bg: "rgba(var(--color-foreground), 0.05)",
			text: "rgba(var(--color-foreground), 0.3)",
			border: "rgba(var(--color-foreground), 0.1)",
			dot: "rgba(var(--color-foreground), 0.3)",
		},
	},
	Caution: {
		bg: "rgba(var(--color-yellow), 0.1)",
		text: "rgba(var(--color-yellow), 0.9)",
		border: "rgba(var(--color-yellow), 0.3)",
		dot: "rgba(var(--color-yellow), 1)",
		disabled: {
			bg: "rgba(var(--color-foreground), 0.05)",
			text: "rgba(var(--color-foreground), 0.3)",
			border: "rgba(var(--color-foreground), 0.1)",
			dot: "rgba(var(--color-foreground), 0.3)",
		},
	},
	Conflicted: {
		bg: "rgba(var(--color-violet), 0.1)",
		text: "rgba(var(--color-violet), 0.9)",
		border: "rgba(var(--color-violet), 0.3)",
		dot: "rgba(var(--color-violet), 1)",
		disabled: {
			bg: "rgba(var(--color-foreground), 0.05)",
			text: "rgba(var(--color-foreground), 0.3)",
			border: "rgba(var(--color-foreground), 0.1)",
			dot: "rgba(var(--color-foreground), 0.3)",
		},
	},
} as const

export type TriggerValue = keyof typeof TRIGGER_COLORS
