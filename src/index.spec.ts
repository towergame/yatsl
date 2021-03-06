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
	it("DEBUG should not log any ANSI escape codes", () => {
		// Log a test message
		logger.debug("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("INFO should not log any ANSI escape codes", () => {
		// Log a test message
		logger.info("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("NOTICE should not log any ANSI escape codes", () => {
		// Log a test message
		logger.note("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("WARNING should not log any ANSI escape codes", () => {
		// Log a test message
		logger.warn("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("ERROR should not log any ANSI escape codes", () => {
		// Log a test message
		logger.error("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("CRITICAL should not log any ANSI escape codes", () => {
		// Log a test message
		logger.critical("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("ALERT should not log any ANSI escape codes", () => {
		// Log a test message
		logger.alert("This is a test.");

		return chai.expect(testStream.read().toString()).not.contain('\x1b');
	});
	it("EMERGENCY should not log any ANSI escape codes", () => {
		// Log a test message
		logger.emergency("This is a test.");

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
	it("DEBUG should contain the name", () => {
		// Log a test message
		logger.debug("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("INFO should contain the name", () => {
		// Log a test message
		logger.info("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("NOTICE should contain the name", () => {
		// Log a test message
		logger.note("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("WARNING should contain the name", () => {
		// Log a test message
		logger.warn("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("ERROR should contain the name", () => {
		// Log a test message
		logger.error("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("CRITICAL should contain the name", () => {
		// Log a test message
		logger.critical("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("ALERT should contain the name", () => {
		// Log a test message
		logger.alert("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
	it("EMERGENCY should contain the name", () => {
		// Log a test message
		logger.emergency("This is a test.");

		return chai.expect(testStream.read().toString()).to.contain("a string which does not exist anywhere in the test message");
	});
});

describe("Logging the line", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("DEBUG should contain file and line number", () => {
		// Log a test message
		logger.debug("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/); // Match the file name and code line using RegEx
	});
	it("INFO should contain file and line number", () => {
		// Log a test message
		logger.info("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
	it("NOTICE should contain file and line number", () => {
		// Log a test message
		logger.note("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
	it("WARNING should contain file and line number", () => {
		// Log a test message
		logger.warn("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
	it("ERROR should contain file and line number", () => {
		// Log a test message
		logger.error("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
	it("CRITICAL should contain file and line number", () => {
		// Log a test message
		logger.critical("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
	it("ALERT should contain file and line number", () => {
		// Log a test message
		logger.alert("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
	it("EMERGENCY should contain file and line number", () => {
		// Log a test message
		logger.emergency("This is a test.");

		return chai.expect(testStream.read().toString()).to.match(/index\.spec\.ts:\d+:\d+/);
	});
});

describe("Logging to multiple streams", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let testStream2 = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: true }, { stream: testStream2, color: true }] // Creates a logger with default settings, except logs it to our custom stream for testing
	});
	it("DEBUG should log the same string to both streams", () => {
		// Log a test message
		logger.debug("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("INFO should log the same string to both streams", () => {
		// Log a test message
		logger.info("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("NOTICE should log the same string to both streams", () => {
		// Log a test message
		logger.note("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("WARNING should log the same string to both streams", () => {
		// Log a test message
		logger.warn("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("ERROR should log the same string to both streams", () => {
		// Log a test message
		logger.error("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("CRITICAL should log the same string to both streams", () => {
		// Log a test message
		logger.critical("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("ALERT should log the same string to both streams", () => {
		// Log a test message
		logger.alert("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
	it("EMERGENCY should log the same string to both streams", () => {
		// Log a test message
		logger.emergency("This is a test.");

		return chai.expect(testStream.read().toString()).to.equal(testStream2.read().toString());
	});
});