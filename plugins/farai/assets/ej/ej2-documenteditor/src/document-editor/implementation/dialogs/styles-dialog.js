import { ListView } from '@syncfusion/ej2-lists';
import { Button } from '@syncfusion/ej2-buttons';
import { createElement, L10n } from '@syncfusion/ej2-base';
/**
 * The Styles dialog is used to create or modify styles.
 */
var StylesDialog = /** @class */ (function () {
    /**
     * @private
     */
    function StylesDialog(documentHelper) {
        var _this = this;
        this.updateStyleNames = function (localValue) {
            var collection = _this.documentHelper.owner.documentHelper.styles.getStyleNames('Paragraph');
            var styleNames = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
            var defaultStyleNames = _this.defaultStyleName(styleNames, localValue);
            var finalList = collection.concat(defaultStyleNames).filter(function (v, i, a) { return a.indexOf(v) === i; });
            return finalList;
        };
        this.defaultStyleName = function (styleNames, localValue) {
            var styleName = [];
            for (var index = 0; index < styleNames.length; index++) {
                styleName.push(styleNames[index]);
            }
            return styleName;
        };
        this.modifyStyles = function () {
            _this.documentHelper.dialog.hide();
            _this.documentHelper.owner.styleDialogModule.show(_this.styleName, _this.localValue.getConstant('Modify Style'));
        };
        /* tslint:disable:no-any */
        this.selectHandler = function (args) {
            _this.styleName = args.text;
        };
        this.addNewStyles = function () {
            _this.documentHelper.dialog.hide();
            _this.documentHelper.owner.styleDialogModule.show();
        };
        this.documentHelper = documentHelper;
    }
    /**
     * @private
     */
    StylesDialog.prototype.getModuleName = function () {
        return 'StylesDialog';
    };
    /**
     * @private
     */
    StylesDialog.prototype.initStylesDialog = function (localValue, styles, isRtl) {
        var instance = this;
        var id = this.documentHelper.owner.containerId + '_insert_styles';
        this.target = createElement('div', { id: id, className: 'e-de-styles' });
        var headerValue = localValue.getConstant('Styles');
        var dlgFields = createElement('div', { innerHTML: headerValue, className: 'e-styles-dlgfields' });
        this.target.appendChild(dlgFields);
        var commonDiv = createElement('div', { className: 'e-styles-common' });
        this.target.appendChild(commonDiv);
        var searchDiv = createElement('div', { className: 'e-styles-list' });
        commonDiv.appendChild(searchDiv);
        if (isRtl) {
            searchDiv.classList.add('e-de-rtl');
        }
        var listviewDiv = createElement('div', { className: 'e-styles-listViewDiv', id: 'styles_listview' });
        searchDiv.appendChild(listviewDiv);
        this.listviewInstance = new ListView({
            dataSource: styles,
            cssClass: 'e-styles-listview',
        });
        this.listviewInstance.appendTo(listviewDiv);
        this.listviewInstance.addEventListener('select', this.selectHandler);
        var buttonDiv = createElement('div', { className: 'e-styles-button' });
        commonDiv.appendChild(buttonDiv);
        var newButtonDiv = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(newButtonDiv);
        var newButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('New') + '...', id: 'new',
            attrs: { type: 'button' }
        });
        newButtonDiv.appendChild(newButtonElement);
        var newbutton = new Button({ cssClass: 'e-button-custom' });
        newbutton.appendTo(newButtonElement);
        newButtonElement.addEventListener('click', this.addNewStyles);
        var modifybuttonDiv = createElement('div', { className: 'e-styles-addbutton' });
        buttonDiv.appendChild(modifybuttonDiv);
        var modifyButtonElement = createElement('button', {
            innerHTML: localValue.getConstant('Modify') + '...', id: 'modify',
            attrs: { type: 'button' }
        });
        modifybuttonDiv.appendChild(modifyButtonElement);
        var addbutton = new Button({ cssClass: 'e-button-custom' });
        addbutton.appendTo(modifyButtonElement);
        modifyButtonElement.addEventListener('click', this.modifyStyles);
    };
    /**
     * @private
     */
    StylesDialog.prototype.show = function () {
        var localValue = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        var styles = this.updateStyleNames(localValue);
        this.localValue = localValue;
        this.initStylesDialog(localValue, styles, this.documentHelper.owner.enableRtl);
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.beforeOpen = this.documentHelper.updateFocus;
        this.documentHelper.dialog.close = this.documentHelper.updateFocus;
        this.documentHelper.dialog.header = localValue.getConstant('Styles');
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = 'auto';
        this.documentHelper.dialog.buttons = [{
                click: this.hideObjects.bind(this),
                buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-hyper-insert', isPrimary: true }
            }];
        this.documentHelper.dialog.dataBind();
        this.documentHelper.dialog.show();
    };
    StylesDialog.prototype.hideObjects = function () {
        this.documentHelper.dialog.hide();
        this.documentHelper.updateFocus();
    };
    /**
     * @private
     */
    StylesDialog.prototype.destroy = function () {
        if (this.listviewInstance) {
            this.listviewInstance.destroy();
            this.listviewInstance = undefined;
        }
    };
    return StylesDialog;
}());
export { StylesDialog };
