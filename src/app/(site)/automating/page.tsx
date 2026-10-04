import CostCalculator from "./CostCalculator"
import AutomationLeadForm from "./AutomationLeadForm"

export { metadata } from "./metadata"

const steps = [
	{
		title: "Free Discovery Call",
		detail: "30 minutes",
		body: "You tell me what's driving you nuts, and I ask a lot of questions. If it isn't a fit, I'll say so on the call.",
	},
	{
		title: "The Audit",
		detail: "$500, which counts toward the build",
		body: "I learn how the work gets done today, step by step, with the people who do it. You get a written list of what to automate, what to leave alone, and what each fix should cost and save.",
	},
	{
		title: "The Build",
		detail: "Fixed quote after the audit",
		body: "You know the price before I start. I build in your accounts, test against your real past work, and keep a person in the loop anywhere a mistake would cost you.",
	},
	{
		title: "The Handover",
		detail: "30 days of fixes included",
		body: "You get a plain-English runbook, the logins, and the code. After that it's yours. If you want me to keep watch, there's an optional monthly care plan.",
	},
]

const goodFits = [
	"Retyping data from emails or PDFs into another system",
	"Sorting an inbox and drafting replies you approve",
	"A weekly report stitched together from three different tools",
	"Following up with leads who went quiet",
	"Turning call notes into CRM updates and next steps",
]

const dontAutomate = [
	"Anything that moves money or makes promises for you without a person signing off.",
	"Sensitive messages to customers that nobody reads before they go out.",
	"A process nobody can explain yet. We fix the process first, then automate it.",
	"Something you do twice a year. The math almost never works.",
]

const faqs = [
	{
		q: "Who owns what you build?",
		a: "You do. It runs in your accounts, and you get the logins, the code, and a runbook. If I'm not around, another developer can pick it up.",
	},
	{
		q: "What happens when the AI gets something wrong?",
		a: "It will, sometimes, so I build around that. Most steps in a workflow don't need AI at all. If a step can follow fixed rules, it runs as plain code: same input, same answer, every time, and nothing made up. AI only gets the steps that need judgment, like reading a messy email, and a person signs off on anything risky. Before it goes live, I run it against your real past work and check the results.",
	},
	{
		q: "What about my data?",
		a: "I work in your accounts with the least access the job needs. If something shouldn't leave your systems, we pick tools that keep it there. We cover this in the audit, before anything is built.",
	},
	{
		q: "How much does a build cost?",
		a: "It depends on the job, so I quote a fixed price after the audit. The quote comes with the same math as the calculator above, so you can see the payback before you agree to anything.",
	},
	{
		q: "Why is the call free but the audit isn't?",
		a: "The call is for both of us to see if there's something worth fixing. The audit is real work, so it's paid. If you hire me for the build, that $500 counts toward it, so the audit costs you nothing extra.",
	},
	{
		q: "I'm one person, not a company. Is this for me?",
		a: "Yes. Some of the best fits are one person losing five hours a week to the same chore.",
	},
]

const eyebrow =
	"font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.75)] mb-2"
const muted = "text-[rgba(var(--color-foreground),0.8)]"

