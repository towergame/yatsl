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
    const str: string = testStream.read().toString();

	it("logging string types", () => {
		return chai.expect(str).to.contain("\"text\": \"string with some characters\"");
	});
    it("logging undefined", () => {
		return chai.expect(str).to.contain("\"undef\": undefined");
	});
    it("logging null", () => {
		return chai.expect(str).to.contain("\"null\": null");
	});
    it("logging number", () => {
		return chai.expect(str).to.contain("\"number\": 1");
	});
    it("logging bool", () => {
		return chai.expect(str).to.contain("\"boolean\": true");
	});
    it("logging arr", () => {
		return chai.expect(str).to.match(/"array":\s+\[\s+1,\s+"he",\s+3\s+\]/);
	});
    it("logging function", () => {
        return chai.expect(str).to.contain("\"fun\": [Function fun2]");
    });
	it("logging symbol", () => {
		return chai.expect(str).to.contain("\"symbol\": Symbol(test)");
	});
	it("logging bigint", () => {
		return chai.expect(str).to.contain("\"bigint\": 153424234");
	});
	it("logging class", () => {
		return chai.expect(str).to.contain("\"s\": [Class S]");
	});
	it("logging class instance", () => {
		return chai.expect(str).to.match(/"s_instance":\s*S\s*\{\s*"_de"\s*:\s*"de"\s*\}/g);
	});
	it("logging circular reference", () => {
		return chai.expect(str).to.contain("\"funny\": [circular reference]");
	});
});

describe("Logging a cyclic object with default settings", () => {
	// Set up the logger
	let testStream = new stream.PassThrough();
	let logger = new Logger({
		streams: [{ stream: testStream, color: false }], // Creates a logger with default settings, except logs it to our custom stream for testing

	});
	let testObject = {
		text: "string with some characters1",
		obj: {}
	};
	let testObject2 = {
		text: "string with some characters2",
		obj: {}
	};
	let testObject3 = {
		text: "string with some characters3",
		obj: {}
	};
	testObject.obj = testObject2;
	testObject2.obj = testObject3;
	testObject3.obj = testObject;
	logger.log(testObject);
	const str: string = testStream.read().toString();
	it("logging circular reference", () => {
		return chai.expect(str).to.contain("[circular reference]");
	});
});

describe("Logging an X like circular loop", () => {
	type X = {children: X[]};
	let parent:X = {
		children: []
	};
	let childA1:X = {
		children: []
	};
	let childA2:X = {
		children: []
	};
	let childB1:X = {
		children: []
	};
	let childB2:X = {
		children: []
	};
	parent.children.push(childA1);
	childA1.children.push(childA2);
	parent.children.push(childB1);
	childB1.children.push(childB2);
	childB2.children.push(childA1);
	childA2.children.push(childB1);
	it("logging circular reference", () => {
		let testStream = new stream.PassThrough();
		let logger = new Logger({
			streams: [{ stream: testStream, color: false }], // Creates a logger with default settings, except logs it to our custom stream for testing
			tabs: false
		});
		logger.log(parent);
		const str: string = testStream.read().toString();
		const len = (str.match(/\[circular reference\]/g) || []).length;
		return chai.expect(len).to.equal(2);
	});

});