'use strict';
import * as vscode from 'vscode'

let disposables: vscode.Disposable[]=[]

export function activate(context: vscode.ExtensionContext) {


    registerTypeForwardCommands(context)
    vscode.workspace.onDidChangeConfiguration(() => {
        disposeCommands()
        registerTypeForwardCommands(context)
    })

    function registerTypeForwardCommands(context: vscode.ExtensionContext) {
        const typeForwardKeys: string[] = vscode.workspace.getConfiguration().typeForwardKeys
        typeForwardKeys.forEach(key => {
            const disposable = vscode.commands.registerCommand(`extension.acceptAndType${key}`, () => acceptAndTypeForward(key))
            context.subscriptions.push(disposable)
            disposables.push(disposable)
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
}

    function disposeCommands(){
        for(let command of disposables)
            command.dispose()
    }
// this method is called when your extension is deactivated
export function deactivate() {
    disposeCommands()
}