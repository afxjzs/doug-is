"use client"

import { useEffect, useId, useState } from "react"

const WEEKS_PER_YEAR = 52

const dollars = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
})
const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

// Empty or junk input counts as 0, and the results say so ("$0") rather
// than showing NaN.
function num(value: string): number {
	const n = Number(value)
	return Number.isFinite(n) && n > 0 ? n : 0
}

function payback(buildCost: number, yearlySavings: number): string {
	const weeks = Math.max(Math.round(buildCost / (yearlySavings / WEEKS_PER_YEAR)), 1)
	if (weeks <= WEEKS_PER_YEAR) return `${weeks} ${weeks === 1 ? "week" : "weeks"}`
	return `${(weeks / WEEKS_PER_YEAR).toFixed(1)} years`
}

const eyebrow =
	"font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-foreground),0.6)]"

function Field({
	label,
	hint,
	value,
	onChange,
	prefix,
	suffix,
}: {
	label: string
	hint: string
	value: string
	onChange: (v: string) => void
	prefix?: string
	suffix?: string
}) {
	const id = useId()
	const hintId = `${id}-hint`
	return (
		<div className="grid grid-cols-1 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] gap-x-8 gap-y-2 md:items-center py-4">
			<div>
				<label htmlFor={id} className={`block mb-2 ${eyebrow}`}>
					{label}
				</label>
				<div className="flex items-center gap-2 text-2xl">
					<span className="w-4 shrink-0 text-[rgba(var(--color-foreground),0.5)]" aria-hidden>{prefix}</span>
					<input
						id={id}
						type="number"
						inputMode="decimal"
						min={0}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						aria-describedby={hintId}
						className="w-full min-w-0 px-3 py-2 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-accent),0.5)] focus:border-transparent text-[rgb(var(--color-foreground))] tabular-nums"
						style={{
							transition:
								"border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
						}}
					/>
					<span className="w-6 shrink-0 text-[rgba(var(--color-foreground),0.5)]" aria-hidden>{suffix}</span>
				</div>
			</div>
			<p id={hintId} className="text-[rgba(var(--color-foreground),0.65)]">
				{hint}
			</p>
		</div>
	)
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
	return (
		<div role="group" aria-label={label}>
			<p className={`mb-2 ${eyebrow}`}>{label}</p>
			<p
				className={`font-[family-name:var(--font-display)] font-bold tabular-nums lining-nums leading-none text-4xl md:text-5xl ${
					accent ? "text-[rgb(var(--color-accent))]" : "text-[rgb(var(--color-foreground))]"
				}`}
			>
				{value}
			</p>
		</div>
	)
}

export default function CostCalculator() {
	const [hours, setHours] = useState("5")
	const [people, setPeople] = useState("1")
	const [rate, setRate] = useState("50")
	const [share, setShare] = useState("75")
	const [buildCost, setBuildCost] = useState("999")
	// Inputs stay disabled until React hydrates, so early typing isn't wiped.
	const [hydrated, setHydrated] = useState(false)
	useEffect(() => setHydrated(true), [])

	const yearlyHours = num(hours) * num(people) * WEEKS_PER_YEAR
	const yearlyCost = yearlyHours * num(rate)
	const yearlySavings = yearlyCost * (Math.min(num(share), 100) / 100)
	const build = num(buildCost)
	const canPayBack = build > 0 && yearlySavings > 0
	const paysBackInAYear = canPayBack && build <= yearlySavings

	return (
		<section aria-label="Cost calculator" className="dark-card">
			<fieldset disabled={!hydrated}>
				<div className="divide-y divide-[rgba(var(--color-border),0.1)]">
					<Field
						label="Hours per week"
						hint="Time spent on the annoying task, per person."
						value={hours}
						onChange={setHours}
					/>
					<Field
						label="People doing it"
						hint="Everyone who does this task, you included."
						value={people}
						onChange={setPeople}
					/>
					<Field
						label="Cost per hour"
						prefix="$"
						hint="Wage plus overhead, or what your own hour is worth."
						value={rate}
						onChange={setRate}
					/>
					<Field
						label="Share I could automate"
						suffix="%"
						hint="Your guess. We'll pin it down on the call."
						value={share}
						onChange={setShare}
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 my-4 border-y border-[rgba(var(--color-border),0.2)]">
					<Stat label="Hours a year" value={whole.format(yearlyHours)} />
					<Stat label="What it costs you a year" value={dollars.format(yearlyCost)} />
					<Stat label="What you get back a year" value={dollars.format(yearlySavings)} accent />
				</div>

				<Field
					label="Build cost"
					prefix="$"
					hint="Change it to see how fast a build pays for itself."
					value={buildCost}
					onChange={setBuildCost}
				/>

				<div className="pt-6">
					{canPayBack ? (
						<>
							<Stat label="Pays for itself in" value={payback(build, yearlySavings)} accent />
							<p className="mt-4 text-[rgba(var(--color-foreground),0.8)]">
								{paysBackInAYear
									? "That's worth talking about."
									: "That's slow. I'd likely tell you to fix something else first."}
							</p>
						</>
					) : (
						<p className="text-[rgba(var(--color-foreground),0.8)]">
							Put in a build cost and some time saved to see the payback.
						</p>
					)}
				</div>
			</fieldset>
		</section>
	)
}
