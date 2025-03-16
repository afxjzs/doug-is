// import Link from "next/link"
// import { usePathname } from "next/navigation"

// export default function Navigation() {
// 	const pathname = usePathname()

// 	return (
// 		<nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 backdrop-blur-xl bg-[rgba(40,0,0,0.85)] border-b border-[rgba(var(--color-foreground),0.1)] shadow-md">
// 			<div className="max-w-6xl mx-auto flex justify-center relative">
// 				<Link
// 					href="/"
// 					className="text-lg font-bold text-[rgba(var(--color-foreground),0.9)] absolute left-0"
// 				>
// 					doug.is{" "}
// 					<span className="text-[rgba(var(--color-foreground),0.5)]">...</span>
// 				</Link>
// 				<ul className="flex space-x-8">
// 					<li>
// 						<Link
// 							href="/building"
// 							className={`text-lg ${
// 								pathname === "/building"
// 									? "text-[rgba(var(--color-foreground),1)] border-b-2 border-violet-500"
// 									: "text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)]"
// 							} transition-colors`}
// 						>
// 							/building
// 						</Link>
// 					</li>
// 					<li>
// 						<Link
// 							href="/advising"
// 							className={`text-lg ${
// 								pathname === "/advising"
// 									? "text-[rgba(var(--color-foreground),1)] border-b-2 border-cyan-500"
// 									: "text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)]"
// 							} transition-colors`}
// 						>
// 							/advising
// 						</Link>
// 					</li>
// 					<li>
// 						<Link
// 							href="/investing"
// 							className={`text-lg ${
// 								pathname === "/investing"
// 									? "text-[rgba(var(--color-foreground),1)] border-b-2 border-[rgb(var(--color-gold))]"
// 									: "text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)]"
// 							} transition-colors`}
// 						>
// 							/investing
// 						</Link>
// 					</li>
// 					<li>
// 						<Link
// 							href="/writing"
// 							className={`text-lg ${
// 								pathname === "/thinking"
// 									? "text-[rgba(var(--color-foreground),1)] border-b-2 border-[rgb(var(--color-emerald))]"
// 									: "text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-foreground),1)]"
// 							} transition-colors`}
// 						>
// 							/writing
// 						</Link>
// 					</li>
// 				</ul>
// 				<Link
// 					href="/contact"
// 					className="neon-button-magenta text-sm py-2 absolute right-0"
// 				>
// 					Let's Connect
// 				</Link>
// 			</div>
// 		</nav>
// 	)
// }
