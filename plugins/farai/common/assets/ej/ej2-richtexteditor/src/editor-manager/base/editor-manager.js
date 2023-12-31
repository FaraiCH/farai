import { Observer } from '@syncfusion/ej2-base';
import * as CONSTANT from './constant';
import { Lists } from './../plugin/lists';
import { NodeSelection } from './../../selection/index';
import { DOMNode } from './../plugin/dom-node';
import { Formats } from './../plugin/formats';
import { LinkCommand } from './../plugin/link';
import { Alignments } from './../plugin/alignments';
import { Indents } from './../plugin/indents';
import { ImageCommand } from './../plugin/image';
import { TableCommand } from './../plugin/table';
import { SelectionBasedExec } from './../plugin/selection-exec';
import { InsertHtmlExec } from './../plugin/inserthtml-exec';
import { ClearFormatExec } from './../plugin/clearformat-exec';
import { UndoRedoManager } from './../plugin/undo';
import { MsWordPaste } from '../plugin/ms-word-clean-up';
import * as EVENTS from './../../common/constant';
import { InsertTextExec } from '../plugin/insert-text';
/**
 * EditorManager internal component
 * @hidden
 * @deprecated
 */
var EditorManager = /** @class */ (function () {
    /**
     * Constructor for creating the component
     * @hidden
     * @deprecated
     */
    function EditorManager(options) {
        this.currentDocument = options.document;
        this.editableElement = options.editableElement;
        this.nodeSelection = new NodeSelection();
        this.domNode = new DOMNode(this.editableElement, this.currentDocument);
        this.observer = new Observer(this);
        this.listObj = new Lists(this);
        this.formatObj = new Formats(this);
        this.alignmentObj = new Alignments(this);
        this.indentsObj = new Indents(this);
        this.linkObj = new LinkCommand(this);
        this.imgObj = new ImageCommand(this);
        this.selectionObj = new SelectionBasedExec(this);
        this.inserthtmlObj = new InsertHtmlExec(this);
        this.insertTextObj = new InsertTextExec(this);
        this.clearObj = new ClearFormatExec(this);
        this.tableObj = new TableCommand(this);
        this.undoRedoManager = new UndoRedoManager(this, options.options);
        this.msWordPaste = new MsWordPaste(this);
        this.wireEvents();
    }
    EditorManager.prototype.wireEvents = function () {
        this.observer.on(EVENTS.KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
        this.observer.on(EVENTS.MODEL_CHANGED, this.onPropertyChanged, this);
        this.observer.on(EVENTS.MS_WORD_CLEANUP, this.onWordPaste, this);
    };
    EditorManager.prototype.onWordPaste = function (e) {
        this.observer.notify(EVENTS.MS_WORD_CLEANUP_PLUGIN, e);
    };
    EditorManager.prototype.onPropertyChanged = function (props) {
        this.observer.notify(EVENTS.MODEL_CHANGED_PLUGIN, props);
    };
    EditorManager.prototype.editorKeyDown = function (e) {
        this.observer.notify(EVENTS.KEY_DOWN_HANDLER, e);
    };
    EditorManager.prototype.editorKeyUp = function (e) {
        this.observer.notify(EVENTS.KEY_UP_HANDLER, e);
    };
    /**
     * execCommand
     * @hidden
     * @deprecated
     */
    EditorManager.prototype.execCommand = function (command, value, event, callBack, text, exeValue, selector) {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(EVENTS.LIST_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'formats':
                this.observer.notify(EVENTS.FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack,
                    selector: selector, exeValue: exeValue
                });
                break;
            case 'alignments':
                this.observer.notify(CONSTANT.ALIGNMENT_TYPE, {
                    subCommand: value, event: event, callBack: callBack,
                    selector: selector,
                    value: exeValue
                });
                break;
            case 'indents':
                this.observer.notify(CONSTANT.INDENT_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'links':
                this.observer.notify(CONSTANT.LINK, { command: command, value: value, item: exeValue, event: event, callBack: callBack });
                break;
            case 'files':
                this.observer.notify(CONSTANT.IMAGE, {
                    command: command, value: 'Image', item: exeValue, event: event, callBack: callBack, selector: selector
                });
                break;
            case 'images':
                this.observer.notify(CONSTANT.IMAGE, {
                    command: command, value: value, item: exeValue, event: event, callBack: callBack, selector: selector
                });
                break;
            case 'table':
                switch (value.toString().toLocaleLowerCase()) {
                    case 'createtable':
                        this.observer.notify(CONSTANT.TABLE, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'insertrowbefore':
                    case 'insertrowafter':
                        this.observer.notify(CONSTANT.INSERT_ROW, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'insertcolumnleft':
                    case 'insertcolumnright':
                        this.observer.notify(CONSTANT.INSERT_COLUMN, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'deleterow':
                        this.observer.notify(CONSTANT.DELETEROW, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'deletecolumn':
                        this.observer.notify(CONSTANT.DELETECOLUMN, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'tableremove':
                        this.observer.notify(CONSTANT.REMOVETABLE, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'tableheader':
                        this.observer.notify(CONSTANT.TABLEHEADER, { item: exeValue, event: event, callBack: callBack });
                        break;
                    case 'aligntop':
                    case 'alignmiddle':
                    case 'alignbottom':
                        this.observer.notify(CONSTANT.TABLE_VERTICAL_ALIGN, { item: exeValue, event: event, callBack: callBack });
                        break;
                }
                break;
            case 'font':
            case 'style':
            case 'effects':
            case 'casing':
                this.observer.notify(CONSTANT.SELECTION_TYPE, { subCommand: value, event: event, callBack: callBack, value: text, selector: selector });
                break;
            case 'inserthtml':
                this.observer.notify(CONSTANT.INSERTHTML_TYPE, { subCommand: value, callBack: callBack, value: text });
                break;
            case 'inserttext':
                this.observer.notify(CONSTANT.INSERT_TEXT_TYPE, { subCommand: value, callBack: callBack, value: text });
                break;
            case 'clear':
                this.observer.notify(CONSTANT.CLEAR_TYPE, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
            case 'actions':
                this.observer.notify(EVENTS.ACTION, { subCommand: value, event: event, callBack: callBack, selector: selector });
                break;
        }
    };
    return EditorManager;
}());
export { EditorManager };
