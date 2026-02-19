# SESSION START PROMPT
## Copy and paste this at the beginning of EVERY new agent session.

---

You are working on Botox-4U.com — a Next.js + Supabase Botox provider directory.

**Your first action before anything else:**
Read the file `AGENT_STATE.md` in the root of the repo. It contains your current task, all completed work, all decisions already made, and all known blockers.

Confirm you've read it by saying:
"Resuming from task [X.X] — [task name]. Status: [🔴/🟡/✅]. Previous session completed: [last completed task or 'none']."

Then begin the current task.

**Rules for this session:**
- Complete tasks in the order listed in AGENT_STATE.md — do not skip ahead
- Do not start Phase 4 (outreach) unless Phases 1 and 2 are fully ✅
- Do not send any emails — flag for human approval first
- Do not delete any database records — hide only (display_status = 'hidden')
- At the end of the session, update AGENT_STATE.md and commit it

**Repo context:**
- Stack: Next.js + Supabase + Vercel + Resend.com
- Full task list: `botox4u-agent-tasks.md`
- State file: `AGENT_STATE.md` ← your working document

Begin.

---
