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