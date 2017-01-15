let vscode = require('vscode');

function activate(context) {

    console.log('Congratulations, your extension "vscode-power-mode" is now active!');

    let charCounter = new CharCounter();

    let disposable = vscode.commands.registerCommand('extension.activatePowerMode', function () {
        // var editor = vscode.window.activeTextEditor;
        // if (!editor) {
        //     return;
        // }

        // var selection = editor.selection;
        // var text = editor.document.getText(selection);

        // vscode.window.showInformationMessage('Selected characters: ' + text.length);     

        charCounter.updateCharCount();
    });

    context.subscriptions.push(charCounter);
    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;

var CharCounter = (function () {
    function CharCounter() {
    }
    CharCounter.prototype.updateCharCount = function () {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }
        // Get the current text editor
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        var doc = editor.document;

        if (doc.languageId === "plaintext") {
            var charCount = this._getCharCount(doc);
            // Update the status bar
            this._statusBarItem.text = charCount !== 1 ? charCount + " Characters" : '1 Character';
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    };
    CharCounter.prototype._getCharCount = function (doc) {
        var docContent = doc.getText();
        var charCount = 0;
        if (docContent != "") {
            charCount = docContent.length;
        }
        return charCount;
    };
    CharCounter.prototype.dispose = function () {
        this._statusBarItem.dispose();
    };
    return CharCounter;
}());