import stream from 'stream';
import { Logger, LogLevel } from './index';
import * as chai from 'chai';
import 'mocha';

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

		return chai.expect(testStream.read().toString()).to.match(/config\.spec\.ts:\d+:\d+/); // Match the file name and code line using RegEx
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

		return chai.expect(a).to.not.equal(null).and.equal(b);
	});
});