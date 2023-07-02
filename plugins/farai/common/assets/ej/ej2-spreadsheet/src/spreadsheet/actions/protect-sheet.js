import { applyProtect, protectSheet, protectCellFormat, editAlert, enableFormulaInput } from '../common/event';
import { clearCopy, protectSelection, clearUndoRedoCollection } from '../common/index';
import { ListView } from '@syncfusion/ej2-lists';
import { EventHandler } from '@syncfusion/ej2-base';
import { locale, updateToggleItem } from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { applyLockCells, setCell } from '../../workbook/index';
/**
 * The `Protect-sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
var ProtectSheet = /** @class */ (function () {
    /**
     * Constructor for protectSheet module in Spreadsheet.
     * @private
     */
    function ProtectSheet(parent) {
        this.parent = parent;
        this.init();
    }
    ProtectSheet.prototype.init = function () {
        this.addEventListener();
    };
    /**
     * To destroy the protectSheet module.
     * @return {void}
     * @hidden
     */
    ProtectSheet.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    ProtectSheet.prototype.addEventListener = function () {
        this.parent.on(applyProtect, this.protect, this);
        this.parent.on(protectSheet, this.protectSheetHandler, this);
        this.parent.on(editAlert, this.editProtectedAlert, this);
        this.parent.on(applyLockCells, this.lockCellsHandler, this);
    };
    ProtectSheet.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyProtect, this.protect);
            this.parent.off(protectSheet, this.protectSheetHandler);
            this.parent.off(editAlert, this.editProtectedAlert);
            this.parent.off(applyLockCells, this.lockCellsHandler);
        }
    };
    ProtectSheet.prototype.protect = function (args) {
        this.parent.notify(clearCopy, null);
        if (!args.isActive) {
            this.createDialogue();
        }
        else {
            this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', false);
            this.parent.notify(updateToggleItem, { props: 'Protect' });
            this.parent.notify(protectSheet, { isActive: args.isActive });
            this.parent.notify(protectSelection, null);
        }
    };
    ProtectSheet.prototype.createDialogue = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        var listData = [
            { text: l10n.getConstant('SelectCells'), id: '1' },
            { text: l10n.getConstant('FormatCells'), id: '2' },
            { text: l10n.getConstant('FormatRows'), id: '3' },
            { text: l10n.getConstant('FormatColumns'), id: '4' },
            { text: l10n.getConstant('InsertLinks'), id: '5' }
        ];
        this.optionList = new ListView({
            width: '250px',
            dataSource: listData,
            showCheckBox: true,
            select: this.dialogOpen.bind(this),
        });
        var protectHeaderCntent = this.parent.createElement('div', { className: 'e-protect-content',
            innerHTML: l10n.getConstant('ProtectAllowUser') });
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', false);
        var checkbox = new CheckBox({ checked: true, label: l10n.getConstant('ProtectContent'), cssClass: 'e-protect-checkbox' });
        var listViewElement = this.parent.createElement('div', { className: 'e-protect-option-list',
            id: this.parent.element.id + '_option_list' });
        var headerContent = this.parent.createElement('div', { className: 'e-header-content', innerHTML: l10n.getConstant('ProtectSheet') });
        var checkBoxElement = this.parent.createElement('input', { id: this.parent.element.id + '_protect_check', attrs: { type: 'checkbox' } });
        this.dialog = this.parent.serviceLocator.getService('dialog');
        this.dialog.show({
            header: headerContent.outerHTML,
            content: checkBoxElement.outerHTML + protectHeaderCntent.outerHTML + listViewElement.outerHTML,
            showCloseIcon: true, isModal: true,
            cssClass: 'e-protect-dlg',
            beforeOpen: function (args) {
                var dlgArgs = {
                    dialogName: 'ProtectSheetDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                _this.parent.element.focus();
            },
            open: function () {
                _this.okBtnFocus();
            },
            beforeClose: function () {
                var checkboxElement = document.getElementById(_this.parent.element.id + '_protect_check');
                EventHandler.remove(checkboxElement, 'focus', _this.okBtnFocus);
                EventHandler.remove(checkbox.element, 'click', _this.checkBoxClickHandler);
                _this.parent.element.focus();
            },
            buttons: [{ click: (this.selectOption.bind(this, this.dialog, this)),
                    buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true } }]
        });
        checkbox.appendTo('#' + this.parent.element.id + '_protect_check');
        this.optionList.appendTo('#' + this.parent.element.id + '_option_list');
        this.optionList.selectMultipleItems([{ id: '1' }]);
        EventHandler.add(checkbox.element, 'click', this.checkBoxClickHandler, this);
    };
    ;
    ProtectSheet.prototype.okBtnFocus = function () {
        var _this = this;
        var checkboxElement = document.getElementById(this.parent.element.id + '_protect_check');
        checkboxElement.addEventListener('focus', function () {
            _this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
        });
    };
    ProtectSheet.prototype.checkBoxClickHandler = function () {
        var ch = document.getElementById(this.parent.element.id + '_protect_check');
        if (ch.checked === false) {
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').disabled = true;
        }
        else {
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').disabled = false;
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
        }
    };
    ProtectSheet.prototype.dialogOpen = function () {
        this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
    };
    ProtectSheet.prototype.selectOption = function () {
        var l10n = this.parent.serviceLocator.getService(locale);
        var selectedItems = this.optionList.getSelectedItems();
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', true);
        var protectSettings = { selectCells: selectedItems.text.indexOf(l10n.getConstant('SelectCells')) > -1,
            formatCells: selectedItems.text.indexOf(l10n.getConstant('FormatCells')) > -1,
            formatRows: selectedItems.text.indexOf(l10n.getConstant('FormatRows')) > -1,
            formatColumns: selectedItems.text.indexOf(l10n.getConstant('FormatColumns')) > -1,
            insertLink: selectedItems.text.indexOf(l10n.getConstant('InsertLinks')) > -1 };
        this.parent.protectSheet(null, protectSettings);
        this.parent.notify(protectSelection, null);
        this.parent.notify(clearUndoRedoCollection, null);
        this.dialog.hide();
    };
    ProtectSheet.prototype.protectSheetHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        var id = this.parent.element.id;
        var disableHomeBtnId = [id + '_undo', id + '_redo', id + '_cut', id + '_copy', id + '_paste', id + '_number_format',
            id + '_font_name', id + '_font_size', id + '_bold', id + '_italic', id + '_line-through', id + '_underline',
            id + '_font_color_picker', id + '_fill_color_picker', id + '_borders', id + '_merge_cells', id + '_text_align',
            id + '_vertical_align', id + '_wrap', id + '_sorting', id + '_clear', id + '_conditionalformatting'];
        var enableHomeBtnId = [id + '_cut', id + '_copy', id + '_number_format', id + '_font_name', id + '_font_size',
            id + '_bold', id + '_italic', id + '_line-through', id + '_underline', id + '_font_color_picker', id + '_fill_color_picker',
            id + '_borders', id + '_text_align', id + '_vertical_align', id + '_wrap', id + '_sorting',
            id + '_clear', id + '_conditionalformatting'];
        var enableFrmlaBtnId = [id + '_insert_function'];
        var enableInsertBtnId = [id + '_hyperlink', id + '_', id + '_chart'];
        var imageBtnId = [id + '_'];
        var findBtnId = [id + '_find'];
        var dataValidationBtnId = [id + '_datavalidation'];
        var chartBtnId = [id + '_chart'];
        var sheetElement = document.getElementById(this.parent.element.id + '_sheet_panel');
        if (sheetElement) {
            if ((sheet.isProtected && sheet.protectSettings.selectCells)) {
                {
                    sheetElement.classList.remove('e-protected');
                }
            }
            else {
                sheetElement.classList.add('e-protected');
            }
            if (!sheet.isProtected) {
                sheetElement.classList.remove('e-protected');
            }
        }
        this.parent.dataBind();
        this.parent.notify(protectCellFormat, { disableHomeBtnId: disableHomeBtnId,
            enableHomeBtnId: enableHomeBtnId, enableFrmlaBtnId: enableFrmlaBtnId, enableInsertBtnId: enableInsertBtnId,
            findBtnId: findBtnId, dataValidationBtnId: dataValidationBtnId, imageBtnId: imageBtnId, chartBtnId: chartBtnId });
        this.parent.notify(enableFormulaInput, null);
        this.parent.notify(updateToggleItem, { props: 'Protect' });
    };
    ProtectSheet.prototype.editProtectedAlert = function () {
        var _this = this;
        var l10n = this.parent.serviceLocator.getService(locale);
        this.dialog = this.parent.serviceLocator.getService('dialog');
        this.dialog.show({
            content: l10n.getConstant('EditAlert'),
            isModal: true,
            closeOnEscape: true,
            showCloseIcon: true,
            width: '400px',
            cssClass: 'e-editAlert-dlg',
            beforeOpen: function (args) {
                var dlgArgs = {
                    dialogName: 'EditAlertDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                _this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                _this.parent.element.focus();
            },
            close: function () { return _this.parent.element.focus(); }
        });
    };
    ProtectSheet.prototype.lockCellsHandler = function (args) {
        var sheet = this.parent.getActiveSheet();
        var cellObj = { isLocked: args.isLocked ? args.isLocked : false };
        setCell(args.rowIdx, args.colIdx, sheet, cellObj, true);
    };
    /**
     * Get the module name.
     * @returns string
     *
     * @private
     */
    ProtectSheet.prototype.getModuleName = function () {
        return 'protectSheet';
    };
    return ProtectSheet;
}());
export { ProtectSheet };
