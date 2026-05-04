import * as path from "node:path";

import { vol } from "memfs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { loadUploadedTurnIds, markTurnUploaded } from "../src/sidecar.js";

vi.mock("node:fs/promises", async () => {
  const { fs } = await import("memfs");
  return fs.promises;
});

vi.mock("node:fs", async () => {
  const { fs } = await import("memfs");
  return fs;
});

beforeEach(() => vol.reset());
afterEach(() => {
  vol.reset();
  vi.unstubAllEnvs();
});

it("load uploaded turn ids", async () => {
  const rolloutFile = path.join("/workspace/repo/rollout.jsonl");

  vol.fromJSON({
    [path.join(rolloutFile + ".langsmith")]:
      [
        "00000000-0000-0000-0000-000000000000",
        "00000000-0000-0000-0000-000000000000",
        "00000000-0000-0000-0000-000000000000",
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002",
      ].join("\n") + "\n",
  });

  await expect(loadUploadedTurnIds(rolloutFile)).resolves.toEqual(
    new Set([
      "00000000-0000-0000-0000-000000000000",
      "00000000-0000-0000-0000-000000000001",
      "00000000-0000-0000-0000-000000000002",
    ]),
  );
});

it("mark turn uploaded", async () => {
  const rolloutFile = path.join("/workspace/repo/rollout.jsonl");
  vol.fromJSON({ [path.join("/workspace/repo/unknown.jsonl")]: "" });

  await expect(
    markTurnUploaded(rolloutFile, "00000000-0000-0000-0000-000000000000"),
  ).resolves.toBeTruthy();

  await expect(
    markTurnUploaded(rolloutFile, "00000000-0000-0000-0000-000000000000"),
  ).resolves.toBeTruthy();

  await expect(
    markTurnUploaded(rolloutFile, "00000000-0000-0000-0000-000000000001"),
  ).resolves.toBeTruthy();

  await expect(loadUploadedTurnIds(rolloutFile)).resolves.toEqual(
    new Set(["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001"]),
  );
});
