# Using the Pre-Instantiated Logger
Simply import the `logger` object from the yatsl library. The object will use all the default settings, namely, logging all level log messages to stdout with no specific name and with the line and file attached.
```ts

import { logger } from "yatsl";

logger.info("Hello World!");

```

# Instantiating a Logger
Instantiating a logger is quite simple as well, simply import the `Logger` class (note the capital L!) and instantiate it.
```ts

import { Logger } from "yatsl";

let logger = new Logger();

logger.info("Hello World!");

```
However, for most scenarios, you will most likely want to pass some sort of option arguments to the constructor, this can be done like so:
```ts

import { Logger } from "yatsl";

let logger = new Logger({logLine: false});

logger.info("Hello World!");

```
This allows for fine-tuning of log options during creation of the logger. It should be noted that options can also be changed on the fly through the use of the `config` field.

## Options
| Field    | Type                      | Explanation                                                                                                                                                    |
| -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logLevel | enum (LogLevel)           | The minimum level at which the logger logs                                                                                                                     | 
| logLine  | bool                      | Determines whether or not to log the file and line where the log function was called                                                                           |
| name     | string                    | The name of the logger, if set, it is printed along with the message                                                                                           |
| streams  | {stream.Writable, bool}[] | Defines the streams the logger will write to. Each stream requires a writeable stream object and a boolean determining whether or not the stream supports ANSI |
| decimalDigits | number			   | Defines how many digits to render after the comma for numbers passed to the logger. |
| multilineObjects | boolean			   | Whether to output object JSON representations in multiple lines or a single one, if the logger is given multiple values to log, objects will always be rendered in a single line. |
| tabs | boolean			   | Whether to use tabs (true) or spaces (false) for multi-line JSON. |