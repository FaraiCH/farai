import { L10n, createElement } from '@syncfusion/ej2-base';
import { DialogUtility } from '@syncfusion/ej2-popups';
/**
 * @private
 */
var EnforceProtectionDialog = /** @class */ (function () {
    function EnforceProtectionDialog(documentHelper, owner) {
        var _this = this;
        /**
         * @private
         */
        this.show = function () {
            _this.localeValue = new L10n('documenteditor', _this.viewer.owner.defaultLocale);
            _this.localeValue.setLocale(_this.viewer.owner.locale);
            if (!_this.target) {
                _this.initDialog(_this.localeValue, _this.viewer.owner.enableRtl);
            }
            _this.documentHelper.dialog.header = _this.localeValue.getConstant('Start Enforcing Protection');
            _this.documentHelper.dialog.height = 'auto';
            _this.documentHelper.dialog.content = _this.target;
            _this.documentHelper.dialog.width = 'auto';
            _this.documentHelper.dialog.buttons = [{
                    click: _this.okButtonClick,
                    buttonModel: { content: _this.localeValue.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true }
                },
                {
                    click: _this.hideDialog,
                    buttonModel: { content: _this.localeValue.getConstant('Cancel'), cssClass: 'e-flat' }
                }];
            _this.passwordTextBox.value = '';
            _this.confirmPasswordTextBox.value = '';
            _this.documentHelper.dialog.show();
        };
        this.hideDialog = function () {
            _this.passwordTextBox.value = '';
            _this.confirmPasswordTextBox.value = '';
            _this.documentHelper.dialog.hide();
        };
        /**
         * @private
         */
        this.okButtonClick = function () {
            if (_this.passwordTextBox.value !== _this.confirmPasswordTextBox.value) {
                /* tslint:disable */
                DialogUtility.alert(_this.localeValue.getConstant('Password Mismatch'));
                /* tslint:enable */
            }
            else {
                _this.password = _this.passwordTextBox.value;
                _this.viewer.owner.editor.addProtection(_this.password, _this.owner.protectionType);
            }
        };
        this.documentHelper = documentHelper;
        this.owner = owner;
    }
    Object.defineProperty(EnforceProtectionDialog.prototype, "viewer", {
        get: function () {
            return this.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    EnforceProtectionDialog.prototype.initDialog = function (localValue, isRtl) {
        var instance = this;
        var id = this.viewer.owner.containerId + '_enforce_protection';
        this.target = createElement('div', { id: id, className: 'e-de-enforce' });
        var container = createElement('div');
        // tslint:disable-next-line:max-line-length
        var newPassWord = createElement('div', { className: 'e-de-enforce-dlg-title', innerHTML: localValue.getConstant('Enter new password') });
        // tslint:disable-next-line:max-line-length
        this.passwordTextBox = createElement('input', { attrs: { type: 'password', autofocus: 'true' }, id: this.viewer.owner.containerId + '_display_text', className: 'e-input e-de-enforce-dlg-input' });
        // this.passwordTextBox.addEventListener('keyup', instance.onKeyUpOnDisplayBox);
        container.appendChild(newPassWord);
        container.appendChild(this.passwordTextBox);
        // tslint:disable-next-line:max-line-length
        var confirmPassword = createElement('div', { className: 'e-de-enforce-dlg-title', innerHTML: localValue.getConstant('Reenter new password to confirm') });
        // tslint:disable-next-line:max-line-length
        this.confirmPasswordTextBox = createElement('input', { attrs: { type: 'password' }, id: this.viewer.owner.containerId + '_url_text', className: 'e-input e-de-enforce-dlg-input' });
        container.appendChild(confirmPassword);
        container.appendChild(this.confirmPasswordTextBox);
        this.target.appendChild(container);
    };
    return EnforceProtectionDialog;
}());
export { EnforceProtectionDialog };
/**
 * @private
 */
var UnProtectDocumentDialog = /** @class */ (function () {
    function UnProtectDocumentDialog(documentHelper, owner) {
        var _this = this;
        /**
         * @private
         */
        this.show = function () {
            _this.localObj = new L10n('documenteditor', _this.viewer.owner.defaultLocale);
            _this.localObj.setLocale(_this.viewer.owner.locale);
            if (!_this.target) {
                _this.initDialog(_this.localObj, _this.viewer.owner.enableRtl);
            }
            _this.documentHelper.dialog.header = 'Unprotect Document';
            _this.documentHelper.dialog.height = 'auto';
            _this.documentHelper.dialog.width = 'auto';
            _this.documentHelper.dialog.content = _this.target;
            _this.documentHelper.dialog.buttons = [{
                    click: _this.okButtonClick,
                    buttonModel: { content: _this.localObj.getConstant('Ok'), cssClass: 'e-flat', isPrimary: true }
                },
                {
                    click: _this.hideDialog,
                    buttonModel: { content: _this.localObj.getConstant('Cancel'), cssClass: 'e-flat' }
                }];
            _this.documentHelper.dialog.dataBind();
            _this.passwordTextBox.value = '';
            _this.documentHelper.dialog.show();
        };
        /**
         * @private
         */
        /* tslint:disable:no-any */
        this.okButtonClick = function () {
            var password = _this.passwordTextBox.value;
            if (password === '') {
                return;
            }
            _this.viewer.owner.editor.stopProtection(password);
        };
        /**
         * @private
         */
        this.hideDialog = function () {
            _this.passwordTextBox.value = '';
            _this.documentHelper.dialog.hide();
        };
        this.documentHelper = documentHelper;
        this.owner = owner;
    }
    Object.defineProperty(UnProtectDocumentDialog.prototype, "viewer", {
        get: function () {
            return this.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    UnProtectDocumentDialog.prototype.initDialog = function (localValue, isRtl) {
        var instance = this;
        var id = this.viewer.owner.containerId + '_enforce_protection';
        this.target = createElement('div', { id: id, className: 'e-de-enforce' });
        var container = createElement('div');
        var newPassWord = createElement('div', {
            className: 'e-de-unprotect-dlg-title',
            innerHTML: localValue.getConstant('Password')
        });
        this.passwordTextBox = createElement('input', {
            attrs: { type: 'password' },
            id: this.viewer.owner.containerId + '_display_text', className: 'e-input e-de-enforce-dlg-input'
        });
        // this.passwordTextBox.addEventListener('keyup', instance.onKeyUpOnDisplayBox);
        container.appendChild(newPassWord);
        container.appendChild(this.passwordTextBox);
        this.target.appendChild(container);
    };
    return UnProtectDocumentDialog;
}());
export { UnProtectDocumentDialog };
