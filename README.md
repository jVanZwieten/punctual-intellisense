# punctual-intellisense README

Ports the simple (yet addictive) Visual Studio feature of accepting intellisense suggestions using the punctuation that will follow the suggestion. This puts the developer into a "forward thinking" posture in which after seeing the correct suggestion, he's already thinking about the code that follows after it.

## Features

* Accepts intellisense suggestion when the user taps a designated punctuation key, then writes that punctuation. Allows user to designate which keys for which this applies through custom user settings.
* When holding down alt, this function is disabled so that the user can type a designated key without accepting if he/she wants. The user can also tap `Esc` to exit the suggestion widget.
* In case the user wants to type a designated key but accepts a suggestion without intending to, accepting the suggestion is on the top of the undo stack. This allows the user to unto the suggestion while keeping the punctuation.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on OSX or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on OSX or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (OSX) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**