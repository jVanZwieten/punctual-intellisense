'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "punctual-intellisense" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.acceptAndTypeForward', async () => {
        const editor = vscode.window.activeTextEditor
        const document = editor.document
        const startEditPosition = editor.selection.active
        let suggestion: string


        

        let replaceWordRange = document.getWordRangeAtPosition(editor.selection.active)
        if (replaceWordRange === undefined)
            replaceWordRange = new vscode.Range(startEditPosition, startEditPosition)
        // save the suggested edit

        await vscode.commands.executeCommand('acceptSelectedSuggestion')
        let suggestionRange = document.getWordRangeAtPosition(editor.selection.active)
        suggestion = editor.document.getText(suggestionRange)
        await vscode.commands.executeCommand('undo')
        await editor.edit(editBuilder => editBuilder.insert(editor.selection.active, '.'))
        editor.edit(editBuilder => editBuilder.replace(replaceWordRange, suggestion))
    })
    context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {
}