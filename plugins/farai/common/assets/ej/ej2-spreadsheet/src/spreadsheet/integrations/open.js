import { refreshSheetTabs, completeAction } from '../common/event';
import { dialog } from '../common/index';
import { openSuccess, openFailure } from '../../workbook/index';
var Open = /** @class */ (function () {
    function Open(parent) {
        this.parent = parent;
        this.addEventListener();
        this.renderFileUpload();
        //Spreadsheet.Inject(WorkbookOpen);
    }
    /**
     * Adding event listener for success and failure
     */
    Open.prototype.addEventListener = function () {
        this.parent.on(openSuccess, this.openSuccess, this);
        this.parent.on(openFailure, this.openFailed, this);
    };
    /**
     * Removing event listener for success and failure
     */
    Open.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(openSuccess, this.openSuccess);
            this.parent.off(openFailure, this.openFailed);
        }
    };
    /**
     * Rendering upload component for importing files.
     */
    Open.prototype.renderFileUpload = function () {
        var uploadID = this.parent.element.id + '_fileUpload';
        this.parent.element.appendChild(this.parent.createElement('input', {
            id: uploadID,
            attrs: { type: 'file', accept: '.xls, .xlsx, .csv, .xlsm', name: 'fileUpload' }
        }));
        var uploadBox = document.getElementById(uploadID);
        uploadBox.onchange = this.fileSelect.bind(this);
        uploadBox.onerror = this.openFailed.bind(this);
        uploadBox.style.display = 'none';
    };
    /**
     * Process after select the excel and image file.
     * @param {Event} args - File select native event.
     */
    Open.prototype.fileSelect = function (args) {
        /* tslint:disable-next-line:no-any */
        var filesData = args.target.files[0];
        if (filesData && filesData.length < 1) {
            return;
        }
        var impArgs = {
            file: filesData
        };
        this.parent.open(impArgs);
        document.getElementById(this.parent.element.id + '_fileUpload').value = '';
    };
    /**
     * File open success event declaration.
     * @param {string} response - File open success response text.
     */
    Open.prototype.openSuccess = function (response) {
        var _this = this;
        var openError = ['UnsupportedFile', 'InvalidUrl'];
        if (openError.indexOf(response.data) > -1) {
            this.parent.serviceLocator.getService(dialog).show({
                content: this.parent.serviceLocator.getService('spreadsheetLocale')
                    .getConstant(response.data),
                width: '300',
                beforeOpen: function (args) {
                    var dlgArgs = {
                        dialogName: 'OpenDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                },
            });
            this.parent.hideSpinner();
            return;
        }
        if (!this.parent.element) {
            return;
        }
        this.parent.trigger('openComplete', { response: response });
        this.parent.notify(completeAction, { response: response, action: 'import' });
        this.parent.renderModule.refreshSheet();
        this.parent.notify(refreshSheetTabs, this);
        this.parent.hideSpinner();
    };
    /**
     * File open failure event declaration.
     * @param {object} args - Open failure arguments.
     */
    Open.prototype.openFailed = function (args) {
        this.parent.trigger('openFailure', args);
        this.parent.hideSpinner();
        /* Need to Implement */
    };
    /**
     * To Remove the event listeners.
     */
    Open.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the sheet open module name.
     */
    Open.prototype.getModuleName = function () {
        return 'open';
    };
    return Open;
}());
export { Open };
