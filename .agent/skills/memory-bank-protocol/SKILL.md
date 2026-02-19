# Memory Bank Protocol

## CRITICAL RULE
At the start of EVERY session, read all files in /memory-bank/ before doing anything else.
At the end of EVERY session, update the relevant memory bank files before closing.
Do not skip this. Ever.

## ON SESSION START
1. Read /memory-bank/project-status.md
2. Read /memory-bank/decisions.md
3. Read /memory-bank/active-task.md
4. Confirm loaded: "Memory bank loaded. Current task: [task from active-task.md]"

## ON SESSION END
1. Update /memory-bank/active-task.md with exactly what was completed and what is next
2. Update /memory-bank/project-status.md if any phase status changed
3. Update /memory-bank/decisions.md if any new decisions were made
4. Commit all memory-bank files: git add memory-bank/ && git commit -m "memory: update after session"

## AUTONOMOUS MODE
You have full permission to execute all tasks without asking for confirmation.
Do not ask "should I proceed", "is this okay", or "do you want me to continue".
Make decisions using the context files and execute.
Only stop for: email sending approval, pricing page go-live approval, database DELETE operations.
