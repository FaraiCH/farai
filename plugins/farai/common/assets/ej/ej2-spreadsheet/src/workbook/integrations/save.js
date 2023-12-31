var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { executeTaskAsync } from '../common/worker';
import * as events from '../common/event';
import { SaveWorker } from '../workers/save-worker';
import { detach } from '@syncfusion/ej2-base';
/**
 * @hidden
 * The `WorkbookSave` module is used to handle the save action in Workbook library.
 */
var WorkbookSave = /** @class */ (function (_super) {
    __extends(WorkbookSave, _super);
    /**
     * Constructor for WorkbookSave module in Workbook library.
     * @private
     */
    function WorkbookSave(parent) {
        var _this = _super.call(this, parent) || this;
        _this.isProcessCompleted = false;
        _this.saveJSON = {};
        _this.isFullPost = false;
        _this.needBlobData = false;
        _this.customParams = null;
        _this.addEventListener();
        return _this;
    }
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookSave.prototype.getModuleName = function () {
        return 'workbookSave';
    };
    /**
     * To destroy the WorkbookSave module.
     * @return {void}
     * @hidden
     */
    WorkbookSave.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * @hidden
     */
    WorkbookSave.prototype.addEventListener = function () {
        this.parent.on(events.beginSave, this.initiateSave, this);
    };
    /**
     * @hidden
     */
    WorkbookSave.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(events.beginSave, this.initiateSave);
        }
    };
    /**
     * Initiate save process.
     * @hidden
     */
    WorkbookSave.prototype.initiateSave = function (args) {
        var saveSettings = args.saveSettings;
        this.saveSettings = {
            saveType: saveSettings.saveType,
            url: saveSettings.url,
            fileName: saveSettings.fileName || 'Sample'
        };
        this.isFullPost = args.isFullPost;
        this.needBlobData = args.needBlobData;
        if (this.needBlobData) {
            this.isFullPost = false;
        }
        this.customParams = args.customParams;
        this.updateBasicSettings();
        this.processSheets();
    };
    /**
     * Update save JSON with basic settings.
     * @hidden
     */
    WorkbookSave.prototype.updateBasicSettings = function () {
        var jsonStr = this.getStringifyObject(this.parent, ['sheets', '_isScalar', 'observers', 'closed', 'isStopped', 'hasError',
            '__isAsync', 'beforeCellFormat', 'beforeCellRender', 'beforeDataBound', 'beforeOpen', 'beforeSave', 'beforeSelect',
            'beforeSort', 'cellEdit', 'cellEditing', 'cellSave', 'beforeCellSave', 'contextMenuItemSelect', 'contextMenuBeforeClose',
            'contextMenuBeforeOpen', 'created', 'dataBound', 'fileMenuItemSelect', 'fileMenuBeforeClose', 'fileMenuBeforeOpen',
            'saveComplete', 'sortComplete', 'select', 'actionBegin', 'actionComplete', 'afterHyperlinkClick', 'afterHyperlinkCreate',
            'beforeHyperlinkClick', 'beforeHyperlinkCreate', 'openComplete', 'openFailure', 'queryCellInfo', 'dialogBeforeOpen',
            'dataSourceChanged']);
        var basicSettings = JSON.parse(jsonStr);
        var sheetCount = this.parent.sheets.length;
        var i = 0;
        if (sheetCount) {
            basicSettings.sheets = [];
        }
        this.saveJSON = basicSettings;
    };
    /**
     * Process sheets properties.
     * @hidden
     */
    WorkbookSave.prototype.processSheets = function () {
        var i = 0;
        var sheetCount = this.parent.sheets.length;
        while (i < sheetCount) {
            executeTaskAsync(this, this.processSheet, this.updateSheet, [this.getStringifyObject(this.parent.sheets[i]), i]);
            i++;
        }
    };
    /**
     * Update processed sheet data.
     * @hidden
     */
    WorkbookSave.prototype.updateSheet = function (data) {
        this.saveJSON.sheets[data[0]] = data[1];
        this.isProcessCompleted = this.getSheetLength(this.saveJSON.sheets) === this.parent.sheets.length;
        if (this.isProcessCompleted) {
            this.save(this.saveSettings);
        }
    };
    WorkbookSave.prototype.getSheetLength = function (sheets) {
        var len = 0;
        sheets.forEach(function (sheet) {
            if (sheet) {
                len++;
            }
        });
        return len;
    };
    /**
     * Save process.
     * @hidden
     */
    WorkbookSave.prototype.save = function (saveSettings) {
        var args = { cancel: false, jsonObject: this.saveJSON };
        this.parent.notify(events.onSave, args);
        if (!args.cancel) {
            if (this.isFullPost) {
                this.initiateFullPostSave();
            }
            else {
                executeTaskAsync(this, { 'workerTask': this.processSave }, this.updateSaveResult, [this.saveJSON, saveSettings, this.customParams], true);
            }
        }
        this.saveJSON = {};
    };
    /**
     * Update final save data.
     * @hidden
     */
    WorkbookSave.prototype.updateSaveResult = function (result) {
        var args = {
            status: 'Success',
            message: '',
            url: this.saveSettings.url,
            fileName: this.saveSettings.fileName,
            saveType: this.saveSettings.saveType,
            blobData: null
        };
        if (typeof (result) === 'object' && result.error) {
            args.status = 'Failure';
            args.message = result.error.toString();
        }
        else {
            if (this.needBlobData) {
                args.blobData = result;
            }
            else {
                this.ClientFileDownload(result, this.saveSettings.fileName);
            }
        }
        this.parent.trigger('saveComplete', args);
        this.parent.notify(events.saveCompleted, args);
    };
    WorkbookSave.prototype.ClientFileDownload = function (blobData, fileName) {
        var anchor = this.parent.createElement('a', { attrs: { download: this.getFileNameWithExtension() } });
        var url = URL.createObjectURL(blobData);
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    };
    WorkbookSave.prototype.initiateFullPostSave = function () {
        var keys = Object.keys(this.saveSettings);
        var i;
        var formElem = this.parent.createElement('form', { attrs: { method: 'POST', action: this.saveSettings.url } });
        var inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: 'JSONData' } });
        inputElem.value = JSON.stringify(this.saveJSON);
        formElem.appendChild(inputElem);
        for (i = 0; i < keys.length; i++) {
            inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: keys[i] } });
            inputElem.value = this.saveSettings[keys[i]];
            formElem.appendChild(inputElem);
        }
        keys = Object.keys(this.customParams);
        for (i = 0; i < keys.length; i++) {
            inputElem = this.parent.createElement('input', { attrs: { type: 'hidden', name: keys[i] } });
            inputElem.value = this.customParams[keys[i]];
            formElem.appendChild(inputElem);
        }
        document.body.appendChild(formElem);
        formElem.submit();
        detach(formElem);
        this.parent.notify(events.saveCompleted, {});
    };
    /**
     * Get stringified workbook object.
     * @hidden
     */
    WorkbookSave.prototype.getStringifyObject = function (value, skipProp) {
        if (skipProp === void 0) { skipProp = []; }
        return JSON.stringify(value, function (key, value) {
            if (skipProp.indexOf(key) > -1) {
                return undefined;
            }
            else {
                if (value && typeof value === 'object' && value.hasOwnProperty('properties')) {
                    return value.properties;
                }
                else if (value !== null) {
                    return value;
                }
                else {
                    return undefined;
                }
            }
        });
    };
    WorkbookSave.prototype.getFileNameWithExtension = function (filename) {
        if (!filename) {
            filename = this.saveSettings.fileName;
        }
        var fileExt = this.getFileExtension();
        var idx = filename.lastIndexOf('.');
        if (idx > -1) {
            filename = filename.substr(0, idx);
        }
        return (filename + fileExt);
    };
    WorkbookSave.prototype.getFileExtension = function () {
        return ('.' + this.saveSettings.saveType.toLowerCase());
    };
    return WorkbookSave;
}(SaveWorker));
export { WorkbookSave };
