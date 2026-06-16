import { readFileSync } from "node:fs";

const RULES = [
  // ---- deny: destructive or irreversible ----
  {
    pattern: /rm\s+(-[a-z]*\s+)*-[a-z]*[rf][a-z]*\s+(-[a-z]*\s+)*("|')?(\/|~|[A-Za-z]:[\\/]?\s|[A-Za-z]:[\\/]("|')?\s*$|\.\.)/i,
    decision: "deny",
    reason: "Recursive delete targeting a filesystem root, home directory, drive root, or parent path. Delete specific project paths instead.",
  },
  {
    pattern: /Remove-Item\b[^|;]*-Recurse[^|;]*(\/|~|[A-Za-z]:\\?("|')?(\s|$)|\$env:USERPROFILE("|')?(\s|$))/i,
    decision: "deny",
    reason: "Recursive Remove-Item targeting a root or home directory. Delete specific project paths instead.",
  },
  {
    pattern: /git\s+push\b[^|;&]*(--force(?!-with-lease)|-f\b)[^|;&]*\b(main|master)\b/,
    decision: "deny",
    reason: "Force-push to main/master is forbidden (docs/agreements/git-workflow.md).",
  },
  {
    pattern: /git\s+reset\s+--hard\s+origin\//,
    decision: "deny",
    reason: "Hard reset to a remote ref discards local commits irrecoverably. Use git stash or a backup branch first.",
  },
  {
    pattern: /(curl|wget|iwr|Invoke-WebRequest)\b[^|;&]*\|\s*(sh|bash|zsh|iex|Invoke-Expression)\b/i,
    decision: "deny",
    reason: "Piping a downloaded script directly into a shell executes unreviewed remote code. Download, inspect, then run.",
  },
  {
    pattern: /chmod\s+(-[a-zA-Z]+\s+)*777\b/,
    decision: "deny",
    reason: "chmod 777 grants world-writable permissions. Use the minimal permission set needed.",
  },
  {
    pattern: /(>|>>)\s*\.git\//,
    decision: "deny",
    reason: "Writing directly into .git/ can corrupt the repository. Use git commands instead.",
  },
  {
    pattern: /\b(cat|type|head|tail|less|more|bat|strings|grep|rg|findstr|sed|awk|cut|od|xxd|hexdump|Get-Content|gc|Select-String|sls)\b[^|;&]*\.env(?!\.(example|sample|template)\b)/i,
    decision: "deny",
    reason: "Reading .env files exposes secrets into the conversation context. Use .env.example for structure, or ask the user for the specific variable name needed.",
  },
    {
    pattern: /\b(pnpm|npm|yarn)\s+publish\b/,
    decision: "deny",
    reason: "Publishing to a package registry is public and hard to retract - you are not allowed to perform these actions.",
  },
  // ---- deny: risky infrastructure CLIs (samples — extend per team policy) ----
  // Hard-blocked entirely, including read-only subcommands: these CLIs carry
  // authenticated cloud sessions and can mutate shared infrastructure.
  {
    pattern: /(?:^|[;&|(]\s*|\$\(\s*|`\s*)(?:sudo\s+)?(?:az|terraform|tf|aws|gcloud|kubectl)\b/,
    decision: "deny",
    reason: "Infrastructure CLIs (az, terraform/tf, aws, gcloud, kubectl) are blocked in this harness.",
  },
  // ---- ask: legitimate sometimes, but the user should decide ----
  {
    pattern: /git\s+push\b[^|;&]*(--force\b|--force-with-lease\b|-f\b)/,
    decision: "ask",
    reason: "Force-push rewrites remote history. Confirm the target branch is yours alone and has no open reviewed PR.",
  },
  {
    pattern: /git\s+clean\b[^|;&]*-[a-zA-Z]*[fd]/,
    decision: "ask",
    reason: "git clean permanently deletes untracked files (ignored files too with -x). Confirm nothing un-committed is needed.",
  },
  {
    pattern: /gh\s+repo\s+delete\b/,
    decision: "ask",
    reason: "Deleting a GitHub repository is destructive and affects the whole team. Confirm explicitly.",
  },
  {
    pattern: /(rm\b[^|;&]*|del\b[^|;&]*|Remove-Item\b[^|;&]*)pnpm-lock\.yaml/i,
    decision: "deny",
    reason: "Deleting the lockfile breaks reproducible installs and CI (--frozen-lockfile). Usually `pnpm install` is the right fix.",
  },
];

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const command = input?.tool_input?.command ?? "";

  const match = RULES.find((rule) => rule.pattern.test(command));
  if (match) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: match.decision,
          permissionDecisionReason: match.reason,
        },
      }),
    );
  }
  process.exit(0);
} catch {
  process.exit(0);
}
