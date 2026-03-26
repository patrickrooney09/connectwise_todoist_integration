import { describe, it, expect } from "vitest";
import {
  BOARD_ROUTING,
  DEFAULT_ROUTE,
  CW_MEMBER_IDENTIFIER,
  CW_INSTANCE_URL,
  getRouteForBoard,
} from "./config";

describe("config", () => {
  it("maps Parking board to Time Equipment / Parking", () => {
    expect(BOARD_ROUTING["Parking"]).toEqual({
      project: "Time Equipment",
      section: "Parking",
    });
  });

  it("maps Service Desk board to Time Equipment / Time + Attendance", () => {
    expect(BOARD_ROUTING["Service Desk"]).toEqual({
      project: "Time Equipment",
      section: "Time + Attendance",
    });
  });

  it("falls back to Inbox for unmapped boards", () => {
    expect(getRouteForBoard("Unknown Board")).toEqual(DEFAULT_ROUTE);
    expect(DEFAULT_ROUTE.project).toBe("Inbox");
  });

  it("exports CW member identifier", () => {
    expect(CW_MEMBER_IDENTIFIER).toBe("Patrick");
  });

  it("exports CW instance URL", () => {
    expect(CW_INSTANCE_URL).toBe("na.myconnectwise.net");
  });
});
