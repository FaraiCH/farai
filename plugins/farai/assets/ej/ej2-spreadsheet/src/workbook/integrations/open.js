/**
 * Open properties.
 */
import { isUndefined } from '@syncfusion/ej2-base';
import { workbookOpen, openSuccess, openFailure, sheetsDestroyed, workbookFormulaOperation } from '../common/index';
import { sheetCreated, protectSheetWorkBook } from '../common/index';
import { initSheet } from '../base/index';
import { beginAction } from '../../spreadsheet/common/event';
var WorkbookOpen = /** @class */ (function () {
    function WorkbookOpen(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To open the excel file stream or excel url into the spreadsheet.
     * @param {OpenOptions} options - Options to open a excel file.
     */
    WorkbookOpen.prototype.open = function (options) {
        var _this = this;
        if (!this.parent.allowOpen) {
            return;
        }
        /* tslint:disable-next-line:no-any */
        if (options.jsonObject) {
            /* tslint:disable-next-line:no-any */
            this.fetchSuccess(options.jsonObject);
            return;
        }
        var formData = new FormData();
        if (options.file) {
            formData.append('file', options.file);
        }
        else {
            this.parent.isOpen = false;
            return;
        }
        var eventArgs = {
            file: options.file || null,
            cancel: false,
            requestData: {
                method: 'POST',
                body: formData
            }
        };
        this.parent.trigger('beforeOpen', eventArgs);
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeOpen' });
        if (eventArgs.cancel) {
            return;
        }
        fetch(this.parent.openUrl, eventArgs.requestData)
            .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
            }
        })
            .then(function (data) { return _this.fetchSuccess(data); })
            .catch(function (error) { return _this.fetchFailure(error); });
    };
    WorkbookOpen.prototype.fetchFailure = function (error) {
        if (isUndefined(error.status) && isUndefined(error.statusText)) {
            error.statusText = 'Improper response';
        }
        this.parent.notify(openFailure, error);
        this.parent.isOpen = false;
    };
    WorkbookOpen.prototype.fetchSuccess = function (data) {
        var openError = ['UnsupportedFile', 'InvalidUrl'];
        var workbookData = data;
        workbookData = (typeof data === 'string') ? JSON.parse(data) : data;
        /* tslint:disable-next-line:no-any */
        var impData = workbookData.Workbook;
        if (openError.indexOf(impData) > -1) {
            this.parent.notify(openSuccess, {
                context: this, data: impData
            });
            return;
        }
        this.updateModel(impData);
        this.parent.notify(openSuccess, {
            context: this, data: impData
        });
        this.parent.isOpen = false;
    };
    WorkbookOpen.prototype.updateModel = function (workbookModel) {
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
        workbookModel.activeSheetIndex = workbookModel.activeSheetIndex || 0;
        this.parent.setProperties({
            'sheets': workbookModel.sheets,
            'activeSheetIndex': workbookModel.activeSheetIndex,
            'definedNames': workbookModel.definedNames || []
        }, true);
        initSheet(this.parent);
        this.parent.notify(sheetCreated, null);
        this.parent.notify(workbookFormulaOperation, { action: 'registerSheet', isImport: true });
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        this.parent.notify(protectSheetWorkBook, null);
    };
    /**
     * Adding event listener for workbook open.
     */
    WorkbookOpen.prototype.addEventListener = function () {
        this.parent.on(workbookOpen, this.open.bind(this));
    };
    /**
     * Removing event listener workbook open.
     */
    WorkbookOpen.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookOpen, this.open.bind(this));
        }
    };
    /**
     * To Remove the event listeners
     */
    WorkbookOpen.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook open module name.
     */
    WorkbookOpen.prototype.getModuleName = function () {
        return 'workbookOpen';
    };
    return WorkbookOpen;
}());
export { WorkbookOpen };
