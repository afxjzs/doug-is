# The Day I Stopped Fighting My AI and Started Managing It

I've been building [my personal website](https://doug.is) with LLM assistance for months now, and I was getting increasingly frustrated. Every conversation with Claude felt like starting over. I'd explain my architecture, repeat my coding standards, and watch in horror as it would suggest changes that completely ignored decisions we'd made just hours earlier.

The breaking point came when I spent three hours trying to implement a simple contact form. Not because the form was complex, but because the AI kept ping-ponging between planning and coding, second-guessing architectural decisions while simultaneously trying to implement them. Sound familiar?

That's when I stumbled across something that changed everything: **LLMs need role clarity just like human teams do.**

## The Problem I Couldn't See

I was asking one AI to be a product manager, architect, developer, and tester all at once. Imagine asking a single person to plan a building while they're actively laying bricks. The context switching destroys focus and creates chaos.

Here's what was actually happening in my conversations:
- I'd ask for a feature
- The AI would start planning... then get excited and begin coding
- Halfway through coding, it would reconsider the architecture
- By the end, I'd have half-baked code and a completely different plan than what I started with

The AI wasn't broken. I was using it wrong.

## The Pattern I Found: Role Separation

I came across this pattern on Twitter - people were experimenting with explicitly separating LLM roles. It clicked immediately: **if human teams separate planning from execution, why don't we do the same with AI?**

So I tried the basic pattern. I started every conversation with one of two declarations:
- "I AM IN PLANNER MODE" - for breaking down features and making architectural decisions
- "I AM IN EXECUTOR MODE" - for pure implementation following an established plan

The results were immediate and dramatic, but something was still missing.

## What Changed

**With just role separation:**
- Better focus during individual conversations
- Less architectural flip-flopping mid-implementation
- But still losing context between sessions
- Still repeating the same explanations

**After adding the structured .cursor system:**
- 45 minutes for a contact form (down from 3 hours)
- Zero repetition of architecture or standards
- Code that consistently builds on previous decisions
- Features delivered exactly as planned with full test coverage

The transformation wasn't from the role pattern alone—it was from **combining role clarity with persistent, contextual guidance**. When the AI wasn't juggling multiple responsibilities AND had all my project context readily available, it excelled at every task.

## Why This Works (And Why I Should Have Known)

LLMs have a cognitive load problem, just like humans. When you ask them to analyze requirements while simultaneously implementing code, they're context-switching constantly. Each switch loses information and introduces inconsistency.

Role separation solves this by creating **single-responsibility conversations**:

**Planner Mode** gives me deep analysis without implementation pressure. The AI can focus entirely on understanding requirements, breaking down complexity, and designing solutions.

**Executor Mode** gives me focused implementation without architectural second-guessing. The AI follows the established plan and reports progress, but doesn't redesign the foundation while building.

## My Contribution: The Structure That Makes It Work

Role separation was a great start, but it kept breaking down. I'd still lose context between sessions, repeat the same explanations, and watch the AI forget my architectural decisions.

That's when I realized the pattern needed **persistent structure**. So I built something around it:

**A `.cursor` directory** with comprehensive guidance files that maintain context across sessions. Using `.mdc` files (not just `.md`), I could configure exactly when Cursor includes each file based on what I'm working on - CSS files get the Tailwind guidance, TypeScript files get the Next.js patterns, test files get the TDD methodology.

**Technology-specific best practices** captured in reusable templates. Instead of explaining my React patterns every conversation, I have a `nextjs.mdc` file that defines my architecture, conventions, and quality standards.

**A task_list.md file** that tracks exactly where I am and what comes next. The Planner updates it, the Executor follows it, creating a persistent project memory.

This is where the magic happened. **The structured guidance + role separation created something neither could achieve alone:** consistent, high-quality development that builds on itself rather than starting over each session.

## The Unexpected Benefits

Beyond speed and consistency, role separation taught me something about my own development process. I was also context-switching too much, planning and coding simultaneously, losing focus just like the AI.

Now I have dedicated planning sessions where I think through problems without touching code. Then I have focused implementation sessions where I follow the plan without second-guessing every decision.

The AI helped me become a better developer.

## What I Learned About LLMs

LLMs are incredible tools, but they're tools that need the right environment to excel. The breakthrough wasn't just role separation—it was creating a **structured context** where roles could work effectively.

**They thrive on consistency.** Role patterns help, but they need persistent context to maintain quality across sessions. The .mdc files give them immediate access to my standards, patterns, and project-specific knowledge.

**They're context machines.** They don't need less guidance—they need better guidance that's always available. When Cursor automatically includes my `testing.mdc` file while I'm writing tests, the AI knows exactly what quality standards to follow.

**They amplify your system.** Give them chaos and they'll amplify chaos. Give them structured guidance files, clear role boundaries, and project continuity, and they'll amplify your productivity exponentially.

## Getting Started

If you're frustrated with inconsistent LLM development, start with the role pattern but don't stop there. The real power comes from the structured guidance system.

Try this two-step approach:

**Step 1:** Start declaring roles in your conversations. "I AM IN PLANNER MODE" or "I AM IN EXECUTOR MODE" at the beginning of each session.

**Step 2:** Create a `.cursor` directory with `.mdc` files for your technologies. Use Cursor's file pattern matching (like in the image) to automatically include the right guidance based on what you're working on.

I've built a complete starter kit with all the templates and guidance files that make this work: [github.com/afxjzs/llm-starter-kit](https://github.com/afxjzs/llm-starter-kit). It's the same system I used to build my website with 72% test coverage and zero console errors.

The role pattern alone will help. But combining it with structured, persistent guidance? That's where the real transformation happens.

## The Real Lesson

The biggest insight wasn't about AI at all - it was about clarity. Clear roles, clear boundaries, clear handoffs. Whether you're managing an AI or a human team, the fundamentals remain the same.

LLMs aren't magic. They're powerful tools that need structure to reach their potential. Give them that structure, and they'll transform how you build software.

Stop fighting your AI. Start managing it.
