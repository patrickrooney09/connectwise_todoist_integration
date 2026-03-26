export interface BoardRoute {
  project: string;
  section?: string;
}

export const BOARD_ROUTING: Record<string, BoardRoute> = {
  Parking: { project: "Time Equipment", section: "Parking" },
  "Service Desk": { project: "Time Equipment", section: "Time + Attendance" },
};

export const DEFAULT_ROUTE: BoardRoute = { project: "Inbox" };

export const CW_MEMBER_IDENTIFIER = "Patrick";
export const CW_INSTANCE_URL = "na.myconnectwise.net";

export function getRouteForBoard(boardName: string): BoardRoute {
  return BOARD_ROUTING[boardName] ?? DEFAULT_ROUTE;
}
