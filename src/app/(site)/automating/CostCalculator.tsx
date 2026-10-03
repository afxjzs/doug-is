"use client"

import { useEffect, useId, useState } from "react"

const WEEKS_PER_YEAR = 52

const dollars = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
})
const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

// Empty or junk input counts as 0, and the results say so ("$0 a year")
// rather than showing NaN.
function num(value: string): number {
	const n = Number(value)
	return Number.isFinite(n) && n > 0 ? n : 0
}

function payback(buildCost: number, yearlySavings: number): string {
	const weeks = Math.round(buildCost / (yearlySavings / WEEKS_PER_YEAR))
	if (weeks <= WEEKS_PER_YEAR) return `about ${Math.max(weeks, 1)} weeks`
	return `about ${(weeks / WEEKS_PER_YEAR).toFixed(1)} years`
}

const inputClass =
	"w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-accent),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"

function Field({
	label,
	hint,
	value,
	onChange,
	prefix,
	suffix,
}: {
	label: string
	hint?: string
	value: string
	onChange: (v: string) => void
	prefix?: string
	suffix?: string
}) {
	const id = useId()
	return (
		<div>
			<label htmlFor={id} className="block text-sm text-[rgba(var(--color-foreground),0.8)] mb-2">
				{label}
			</label>
			<div className="flex items-center gap-2">
				{prefix && <span className="text-[rgba(var(--color-foreground),0.6)]">{prefix}</span>}
				<input
					id={id}
					type="number"
					inputMode="decimal"
					min={0}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={inputClass}
					style={{
						transition:
							"border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
					}}
				/>
				{suffix && <span className="text-[rgba(var(--color-foreground),0.6)]">{suffix}</span>}
			</div>
			{hint && <p className="mt-1 text-xs text-[rgba(var(--color-foreground),0.55)]">{hint}</p>}
		</div>
	)
}

export default function CostCalculator() {
	const [hours, setHours] = useState("5")
	const [people, setPeople] = useState("1")
	const [rate, setRate] = useState("50")
	const [share, setShare] = useState("50")
	const [buildCost, setBuildCost] = useState("")
	// Inputs stay disabled until React hydrates, so early typing isn't wiped.
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])

	const yearlyHours = num(hours) * num(people) * WEEKS_PER_YEAR
	const yearlyCost = yearlyHours * num(rate)
	const yearlySavings = yearlyCost * (Math.min(num(share), 100) / 100)
	const build = num(buildCost)
	const showPayback = build > 0 && yearlySavings > 0
	const paysBackInAYear = showPayback && build <= yearlySavings

	return (
		<section aria-label="Cost calculator" className="dark-card">
			<fieldset disabled={!hydrated}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<Field label="Hours per week" hint="Spent on the annoying task, per person." value={hours} onChange={setHours} />
				<Field label="People doing it" value={people} onChange={setPeople} />
				<Field label="Cost per hour" hint="Wage plus overhead, or what your own hour is worth." prefix="$" value={rate} onChange={setRate} />
				<Field label="Share I could automate" hint="Your guess. We'll pin it down on the call." suffix="%" value={share} onChange={setShare} />
			</div>

			<div className="border-t border-[rgba(var(--color-border),0.12)] pt-6 space-y-2 text-lg">
				<p>
					That task takes <strong>{whole.format(yearlyHours)} hours a year</strong> and costs you{" "}
					<strong>{dollars.format(yearlyCost)} a year</strong>.
				</p>
				<p>
					Automating {whole.format(Math.min(num(share), 100))}% of it gets back{" "}
					<strong className="text-[rgb(var(--color-accent))]">{dollars.format(yearlySavings)} a year</strong>.
				</p>
			</div>

			<div className="mt-6 max-w-xs">
				<Field
					label="A build that costs"
					hint="Optional. Try a number to see the payback."
					prefix="$"
					value={buildCost}
					onChange={setBuildCost}
				/>
			</div>
			{showPayback && (
				<p className="mt-4 text-[rgba(var(--color-foreground),0.85)]">
					At that price it pays for itself in {payback(build, yearlySavings)}.{" "}
					{paysBackInAYear
						? "That's worth talking about."
						: "That's slow. I'd likely tell you to fix something else first."}
				</p>
			)}
			</fieldset>
		</section>
	)
}
