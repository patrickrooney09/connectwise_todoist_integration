import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  it("logger.info outputs JSON with severity INFO", () => {
    logger.info("test message");
    expect(consoleSpy).toHaveBeenCalledOnce();
    const entry = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(entry.severity).toBe("INFO");
    expect(entry.message).toBe("test message");
    expect(entry.timestamp).toBeDefined();
  });

  it("logger.warn outputs JSON with severity WARNING", () => {
    logger.warn("warn message");
    const entry = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(entry.severity).toBe("WARNING");
    expect(entry.message).toBe("warn message");
  });

  it("logger.error outputs JSON with severity ERROR", () => {
    logger.error("error message");
    const entry = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(entry.severity).toBe("ERROR");
    expect(entry.message).toBe("error message");
  });

  it("includes extra data fields", () => {
    logger.info("with data", { port: 8080, env: "test" });
    const entry = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(entry.port).toBe(8080);
    expect(entry.env).toBe("test");
  });

  it("timestamp is valid ISO string", () => {
    logger.info("ts check");
    const entry = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    expect(() => new Date(entry.timestamp).toISOString()).not.toThrow();
  });
});
