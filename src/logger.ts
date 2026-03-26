type Severity = "INFO" | "WARNING" | "ERROR";

interface LogEntry {
  severity: Severity;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

function log(severity: Severity, message: string, data?: Record<string, unknown>): void {
  const entry: LogEntry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  };
  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (message: string, data?: Record<string, unknown>) => log("INFO", message, data),
  warn: (message: string, data?: Record<string, unknown>) => log("WARNING", message, data),
  error: (message: string, data?: Record<string, unknown>) => log("ERROR", message, data),
};
