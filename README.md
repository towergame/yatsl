# YATSL ![Test Status](https://github.com/towergame/yatsl/actions/workflows/testing.yml/badge.svg)  
*(**Y**et **A**nother **T**ype**S**cript **L**ogger)*  
    

**What is this?**  
A logger utility that *should* be relatively simple/quick to set up and offers a neat output. It's also not anything fancy, it will not connect to 5 different servers and upload the log to the blockchain or something, but it should be sufficient for debug logging or just in general having an idea what your typescript program is doing.

**Why should I use this?**  
It is a simple library for logging that produces and output with all the necessary information you could want, like log level, timestamp and the line of code that produced the message (can be toggled off for production builds via the config). 

Here's an example of what the program might output:  
![Example of the Logger, it is currently saying "swag yolo"](https://i.imgur.com/YzfOjCH.png)  
It should be noted that the library requires  ANSI code support for your terminal/command line/thing in order to have the pretty formatting. If you don't, however, you should still be able to get a readable output out of it, it just won't have the colours and formatting.

**How do I use it?**  
There are two main ways of using this library.  
One option is using the default object exported by the library, this is handy if all you need is a thing to call every time you want to log something. Setting this up is simple:
```ts
import { logger } from "yatsl";
logger.info("Hello World!");
```
However, if your codebase is larger than a couple scripts, you might want to have a seperate logger object for each file. Luckily, yatsl supports instantiating your own Logger objects like so:
```ts
import { Logger } from "yatsl";
let logger = new Logger();
logger.info("Hello World!");
```
This also allows for a degree of customisation, as you can pass a config object as an argument to the Logger constructor:
```ts
import { Logger } from "yatsl";
let logger = new Logger({logLine: false});
logger.info("Hello World!");
```

Additional information on how to better customise the logger can be found on the [wiki](https://github.com/towergame/yatsl/wiki).

**Wow this thing sucks, it doesn't even support \<XYZ\>!!**  
If you want a feature that is currently missing, feel free to make an issue. Alternatively, if you're up for getting down and dirty yourself, you can always implement the feature yourself and make a pull request.