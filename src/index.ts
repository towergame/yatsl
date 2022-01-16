/**
 * Enum containing the log levels used by the Logger.
 * 
 * Levels are based on the levels of severity, which are lifted off of https://datatracker.ietf.org/doc/html/rfc5424#section-3
 */
export enum LogLevel {
	/**
	 * System is unstable
	 */
	EMERGENCY,
	/**
	 * Action must be taken immediately
	 */
	ALERT,
	/**
	 * Critical conditions
	 */
	CRITICAL,
	/**
	 * Error conditions
	 */
	ERROR,
	/**
	 * Warning conditions
	 */
	WARNING,
	/**
	 * Normal, significant conditions
	 */
	NOTICE,
	/**
	 * Informational messages
	 */
	INFO,
	/**
	 * Debug messages
	 */
	DEBUG
}

/**
 * The config object for the Logger, pass to the constructer or Logger.config field in order to customise the Logger.
 */
export class LoggerConfig {
	minLevel?: LogLevel = LogLevel.INFO;
	logLine?: boolean = true;
}

const reset = "\x1b[0m";

/**
 * The Logger class, it can be used to instantiate multiple instances of the Logger for extra customisability.
 */
export class Logger {
	/**
	 * Logger config. 
	 */
	public config: LoggerConfig = {
		minLevel: LogLevel.DEBUG,
		logLine: true
	}

	constructor(conf?: LoggerConfig) {
		if (conf) this.config = conf;
	}

	/**
	 * Log a message with the severity of EMERGENCY
	 * @param data String(s) to log
	 */
	public emergency(...data: any[]) {
		this.write(data.join(" | "), LogLevel.EMERGENCY);
	}

	/**
	 * Log a message with the severity of ALERT
	 * @param data String(s) to log
	 */
	public alert(...data: any[]) {
		this.write(data.join(" | "), LogLevel.ALERT);
	}

	/**
	 * Log a message with the severity of CRITICAL
	 * @param data String(s) to log
	 */
	public critical(...data: any[]) {
		this.write(data.join(" | "), LogLevel.CRITICAL);
	}

	/**
	 * Log a message with the severity of ERROR
	 * @param data String(s) to log
	 */
	public error(...data: any[]) {
		this.write(data.join(" | "), LogLevel.ERROR);
	}

	/**
	 * Log a message with the severity of WARNING
	 * @param data String(s) to log
	 */
	public warn(...data: any[]) {
		this.write(data.join(" | "), LogLevel.WARNING);
	}

	/**
	 * Log a message with the severity of NOTICE
	 * @param data String(s) to log
	 */
	public note(...data: any[]) {
		this.write(data.join(" | "), LogLevel.NOTICE);
	}

	/**
	 * Log a message with the severity of INFO
	 * @param data String(s) to log
	 */
	public info(...data: any[]) {
		this.write(data.join(" | "), LogLevel.INFO);
	}

	/**
	 * Log a message with the severity of DEBUG
	 * @param data String(s) to log
	 */
	public debug(...data: any[]) {
		this.write(data.join(" | "), LogLevel.DEBUG);
	}

	public log(...data: any[]) { this.debug(...data) };

	// Shamelessly stolen from a friend.
	private getCallSignature(): string {
		const callerLine = (new Error()).stack!.split("\n")[4];
		const thing = callerLine.split("/");
		const clean = thing[thing.length - 1];
		return clean.substring(0, clean.length - 1);
	}

	/**
	 * Writes a log message to STDOUT
	 * @param message The message to log
	 * @param severity The severity of log
	 */
	private write(message: string, severity: LogLevel) {
		if (this.config.minLevel && this.config.minLevel < severity) return;
		let style = "";
		switch (severity) {
			case LogLevel.EMERGENCY:
				style = "\x1b[1;5;30;41m" + "emer";
				break;
			case LogLevel.ALERT:
				style = "\x1b[1;30;41m" + "alert";
				break;
			case LogLevel.CRITICAL:
				style = "\x1b[1;31m" + "crit";
				break;
			case LogLevel.ERROR:
				style = "\x1b[31m" + "err";
				break;
			case LogLevel.WARNING:
				style = "\x1b[33m" + "warn";
				break;
			case LogLevel.NOTICE:
				style = "\x1b[34m" + "note";
				break;
			case LogLevel.INFO:
				style = "info";
				break;
			case LogLevel.DEBUG:
				style = "\x1b[22m" + "debug";
				break;
		}
		let line = "";
		if (this.config.logLine) line = " | " + this.getCallSignature();
		console.log("\x1b[2m" + (new Date()).toISOString() + reset + " [" + style + reset + line + "] " + message);
	}
}

/**
 * The default Logger object, useful for when you can't be bothered to instantiate your own.
 */
export let logger = new Logger();