import { createElement, isNullOrUndefined, addClass, removeClass, closest, isBlazor, select } from '@syncfusion/ej2-base';
import { EventHandler, setStyleAttribute, extend } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { Tab } from '@syncfusion/ej2-navigations';
import * as events from '../../common/base/constant';
import { PivotUtil } from '../../base/util';
/**
 * Module to render Pivot Field List Dialog
 */
/** @hidden */
var DialogRenderer = /** @class */ (function () {
    /** Constructor for render module */
    function DialogRenderer(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the field list layout rendering
     * @returns void
     * @private
     */
    DialogRenderer.prototype.render = function () {
        var fieldListWrappper = createElement('div', {
            id: this.parent.element.id + '_Wrapper',
            className: cls.WRAPPER_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_WRAPPER_CLASS : ''),
            styles: 'width:' + this.parent.element.style.width
        });
        if (this.parent.isAdaptive) {
            addClass([fieldListWrappper], cls.DEVICE);
        }
        else {
            removeClass([fieldListWrappper], cls.DEVICE);
        }
        if (this.parent.enableRtl) {
            addClass([fieldListWrappper], cls.RTL);
        }
        else {
            removeClass([fieldListWrappper], cls.RTL);
        }
        if (this.parent.cssClass) {
            addClass([fieldListWrappper], this.parent.cssClass);
        }
        this.parentElement = createElement('div', { className: cls.CONTAINER_CLASS });
        this.parent.element.appendChild(fieldListWrappper);
        if (this.parent.isAdaptive) {
            fieldListWrappper.removeAttribute('style');
            this.parentElement = createElement('div', { className: cls.ADAPTIVE_CONTAINER_CLASS });
            this.renderAdaptiveLayout(fieldListWrappper);
        }
        if (this.parent.renderMode === 'Popup') {
            this.renderFieldListDialog(fieldListWrappper);
            this.unWireDialogEvent(this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS));
            this.wireDialogEvent(this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS));
        }
        else {
            this.renderStaticLayout(fieldListWrappper);
        }
    };
    DialogRenderer.prototype.renderStaticLayout = function (fieldListWrappper) {
        if (!this.parent.isAdaptive) {
            var layoutHeader = createElement('div', {
                className: cls.FIELD_LIST_TITLE_CLASS
            });
            var headerContent = createElement('div', {
                className: cls.FIELD_LIST_TITLE_CONTENT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('staticFieldList')
            });
            layoutHeader.appendChild(headerContent);
            layoutHeader.appendChild(this.createCalculatedButton());
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            fieldListWrappper.appendChild(layoutHeader);
            fieldListWrappper.appendChild(this.parentElement);
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            if (this.parent.allowDeferLayoutUpdate) {
                fieldListWrappper.appendChild(this.createDeferUpdateButtons());
                this.renderDeferUpdateButtons();
            }
        }
    };
    DialogRenderer.prototype.renderDeferUpdateButtons = function () {
        if (this.parent.allowDeferLayoutUpdate) {
            this.deferUpdateCheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('deferLayoutUpdate'),
                checked: true,
                enableRtl: this.parent.enableRtl,
                change: this.onCheckChange.bind(this)
            });
            this.deferUpdateCheckBox.isStringTemplate = true;
            this.deferUpdateCheckBox.appendTo('#' + this.parent.element.id + 'DeferUpdateCheckBox');
            this.deferUpdateApplyButton = new Button({
                cssClass: cls.DEFER_APPLY_BUTTON + ' ' + cls.DEFER_UPDATE_BUTTON + (this.parent.renderMode === 'Popup' ?
                    (' ' + cls.BUTTON_FLAT_CLASS) : ''),
                content: this.parent.localeObj.getConstant('apply'),
                enableRtl: this.parent.enableRtl,
                isPrimary: true
            });
            this.deferUpdateApplyButton.isStringTemplate = true;
            this.deferUpdateApplyButton.appendTo('#' + this.parent.element.id + '_DeferUpdateButton1');
            this.deferUpdateApplyButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.applyButtonClick.bind(this) :
                this.onDeferUpdateClick.bind(this);
        }
        this.deferUpdateCancelButton = new Button({
            cssClass: cls.DEFER_CANCEL_BUTTON + ' ' + cls.CANCEL_BUTTON_CLASS + (this.parent.renderMode === 'Popup' ?
                (' ' + cls.BUTTON_FLAT_CLASS) : ''),
            content: this.parent.allowDeferLayoutUpdate ? this.parent.localeObj.getConstant('cancel') :
                this.parent.localeObj.getConstant('close'),
            enableRtl: this.parent.enableRtl, isPrimary: !this.parent.allowDeferLayoutUpdate
        });
        this.deferUpdateCancelButton.isStringTemplate = true;
        this.deferUpdateCancelButton.appendTo('#' + this.parent.element.id + '_DeferUpdateButton2');
        this.deferUpdateCancelButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.cancelButtonClick.bind(this) :
            this.onCloseFieldList.bind(this);
    };
    DialogRenderer.prototype.createDeferUpdateButtons = function () {
        var layoutFooter = createElement('div', {
            className: cls.LAYOUT_FOOTER
        });
        if (this.parent.allowDeferLayoutUpdate) {
            var checkBoxLayout = createElement('div', {
                className: cls.CHECKBOX_LAYOUT
            });
            var deferUpdateCheckBox = createElement('input', {
                id: this.parent.element.id + 'DeferUpdateCheckBox'
            });
            checkBoxLayout.appendChild(deferUpdateCheckBox);
            layoutFooter.appendChild(checkBoxLayout);
        }
        var buttonLayout = createElement('div', {
            className: cls.BUTTON_LAYOUT
        });
        if (this.parent.allowDeferLayoutUpdate) {
            var deferUpdateButton1 = createElement('button', {
                id: this.parent.element.id + '_DeferUpdateButton1', attrs: { 'type': 'button' }
            });
            buttonLayout.appendChild(deferUpdateButton1);
        }
        var deferUpdateButton2 = createElement('button', {
            id: this.parent.element.id + '_DeferUpdateButton2', attrs: { 'type': 'button' }
        });
        buttonLayout.appendChild(deferUpdateButton2);
        layoutFooter.appendChild(buttonLayout);
        return layoutFooter;
    };
    DialogRenderer.prototype.onCheckChange = function (args) {
        if (args.checked) {
            this.parent.clonedDataSource = extend({}, this.parent.dataSourceSettings, null, true);
            this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true);
        }
        this.parent.allowDeferLayoutUpdate = !this.parent.allowDeferLayoutUpdate;
        if (this.parent.renderMode === 'Fixed') {
            this.deferUpdateApplyButton.setProperties({ disabled: !this.parent.allowDeferLayoutUpdate });
            this.deferUpdateCancelButton.setProperties({ disabled: !this.parent.allowDeferLayoutUpdate });
        }
        else {
            if (this.parent.allowDeferLayoutUpdate) {
                this.deferUpdateApplyButton.element.style.display = '';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('cancel') });
                this.deferUpdateCancelButton.isPrimary = false;
            }
            else {
                this.deferUpdateApplyButton.element.style.display = 'none';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('close') });
                this.deferUpdateCancelButton.isPrimary = true;
            }
        }
        this.cancelButtonClick();
    };
    DialogRenderer.prototype.applyButtonClick = function () {
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.allowDeferLayoutUpdate) {
            this.parent.pivotChange = false;
        }
        this.parent.updateDataSource(false);
        var parent = this.parent;
        //setTimeout(() => {
        parent.axisFieldModule.render();
        parent.clonedDataSource = extend({}, parent.dataSourceSettings, null, true);
        parent.clonedFieldList = extend({}, parent.pivotFieldList, null, true);
        //});
    };
    DialogRenderer.prototype.cancelButtonClick = function () {
        /* tslint:disable:align */
        if (isBlazor() && !this.parent.isPopupView) {
            /* tslint:disable-next-line:max-line-length */
            PivotUtil.updateDataSourceSettings(this.parent, PivotUtil.getClonedDataSourceSettings(this.parent.clonedDataSource.properties));
        }
        else {
            this.parent.
                setProperties({
                dataSourceSettings: this.parent.clonedDataSource.properties
            }, true);
        }
        /* tslint:enable:align */
        if (this.parent.dataType === 'olap') {
            this.parent.olapEngineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true);
            for (var _i = 0, _a = Object.keys(this.parent.clonedFieldList); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var item = this.parent.clonedFieldList[name_1];
                this.parent.olapEngineModule.updateFieldlistData(item.id, item.isSelected);
            }
        }
        else {
            this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true);
        }
        this.parent.updateDataSource(false, true);
    };
    DialogRenderer.prototype.renderFieldListDialog = function (fieldListWrappper) {
        var toggleFieldList = createElement('div', {
            className: cls.TOGGLE_FIELD_LIST_CLASS + ' ' + cls.ICON + ' ' + cls.TOGGLE_SELECT_CLASS,
            attrs: {
                'tabindex': '0',
                title: this.parent.localeObj.getConstant('fieldList'),
                'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('fieldList')
            }
        });
        this.parent.element.appendChild(toggleFieldList);
        if (this.parent.isAdaptive) {
            var headerTemplate = '<div class=' + cls.TITLE_MOBILE_HEADER + '><span class="' + cls.ICON + ' ' +
                cls.BACK_ICON + '"></span><div class=' + cls.TITLE_MOBILE_CONTENT + '>' + this.parent.localeObj.getConstant('fieldList') +
                '</div></div>';
            var buttons = [{
                    click: this.showFieldListDialog.bind(this),
                    buttonModel: {
                        cssClass: cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS,
                        iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
                        isPrimary: true
                    }
                }, {
                    click: this.showCalculatedField.bind(this),
                    buttonModel: {
                        cssClass: cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                            ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + ' ' + cls.ICON_DISABLE,
                        iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS, enableRtl: this.parent.enableRtl,
                        isPrimary: true
                    }
                }];
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: this.parent.enableRtl ? 'SlideRight' : 'SlideLeft' },
                header: headerTemplate,
                content: this.parentElement,
                isModal: true,
                showCloseIcon: false,
                visible: false,
                allowDragging: false,
                closeOnEscape: false,
                enableRtl: this.parent.enableRtl,
                width: '100%',
                height: '100%',
                position: { X: 'center', Y: 'center' },
                buttons: buttons,
                target: document.body,
                close: this.removeFieldListIcon.bind(this),
                open: this.dialogOpen.bind(this)
            });
            this.fieldListDialog.isStringTemplate = true;
            this.fieldListDialog.appendTo(fieldListWrappper);
            // this.fieldListDialog.element.querySelector('.e-dlg-header').innerHTML = headerTemplate;
            setStyleAttribute(select('#' + fieldListWrappper.id + '_dialog-content', fieldListWrappper), {
                'padding': '0'
            });
            var footer = fieldListWrappper.querySelector('.' + cls.FOOTER_CONTENT_CLASS);
            addClass([footer], cls.FIELD_LIST_FOOTER_CLASS);
            removeClass([footer.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], cls.BUTTON_FLAT_CLASS);
            removeClass([footer.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.BUTTON_FLAT_CLASS);
            this.fieldListDialog.element.querySelector('.' + cls.BACK_ICON).onclick =
                this.parent.allowDeferLayoutUpdate ? this.onDeferUpdateClick.bind(this) : this.onCloseFieldList.bind(this);
        }
        else {
            var template = this.createDeferUpdateButtons().outerHTML;
            var headerTemplate = '<div class=' + cls.TITLE_HEADER_CLASS + '><div class=' +
                cls.TITLE_CONTENT_CLASS + '>' + this.parent.localeObj.getConstant('fieldList') + '</div></div>';
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: 'Zoom' },
                header: headerTemplate,
                content: this.parentElement,
                isModal: false,
                showCloseIcon: false,
                visible: false,
                allowDragging: true,
                enableRtl: this.parent.enableRtl,
                width: this.parent.element.style.width,
                position: { X: 'center', Y: this.parent.element.offsetTop },
                footerTemplate: template,
                closeOnEscape: false,
                target: !isNullOrUndefined(this.parent.target) ? ((typeof this.parent.target) === 'string') ?
                    document.querySelector(this.parent.target) : this.parent.target : document.body,
                close: this.removeFieldListIcon.bind(this)
            });
            this.fieldListDialog.isStringTemplate = true;
            this.fieldListDialog.appendTo(fieldListWrappper);
            // this.fieldListDialog.element.querySelector('.e-dlg-header').innerHTML = headerTemplate;
            // this.fieldListDialog.element.querySelector('.e-footer-content').innerHTML = template;
            this.renderDeferUpdateButtons();
            setStyleAttribute(select('#' + fieldListWrappper.id + '_title', fieldListWrappper), { 'width': '100%' });
            fieldListWrappper.querySelector('.' + cls.TITLE_HEADER_CLASS).appendChild(this.createCalculatedButton());
        }
    };
    DialogRenderer.prototype.dialogOpen = function () {
        this.adaptiveElement.refresh();
    };
    /**
     * Called internally if any of the field added to axis.
     * @hidden
     */
    DialogRenderer.prototype.updateDataSource = function (selectedNodes) {
        var axis = ['filters', 'columns', 'rows', 'values'];
        for (var _i = 0, selectedNodes_1 = selectedNodes; _i < selectedNodes_1.length; _i++) {
            var field = selectedNodes_1[_i];
            var fieldName = field;
            var droppedClass = axis[this.adaptiveElement.selectedItem];
            this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ?
                this.parent : (this.parent.pivotGridModule ?
                this.parent.pivotGridModule : this.parent);
            this.parent.pivotCommon.dataSourceUpdate.updateDataSource(fieldName, droppedClass, -1);
        }
        this.parent.axisFieldModule.render();
        if (!this.parent.allowDeferLayoutUpdate) {
            this.parent.updateDataSource(true);
        }
        else {
            this.parent.triggerPopulateEvent();
        }
    };
    DialogRenderer.prototype.onDeferUpdateClick = function () {
        this.parent.updateDataSource();
        this.parent.dialogRenderer.fieldListDialog.hide();
    };
    DialogRenderer.prototype.renderAdaptiveLayout = function (fieldListWrappper) {
        var layoutFooter = createElement('div', {
            className: cls.FIELD_LIST_FOOTER_CLASS
        });
        fieldListWrappper.appendChild(this.parentElement);
        var items = [
            {
                header: { 'text': this.parent.localeObj.getConstant('filters') },
                content: this.createAxisTable('filters')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('columns') },
                content: this.createAxisTable('columns')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('rows') },
                content: this.createAxisTable('rows')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('values') },
                content: this.createAxisTable('values')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('createCalculatedField') },
                content: 'Calculated Field Related UI'
            }
        ];
        if (!this.parent.allowCalculatedField) {
            items.pop();
        }
        this.adaptiveElement = new Tab({
            heightAdjustMode: 'Auto',
            items: items,
            height: '100%',
            enableRtl: this.parent.enableRtl,
            selected: this.tabSelect.bind(this)
        });
        if (this.parent.renderMode === 'Fixed') {
            layoutFooter.appendChild(this.createAddButton());
            addClass([fieldListWrappper], cls.STATIC_FIELD_LIST_CLASS);
            this.adaptiveElement.isStringTemplate = true;
            this.adaptiveElement.appendTo(this.parentElement);
            this.parentElement.appendChild(layoutFooter);
        }
        else {
            this.adaptiveElement.isStringTemplate = true;
            this.adaptiveElement.appendTo(this.parentElement);
        }
    };
    DialogRenderer.prototype.tabSelect = function (e) {
        var fieldWrapper = closest(this.parentElement, '.' + cls.WRAPPER_CLASS);
        if (fieldWrapper && fieldWrapper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)) {
            if (e.selectedIndex !== 4) {
                addClass([fieldWrapper.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], cls.ICON_DISABLE);
                removeClass([fieldWrapper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.ICON_DISABLE);
            }
            else {
                removeClass([fieldWrapper.querySelector('.' + cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], cls.ICON_DISABLE);
                addClass([fieldWrapper.querySelector('.' + cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], cls.ICON_DISABLE);
            }
        }
        if (e.selectedIndex === 4) {
            this.adaptiveElement.items[4].content = '';
            this.adaptiveElement.dataBind();
            this.parent.notify(events.initCalculatedField, {});
        }
        else {
            this.parent.axisFieldModule.render();
        }
    };
    DialogRenderer.prototype.createCalculatedButton = function () {
        var calculatedButton = createElement('button', {
            id: this.parent.element.id + '_CalculatedField',
            attrs: {
                'type': 'button',
                'tabindex': '0',
                'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('CalculatedField')
            }
        });
        var calculateField = new Button({
            cssClass: cls.CALCULATED_FIELD_CLASS + ' ' + cls.ICON_DISABLE,
            content: this.parent.localeObj.getConstant('CalculatedField'),
            enableRtl: this.parent.enableRtl
        });
        calculateField.isStringTemplate = true;
        calculateField.appendTo(calculatedButton);
        if (this.parent.calculatedFieldModule) {
            removeClass([calculatedButton], cls.ICON_DISABLE);
        }
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        return calculatedButton;
    };
    DialogRenderer.prototype.createAddButton = function () {
        var footerContainer = createElement('div', {
            className: cls.FIELD_LIST_FOOTER_CLASS + '-content'
        });
        var fieldListButton = createElement('div', {});
        var calculatedButton = createElement('div', {});
        var calculateField = new Button({
            cssClass: cls.ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS + ' ' + cls.ICON_DISABLE,
            iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        var fieldList = new Button({
            cssClass: cls.ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + cls.BUTTON_SMALL_CLASS + ' ' + cls.BUTTON_ROUND_CLASS,
            iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        fieldList.isStringTemplate = true;
        fieldList.appendTo(fieldListButton);
        calculateField.isStringTemplate = true;
        calculateField.appendTo(calculatedButton);
        footerContainer.appendChild(fieldListButton);
        footerContainer.appendChild(calculatedButton);
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        fieldList.element.onclick = this.showFieldListDialog.bind(this);
        return footerContainer;
    };
    DialogRenderer.prototype.createAxisTable = function (axis) {
        var axisWrapper = createElement('div', {
            className: cls.FIELD_LIST_CLASS + '-' + axis
        });
        var axisContent = createElement('div', { className: cls.AXIS_CONTENT_CLASS + ' ' + 'e-' + axis });
        var axisPrompt = createElement('span', {
            className: cls.AXIS_PROMPT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('addPrompt')
        });
        axisWrapper.appendChild(axisContent);
        axisWrapper.appendChild(axisPrompt);
        return axisWrapper;
    };
    DialogRenderer.prototype.showCalculatedField = function (event) {
        if (!this.parent.isAdaptive) {
            if (this.parent.dialogRenderer.fieldListDialog) {
                this.parent.dialogRenderer.fieldListDialog.hide();
                addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
            }
        }
        this.parent.notify(events.initCalculatedField, {});
    };
    DialogRenderer.prototype.showFieldListDialog = function (event) {
        var activeindex = this.adaptiveElement.selectedItem;
        this.parent.treeViewModule.render(activeindex);
    };
    DialogRenderer.prototype.onShowFieldList = function () {
        if (this.parent.allowDeferLayoutUpdate) {
            if (this.parent.isAdaptive) {
                this.parent.axisFieldModule.render();
            }
            this.parent.clonedDataSource = extend({}, this.parent.dataSourceSettings, null, true);
            this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true);
        }
        addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        this.parent.dialogRenderer.fieldListDialog.show();
        this.parent.dialogRenderer.fieldListDialog.element.style.top =
            parseInt(this.parent.dialogRenderer.fieldListDialog.element.style.top, 10) < 0 ?
                '0px' : this.parent.dialogRenderer.fieldListDialog.element.style.top;
    };
    DialogRenderer.prototype.onCloseFieldList = function () {
        if (this.parent.allowDeferLayoutUpdate) {
            this.parent.dataSourceSettings =
                extend({}, this.parent.clonedDataSource.properties, null, true);
            this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            this.parent.pivotGridModule.olapEngineModule = this.parent.olapEngineModule;
            /* tslint:disable:align */
            this.parent.pivotGridModule.
                setProperties({
                dataSourceSettings: this.parent.clonedDataSource.properties
            }, true);
            /* tslint:enable:align */
            if (Object.keys(this.parent.clonedFieldList).length > 0) {
                this.parent.dataType === 'olap' ? this.parent.olapEngineModule.fieldList =
                    extend({}, this.parent.clonedFieldList, null, true) :
                    this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true);
            }
            this.parent.pivotGridModule.notify(events.uiUpdate, this);
            this.parent.pivotGridModule.notify(events.contentReady, this);
        }
        this.parent.dialogRenderer.fieldListDialog.hide();
    };
    DialogRenderer.prototype.removeFieldListIcon = function () {
        if (this.parent.isAdaptive && this.parent.allowCalculatedField && this.parent.calculatedFieldModule) {
            if (this.adaptiveElement && this.adaptiveElement.selectedItem === 4) {
                if (select('#' + this.parent.element.id + 'droppable', this.adaptiveElement.element)) {
                    /* tslint:disable */
                    this.parent.calculatedFieldModule
                        .updateAdaptiveCalculatedField(false);
                    /* tslint:enable */
                }
                else {
                    this.parent.notify(events.initCalculatedField, { edit: false });
                }
            }
        }
        if (!document.getElementById(this.parent.element.id + 'calculateddialog')) {
            removeClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
        }
    };
    DialogRenderer.prototype.keyPress = function (e) {
        var target = e.target;
        if (e.keyCode === 13 && e.target) {
            e.target.click();
            e.preventDefault();
            return;
        }
    };
    DialogRenderer.prototype.wireDialogEvent = function (element) {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.onShowFieldList, this);
    };
    DialogRenderer.prototype.unWireDialogEvent = function (element) {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.onShowFieldList);
    };
    return DialogRenderer;
}());
export { DialogRenderer };
