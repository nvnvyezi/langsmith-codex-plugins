import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { convertToRunTree } from "../src/trace.ts";
import { vol } from "memfs";

import * as path from "node:path";
import { Client } from "langsmith";

async function preloadTestFiles() {
  const fs = await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");

  const sourceDir = path.join(__dirname, "sessions/2026/04/23");
  const targetDir = path.join("/home/codex-user/.codex/sessions/2026/04/23");

  const fileDir = await fs.readdir(sourceDir);

  const testFiles = {};

  for (const file of fileDir) {
    if (!file.endsWith(".jsonl")) continue;
    testFiles[path.join(targetDir, file)] = await fs.readFile(path.join(sourceDir, file), "utf-8");
  }

  return testFiles;
}

vi.mock("node:fs/promises", async () => {
  const { fs } = await import("memfs");
  return fs.promises;
});

vi.mock("node:fs", async () => {
  const { fs } = await import("memfs");
  return fs;
});

beforeEach(() => vol.reset());
afterEach(() => vi.unstubAllEnvs());

it("editing", async () => {
  const client = new Client();
  vol.fromJSON(await preloadTestFiles());

  await convertToRunTree(
    path.join("/home/codex-user/.codex/sessions/2026/04/23/rollout-editing.jsonl"),
    { client, projectName: "codex" },
  );

  // Sidecar file is created
  expect(vol.toJSON()).toMatchObject({
    "/home/codex-user/.codex/sessions/2026/04/23/rollout-editing.jsonl.langsmith":
      expect.stringContaining("019dbc00-ede4-77c2-9e7a-b6876efeab9b"),
  });

  await client.awaitPendingTraceBatches();
});

it("attachments", async () => {
  const client = new Client();
  vol.fromJSON(await preloadTestFiles());

  await convertToRunTree(
    path.join("/home/codex-user/.codex/sessions/2026/04/23/rollout-attachments.jsonl"),
    { client, projectName: "codex" },
  );
  // Sidecar file is created
  expect(vol.toJSON()).toMatchObject({
    "/home/codex-user/.codex/sessions/2026/04/23/rollout-attachments.jsonl.langsmith":
      expect.stringContaining("019dbc02-53d1-7fc2-8e82-a5419b451d7a"),
  });

  await client.awaitPendingTraceBatches();
});

it("subagents", async () => {
  const client = new Client();
  vol.fromJSON(await preloadTestFiles());

  await convertToRunTree(
    path.join("/home/codex-user/.codex/sessions/2026/04/23/rollout-subagents.jsonl"),
    { client, projectName: "codex" },
  );

  // Sidecar file is created
  expect(vol.toJSON()).toMatchObject({
    "/home/codex-user/.codex/sessions/2026/04/23/rollout-subagents.jsonl.langsmith":
      expect.stringContaining("019dbc03-4aa2-72a0-8190-c747168c8f1d"),
  });

  await client.awaitPendingTraceBatches();
});
