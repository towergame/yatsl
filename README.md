# YATSL
*(**Y**et **A**nother **T**ype**S**cript **L**ogger)*  
    
**What is this?**  
A logger utility that *should* be relatively simple/quick to set up and offers a neat output. It's also not anything fancy, it will not connect to 5 different servers and upload the log to the blockchain or something, but it should be sufficient for debug logging or just in general having an idea what your typescript program is doing.

**Why should I use this?**  
It is a simple library for logging that produces and output with all the necessary information you could want, like log level, timestamp and the line of code that produced the message (can be toggled off for production builds via the config). 

Here's an example of what the program might output:  
![Example of the Logger, it is currently saying "swag yolo"](https://i.imgur.com/YzfOjCH.png)  
It should be noted that the library requires  ANSI code support for your terminal/command line/thing in order to have the pretty formatting. If you don't, however, you should still be able to get a readable output out of it, it just won't have the colours and formatting.

**Wow this thing sucks, it doesn't even support \<XYZ\>!!**  
If you want a feature that is currently missing, feel free to make an issue. Alternatively, if you're up for getting down and dirty yourself, you can always implement the feature yourself and make a pull request.