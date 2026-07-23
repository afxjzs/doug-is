import { completeInput, runCommand } from "../commands"

describe("terminal commands", () => {
	describe("help", () => {
		it("lists the real commands", () => {
			const { output } = runCommand("help")
			const text = output.join("\n")
			expect(text).toContain("help")
			expect(text).toContain("ls")
			expect(text).toContain("open")
			expect(text).toContain("cat")
			expect(text).toContain("clear")
		})

		it("does not spoil the easter eggs", () => {
			const text = runCommand("help").output.join("\n")
			expect(text).not.toContain("barrel")
			expect(text).not.toContain("sudo")
			expect(text).not.toContain("vim")
			expect(text).not.toContain("fortune")
		})

		it("hints that there is more than it lists", () => {
			const text = runCommand("help").output.join("\n")
			expect(text).toContain("doesn't mention")
		})
	})

	describe("navigation", () => {
		it("open advising navigates to /advising", () => {
			const result = runCommand("open advising")
			expect(result.action).toEqual({ type: "navigate", href: "/advising" })
		})

		it("cd works as an alias for open", () => {
			const result = runCommand("cd building")
			expect(result.action).toEqual({ type: "navigate", href: "/building" })
		})

		it("open with an unknown section prints usage instead of navigating", () => {
			const result = runCommand("open nonsense")
			expect(result.action).toBeUndefined()
			expect(result.output.join("\n")).toContain("usage: open <section>")
		})

		it("ls lists the sections and the cat-able files", () => {
			const text = runCommand("ls").output.join("\n")
			expect(text).toContain("advising/")
			expect(text).toContain("connecting/")
			expect(text).toContain("experience.log")
			expect(text).toContain("resume")
		})
	})

	describe("files", () => {
		it("cat resume prints the resume", () => {
			const text = runCommand("cat resume").output.join("\n")
			expect(text).toContain("25+ years building products")
		})

		it("cat experience.log matches the intro", () => {
			const text = runCommand("cat experience.log").output.join("\n")
			expect(text).toContain("multiple startups, two exits")
		})

		it("cat with an unknown file errors loudly", () => {
			const text = runCommand("cat nope.txt").output.join("\n")
			expect(text).toContain("no such file")
		})
	})

	describe("easter eggs", () => {
		it("do a barrel roll returns the barrel-roll action", () => {
			const result = runCommand("do a barrel roll")
			expect(result.action).toEqual({ type: "barrel-roll" })
			expect(result.output.length).toBeGreaterThan(0)
		})

		it("sudo hire doug grants permission and navigates to /connecting", () => {
			const result = runCommand("sudo hire doug")
			expect(result.output.join("\n")).toContain("permission granted")
			expect(result.action).toEqual({ type: "navigate", href: "/connecting" })
		})

		it("other sudo attempts get the classic warning", () => {
			const text = runCommand("sudo rm everything").output.join("\n")
			expect(text).toContain("not in the sudoers file")
		})

		it("cat pitchdeck.pdf pushes revenue over decks", () => {
			const text = runCommand("cat pitchdeck.pdf").output.join("\n")
			expect(text).toContain("revenue")
		})

		it("rm -rf / is handled by the robots", () => {
			const text = runCommand("rm -rf /").output.join("\n")
			expect(text).toContain("robots have backups")
		})

		it("git log prints the career history", () => {
			const text = runCommand("git log --oneline career").output.join("\n")
			expect(text).toContain("exit")
			expect(text).toContain("Y Combinator")
		})

		it("vim traps you and :q releases you", () => {
			expect(runCommand("vim").output.join("\n")).toContain("trapped in vim")
			expect(runCommand(":q").output.join("\n")).toContain("escaped")
		})

		it("uptime is still shipping", () => {
			expect(runCommand("uptime").output.join("\n")).toContain(
				"still shipping"
			)
		})

		it("brew install sleep conflicts with side projects", () => {
			const text = runCommand("brew install sleep").output.join("\n")
			expect(text).toContain("side-projects")
		})

		it("fortune returns one of doug's actual lines", () => {
			const text = runCommand("fortune").output.join("\n")
			expect(text.length).toBeGreaterThan(0)
		})
	})

	describe("shell basics", () => {
		it("echo echoes its arguments", () => {
			expect(runCommand("echo hello world").output).toEqual(["hello world"])
		})

		it("echo $STATUS matches the intro", () => {
			expect(runCommand("echo $STATUS").output).toEqual(["still shipping."])
		})

		it("whoami answers for the guest", () => {
			expect(runCommand("whoami").output.join("\n")).toContain("guest")
		})

		it("clear returns the clear action", () => {
			expect(runCommand("clear").action).toEqual({ type: "clear" })
		})

		it("empty input produces no output", () => {
			expect(runCommand("   ").output).toEqual([])
		})

		it("unknown commands fail loudly with a pointer to help", () => {
			const text = runCommand("frobnicate").output.join("\n")
			expect(text).toContain("command not found: frobnicate")
			expect(text).toContain("help")
		})
	})

	describe("tab completion", () => {
		it("completes command names", () => {
			expect(completeInput("he")).toBe("help")
			expect(completeInput("cl")).toBe("clear")
		})

		it("completes section arguments for open", () => {
			expect(completeInput("open adv")).toBe("open advising")
		})

		it("completes file arguments for cat", () => {
			expect(completeInput("cat exp")).toBe("cat experience.log")
		})

		it("returns null when nothing matches", () => {
			expect(completeInput("zz")).toBeNull()
		})

		it("does not complete easter eggs", () => {
			expect(completeInput("do a bar")).toBeNull()
			expect(completeInput("sud")).toBeNull()
		})
	})
})
