import {LogLevel} from "./LogLevel";

/**
 * The config object for the Logger, pass to the constructer or Logger.config field in order to customise the Logger.
 */
export class LoggerConfig {
	/**
	 * The minimum log level to log. Anything below this level will not be logged.
	 */
	minLevel?: LogLevel = LogLevel.INFO;

	/**
	 * Whether or not to log the line of code that called the logger.
	 */
	logLine?: boolean = true;
	
	/**
	 * The name of the logger, used to identify the logger in the log line.
	 */
	name?: string = "";

	/**
	 * The number of decimal digits to log for numbers.
	 */
	decimalDigits?: number = 3;

	/**
	 * Whether or not to log objects on multiple lines. When logging multiple items,
	 * all items will be logged on a single line regardless.
	 */
	multilineObjects?: boolean = true;

	/**
	 * Whether or not to use tabs when logging objects.
	 * If false, spaces will be used instead.
	 */
	tabs?: boolean = true;
	spaceCount?: number = 2;
}

/**
 * The Logger class, it can be used to instantiate multiple instances of the Logger for extra customisability.
 */
export class Logger {
	/**
	 * Logger config. 
	 */
	public config: LoggerConfig = {
		minLevel: LogLevel.DEBUG,
		logLine: true,
		name: "",
		decimalDigits: 3,
		multilineObjects: true,
		tabs: true,
		spaceCount: 2
	}

	private override: LoggerConfig = {};

	constructor(conf?: LoggerConfig) {
		if (conf) this.config = { ...this.config, ...conf };
	}

	/**
	 * Log a message with the severity of EMERGENCY
	 * @param data String(s) to log
	 */
	public emergency(...data: any[]) {
		this.write(data, LogLevel.EMERGENCY);
	}

	/**
	 * Log a message with the severity of ALERT
	 * @param data String(s) to log
	 */
	public alert(...data: any[]) {
		this.write(data, LogLevel.ALERT);
	}

	/**
	 * Log a message with the severity of CRITICAL
	 * @param data String(s) to log
	 */
	public critical(...data: any[]) {
		this.write(data, LogLevel.CRITICAL);
	}

	/**
	 * Log a message with the severity of ERROR
	 * @param data String(s) to log
	 */
	public error(...data: any[]) {
		this.write(data, LogLevel.ERROR);
	}

	/**
	 * Log a message with the severity of WARNING
	 * @param data String(s) to log
	 */
	public warn(...data: any[]) {
		this.write(data, LogLevel.WARNING);
	}

	/**
	 * Log a message with the severity of NOTICE
	 * @param data String(s) to log
	 */
	public note(...data: any[]) {
		this.write(data, LogLevel.NOTICE);
	}

	/**
	 * Log a message with the severity of INFO
	 * @param data String(s) to log
	 */
	public info(...data: any[]) {
		this.write(data, LogLevel.INFO);
	}

	/**
	 * Log a message with the severity of DEBUG
	 * @param data String(s) to log
	 */
	public debug(...data: any[]): void {
		this.write(data, LogLevel.DEBUG);
	}

	/**
	 * Log a message with the severity of DEBUG
	 * @param data String(s) to log
	 */
	public log(...data: any[]) {
		this.write(data, LogLevel.DEBUG); // TODO: Move this back to a logger.debug call once getCallSignature is revamped.
	}

	/**
	 * Temporarily overrides config options for the next call.
	 * @param config Config values to override for next call
	 */
	public overrideConfig(config: LoggerConfig) {
		this.override = config; // TODO: Figure out how to make config overrides passable to logger.debug, etc.
	}

	// Shamelessly stolen from a friend.
	private getCallSignature(): string {
		const callerLine = (new Error()).stack!.split("\n")[4];
		const thing = callerLine.split("/");
		const clean = thing[thing.length - 1];
		return clean.substring(0, clean.length - 1);
	}

	/**
	 * Writes a log message to STDOUT
	 * @param rawMessage The message to log
	 * @param severity The severity of log
	 */
	private write(rawMessage: any[], severity: LogLevel) {
		let actualConfig = { ...this.config, ...this.override };
		if ((actualConfig.minLevel !== null || actualConfig.minLevel !== undefined) && actualConfig.minLevel! < severity) {
			this.override = {};
			return;
		}

		let level = "";
		let style = "";
		switch (severity) {
			case LogLevel.EMERGENCY:
				level = "emer";
				style = "font-weight: bold; background-color: Black; color: Red;";
				break;
			case LogLevel.ALERT:
				level = "alert";
				style = "font-weight: bold; background-color: Black; color: Yellow;";
				break;
			case LogLevel.CRITICAL:
				level = "crit";
				style = "font-weight: bold; background-color: #FF0000; color: Black;";
				break;
			case LogLevel.ERROR:
				level = "err";
				style = "font-weight: bold; background-color: #FFAAAA; color: Black;";
				break;
			case LogLevel.WARNING:
				level = "warn";
				style = "font-weight: bold; background-color: #FFFFAA; color: Black;";
				break;
			case LogLevel.NOTICE:
				level = "note";
				style = "font-weight: bold; background-color: White; color: Black;";
				break;
			case LogLevel.INFO:
				level = "info";
				style = "";
				break;
			case LogLevel.DEBUG:
				level = "debug";
				style = "color: Gray;";
				break;
		}
		let line = "";
		if (actualConfig.logLine) line += " | " + this.getCallSignature();
		if (actualConfig.name !== "") line += " | " + actualConfig.name;

		const ansiLogStr = `${(new Date()).toISOString()} [${style} | ${line}]`;

		// Just use console.log, I don't think there's any point in doing anything else :P
		console.log('%c' + ansiLogStr, style);
		console.log('%c' + rawMessage, style);

		this.override = {}; // Clear the override
	}
}

/**
 * The default Logger object, useful for when you can't be bothered to instantiate your own.
 */
export let logger = new Logger();