export default function AutomatingPage() {
	return (
		<div className="max-w-4xl mx-auto">
			{/* Hero */}
			<div className="mb-20">
				<p className={eyebrow}>doug.is/automating</p>
				<h1 className="text-4xl md:text-5xl font-bold display-heading mb-6">
					Tell Me What&apos;s Eating Your Week
				</h1>
				<p className={`text-xl ${muted} mb-4`}>
					I&apos;m Doug. I&apos;ve been writing software for 25 years, and now I build
					custom AI automations for small businesses, teams, and people who are tired
					of doing the same chore every week.
				</p>
				<p className={`text-xl ${muted} mb-8`}>
					There&apos;s no agency or sales team behind this page. You talk to me, and
					I&apos;m the one who builds it.
				</p>
				<div className="flex flex-wrap gap-4 mb-8">
					<a href="#talk" className="btn-primary">Book a free call</a>
					<a href="#numbers" className="btn-secondary">Run your numbers</a>
				</div>
				<div className="flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-foreground),0.65)]">
					<span>25+ years building software</span>
					<span>Y Combinator W15</span>
					<span>Techstars &apos;24</span>
					<span>2 exits</span>
				</div>
			</div>

			{/* Why an engineer */}
			<section className="mb-20">
				<h2 className="text-3xl font-bold display-heading mb-6">Why an Engineer</h2>
				<div className={`space-y-4 text-lg ${muted}`}>
					<p>
						Most of what makes an automation work is plumbing. Getting data out of
						the tool that doesn&apos;t want to give it up. Handling the week the
						invoice format changes. Knowing when to stop and ask a person. I&apos;ve
						done that kind of work for 25 years.
					</p>
					<p>
						I also know how the AI part works. I co-founded{" "}
						<a
							href="https://gaius.fyi"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[rgb(var(--color-accent))] underline underline-offset-4"
						>
							GAIuS
						</a>
						, which builds explainable AI for decisions where &quot;the model said
						so&quot; isn&apos;t good enough. So I use AI where it earns its place and
						plain code everywhere else. Plain code doesn&apos;t make things up.
					</p>
				</div>
			</section>

			{/* Calculator */}
			<section id="numbers" className="mb-20 scroll-mt-24">
				<h2 className="text-3xl font-bold display-heading mb-4">Run Your Own Numbers</h2>
				<p className={`text-lg ${muted} mb-8`}>
					This is the math I&apos;ll do with you on the call. Put in your own numbers.
					If the payback is slow, I&apos;ll tell you, even if it means I don&apos;t get
					the job.
				</p>
				<CostCalculator />
			</section>

			{/* Process */}
			<section className="mb-20">
				<h2 className="text-3xl font-bold display-heading mb-8">How It Works</h2>
				<ol className="space-y-6">
					{steps.map((step, i) => (
						<li key={step.title} className="dark-card flex gap-6">
							<span className="font-[family-name:var(--font-mono)] text-2xl text-[rgb(var(--color-accent))]">
								{i + 1}
							</span>
							<div>
								<h3 className="text-xl font-semibold display-heading">{step.title}</h3>
								<p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.75)] mb-3">
									{step.detail}
								</p>
								<p className={muted}>{step.body}</p>
							</div>
						</li>
					))}
				</ol>
			</section>

			{/* Fits */}
			<section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="dark-card">
					<h2 className="text-2xl font-bold display-heading mb-4">Good Fits</h2>
					<ul className={`space-y-3 ${muted}`}>
						{goodFits.map((item) => (
							<li key={item} className="flex gap-3">
								<span className="check-mark" aria-hidden>✓</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="dark-card">
					<h2 className="text-2xl font-bold display-heading mb-4">What I&apos;ll Tell You Not to Automate</h2>
					<ul className={`space-y-3 ${muted}`}>
						{dontAutomate.map((item) => (
							<li key={item} className="flex gap-3">
								<span className="text-[rgba(var(--color-foreground),0.5)]" aria-hidden>✕</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* FAQ */}
			<section className="mb-20">
				<h2 className="text-3xl font-bold display-heading mb-8">Questions People Ask</h2>
				<div className="space-y-4">
					{faqs.map((faq) => (
						<div key={faq.q} className="dark-card">
							<h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
							<p className={muted}>{faq.a}</p>
						</div>
					))}
				</div>
			</section>

			{/* Form */}
			<section id="talk" className="mb-12 scroll-mt-24">
				<h2 className="text-3xl font-bold display-heading mb-4">Let&apos;s Talk</h2>
				<p className={`text-lg ${muted} mb-8`}>
					I&apos;d rather hear about it on a call than read a long form. Tell me the
					basics, then pick a time and I&apos;ll call you.
				</p>
				<AutomationLeadForm />
			</section>
		</div>
	)
}
