import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { AddUserDialog } from './add-user-dialog';
import { EnforceProtectionDialog, UnProtectDocumentDialog } from './enforce-protection-dialog';
import { Base64 } from '../editor/editor-helper';
import { ListView } from '@syncfusion/ej2-lists';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
/**
 * @private
 */
var RestrictEditing = /** @class */ (function () {
    function RestrictEditing(documentHelper) {
        var _this = this;
        this.addRemove = true;
        this.protectionType = 'ReadOnly';
        this.restrictFormatting = false;
        this.isShowRestrictPane = false;
        this.isAddUser = false;
        this.usersCollection = ['Everyone'];
        this.closePane = function () {
            _this.restrictPane.style.display = 'none';
            _this.documentHelper.updateViewerSize();
        };
        /* tslint:disable:no-any */
        this.enableFormatting = function (args) {
            _this.restrictFormatting = !args.checked;
        };
        this.stopProtectionTriggered = function (args) {
            if ((isNullOrUndefined(_this.documentHelper.saltValue) || _this.documentHelper.saltValue === '')
                && (isNullOrUndefined(_this.documentHelper.hashValue) || _this.documentHelper.hashValue === '')) {
                _this.documentHelper.owner.editor.unProtectDocument();
                return;
            }
            _this.unProtectDialog.show();
        };
        this.protectionTypeDropChanges = function (args) {
            if (args.value === 'Read only') {
                _this.protectionType = 'ReadOnly';
                _this.userWholeDiv.style.display = 'block';
                _this.enforceProtection.style.marginLeft = '0px';
            }
            else if (args.value === 'Filling in forms') {
                _this.protectionType = 'FormFieldsOnly';
                _this.userWholeDiv.style.display = 'none';
                _this.enforceProtection.style.marginLeft = '8px';
            }
            else {
                _this.protectionType = 'NoProtection';
                _this.addedUser.uncheckAllItems();
                _this.viewer.owner.editor.removeAllEditRestrictions();
            }
            if (args.value === 'Filling in forms') {
                _this.contentDiv1.innerHTML = _this.localObj.getConstant('FormFieldsOnly');
            }
            else {
                _this.contentDiv1.innerHTML = _this.localObj.getConstant('Protected Document');
            }
        };
        this.selectHandler = function (args) {
            if (args.isChecked) {
                _this.viewer.owner.editor.insertEditRangeElement(args.text);
                args.event.target.classList.add('e-check');
            }
            else {
                _this.viewer.owner.editor.removeUserRestrictions(args.text);
            }
        };
        this.highlightClicked = function (args) {
            _this.documentHelper.selection.isHighlightEditRegion = args.checked;
        };
        /* tslint:enable:no-any */
        this.protectDocument = function () {
            _this.enforceProtectionDialog.show();
        };
        this.navigateNextRegion = function () {
            _this.documentHelper.selection.navigateToNextEditingRegion();
        };
        this.showAllRegion = function () {
            _this.documentHelper.selection.showAllEditingRegion();
        };
        this.documentHelper = documentHelper;
        this.addUserDialog = new AddUserDialog(documentHelper, this);
        this.enforceProtectionDialog = new EnforceProtectionDialog(documentHelper, this);
        this.unProtectDialog = new UnProtectDocumentDialog(documentHelper, this);
        this.base64 = new Base64();
    }
    Object.defineProperty(RestrictEditing.prototype, "viewer", {
        get: function () {
            return this.documentHelper.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    RestrictEditing.prototype.showHideRestrictPane = function (isShow) {
        if (isShow) {
            this.localObj = new L10n('documenteditor', this.viewer.owner.defaultLocale);
            this.localObj.setLocale(this.viewer.owner.locale);
            if (!this.restrictPane) {
                this.initPane(this.localObj, true);
            }
            this.restrictPane.style.display = 'block';
            this.isShowRestrictPane = true;
            this.documentHelper.selection.isHighlightEditRegion = true;
            this.wireEvents();
            this.documentHelper.updateViewerSize();
            this.loadPaneValue();
        }
        else {
            this.closePane();
            this.documentHelper.updateFocus();
        }
    };
    RestrictEditing.prototype.initPane = function (localValue, initial) {
        this.restrictPane = createElement('div', { className: 'e-de-restrict-pane', styles: 'display:none' });
        var headerWholeDiv = createElement('div', { className: 'e-de-rp-whole-header' });
        var headerDiv1 = createElement('div', {
            styles: 'width:75%',
            innerHTML: localValue.getConstant('Restrict Editing'), className: 'e-de-rp-header'
        });
        this.closeButton = createElement('button', {
            className: 'e-de-rp-close-icon e-de-close-icon e-btn e-flat e-icon-btn', id: 'close',
            attrs: { type: 'button' }
        });
        headerWholeDiv.appendChild(this.closeButton);
        headerWholeDiv.appendChild(headerDiv1);
        var closeSpan = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.restrictPane.appendChild(headerWholeDiv);
        this.initRestrictEditingPane(localValue);
        this.documentHelper.optionsPaneContainer.setAttribute('style', 'display:inline-flex;');
        this.documentHelper.optionsPaneContainer.insertBefore(this.restrictPane, this.documentHelper.viewerContainer);
    };
    // tslint:disable:max-func-body-length
    RestrictEditing.prototype.initRestrictEditingPane = function (localObj) {
        this.restrictPaneWholeDiv = createElement('div');
        var formatWholeDiv = createElement('div', { className: 'e-de-rp-sub-div' });
        var formatDiv = createElement('div', {
            innerHTML: localObj.getConstant('Formatting restrictions'),
            className: 'e-de-rp-format'
        });
        formatWholeDiv.appendChild(formatDiv);
        var allowFormatting = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.viewer.owner.containerId + '_allowFormat',
        });
        formatWholeDiv.appendChild(allowFormatting);
        this.allowFormat = this.createCheckBox(localObj.getConstant('Allow formatting'), allowFormatting);
        this.restrictPaneWholeDiv.appendChild(formatWholeDiv);
        // Editing restrictions
        var editRestrictWholeDiv = createElement('div', { className: 'e-de-rp-sub-div' });
        var editRestrict = createElement('div', {
            innerHTML: localObj.getConstant('Editing restrictions'),
            className: 'e-de-rp-format'
        });
        editRestrictWholeDiv.appendChild(editRestrict);
        var readOnly = createElement('input', {
            attrs: { type: 'checkbox' },
            id: this.viewer.owner.containerId + '_readOnly'
        });
        var protectionTypeInput = createElement('input', {
            id: this.viewer.owner.containerId + '_readOnly',
            className: 'e-prop-font-style'
        });
        editRestrictWholeDiv.appendChild(protectionTypeInput);
        var protectionTypeValue = ['Read only', 'Filling in forms'];
        this.protectionTypeDrop = new DropDownList({
            dataSource: protectionTypeValue,
            cssClass: 'e-de-prop-dropdown'
        });
        this.protectionTypeDrop.value = 'Read only';
        this.protectionTypeDrop.appendTo(protectionTypeInput);
        // let allowPrint: HTMLInputElement = createElement('input', {
        //     attrs: { type: 'checkbox' },
        //     id: this.viewer.owner.containerId + '_allowPrint'
        // }) as HTMLInputElement;
        // editRestrictWholeDiv.appendChild(allowPrint);
        // this.allowPrint = this.createCheckBox('Allow Printing', allowPrint);
        // let allowCopy: HTMLInputElement = createElement('input', {
        //     attrs: { type: 'checkbox' },
        //     id: this.viewer.owner.containerId + '_allowCopy'
        // }) as HTMLInputElement;
        // editRestrictWholeDiv.appendChild(allowCopy);
        // this.allowCopy = this.createCheckBox('Allow Copy', allowCopy);
        this.restrictPaneWholeDiv.appendChild(editRestrictWholeDiv);
        // User Permissions
        this.userWholeDiv = createElement('div', { className: 'e-de-rp-sub-div' });
        var userDiv = createElement('div', {
            innerHTML: localObj.getConstant('Exceptions Optional'),
            className: 'e-de-rp-format'
        });
        this.userWholeDiv.appendChild(userDiv);
        var subContentDiv = createElement('div', {
            innerHTML: localObj.getConstant('Select Part Of Document And User'),
            styles: 'margin-bottom:8px;'
        });
        this.userWholeDiv.appendChild(subContentDiv);
        var emptyuserDiv = createElement('div', { className: 'e-de-rp-user' });
        this.userWholeDiv.appendChild(emptyuserDiv);
        this.addedUser = new ListView({
            cssClass: 'e-de-user-listView',
            dataSource: [{ text: 'Everyone' }],
            showCheckBox: true,
            select: this.selectHandler
        });
        this.addedUser.appendTo(emptyuserDiv);
        this.addUser = createElement('button', {
            id: this.viewer.owner.containerId + '_addUser',
            className: 'e-btn e-primary e-flat',
            innerHTML: localObj.getConstant('More users') + '...',
            styles: 'margin-top: 3px',
            attrs: { type: 'button' }
        });
        this.userWholeDiv.appendChild(this.addUser);
        this.restrictPaneWholeDiv.appendChild(this.userWholeDiv);
        var lastDiv = createElement('div', { className: 'e-de-rp-enforce' });
        this.restrictPaneWholeDiv.appendChild(lastDiv);
        this.enforceProtection = createElement('button', {
            id: this.viewer.owner.containerId + '_addUser',
            innerHTML: localObj.getConstant('Enforcing Protection'),
            className: 'e-btn e-de-rp-btn-enforce',
            attrs: { type: 'button' }
        });
        lastDiv.appendChild(this.enforceProtection);
        this.restrictPane.appendChild(this.restrictPaneWholeDiv);
        this.stopProtectionDiv = createElement('div', { styles: 'display:none' });
        // tslint:disable-next-line:max-line-length
        var headerDiv = createElement('div', { innerHTML: localObj.getConstant('Your permissions'), className: 'e-de-rp-stop-div1' });
        this.stopProtectionDiv.appendChild(headerDiv);
        // tslint:disable-next-line:max-line-length
        var content = localObj.getConstant('Protected Document');
        this.contentDiv1 = createElement('div', { innerHTML: content, className: 'e-de-rp-stop-div2' });
        this.stopProtectionDiv.appendChild(this.contentDiv1);
        // tslint:disable-next-line:max-line-length
        var contentDiv2 = createElement('div', { innerHTML: localObj.getConstant('You may format text only with certain styles'), className: 'e-de-rp-stop-div3' });
        this.stopProtectionDiv.appendChild(contentDiv2);
        this.stopReadOnlyOptions = createElement('div');
        this.stopProtectionDiv.appendChild(this.stopReadOnlyOptions);
        var navigateNext = createElement('div', { className: 'e-de-rp-enforce-nav' });
        // tslint:disable-next-line:max-line-length
        var navigateNextButton = createElement('button', {
            innerHTML: localObj.getConstant('Find Next Region I Can Edit'), className: 'e-btn e-de-rp-nav-btn',
            attrs: { type: 'button' }
        });
        navigateNext.appendChild(navigateNextButton);
        navigateNextButton.addEventListener('click', this.navigateNextRegion);
        this.stopReadOnlyOptions.appendChild(navigateNext);
        var showAllRegion = createElement('div', { className: 'e-de-rp-enforce-nav' });
        // tslint:disable-next-line:max-line-length
        var showAllRegionButton = createElement('button', {
            innerHTML: localObj.getConstant('Show All Regions I Can Edit'), className: 'e-btn e-de-rp-nav-btn',
            attrs: { type: 'button' }
        });
        showAllRegion.appendChild(showAllRegionButton);
        showAllRegionButton.addEventListener('click', this.showAllRegion);
        this.stopReadOnlyOptions.appendChild(showAllRegion);
        var highlightRegion = createElement('div', { className: 'e-de-rp-enforce-nav e-de-rp-nav-lbl' });
        // tslint:disable-next-line:max-line-length
        var highlightRegionInput = createElement('input', { attrs: { type: 'checkbox' }, className: 'e-btn e-de-rp-nav-btn' });
        highlightRegion.appendChild(highlightRegionInput);
        this.stopReadOnlyOptions.appendChild(highlightRegion);
        this.highlightCheckBox = new CheckBox({ label: localObj.getConstant('Highlight the regions I can edit') }, highlightRegionInput);
        var lastButtonDiv = createElement('div', { className: 'e-de-rp-enforce' });
        this.stopProtection = createElement('button', {
            innerHTML: localObj.getConstant('Stop Protection'),
            className: 'e-btn e-de-rp-btn-stop-enforce',
            attrs: { type: 'button' }
        });
        lastButtonDiv.appendChild(this.stopProtection);
        this.stopProtectionDiv.appendChild(lastButtonDiv);
        this.restrictPane.appendChild(this.stopProtectionDiv);
    };
    RestrictEditing.prototype.showStopProtectionPane = function (show) {
        if (show) {
            this.stopProtectionDiv.style.display = 'block';
            this.restrictPaneWholeDiv.style.display = 'none';
        }
        else {
            this.stopProtectionDiv.style.display = 'none';
            this.restrictPaneWholeDiv.style.display = 'block';
        }
        if (this.documentHelper.protectionType === 'ReadOnly') {
            this.stopReadOnlyOptions.style.display = 'block';
        }
        else {
            this.stopReadOnlyOptions.style.display = 'none';
        }
    };
    RestrictEditing.prototype.wireEvents = function () {
        this.addUser.addEventListener('click', this.addUserDialog.show);
        this.enforceProtection.addEventListener('click', this.protectDocument);
        this.stopProtection.addEventListener('click', this.stopProtectionTriggered);
        this.closeButton.addEventListener('click', this.closePane);
        this.allowFormat.addEventListener('change', this.enableFormatting);
        this.protectionTypeDrop.addEventListener('change', this.protectionTypeDropChanges);
        this.highlightCheckBox.addEventListener('change', this.highlightClicked);
    };
    RestrictEditing.prototype.createCheckBox = function (label, element) {
        var checkBox = new CheckBox({ label: label });
        checkBox.appendTo(element);
        return checkBox;
    };
    RestrictEditing.prototype.loadPaneValue = function () {
        // if (!this.isAddUser) {
        //     this.protectionType = this.documentHelper.protectionType;
        // }
        this.allowFormat.checked = !this.documentHelper.restrictFormatting;
        if (this.documentHelper.protectionType === 'ReadOnly') {
            this.protectionTypeDrop.value = 'Read only';
        }
        else if (this.documentHelper.protectionType === 'FormFieldsOnly') {
            this.protectionTypeDrop.value = 'Filling in forms';
        }
        this.highlightCheckBox.checked = true;
        this.addedUser.enablePersistence = true;
        this.addedUser.dataSource = this.documentHelper.userCollection;
        this.addedUser.refresh();
        this.showStopProtectionPane(this.documentHelper.isDocumentProtected);
    };
    RestrictEditing.prototype.addUserCollection = function () {
        if (this.documentHelper.selection && this.documentHelper.selection.editRangeCollection.length > 0) {
            for (var i = 0; i < this.documentHelper.selection.editRangeCollection.length; i++) {
                var editStart = this.documentHelper.selection.editRangeCollection[i];
                if (editStart.user !== '' && this.usersCollection.indexOf(editStart.user) === -1) {
                    this.usersCollection.push(editStart.user);
                }
                if (editStart.group !== '' && this.usersCollection.indexOf(editStart.group) === -1) {
                    this.usersCollection.push(editStart.group);
                }
            }
        }
        this.addedUser.dataSource = this.usersCollection;
        this.addedUser.refresh();
    };
    RestrictEditing.prototype.updateUserInformation = function () {
        this.addedUser.uncheckAllItems();
        if (this.documentHelper.selection.checkSelectionIsAtEditRegion) {
            var editRange = this.documentHelper.selection.getEditRangeStartElement();
            if (editRange) {
                var index = this.addedUser.dataSource.indexOf(editRange.user);
                if (index > -1) {
                    var listElement = this.addedUser.element.querySelectorAll('li')[index];
                    listElement.querySelector('.e-icons').classList.add('e-check');
                }
                index = this.addedUser.dataSource.indexOf(editRange.group);
                if (index > -1) {
                    var listElement = this.addedUser.element.querySelectorAll('li')[index];
                    listElement.querySelector('.e-icons').classList.add('e-check');
                }
            }
        }
    };
    return RestrictEditing;
}());
export { RestrictEditing };
