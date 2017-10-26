'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as process from 'process'
import * as os from 'os'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // The command has been defined in the package.json file
    // Now provide the implementation of  the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    registerTypeForwardCommands(context)

    function registerTypeForwardCommands(context: vscode.ExtensionContext) {
        const typeForwardKeys: string[] = vscode.workspace.getConfiguration().typeForwardKeys
        typeForwardKeys.forEach(key => {
            context.subscriptions.push(
                vscode.commands.registerCommand(`extension.acceptAndType${key}`, () => acceptAndTypeForward(key))
            )
        });
    }

    async function acceptAndTypeForward(punctuation: string) {
        const editor = vscode.window.activeTextEditor
        const document = editor.document

        let suggestion = await getSuggestion()
        await addPunctiation()
        replaceFragmentWithSuggestion(suggestion)

        async function getSuggestion() {
            await vscode.commands.executeCommand('acceptSelectedSuggestion')

            const suggestionRange = document.getWordRangeAtPosition(editor.selection.active)
            const suggestion = editor.document.getText(suggestionRange)

            await vscode.commands.executeCommand('undo')
            return suggestion
        }

        async function addPunctiation() {
            await editor.edit(editBuilder => editBuilder.insert(cursorPosition(), punctuation))
        }

        async function replaceFragmentWithSuggestion(suggestion) {
            let positionBeforePunctuation = cursorPosition().translate(0, -1)
            let draftRange = document.getWordRangeAtPosition(positionBeforePunctuation)
                || new vscode.Range(positionBeforePunctuation, positionBeforePunctuation)
            await editor.edit(editBuilder => editBuilder.replace(draftRange, suggestion))
        }

        function cursorPosition(): vscode.Position {
            return editor.selection.active
        }

    }

    // let disposable = vscode.commands.registerCommand('extension.acceptAndTypeForward', async (punct, another) => {
    //     const punctuation = punct.context
    //     const editor = vscode.window.activeTextEditor
    //     const document = editor.document

    //     let suggestion = await getSuggestion()
    //     await addPunctiation()
    //     await replaceFragmentWithSuggestion(suggestion)

    //     async function getSuggestion() {
    //         await vscode.commands.executeCommand('acceptSelectedSuggestion')

    //         const suggestionRange = document.getWordRangeAtPosition(editor.selection.active)
    //         const suggestion = editor.document.getText(suggestionRange)

    //         await vscode.commands.executeCommand('undo')
    //         return suggestion
    //     }

    //     async function addPunctiation() {
    //         await editor.edit(editBuilder => editBuilder.insert(cursorPosition(), punctuation))
    //     }

    //     async function replaceFragmentWithSuggestion(suggestion) {
    //         let positionBeforePunctuation = cursorPosition().translate(0, -1)
    //         let draftRange = document.getWordRangeAtPosition(positionBeforePunctuation)
    //             || new vscode.Range(positionBeforePunctuation, positionBeforePunctuation)
    //         await editor.edit(editBuilder => editBuilder.replace(draftRange, suggestion))
    //     }

    //     function cursorPosition(): vscode.Position {
    //         return editor.selection.active
    //     }

    // })
    // context.subscriptions.push(disposable)

    console.log('Congratulations, your extension "punctual-intellisense" is now active!');
}

// this method is called when your extension is deactivated
export function deactivate() {
}