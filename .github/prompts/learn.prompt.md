---
name: learn
description: Teach the AI a new rule or convention by updating the project instructions file
---

# Learn: Update Project Instructions

The user wants to teach you a new rule, convention, or piece of project knowledge. Your job is to persist it by editing the instructions file at `.github/instructions/main.instructions.md`.

## Steps

1. **Read** the current contents of `.github/instructions/main.instructions.md`.
2. **Understand** what the user wants you to remember — it could be a coding convention, a project rule, a tool preference, documentation link, or any other instruction.
3. **Clarify before editing**: Before making any changes, ask the user clarifying questions to make sure you get the instruction right. Use the `ask_questions` tool with multiple-choice options whenever possible. Examples of what to clarify:
   - **Scope**: Does this rule apply globally, only to the frontend, only to the backend, etc.?
   - **Specificity**: If the instruction is vague, propose concrete phrasings and let the user pick.
   - **Placement**: If multiple sections could fit, ask which section the rule belongs under (or propose a new one).
   - **Conflicts**: If the new instruction contradicts an existing one, ask the user whether to replace, merge, or keep both.
   - Skip clarification only if the user's intent is completely unambiguous.
4. **Decide placement**: Find the most appropriate section in the file for the new instruction. If no suitable section exists, create one with a clear `##` heading.
5. **Edit** the file to add the new instruction. Follow these rules:
   - Keep the YAML frontmatter (`---` block) intact.
   - Use concise, imperative language (e.g., "Use foo, not bar.").
   - Use Markdown bullet points for individual rules.
   - Do not duplicate existing instructions — if a similar rule exists, update it instead.
   - Preserve all existing content unless the user explicitly asks to replace or remove something.
6. **Confirm** to the user what was added or changed, quoting the relevant line(s).

## Example interactions

**User:** "Always use foo instead of bar"
→ Add `- Use `foo`. Do not use `bar`or`baz`.` under a relevant section.

**User:** "The foo URL is https://example.com/foo"
→ Add under an appropriate section, creating one if needed.

**User:** "Remove the foo link"
→ Remove the corresponding line from the file.

## Important

- Only modify `.github/instructions/main.instructions.md` — do not create new instruction files unless the user asks.
- Do not remove or alter existing instructions unless explicitly told to.
