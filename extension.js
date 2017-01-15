let vscode = require('vscode');

function activate(context) {

    console.log('Congratulations, your extension "vscode-power-mode" is now active!');

    let charCounter = new CharCounter();
    let controller = new CharCounterController(charCounter);

    context.subscriptions.push(controller);
    context.subscriptions.push(charCounter);

}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;

var CharCounter = (function () {
    function CharCounter() {
    }
    CharCounter.prototype.updateCharCount = function () {

        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        var doc = editor.document;

        if (doc.languageId === "plaintext") {
            var charCount = this._getCharCount(doc);
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

var CharCounterController = (function () {
    function CharCounterController(charCounter) {
        this._charCounter = charCounter;
        this._charCounter.updateCharCount();

        var subscriptions = [];

        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._charCounter.updateCharCount();
        this._disposable = vscode.Disposable.from.apply(vscode.Disposable, subscriptions);
    }
    CharCounterController.prototype.dispose = function () {
        this._disposable.dispose();
    };
    CharCounterController.prototype._onEvent = function () {
        this._charCounter.updateCharCount();
    };
    return CharCounterController;
}());