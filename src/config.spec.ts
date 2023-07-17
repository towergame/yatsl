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

describe("Logging with allowLists", () => {
	// Set up the logger
	let testStream1 = new stream.PassThrough();
	let testStream2 = new stream.PassThrough();
	let testStream3 = new stream.PassThrough();
	let logger = new Logger({
		streams: [
			{ stream: testStream1, color: true, allowList: [LogLevel.INFO] },
			{ stream: testStream2, color: true, allowList: [] },
			{ stream: testStream3, color: true, allowList: [LogLevel.WARNING, LogLevel.DEBUG] },
		]
	});
	logger.debug("test1");
	logger.info("test2");
	logger.note("test3");
	logger.warn("test4");
	const str = testStream1.read().toString();
	it("The logger should log to the first stream only on test2", () => {
		return chai.expect(str).to.contain("test2").and.not.to.contain("test1").and.contain("test3").and.contain("test4");
	});
	const str2 = testStream2.read();
	it("The logger should not log to the second stream", () => {
		return chai.expect(str2).to.equal(null);
	});
	const str3 = testStream3.read().toString();
	it("The logger should log to the third stream only on test1 and test3", () => {
		return chai.expect(str3).to.contain("test1").and.to.contain("test4").and.not.to.contain("test2").and.contain("test3");
	});
});

describe("Logging with blockLists", () => {
	// Set up the logger
	let testStream1 = new stream.PassThrough();
	let testStream2 = new stream.PassThrough();
	let testStream3 = new stream.PassThrough();
	let logger = new Logger({
		streams: [
			{ stream: testStream1, color: true, blockList: [LogLevel.INFO] },
			{ stream: testStream2, color: true, blockList: [] },
			{ stream: testStream3, color: true, blockList: [LogLevel.WARNING, LogLevel.DEBUG] },
		]
	});
	logger.debug("test1");
	logger.info("test2");
	logger.note("test3");
	logger.warn("test4");
	const str = testStream1.read().toString();
	it("The logger should log to the first stream only on test2", () => {
		return chai.expect(str).to.contain("test1").and.to.contain("test3").and.contain("test4").and.not.contain("test2");
	});
	const str2 = testStream2.read().toString();
	it("The logger should not log to the second stream", () => {
		return chai.expect(str2).to.contain("test2").and.to.contain("test1").and.contain("test3").and.contain("test4");
	});
	const str3 = testStream3.read().toString();
	it("The logger should log to the third stream only on test2 and test3", () => {
		return chai.expect(str3).to.contain("test2").and.to.contain("test3").and.not.to.contain("test1").and.contain("test4");
	});
});