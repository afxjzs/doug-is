"use client"

import SocialIcons from "./SocialIcons"

export default function Footer() {
	return (
		<footer className="py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] border-t border-[rgba(var(--color-border),0.06)] text-[rgba(var(--color-foreground),0.55)] font-[family-name:var(--font-mono)]">
			<span>doug.is</span>
			<SocialIcons iconSize="small" className="!space-x-4" />
			<span>&copy; {new Date().getFullYear()}</span>
			<span>built with &lt;3 by my robots</span>
		</footer>
	)
}
