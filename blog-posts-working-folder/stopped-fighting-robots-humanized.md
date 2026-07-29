# The Day I Stopped Fighting Robots and Started Managing Them

I've been noodling on [my personal website](https://doug.is) (don't click, you're already on it) with Cursor for a few months, and I spent most of that time annoyed. Every conversation with Claude felt like starting over. I'd explain my architecture, repeat my coding standards, then watch it suggest changes that ignored decisions we'd made two hours earlier.

The breaking point was a contact form that ate three hours. The form wasn't complicated. The AI kept ping-ponging between planning and coding, second-guessing the architecture while it was already implementing it. Sound familiar?

Then I picked up a fix that took care of most of it: LLMs need role clarity, the same way human teams do.

## The Problem I Couldn't See

I was asking one AI to be product manager, architect, developer, and tester at once. That's like asking someone to draw the blueprints while they lay the brick. The switching eats the work.

Here's what my conversations actually looked like:

1. I ask for a feature.
2. The AI starts planning, gets excited, starts coding.
3. Halfway through the code, it reconsiders the architecture.
4. I end up with half-built code and a plan I never agreed to.

The AI wasn't broken. I was using it wrong.

## The Pattern I Found: Role Separation

I picked this up on Twitter. I've lost the original post and can't credit whoever wrote it, which bugs me. The idea was to split LLM roles explicitly. It makes sense. Human teams separate planning from execution. Why not do it here?

I tried the plain version. Every response had to open with one of two declarations:

- "I AM IN PLANNER MODE" for breaking down features and making architectural calls
- "I AM IN EXECUTOR MODE" for implementation, following a plan we already agreed on

The declaration turned out to double as a warning light. When the AI stopped announcing its mode, or announced the wrong one, I knew the context window was full and it was about to go sideways. Time for a fresh session.

Better. Something was still missing.

## What Changed

Role separation on its own got me better focus inside a single conversation and less architectural flip-flopping mid-build. Between sessions I still lost everything, and I still re-explained the same things every morning.

The `.cursor` folder is what moved the numbers. The contact form went from three hours to forty-five minutes. I stopped repeating my architecture and standards. The code started building on earlier decisions instead of relitigating them, and features shipped the way the plan said they would, tests and all.

Neither half does that alone. Role clarity stopped the AI from juggling four jobs. The guidance files meant it already knew my project when it showed up.

## Why This Works (And Why I Should Have Known)

LLMs have a cognitive load problem, same as people. Ask one to analyze requirements while it writes code and it switches the whole time. Every switch drops something.

Planner mode gets me analysis with no pressure to produce code. It can sit with the requirements and take them apart.

Executor mode gets me code with no second-guessing of the foundation. It follows the plan and reports what it did, instead of redesigning the basement while it frames the roof.

## My Tweak: The Structure That Makes It Work

Role separation was a good start and it still fell apart. Between sessions I lost context, repeated myself, and watched the AI forget decisions I'd already made.

The pattern needed somewhere to keep things. So I built around it.

A `.cursor` directory holds the guidance files. Using `.mdc` files instead of plain `.md` lets me set exactly when Cursor pulls each one in: CSS files get the Tailwind guidance, TypeScript files get the Next.js patterns, test files get the TDD rules.

Each technology gets its own file. Instead of explaining my React patterns again every conversation, there's a `nextjs.mdc` that spells out the architecture and conventions I want.

A `task_list.md` tracks where I am and what's next. Planner writes to it, Executor reads it. That file is the project's memory.

That combination is what did it. Guidance files plus role separation gave me work that compounds instead of resetting every session.

## The Unexpected Benefit

Role separation also taught me something about my own process. I was context-switching too, planning and coding at once, losing the thread the same way the AI was.

Now I plan in sessions where I don't touch code. Then I implement in sessions where I don't relitigate the plan.

The agent made me a better developer. I did not see that coming.

## What I Learned About LLMs

LLMs (which are, let's be honest, plagiarism machines) are good tools that need the right setup. The roles alone didn't do it. They needed somewhere to live.

They want consistency. Role patterns help, but without persistent context the quality falls off between sessions. The `.mdc` files hand them my standards up front, every time.

More guidance doesn't help them. Better guidance that's already sitting there does. When Cursor pulls in `testing.mdc` while I'm writing tests, the AI knows what I count as a passing test before I have to say it.

And they amplify whatever system you already have. Give them chaos, you get more chaos, faster.

## Getting Started

If your LLM development is inconsistent, start with the roles, then keep going.

Step one: declare the role at the top of the session. "I AM IN PLANNER MODE" or "I AM IN EXECUTOR MODE."

Step two: make a `.cursor` directory with `.mdc` files for your stack, and use Cursor's file pattern matching (see the image) so the right guidance loads for whatever file you're in.

I put the templates and guidance files in a starter kit: [github.com/afxjzs/llm-starter-kit](https://github.com/afxjzs/llm-starter-kit). Same setup I used to build this site, which sits at 72% test coverage with a clean console.

## The Real Lesson

The insight had nothing to do with AI. It was about clarity: who's doing what, and when they hand off. Managing an agent turns out to be a lot like managing people.

Stop fighting your AI. Start managing it.
