# punctual-intellisense README

Ports the simple (yet addictive) Visual Studio feature of accepting intellisense suggestions using the punctuation that will follow the suggestion. This puts the developer into a "forward thinking" posture in which after seeing the correct suggestion, he's already thinking about the code that follows after it.

## Features

* Accepts intellisense suggestion when the user taps any designated punctuation key, then writes that punctuation. Behavior is modeled after Visual Studio.
* When `.` used, the next suggestion widget is triggered.
* If typing punctuation is desired without accepting the suggestion, the user can tap `Esc` to exit the suggestion widget before typing the punctuation.
* In case the user wants to type a designated key but accepts a suggestion without intending to, accepting the suggestion is on the top of the undo stack. This allows the user to undo the suggestion while keeping the punctuation.
* Allows user to define which keys through settings.json.


<!-- For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

## Extension Settings

This extension contributes the following settings:

* `punctual-intellisense.typeForwardKeys`: Array of keys which will accept an Intellisense suggestion before being typed. If unspecified through user settings, the extension default keys will be used. If specified, every desired key must be included.

The default keys are: `.,!@#%^&*()-=+[]{}<>/?|~;:` and `space`

## Known Issues

* When openning parentheses/brackets are typed, the closing is not included. Future feature.
* `.` is the accessor in many languages, but not all. At this time, only those languages for which it is are supported (as far as triggering the next suggestion widget). Future feature may allow for different behaviors per language, if there's public demand for it.
* Bad things happen when using this with JSON. Will need to figure out how to deactivate when JSON is being edited.

<!-- ## Release Notes

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