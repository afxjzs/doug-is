"use client"

export default function Footer() {
	return (
		<footer className="py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] border-t border-[rgba(var(--color-border),0.06)] text-[rgba(var(--color-foreground),0.25)] font-[family-name:var(--font-mono)]">
			<span>doug.is</span>
			<span>&copy; {new Date().getFullYear()}</span>
			<span>built with &lt;3 by my robots</span>
		</footer>
	)
}
