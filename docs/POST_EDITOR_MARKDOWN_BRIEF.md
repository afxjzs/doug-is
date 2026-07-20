# Brief: Replace the Tiptap post editor with a Markdown source editor

## Problem

The blog stores and renders **Markdown** (`PostView.tsx` uses `react-markdown` + `remark-gfm`), but the admin content editor is **`TiptapEditor`** — a WYSIWYG editor built on Tiptap/ProseMirror, which works in HTML internally. There is no `tiptap-markdown` package; the editor hand-rolls two lossy converters:

- `convertMarkdownToHtml` (`src/components/admin/TiptapEditor.tsx` ~line 56) — markdown → HTML to load into Tiptap
- `convertHtmlToMarkdown` (~line 143) — HTML → markdown to save

On every edit it does markdown → HTML → `editor.getHTML()` → back to markdown (`~lines 311–313`). This round-trip is lossy. It **HTML-escapes `< > &` into entities** (`&lt;`, `&amp;`) and **collapses code-fence newlines**, so it silently corrupts every fenced code block on save. Published posts then show literal `&lt;name&gt;`, merged lines, and the fence language leaking into the first line (e.g. `bashREPO=...`). Prose survives because it doesn't depend on those characters or on internal newlines; code blocks break hard.

A WYSIWYG (HTML) editor feeding a Markdown renderer is the wrong architecture. Making Tiptap round-trip markdown correctly (via `tiptap-markdown`) or patching the hand-rolled converters both keep fighting the mismatch. **The fix is to edit Markdown source directly.**

## Goal

Lossless Markdown authoring: what the user types/pastes is stored **verbatim** as Markdown and renders identically. Round-tripping through HTML is eliminated.

## Approach (agreed)

Replace `TiptapEditor` with a **Markdown source editor**: a raw `<textarea>` bound to the content string, alongside a **live preview** that uses the *exact same* renderer as the public site.

1. **New component** `src/components/admin/MarkdownEditor.tsx` with the same props contract as `TiptapEditor` so the swap is a one-liner:
   ```
   { content: string; onChange: (markdown: string) => void; placeholder?: string }
   ```
   - A `<textarea>` whose value is `content` and whose `onChange` calls `props.onChange(e.target.value)` — that's the whole "no corruption" guarantee: the stored string is exactly what was typed.
   - A live preview pane rendering `content` with `<ReactMarkdown remarkPlugins={[remarkGfm]}>` — **mirror `PostView.tsx` exactly** (same plugins, same `prose` wrapper classes) so the preview equals the published result. Consider extracting the shared render into one component so preview and `PostView` can't drift.
   - Editor niceties (optional, nice-to-have): monospace textarea, tab-to-indent, a toggle or side-by-side edit/preview.

2. **Preserve image upload.** `TiptapEditor` currently uploads images (see its `handleFileChange`, ~line 630, and the upload endpoint it posts to). Keep that capability: on upload, insert Markdown image syntax `![alt](returned-url)` at the textarea cursor. Reuse the existing upload endpoint — do not build a new one.

3. **Swap the usage** in `src/components/admin/PostEditor.tsx` (~line 389): `<TiptapEditor .../>` → `<MarkdownEditor .../>`. The surrounding form, `content`/`setContent` state, and the save flow (`onChange` receives the markdown string) are unchanged.

4. **Remove** `TiptapEditor.tsx` and the now-unused `@tiptap/*` dependencies from `package.json` once nothing imports them. Verify no other importers first.

## Out of scope / already done

- **CSS is already fixed** in `src/app/globals.css` (`.prose pre` got `line-height: 1.6`; `.prose code` padding changed to `0.1em 0.35em` to stop inline-code boxes overlapping wrapped lines). Do not redo; do keep it.
- Rendering (`PostView.tsx`) is correct and unchanged — the preview must match it, not replace it.

## Data migration note

Existing posts already saved through the old editor are **corrupted at rest** in the Supabase `posts.content` column (entities + collapsed newlines). Fixing the editor does not heal them. After this ships, affected posts must be re-saved from clean Markdown source. Flag this to the owner; do not silently leave corrupted posts.

## Acceptance criteria

1. Paste a Markdown document that includes a fenced code block containing `<`, `>`, `&`, and multiple lines (e.g. a `jq` pipeline). Save. View the published post → it renders **identically to the source**: no `&lt;`/`&amp;`, no merged lines, the fence language is not shown, newlines preserved.
2. Bold, italic, lists, blockquotes, links, inline code, and headings all render correctly and match the live preview.
3. The live preview output equals the published `PostView` output for the same source.
4. Image upload still works and inserts a Markdown image at the cursor.
5. Round-tripping (open an existing clean post, save with no edits) leaves `content` byte-identical.
6. Existing admin/editor tests pass; add a test that saves Markdown with a code block containing `<>&` + newlines and asserts the stored string is unchanged.

## Verify before calling it done

Drive it end to end: create a post from real Markdown (reuse the `jq` merge block from the agent-config write-up as the torture test), save, load the published page, and confirm the code block is intact. Don't rely on unit tests alone.
