import { Dialog as DialogComponent } from '@syncfusion/ej2-popups';
import { extend, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { locale } from '../common/index';
/**
 * Dialog Service.
 * @hidden
 */
var Dialog = /** @class */ (function () {
    /**
     * Constructor for initializing dialog service.
     */
    function Dialog(parent) {
        this.parent = parent;
    }
    /**
     * To show dialog.
     */
    Dialog.prototype.show = function (dialogModel, cancelBtn) {
        var _this = this;
        var btnContent;
        cancelBtn = isNullOrUndefined(cancelBtn) ? true : false;
        var closeHandler = dialogModel.close || null;
        var model = {
            header: 'Spreadsheet',
            cssClass: this.parent.cssClass,
            target: this.parent.element,
            buttons: []
        };
        dialogModel.close = function () {
            _this.dialogInstance.destroy();
            remove(_this.dialogInstance.element);
            _this.dialogInstance = null;
            if (closeHandler) {
                closeHandler();
            }
        };
        extend(model, dialogModel);
        if (cancelBtn) {
            btnContent = this.parent.serviceLocator.getService(locale).getConstant(model.buttons.length ? 'Cancel' : 'Ok');
            model.buttons.push({
                buttonModel: { content: btnContent, isPrimary: model.buttons.length === 0 },
                click: this.hide.bind(this),
            });
        }
        var div = this.parent.createElement('div');
        document.body.appendChild(div);
        this.dialogInstance = new DialogComponent(model);
        this.dialogInstance.createElement = this.parent.createElement;
        this.dialogInstance.appendTo(div);
        this.dialogInstance.refreshPosition();
    };
    /**
     * To hide dialog.
     */
    Dialog.prototype.hide = function () {
        if (this.dialogInstance) {
            this.dialogInstance.hide();
        }
    };
    /**
     * To clear private variables.
     */
    Dialog.prototype.destroy = function () {
        this.parent = null;
    };
    return Dialog;
}());
export { Dialog };
