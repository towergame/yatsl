import stream from 'stream';
import { Logger, LogLevel } from './index';
import * as chai from 'chai';
import 'mocha';

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
		text: "Nice String with \"some escaped\": characters",
		integer: 13
	}
	it("The logger should log a multiline object using spaces", () => {
		// Log a test message
		logger.log(testObject);

		return chai.expect(testStream.read().toString()).to.match(/\n\s+/g);
	});
});

describe("Logging an object with space indent set to 3", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		tabs: false,
		spaceCount: 3,
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	let testObject = {
		text: "Nice String with \"some escaped\": characters"
	}
	it("The logger should log a multiline object using 3 spaces", () => {
		// Log a test message
		logger.log(testObject);

		return chai.expect(testStream.read().toString()).to.match(/\n\s{3}/g);
	});
});