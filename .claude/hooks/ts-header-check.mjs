import { readFileSync, existsSync } from "node:fs";

const REQUIRED_FIELDS = ["@file", "@model", "@description", "@feature"];
const DATE_FIELDS = ["@created", "@updated"];

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const filePath = input?.tool_input?.file_path ?? "";
  const toolName = input?.tool_name ?? "";

  if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) {
    process.exit(0);
  }

  if (!existsSync(filePath)) {
    process.exit(0);
  }

  const content = readFileSync(filePath, "utf8");
  const hasRequiredFields = REQUIRED_FIELDS.every((field) => content.includes(field));
  const hasDateField = DATE_FIELDS.some((field) => content.includes(field));

  if (!hasRequiredFields || !hasDateField) {
    const today = new Date().toISOString().slice(0, 10);

    const dateLines = toolName === "Write"
      ? ` * @created ${today}`
      : ` * @updated ${today}`;

    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: `${filePath} is missing the required JSDoc provenance header. Add it as the very first thing in the file (above any 'use client'/'use server' directive):

/**
 * @file <repo-relative path, e.g. lib/store.ts>
${dateLines}
 * @model <model id, e.g. claude-sonnet-4-6>
 * @description <one-line purpose: what this file does and why it exists>
 * @feature <comma-separated feature slugs from docs/features/, or "none">
 */

Notes:
 - @created: add only when this file is fully AI-generated (first Write of a new file)
 - @updated: add/update whenever AI edits an existing file`,
        },
      }),
    );
  }

  process.exit(0);
} catch {
  process.exit(0);
}
