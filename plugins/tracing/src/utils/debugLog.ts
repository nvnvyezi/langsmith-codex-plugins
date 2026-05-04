import * as fs from "node:fs/promises";

let LOG_QUEUE = Promise.resolve();

const isPrimitive = (value: unknown): value is string | number | boolean => {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
};

export const DEBUG_log = (...args: unknown[]) => {
  LOG_QUEUE = LOG_QUEUE.then(() =>
    fs.appendFile(
      "debug.log",
      `${args.map((i) => (isPrimitive(i) ? i : JSON.stringify(i))).join(" ")}\n`,
    ),
  );
};

export const DEBUG_relative = (startTime: number, now = Date.now()) => {
  return (timestamp: number) => {
    const diff = timestamp - startTime;
    return now + diff;
  };
};
