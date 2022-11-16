import stream from 'stream';
import { Logger, LogLevel } from './index';
import * as chai from 'chai';
import 'mocha';

describe("Logging with default settings", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("DEBUG should log", () => {
		// Log a test message
		logger.debug("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("INFO should log", () => {
		// Log a test message
		logger.info("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("NOTICE should log", () => {
		// Log a test message
		logger.note("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("WARNING should log", () => {
		// Log a test message
		logger.warn("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("ERROR should log", () => {
		// Log a test message
		logger.error("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("CRITICAL should log", () => {
		// Log a test message
		logger.critical("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("ALERT should log", () => {
		// Log a test message
		logger.alert("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
	it("EMERGENCY should log", () => {
		// Log a test message
		logger.emergency("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
});

describe("Logging with minimum log level set at EMERGENCY", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		minLevel: LogLevel.EMERGENCY,
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("DEBUG should not log", () => {
		// Log a test message
		logger.debug("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("INFO should not log", () => {
		// Log a test message
		logger.info("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("NOTICE should not log", () => {
		// Log a test message
		logger.note("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("WARNING should not log", () => {
		// Log a test message
		logger.warn("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("ERROR should not log", () => {
		// Log a test message
		logger.error("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("CRITICAL should not log", () => {
		// Log a test message
		logger.critical("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("ALERT should not log", () => {
		// Log a test message
		logger.alert("This is a test.");

		return chai.expect(testStream.read()).to.equal(null);
	});
	it("EMERGENCY should log", () => {
		// Log a test message
		logger.emergency("This is a test.");

		return chai.expect(testStream.read()).not.equal(null);
	});
});

describe("Logging with color set to false", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: false }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("The logger should not log any ANSI escape codes", () => {
		// Log a test message
		logger.log("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
});

describe("Logging with a set name", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		name: "a string which does not exist anywhere in the test message",
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("The log should contain the name", () => {
		// Log a test message
		logger.log("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
});

describe("Logging the line", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("The log should contain file and line number", () => {
		// Log a test message
		logger.log("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/); // Match the file name and code line using RegEx
	});
});

describe("Logging to multiple streams", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let testStream2 = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }, { stream: testStream2, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("The logger should log the same string to both streams", () => {
		// Log a test message
		logger.log("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
});

describe("Logging an object with default settings", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	let testObject = {
		text: "Nice String with \"some escaped\": characters"
	}
	it("The log should log a multiline object using tabs", () => {
		// Log a test message
		logger.log(testObject);

		return chai.expect(testStream.read().toString()).to.match(/\t/);
	});
	it("The log should format the JSON correctly", () => {
		// Log a test message
		logger.log(testObject);

		return chai.expect(testStream.read().toString()).to.match(/\[\d+m"text"/).not.match(/\[\d+m\\\"some escaped\\\":/); // The key should be formatted but the string containing escaped quotes followed by a colon should not be.
	});
});

describe("Logging an object with colour formatting disabled", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: false }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	let testObject = {
		text: "Nice String with \"some escaped\": characters"
	}
	it("The logger should not log any ANSI escape codes", () => {
		// Log a test message
		logger.log(testObject);

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
});

describe("Logging multiple objects in a single call", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }], // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	let testObject1 = {
		id: 1,
		message: "Nice String with \"some escaped\": characters"
	};
	let testObject2 = {
		id: 2,
		message: "Another nice string."
	};
	it("The logger should not log any newlines", () => {
		// Log a test message
		logger.log(testObject1, testObject2);
		let testString: string = testStream.read().toString();

		return chai.expect(testString.substring(0, testString.length - 1)).not.contain('\n'); // ignore the newline at the end because it doesn't count for the test
	});
});

describe("Logging an object with multilineObjects disabled", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }], // Creates a logger with default settings, except logs it to our custom stream for testing
		multilineObjects: false
	});
	let testObject = {
		text: "Nice String with \"some escaped\": characters"
	}
	it("The logger should not log any newlines", () => {
		// Log a test message
		logger.log(testObject);
		let testString: string = testStream.read().toString();

		return chai.expect(testString.substring(0, testString.length - 1)).not.contain('\n'); // ignore the newline at the end because it doesn't count for the test
	});
});

describe("Logging an object with tabs set to false", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		tabs: false,
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	let testObject = {
		text: "Nice String with \"some escaped\": characters"
	}
	it("The logger should log a multiline object using spaces", () => {
		// Log a test message
		logger.log(testObject);

		return chai.expect(testStream.read().toString()).to.match(/ /);
	});
});

describe("Logging with an option override setting minLevel to EMERGENCY", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("DEBUG should log once", () => {
		// Log a test message
		logger.overrideConfig({ minLevel: LogLevel.EMERGENCY });
		logger.debug("This is a test.");
		let a = testStream.read();
		logger.debug("This is a test.");
		let b = testStream.read();

		return chai.expect(a).to.equal(null).but.not.equal(b);
	});
	it("EMERGENCY should log twice", () => {
		// Log a test message
		logger.overrideConfig({ minLevel: LogLevel.EMERGENCY });
		logger.emergency("This is a test.");
		let a = testStream.read();
		logger.emergency("This is a test.");
		let b = testStream.read();

		return chai.expect(a).to.equal(null).but.not.equal(b);
	});
});