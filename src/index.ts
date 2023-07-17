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
	minLevel?: LogLevel = LogLevel.INFO;
	logLine?: boolean = true;
	name?: string = "";
	streams?: { stream: stream.Writable, color: boolean }[];
	decimalDigits?: number = 3;
	multilineObjects?: boolean = true;
	tabs?: boolean = true;
	carriageReturn?: boolean = false;
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
		carriageReturn: false
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
	 * Turns an object into a string 
	 * @param item The item to be stringified
	 * @param actualConfig The config to use for stringification
	 * @param referenceArr An array of references to check for circular references
	 * @param depth The depth of the current item (used for indentation and reference checking)
	 * @returns A JSON-adjacent string of item
	 **/
	private stringifyItem(item: any, actualConfig: LoggerConfig, referenceArr: Array<[any, number]>, depth: number = 0): string {
		const whitespace = actualConfig.tabs ? "\t" : "  ";
		const lineStartWhitespace = whitespace.repeat(depth);
		const newline = actualConfig.carriageReturn ? "\r\n" : "\n";
		const itemSeperator = (actualConfig.multilineObjects ? (newline + lineStartWhitespace) : whitespace);
		let result = "";
		switch (typeof (item)) {
			case "undefined":
				result = "undefined";
				break;
			case "boolean":
				result = item.toString();
				break;
			case "number":
				result = (item as number).toFixed(item % 1 > 0 ? actualConfig.decimalDigits : 0);
				break;
			case "bigint":
				result = item.toString();
				break;
			case "string":
				// if the string is from the recursive call, 
				// it means it's a stringified object, so we need to wrap it in quotes
				result = depth!==0 ? `"${item}"` : item;
				break;
			case "symbol":
				// TODO: Figure out how to stringify symbols, whatever that means
				result = "[symbol]";
				break;
			case "function":
				// differentiate function from class
				{
					let hasNonTrivialReferences = false;
					for(let i=0;i<referenceArr.length;i++) {
						if(referenceArr[i][0] === item && depth > referenceArr[i][1]) {
							result = "[unserializable object]";
							hasNonTrivialReferences = true;
							break;
						}
					}
					if(hasNonTrivialReferences) break;
				}
				referenceArr.push([item, depth]);
				if(item.name[0].toUpperCase()===item.name[0]) {
					result = `[Class ${item.prototype.constructor.name}]`;
				} else {
					result = `[Function ${item.name}]`;
				}
				break;
			case "object":
				if (item === null) {
					// null is an object, so we need to check for it first
					result = "null";
					break;
				}
				// does this object have non-trivial references?
				{
					let hasNonTrivialReferences = false;
					for(let i=0;i<referenceArr.length;i++) {
						if(referenceArr[i][0] === item && depth > referenceArr[i][1]) {
							result = "[unserializable object]";
							hasNonTrivialReferences = true;
							referenceArr[i][1] = depth;
							break;
						}
					}
					if(hasNonTrivialReferences) break;
				}
				
				referenceArr.push([item, depth]);
				if (Array.isArray(item)) {
					// check item is an array
					
					if(item.length === 0) result = "[ ]"; // empty array
					else {
						result = "[" + itemSeperator;
						item.forEach((element, index) => {
							result += whitespace + this.stringifyItem(element, actualConfig, referenceArr, depth+1);
							if (index + 1 !== item.length) result += "," + itemSeperator;
						});
						result += itemSeperator + "]";
					}
					
				} else {
					// item is a regular object

					// check if item is a class instance
					if(item.constructor.name !== "Object") result = item.constructor.name + whitespace;
					else result = "";
					result += "{" + itemSeperator;
					Object.keys(item).forEach((key, index) => {
						result += `${whitespace}"${key}": ${this.stringifyItem(item[key], actualConfig, referenceArr, depth+1)}`;
						if (index + 1 !== Object.keys(item).length) result += "," + itemSeperator;
					});
					result += itemSeperator + "}";
				}
				result = this.highlightJSON(result);
				break;
			default:
				throw new Error(`Unknown type: ${typeof (item)}`);
		}
		return result;
	}

	/**
	 * Turns an object array into a string
	 * @param content The array to be stringified
	 * @returns A JSON-adjacent string of content
	 */
	private stringify(content: any[], actualConfig: LoggerConfig): string {
		let references: any[] = [];
		let result = "";
		if (content.length === 0) {
			result = "";
			// an empty array means that the user just called logger.log() with no arguments.
			// we don't want to log anything in this case.
			// the timestamp and line number will still be printed, though.
		} else if (content.length === 1) {
			result = this.stringifyItem(content[0], actualConfig, references, 0);
		} else if (content.length > 1) {
			// disable multilineObjects for multiple items
			actualConfig.multilineObjects = false;
			// result += "[ ";
			for (let x: number = 0; x < content.length; x++) {
				result += this.stringifyItem(content[x], actualConfig, references, 0);
				if (x + 1 !== content.length) result += " | ";
			}
			// result += " ]";
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
			stream.stream.write(stream.color ? ansiLogStr : rawLogStr);
		});

		this.override = {}; // Clear the override
	}
}

/**
 * The default Logger object, useful for when you can't be bothered to instantiate your own.
 */
export let logger = new Logger();
