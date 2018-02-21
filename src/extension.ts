'use strict';
import * as vscode from 'vscode'
import * as fs from 'fs'
import { shiftKeys } from "./shiftKeys"
import { openCloseKeys } from "./openCloseKeys"


let disposables: vscode.Disposable[] = []
const keyBindingsChangedMessage = 'Changes were detected in your typeForwardKeys settings. Please restart Visual Studio Code in order for these new bindings to take effect.'


export function activate(context: vscode.ExtensionContext) {
    let typeForwardKeys: string[] = getTypeForwardKeys()
    registerTypeForwardCommands(typeForwardKeys, context)

    vscode.workspace.onDidChangeConfiguration(() => {
        let newTypeForwardKeys: string[] = getTypeForwardKeys()
        if (!equivalent(typeForwardKeys, newTypeForwardKeys)) {
            typeForwardKeys = newTypeForwardKeys

            writeTypeForwardKeyBindings(typeForwardKeys, context)
            vscode.window.showInformationMessage(keyBindingsChangedMessage)
        }
    })


    function getTypeForwardKeys(): string[] {
        return vscode.workspace.getConfiguration('punctual-intellisense').typeForwardKeys
    }

    function registerTypeForwardCommands(typeForwardKeys: string[], context: vscode.ExtensionContext) {
        for (const key of typeForwardKeys)
            registerTypeForwardCommand(key, context)


        function registerTypeForwardCommand(key: string, context: vscode.ExtensionContext) {
            const disposable = vscode.commands.registerCommand(`extension.acceptAndType${key}`,
                () => acceptAndTypeForward(key))
            context.subscriptions.push(disposable)
            disposables.push(disposable)
        }
    }

    function writeTypeForwardKeyBindings(typeForwardKeys: string[], context: vscode.ExtensionContext) {
        const extensionSettingsPath = context.extensionPath + "\\package.json"
        let extensionSettings = readExtensionSettings(extensionSettingsPath)

        updateKeyBindings(extensionSettings, typeForwardKeys)
        writeExtensionSettings(extensionSettingsPath, extensionSettings)


        function updateKeyBindings(extensionSettings, typeForwardKeys: string[]) {
            let keyBindings: KeyBinding[] = []
            for (const key of typeForwardKeys)
                keyBindings.push(new KeyBinding(key))

            extensionSettings.contributes.keybindings = keyBindings
        }

        function readExtensionSettings(extensionSettingsPath: string): any {
            try {
                let settingsString = fs.readFileSync(extensionSettingsPath, 'utf8')
                let settings = JSON.parse(settingsString)
                return settings
            } catch (error) {
                console.log(error)
            }
        }

        function writeExtensionSettings(extensionSettingsPath: string, settings) {
            let saveSettings = JSON.stringify(settings)
            fs.writeFileSync(extensionSettingsPath, JSON.stringify(settings))
        }
    }

    async function acceptAndTypeForward(punctuation: string) {
        const editor = vscode.window.activeTextEditor
        const document = editor.document

        // This doesn't play well in conjunction with VSCode's manipulation with JSON, therefore we'll just abort if the editor is JSON. I don't like defending against this here; it aught to be done at the keybinding level so we can stay out of the way in that case, but it's a limitation of VSCode "when" arguments in keybindings. The issues is logged here: https://github.com/Microsoft/vscode/issues/38972
        if (document.languageId !== "jsonc") {
            let suggestion = await getSuggestion()
            await addPunctuation(punctuation)
            replaceFragmentWithSuggestion(suggestion)
            if (punctuation === '.')
                await vscode.commands.executeCommand('editor.action.triggerSuggest')
        } else
            addPunctuation(punctuation)



        async function getSuggestion(): Promise<string> {
            await vscode.commands.executeCommand('acceptSelectedSuggestion')

            const suggestionRange = document.getWordRangeAtPosition(editor.selection.active)
            const suggestion = editor.document.getText(suggestionRange)

            await vscode.commands.executeCommand('undo')
            return suggestion
        }

        async function addPunctuation(punctuation: string) {
            await editor.edit(editBuilder => editBuilder.insert(cursorPosition(), punctuation))
            if (openCloseKeys.hasOwnProperty(punctuation)) {
                await editor.edit(editBuilder => editBuilder.insert(cursorPosition(), openCloseKeys[punctuation]))
                let insideCursorPosition=cursorPosition().translate(0, -1)
                editor.selection = new vscode.Selection(insideCursorPosition, insideCursorPosition)
            }
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

function disposeCommands() {
    for (const command of disposables)
        command.dispose()
}

export function deactivate() {
    disposeCommands()
}

function equivalent(array1: string[], array2: string[]): boolean {
    return array1.length == array2.length && array1.every((v, i) => v === array2[i])
}

class KeyBinding {
    command: string
    key: string
    when: string

    constructor(key: string) {
        let triggerKey
        shiftKeys.hasOwnProperty(key) ? triggerKey = `shift+${shiftKeys[key]}` : triggerKey = key

        this.command = `extension.acceptAndType${key}`
        this.key = triggerKey
        this.when = "editorTextFocus && suggestWidgetVisible"
    }
}