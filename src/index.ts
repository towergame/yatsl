import stream from "stream";
import process from "process";

function stripAnsi(ansiString: string) {
	return JSON.parse(JSON.stringify(ansiString).replace(/\\u001b\[(\d+;)*\d+m/g, ""));
}

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
	 * List of streams to log to.
	 */
	streams?: { 
		/**
		 * The stream to log to
		 */
		stream: stream.Writable,

		/**
		 * Whether or not to use ANSI escape codes to color the log.
		 */
		color: boolean,

		/**
		 * List of log levels to allow. If this is set, only the log levels in this list will be logged.
		 */
		allowList?: LogLevel[],

		/**
		 * List of log levels to block. If this is set, all log levels except the ones in this list will be logged.
		 */
		blockList?: LogLevel[] 
	}[];

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
		logLine: true,
		name: "",
		streams: [ { stream: process.stdout, color: true } ],
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
	 * Highhlights a JSON string using ANSI characters.
	 * @param json The JSON to highlight
	 * @returns JSON with ANSI characters to highlight it
	 */
	private highlightJSON(json: string): string {
		json = json
			.replace(/(?<=\s|,|{)\"[^\"]+\"(?=:)/g, "\x1b[2m$&" + reset) // Highlight field names
			.replace(/(?<=: |\s|:|,|\[)\d+(?!:|\d*m)/g, "\x1b[31m$&" + reset) // Highlight number values
			.replace(/(?<=: |\s|:|,|\[)(true|false)(?!:)/g, "\x1b[33m$&" + reset) // Highlight bool values
			.replace(/(?<=: |\s|:|,|\[)null(?!:)/g, "\x1b[35m$&" + reset) // Highlight null values
			.replace(/(?<=: |\s|:|,|\[)"(?:\\\\|\\"|[\s\S])*?"(?!:)/g, "\x1b[32m$&" + reset) // Highlight string values
		return json;
	}

	/**
	 * Turns an object array into a JSON string
	 * @param content The array to be stringified
	 * @returns A JSON string of content
	 */
	private stringify(content: any[], actualConfig: LoggerConfig, recursive: boolean = false): string {
		let result = "";
		if (content.length > 1) {
			// result += "[ ";
			for (let x: number = 0; x < content.length; x++) {
				result += this.stringify([content[x]], actualConfig, true);
				if (x + 1 !== content.length) result += " | ";
			}
			// result += " ]";
		} else if (content.length === 0) {
			result = "[ ]"; /* If we're given an empty array, just return "[ ]" to indicate that it's empty.
			            	   Hopefully that's what the user wanted and there isn't a horrible bug that passes an empty array to this function. */
		} else {
			switch (typeof (content[0])) {
				case "string":
					result = content[0];
					break;
				case "number":
					result = (content[0] as number).toFixed(content[0] % 1 > 0 ? actualConfig.decimalDigits : 0);
					break;
				case "boolean":
					result = content[0].toString();
					break;
				default:
					if (recursive || !actualConfig.multilineObjects) {
						result = JSON.stringify(content[0]);
					} else {
						result = "\n" + JSON.stringify(content[0], undefined, (actualConfig.tabs ? '	' : ' '.repeat(actualConfig.spaceCount!)));
					}
					result = this.highlightJSON(result);
			}
		}
		return result;
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

		let message = rawMessage.length > 0 ? this.stringify(rawMessage, actualConfig) : "";

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
		if (actualConfig.logLine) line += " | " + this.getCallSignature();
		if (actualConfig.name !== "") line += " | " + actualConfig.name;

		const ansiLogStr = `\x1b[2m${(new Date()).toISOString()}${reset} [${style}${reset}${line}] ${message}\n`;
		const rawLogStr = stripAnsi(ansiLogStr);

		actualConfig.streams?.forEach((stream) => {
			if (stream.allowList && !stream.allowList.includes(severity)) return;
			if (stream.blockList && stream.blockList.includes(severity)) return;
			stream.stream.write(stream.color ? ansiLogStr : rawLogStr);
		});

		this.override = {}; // Clear the override
	}
}

/**
 * The default Logger object, useful for when you can't be bothered to instantiate your own.
 */
export let logger = new Logger();
