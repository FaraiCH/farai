import { debounce, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NodeSelection } from './../../selection/selection';
import * as EVENTS from './../../common/constant';
import { isIDevice, setEditFrameFocus } from '../../common/util';
/**
 * `Undo` module is used to handle undo actions.
 */
var UndoRedoManager = /** @class */ (function () {
    function UndoRedoManager(parent, options) {
        this.undoRedoStack = [];
        this.parent = parent;
        this.undoRedoSteps = !isNullOrUndefined(options) ? options.undoRedoSteps : 30;
        this.undoRedoTimer = !isNullOrUndefined(options) ? options.undoRedoTimer : 300;
        this.addEventListener();
    }
    UndoRedoManager.prototype.addEventListener = function () {
        var debounceListener = debounce(this.keyUp, this.undoRedoTimer);
        this.parent.observer.on(EVENTS.KEY_UP_HANDLER, debounceListener, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDown, this);
        this.parent.observer.on(EVENTS.ACTION, this.onAction, this);
        this.parent.observer.on(EVENTS.MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    };
    UndoRedoManager.prototype.onPropertyChanged = function (props) {
        for (var _i = 0, _a = Object.keys(props.newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'undoRedoSteps':
                    this.undoRedoSteps = props.newProp.undoRedoSteps;
                    break;
                case 'undoRedoTimer':
                    this.undoRedoTimer = props.newProp.undoRedoTimer;
                    break;
            }
        }
    };
    UndoRedoManager.prototype.removeEventListener = function () {
        this.parent.observer.off(EVENTS.KEY_UP_HANDLER, this.keyUp);
        this.parent.observer.off(EVENTS.KEY_DOWN_HANDLER, this.keyDown);
        this.parent.observer.off(EVENTS.ACTION, this.onAction);
    };
    /**
     * onAction method
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.onAction = function (e) {
        if (e.subCommand === 'Undo') {
            this.undo(e);
        }
        else {
            this.redo(e);
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.destroy = function () {
        this.removeEventListener();
    };
    UndoRedoManager.prototype.keyDown = function (e) {
        var event = e.event;
        var proxy = this;
        switch (event.action) {
            case 'undo':
                event.preventDefault();
                proxy.undo(e);
                break;
            case 'redo':
                event.preventDefault();
                proxy.redo(e);
                break;
        }
    };
    UndoRedoManager.prototype.keyUp = function (e) {
        if (e.event.keyCode !== 17 && !e.event.ctrlKey) {
            this.saveData(e);
        }
    };
    /**
     * RTE collection stored html format.
     * @method saveData
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.saveData = function (e) {
        var range = new NodeSelection().getRange(this.parent.currentDocument);
        var save = new NodeSelection().save(range, this.parent.currentDocument);
        var htmlText = this.parent.editableElement.innerHTML;
        var changEle = { text: htmlText, range: save };
        if (this.undoRedoStack.length >= this.steps) {
            this.undoRedoStack = this.undoRedoStack.slice(0, this.steps + 1);
        }
        if (this.undoRedoStack.length > 1 && (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.collapsed === range.collapsed)
            && (this.undoRedoStack[this.undoRedoStack.length - 1].range.startOffset === save.range.startOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.endOffset === save.range.endOffset) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].range.range.startContainer === save.range.startContainer) &&
            (this.undoRedoStack[this.undoRedoStack.length - 1].text.trim() === changEle.text.trim())) {
            return;
        }
        this.undoRedoStack.push(changEle);
        this.steps = this.undoRedoStack.length - 1;
        if (this.steps > this.undoRedoSteps) {
            this.undoRedoStack.shift();
            this.steps--;
        }
        if (e && e.callBack) {
            e.callBack();
        }
    };
    /**
     * Undo the editable text.
     * @method undo
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.undo = function (e) {
        if (this.steps > 0) {
            var range = this.undoRedoStack[this.steps - 1].range;
            var removedContent = this.undoRedoStack[this.steps - 1].text;
            this.parent.editableElement.innerHTML = removedContent;
            this.parent.editableElement.focus();
            if (isIDevice()) {
                setEditFrameFocus(this.parent.editableElement, e.selector);
            }
            range.restore();
            this.steps--;
            if (e.callBack) {
                e.callBack({
                    requestType: 'Undo',
                    editorMode: 'HTML',
                    range: range,
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument),
                    event: e.event
                });
            }
        }
    };
    /**
     * Redo the editable text.
     * @method redo
     * @return {void}
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.redo = function (e) {
        if (this.undoRedoStack[this.steps + 1] != null) {
            var range = this.undoRedoStack[this.steps + 1].range;
            this.parent.editableElement.innerHTML = this.undoRedoStack[this.steps + 1].text;
            this.parent.editableElement.focus();
            if (isIDevice()) {
                setEditFrameFocus(this.parent.editableElement, e.selector);
            }
            range.restore();
            this.steps++;
            if (e.callBack) {
                e.callBack({
                    requestType: 'Redo',
                    editorMode: 'HTML',
                    range: range,
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument),
                    event: e.event
                });
            }
        }
    };
    /**
     * getUndoStatus method
     * @hidden
     * @deprecated
     */
    UndoRedoManager.prototype.getUndoStatus = function () {
        var status = { undo: false, redo: false };
        if (this.steps > 0) {
            status.undo = true;
        }
        if (this.undoRedoStack[this.steps + 1] != null) {
            status.redo = true;
        }
        return status;
    };
    return UndoRedoManager;
}());
export { UndoRedoManager };
