import { it } from "vitest";
import { convertToRunTree } from "../src/trace.ts";

import * as path from "node:path";
import { Client } from "langsmith";

it("editing", async () => {
  const client = new Client();
  await convertToRunTree(path.join(__dirname, "testfiles", "editing.jsonl"), { client });

  await client.awaitPendingTraceBatches();
});

it("attachments", async () => {
  const client = new Client();
  await convertToRunTree(path.join(__dirname, "testfiles", "attachments.jsonl"), { client });

  await client.awaitPendingTraceBatches();
});

it("subagents", async () => {
  const client = new Client();
  await convertToRunTree(path.join(__dirname, "testfiles", "subagents.root.jsonl"), {
    client,
    sessionsRoot: path.join(__dirname, "testfiles"),
  });

  await client.awaitPendingTraceBatches();
});
