import * as CONSTANT from './../base/constant';
import { ClearFormat } from './clearformat';
import * as EVENTS from './../../common/constant';
/**
 * Clear Format EXEC internal component
 * @hidden
 * @deprecated
 */
var ClearFormatExec = /** @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    function ClearFormatExec(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    ClearFormatExec.prototype.addEventListener = function () {
        this.parent.observer.on(CONSTANT.CLEAR_TYPE, this.applyClear, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.onKeyDown, this);
    };
    ClearFormatExec.prototype.onKeyDown = function (e) {
        switch (e.event.action) {
            case 'clear-format':
                this.applyClear({ subCommand: 'ClearFormat', callBack: e.callBack });
                e.event.preventDefault();
                break;
        }
    };
    ClearFormatExec.prototype.applyClear = function (e) {
        if (e.subCommand === 'ClearFormat') {
            ClearFormat.clear(this.parent.currentDocument, this.parent.editableElement, e.selector);
            if (e.callBack) {
                e.callBack({
                    requestType: e.subCommand,
                    event: e.event,
                    editorMode: 'HTML',
                    range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                    elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
                });
            }
        }
    };
    return ClearFormatExec;
}());
export { ClearFormatExec };
