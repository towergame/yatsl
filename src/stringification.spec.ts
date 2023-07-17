import stream from 'stream';
import { Logger, LogLevel } from './index';
import * as chai from 'chai';
import 'mocha';

describe("Logging a complex object with default settings", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: false }], // Creates a logger with default settings, except logs it to our custom stream for testing

	});
    class S {
        private _de: string;
        constructor() {
            this._de = "de";
        }
        get de() {
            return this._de;
        }
    }
	let testObject = {
		text: "string with some characters",
        undef: undefined,
        null: null,
        number: 1,
        boolean: true,
        array: [1, "he", 3],
        object: {
            text: "string with some characters",
        },
        fun: function fun2() {
            const hehe=69;
            return hehe;
        },
        symbol: Symbol("test"),
        bigint: BigInt(153424234),
        s: S,
        s_instance: new S(),
        funny: {} 
	};
    testObject["funny"] = testObject;
    logger.log(testObject);
    const str = testStream.read().toString();

	it("logging string types", () => {
		return chai.expect(str).to.contain("\"text\": \"string with some characters\",");
	});
    it("logging undefined", () => {
		return chai.expect(str).to.contain("\"undef\": undefined,");
	});
    it("logging null", () => {
		return chai.expect(str).to.contain("\"null\": null,");
	});
    it("logging number", () => {
		return chai.expect(str).to.contain("\"number\": 1,");
	});
    it("logging bool", () => {
		return chai.expect(str).to.contain("\"boolean\": true,");
	});
    it("logging arr", () => {
		return chai.expect(str).to.match(/"array":\s+\[\s+1,\s+"he",\s+3\s+\],/);
	});
    it("logging function", () => {
        return chai.expect(str).to.contain("\"fun\": [Function fun2],");
    });
});