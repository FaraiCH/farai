import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, addClass, blazorTemplates, classList, cldrData, closest, compile, detach, extend, getComponent, getInstance, getUniqueID, getValue, isBlazor, isNullOrUndefined, removeClass, resetBlazorTemplate, rippleEffect, select, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Button, RadioButton } from '@syncfusion/ej2-buttons';
import { CheckBoxSelection, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { DataManager, Deferred, Predicate, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Query Builder Source
 */
/**
 * Defines the Columns of Query Builder
 */
class Columns extends ChildProperty {
}
__decorate([
    Property(null)
], Columns.prototype, "field", void 0);
__decorate([
    Property(null)
], Columns.prototype, "label", void 0);
__decorate([
    Property(null)
], Columns.prototype, "type", void 0);
__decorate([
    Property(null)
], Columns.prototype, "values", void 0);
__decorate([
    Property(null)
], Columns.prototype, "operators", void 0);
__decorate([
    Property()
], Columns.prototype, "ruleTemplate", void 0);
__decorate([
    Property(null)
], Columns.prototype, "template", void 0);
__decorate([
    Property({ isRequired: true, min: 0, max: Number.MAX_VALUE })
], Columns.prototype, "validation", void 0);
__decorate([
    Property(null)
], Columns.prototype, "format", void 0);
__decorate([
    Property(null)
], Columns.prototype, "step", void 0);
__decorate([
    Property(null)
], Columns.prototype, "value", void 0);
__decorate([
    Property(null)
], Columns.prototype, "category", void 0);
/**
 * Defines the rule of Query Builder
 */
class Rule extends ChildProperty {
}
__decorate([
    Property(null)
], Rule.prototype, "condition", void 0);
__decorate([
    Collection([], Rule)
], Rule.prototype, "rules", void 0);
__decorate([
    Property(null)
], Rule.prototype, "field", void 0);
__decorate([
    Property(null)
], Rule.prototype, "label", void 0);
__decorate([
    Property(null)
], Rule.prototype, "type", void 0);
__decorate([
    Property(null)
], Rule.prototype, "operator", void 0);
__decorate([
    Property(null)
], Rule.prototype, "value", void 0);
__decorate([
    Property(false)
], Rule.prototype, "not", void 0);
/**
 * Defines the ruleDelete, groupInsert, and groupDelete options of Query Builder.
 */
class ShowButtons extends ChildProperty {
}
__decorate([
    Property(true)
], ShowButtons.prototype, "ruleDelete", void 0);
__decorate([
    Property(true)
], ShowButtons.prototype, "groupInsert", void 0);
__decorate([
    Property(true)
], ShowButtons.prototype, "groupDelete", void 0);
let QueryBuilder = class QueryBuilder extends Component {
    constructor(options, element) {
        super(options, element);
        this.isReadonly = true;
        this.fields = { text: 'label', value: 'field' };
        this.updatedRule = { not: false, condition: 'and' };
        this.isLocale = false;
        this.isRefreshed = false;
        MultiSelect.Inject(CheckBoxSelection);
    }
    getPersistData() {
        return this.addOnPersist(['rule']);
    }
    /**
     * Clears the rules without root rule.
     * @returns void.
     */
    reset() {
        this.isImportRules = false;
        let bodeElem = this.element.querySelector('.e-group-body');
        bodeElem.innerHTML = '';
        if (this.enableNotCondition) {
            removeClass(this.element.querySelectorAll('.e-qb-toggle'), 'e-active-toggle');
        }
        bodeElem.appendChild(this.createElement('div', { attrs: { class: 'e-rule-list' } }));
        this.levelColl[this.element.id + '_group0'] = [0];
        this.rule = { condition: 'and', not: false, rules: [] };
        this.disableRuleCondition(bodeElem.parentElement);
    }
    getWrapper() {
        return this.element;
    }
    getModuleName() {
        return 'query-builder';
    }
    initialize() {
        if (this.dataColl.length) {
            let columnKeys = Object.keys(this.dataColl[0]);
            let cols = [];
            let categories = [];
            let type;
            let groupBy = false;
            let isDate = false;
            let value;
            let validateObj = { isRequired: true, min: 0, max: Number.MAX_VALUE };
            if (this.columns.length) {
                this.columnSort();
                let columns = this.columns;
                for (let i = 0, len = columns.length; i < len; i++) {
                    this.updateCustomOperator(columns[i]);
                    if (!columns[i].type) {
                        if (columnKeys.indexOf(columns[i].field) > -1) {
                            value = this.dataColl[0][columns[i].field];
                            type = typeof value;
                            if (type === 'string') {
                                isDate = !isNaN(Date.parse(value));
                            }
                            else if (type === 'object') {
                                isDate = value instanceof Date && !isNaN(value.getTime());
                                type = 'string';
                            }
                            columns[i].type = type;
                            isDate = false;
                        }
                        type = 'string';
                    }
                    if (!columns[i].validation) {
                        columns[i].validation = validateObj;
                    }
                    if (columns[i].category) {
                        groupBy = true;
                    }
                    else {
                        columns[i].category = this.l10n.getConstant('OtherFields');
                    }
                    if (categories.indexOf(columns[i].category) < 0) {
                        categories.push(columns[i].category);
                    }
                    if (!columns[i].operators || this.isLocale) {
                        columns[i].operators = this.customOperators[columns[i].type + 'Operator'];
                    }
                }
                if (groupBy && (categories.length > 1 || categories[0] !== this.l10n.getConstant('OtherFields'))) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                }
            }
            else {
                for (let i = 0, len = columnKeys.length; i < len; i++) {
                    value = this.dataColl[0][columnKeys[i]];
                    type = typeof value;
                    if (type === 'string') {
                        isDate = !isNaN(Date.parse(value));
                    }
                    else if (type === 'object') {
                        isDate = value instanceof Date && !isNaN(value.getTime());
                        type = 'string';
                    }
                    cols[i] = { 'field': columnKeys[i], 'label': columnKeys[i], 'type': isDate ? 'date' : type,
                        'validation': validateObj };
                    isDate = false;
                    cols[i].operators = this.customOperators[cols[i].type + 'Operator'];
                }
                this.columns = cols;
            }
        }
        else if (this.columns.length) {
            let columns = this.columns;
            for (let i = 0, len = columns.length; i < len; i++) {
                if (columns[i].category) {
                    this.fields = { text: 'label', value: 'field', groupBy: 'category' };
                }
                else {
                    columns[i].category = this.l10n.getConstant('OtherFields');
                }
                this.updateCustomOperator(columns[i]);
                if (!columns[i].operators || this.isLocale) {
                    columns[i].operators = this.customOperators[columns[i].type + 'Operator'];
                }
            }
        }
    }
    updateCustomOperator(column) {
        if (column.operators) {
            for (let j = 0; j < column.operators.length; j++) {
                let sqlIdx = Object.keys(column.operators[j]).indexOf('sqlOperator');
                if (sqlIdx > -1) {
                    let operator = column.operators[j];
                    let operColl = Object.keys(operator);
                    let values = operColl.map((key) => operator[key]).join(',').split(',');
                    let valueIdx = operColl.indexOf('value');
                    this.operators[values[valueIdx]] = values[sqlIdx];
                }
            }
        }
    }
    focusEventHandler(event) {
        this.target = event.target;
    }
    clickEventHandler(event) {
        let target = event.target;
        let args;
        this.isImportRules = false;
        let groupID;
        if (target.tagName === 'SPAN') {
            target = target.parentElement;
        }
        if (target.className.indexOf('e-collapse-rule') > -1) {
            let animation = new Animation({ duration: 1000, delay: 0 });
            if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                this.renderSummary();
            }
            let summaryElem = document.getElementById(this.element.id + '_summary_content');
            let txtareaElem = summaryElem.querySelector('.e-summary-text');
            animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
            let groupElem = this.element.querySelector('.e-group-container');
            groupElem.style.display = 'none';
            txtareaElem.textContent = this.getSqlFromRules(this.rule);
            summaryElem.style.display = 'block';
            txtareaElem.style.height = txtareaElem.scrollHeight + 'px';
        }
        if (target.tagName === 'BUTTON' && target.className.indexOf('e-qb-toggle') < 0) {
            if (target.className.indexOf('e-removerule') > -1) {
                this.actionButton = target;
                this.deleteRule(target);
            }
            else if (target.className.indexOf('e-deletegroup') > -1) {
                this.actionButton = target;
                this.deleteGroup(closest(target, '.e-group-container'));
            }
            else if (target.className.indexOf('e-edit-rule') > -1) {
                let animation = new Animation({ duration: 1000, delay: 0 });
                animation.animate('.e-query-builder', { name: 'SlideLeftIn' });
                document.getElementById(this.element.id + '_summary_content').style.display = 'none';
                if (this.element.querySelectorAll('.e-group-container').length < 1) {
                    this.addGroupElement(false, this.element, this.rule.condition);
                    let mRules = extend({}, this.rule, {}, true);
                    this.setGroupRules(mRules);
                    this.renderSummaryCollapse();
                }
                else {
                    let groupElem = this.element.querySelector('.e-group-container');
                    if (groupElem.querySelectorAll('.e-collapse-rule').length < 1) {
                        this.renderSummaryCollapse();
                    }
                    groupElem.style.display = 'block';
                }
            }
        }
        else if ((target.tagName === 'LABEL' && target.parentElement.className.indexOf('e-btn-group') > -1) ||
            target.className.indexOf('e-qb-toggle') > -1) {
            let element = closest(target, '.e-group-container');
            let forIdValue = target.getAttribute('for');
            let targetValue;
            if (forIdValue) {
                targetValue = document.getElementById(forIdValue).getAttribute('value');
            }
            groupID = element.id.replace(this.element.id + '_', '');
            let group = this.getGroup(groupID);
            let ariaChecked;
            if (this.enableNotCondition) {
                if (target.className.indexOf('e-qb-toggle') > -1) {
                    let toggleElem = element.getElementsByClassName('e-qb-toggle')[0];
                    if (toggleElem.className.indexOf('e-active-toggle') > -1) {
                        removeClass([toggleElem], 'e-active-toggle');
                        ariaChecked = false;
                    }
                    else {
                        addClass([toggleElem], 'e-active-toggle');
                        ariaChecked = true;
                    }
                    targetValue = group.condition;
                }
                else {
                    ariaChecked = group.not;
                }
            }
            args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase() };
            if (this.enableNotCondition) {
                args = { groupID: groupID, cancel: false, type: 'condition', value: targetValue.toLowerCase(),
                    'not': ariaChecked };
            }
            if (!this.isImportRules) {
                this.trigger('beforeChange', args, (observedChangeArgs) => {
                    this.beforeSuccessCallBack(observedChangeArgs, target);
                });
            }
            else {
                this.beforeSuccessCallBack(args, target);
            }
        }
        this.target = target;
    }
    beforeSuccessCallBack(args, target) {
        if (!args.cancel) {
            let element = closest(target, '.e-group-container');
            let groupID = element.id.replace(this.element.id + '_', '');
            let beforeRules = this.getValidRules(this.rule);
            let rule = this.getParentGroup(element);
            rule.condition = args.value;
            if (this.enableNotCondition) {
                rule.not = args.not;
            }
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, type: 'condition', value: rule.condition });
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'condition');
        }
    }
    selectBtn(target, event) {
        if (event.name === 'beforeOpen') {
            if (this.showButtons.groupInsert) {
                removeClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
            else {
                addClass([event.element.querySelector('li span.e-addgroup').parentElement], 'e-button-hide');
            }
        }
        else if (event.element.children[0].className.indexOf('e-addrule') > -1) {
            this.addRuleElement(closest(target, '.e-group-container'), {});
        }
        else if (event.element.children[0].className.indexOf('e-addgroup') > -1) {
            this.addGroupElement(true, closest(target, '.e-group-container'), '', true);
        }
    }
    appendRuleElem(target, column, type, parentId, action, rule) {
        let ruleElem;
        let elem;
        let ruleListElem = target.querySelector('.e-rule-list');
        let args;
        if (type === 'change') {
            ruleElem = select('#' + parentId, target);
        }
        else {
            ruleElem = this.createElement('div', { attrs: { class: 'e-rule-container' } });
            ruleElem.setAttribute('id', target.id + '_rule' + this.ruleIdCounter);
            ruleListElem.appendChild(ruleElem);
            this.ruleIdCounter++;
        }
        if (column && column.ruleTemplate) {
            args = { requestType: 'template-initialize', ruleID: ruleElem.id, action: action, fields: this.fields, rule: rule };
            this.trigger('actionBegin', args);
            this.ruleTemplateFn = this.templateParser(column.ruleTemplate);
            let templateID = this.element.id + column.field;
            let template;
            args.fields = this.fields;
            args.columns = this.columns;
            args.operators = this.getOperators(rule.field);
            args.operatorFields = { text: 'key', value: 'value' };
            // tslint:disable
            if (this.isReact || this.isAngular) {
                template = this.ruleTemplateFn(args, this, ruleElem.id, templateID);
            }
            else {
                template = this.ruleTemplateFn(args, this, 'Template', templateID);
            }
            elem = template[0];
            elem.className += ' e-rule-field';
        }
        else {
            elem = this.ruleElem.querySelector('.e-rule-field').cloneNode(true);
        }
        ruleElem.appendChild(elem);
        if (column && column.ruleTemplate) {
            this.renderReactTemplates();
        }
        return ruleElem;
    }
    addRuleElement(target, rule, column, action, parentId, isRuleTemplate) {
        if (!target) {
            return;
        }
        let args = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertRule' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, (observedChangeArgs) => {
                this.addRuleSuccessCallBack(observedChangeArgs, target, rule, column, action, parentId, isRuleTemplate);
            });
        }
        else {
            this.isInitialLoad = false;
            this.addRuleSuccessCallBack(args, target, rule, column, action, parentId, isRuleTemplate);
        }
    }
    addRuleSuccessCallBack(args, trgt, rule, col, act, pId, isRlTmp) {
        let height = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
        let ruleID;
        let column = (rule && rule.field) ? this.getColumn(rule.field) : col ? col : this.columns[0];
        let operators;
        let dropDownList;
        let ruleElem;
        let newRule = { 'label': '', 'field': '', 'type': '', 'operator': '' };
        if (!args.cancel) {
            if (column && column.ruleTemplate) {
                this.selectedColumn = column;
                operators = this.selectedColumn.operators;
                newRule = { 'label': column.label, 'field': column.field, 'type': column.type, 'operator': operators[0].value };
                let passedRule = Object.keys(rule).length ? rule : newRule;
                ruleElem = this.appendRuleElem(trgt, column, act, pId, 'field', passedRule);
                let args = { requestType: 'template-create', action: 'insert-rule', ruleID: ruleElem.id,
                    fields: this.fields, rule: passedRule };
                this.trigger('actionBegin', args);
            }
            else {
                ruleElem = this.appendRuleElem(trgt, column, act, pId, 'field');
                ruleElem.querySelector('.e-filter-input').setAttribute('id', ruleElem.id + '_filterkey');
                let element = ruleElem.querySelector('button');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    element.textContent = this.l10n.getConstant('Remove');
                    addClass([element], 'e-flat');
                    addClass([element], 'e-primary');
                }
                else {
                    addClass([element], 'e-round');
                    addClass([element], 'e-icon-btn');
                    let tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteRule') });
                    tooltip.appendTo(element);
                    element = this.createElement('span', { attrs: { class: 'e-btn-icon e-icons e-delete-icon' } });
                    ruleElem.querySelector('button').appendChild(element);
                }
            }
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleElem.className = 'e-rule-container e-vertical-mode';
            }
            else {
                ruleElem.className = 'e-rule-container e-horizontal-mode';
            }
            if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-rule-container') > -1) {
                if (ruleElem.className.indexOf('e-joined-rule') < 0) {
                    ruleElem.className += ' e-joined-rule';
                }
                if (ruleElem.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                    ruleElem.previousElementSibling.className += ' e-prev-joined-rule';
                }
            }
            if (ruleElem.previousElementSibling && ruleElem.previousElementSibling.className.indexOf('e-group-container') > -1 &&
                ruleElem.className.indexOf('e-separate-rule') < 0) {
                ruleElem.className += ' e-separate-rule';
            }
            if (!this.isImportRules) {
                this.updateAddedRule(trgt, rule, newRule, isRlTmp);
            }
            if (!column || (column && !column.ruleTemplate)) {
                dropDownList = new DropDownList({
                    dataSource: this.columns,
                    fields: this.fields, placeholder: this.l10n.getConstant('SelectField'),
                    popupHeight: ((this.columns.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this), value: rule ? rule.field : null
                });
                dropDownList.appendTo('#' + ruleElem.id + '_filterkey');
                this.selectedColumn = dropDownList.getDataByValue(dropDownList.value);
                if (Object.keys(rule).length) {
                    this.changeRule(rule, {
                        element: dropDownList.element,
                        itemData: this.selectedColumn
                    });
                }
            }
            ruleID = ruleElem.id.replace(this.element.id + '_', '');
            if (!this.isImportRules) {
                this.trigger('change', { groupID: trgt.id.replace(this.element.id + '_', ''), ruleID: ruleID, type: 'insertRule' });
            }
        }
    }
    updateAddedRule(target, rule, newRule, isRuleTemplate) {
        let groupElem = closest(target, '.e-group-container');
        let rules = this.getParentGroup(groupElem);
        let ruleElem = closest(target, '.e-rule-container');
        let index = 0;
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        if (isRuleTemplate) {
            rules.rules[index] = rule;
        }
        else {
            if (Object.keys(rule).length) {
                rules.rules.push({
                    'field': rule.field, 'type': rule.type, 'label': rule.label, 'operator': rule.operator, value: rule.value
                });
            }
            else {
                rules.rules.push(newRule);
            }
        }
        this.disableRuleCondition(target, rules);
    }
    // tslint:disable-next-line:no-any
    changeRuleTemplate(column, element, rule, type) {
        let operVal = this.selectedColumn.operators;
        if (column.ruleTemplate) {
            return;
        }
        else {
            let parentId = closest(element, '.e-rule-container').id;
            if (this.previousColumn && this.previousColumn.ruleTemplate) {
                detach(element.closest('[id="' + parentId + '"]').querySelector('.e-rule-field'));
                this.clearQBTemplate([parentId]);
            }
            if (column) {
                let rule = { field: column.field, label: column.label, operator: operVal[0].value, value: '' };
                this.addRuleElement(this.element.querySelector('.e-group-container'), rule, column, 'change', parentId, true);
            }
        }
    }
    renderToolTip(element) {
        let tooltip = new Tooltip({ content: this.l10n.getConstant('ValidationMessage'),
            position: 'BottomCenter', cssClass: 'e-querybuilder-error' });
        tooltip.appendTo(element);
        tooltip.open(element);
    }
    /**
     * Validate the conditions and it display errors for invalid fields.
     * @returns boolean.
     */
    validateFields() {
        let isValid = true;
        if (this.allowValidation) {
            let i;
            let len;
            let fieldElem;
            let indexElem;
            let valArray = [];
            let groupElem;
            let index;
            let dropDownObj;
            let tempElem;
            let rule;
            let ruleElemCln = this.element.querySelectorAll('.e-rule-container');
            let validateRule;
            for (i = 0, len = ruleElemCln.length; i < len; i++) {
                groupElem = closest(ruleElemCln[i], '.e-group-container');
                rule = this.getParentGroup(groupElem);
                index = 0;
                indexElem = tempElem = ruleElemCln[i];
                dropDownObj = getComponent(ruleElemCln[i].querySelector('.e-rule-field input.e-control'), 'dropdownlist');
                this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
                validateRule = !isNullOrUndefined(dropDownObj.index) && this.selectedColumn.validation;
                fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                if (validateRule && validateRule.isRequired) {
                    while (indexElem && indexElem.previousElementSibling !== null) {
                        indexElem = indexElem.previousElementSibling;
                        index++;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-field input.e-control');
                    if (!rule.rules[index].field) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    fieldElem = tempElem.querySelector('.e-rule-operator input.e-control');
                    if (!rule.rules[index].operator) {
                        if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                            this.renderToolTip(fieldElem.parentElement);
                        }
                        isValid = false;
                    }
                    if (rule.rules[index].value instanceof Array) {
                        valArray = rule.rules[index].value;
                    }
                    if (isNullOrUndefined(rule.rules[index].value) || rule.rules[index].value === ''
                        || (rule.rules[index].value instanceof Array && valArray.length < 1)) {
                        let valElem = tempElem.querySelectorAll('.e-rule-value input.e-control');
                        isValid = false;
                        for (let j = 0, jLen = valElem.length; j < jLen; j++) {
                            let element = valElem[j];
                            let elem;
                            if (element.parentElement.className.indexOf('e-searcher') > -1) {
                                elem = closest(element, '.e-multi-select-wrapper');
                                if (elem.className.indexOf('e-tooltip') < 0) {
                                    this.renderToolTip(elem);
                                }
                            }
                            else if (valElem[j].parentElement.className.indexOf('e-tooltip') < 0) {
                                this.renderToolTip(valElem[j].parentElement);
                            }
                            j++;
                        }
                    }
                }
                else if (dropDownObj.element && isNullOrUndefined(dropDownObj.index)) {
                    if (fieldElem.parentElement.className.indexOf('e-tooltip') < 0) {
                        this.renderToolTip(fieldElem.parentElement);
                    }
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    refreshLevelColl() {
        this.levelColl = {};
        let groupElem = this.element.querySelector('.e-group-container');
        this.levelColl[groupElem.id] = [0];
        let obj = { groupElement: groupElem, level: [0] };
        this.refreshLevel(obj);
    }
    refreshLevel(obj) {
        let ruleList = obj.groupElement.querySelector('.e-rule-list').children;
        let childElem;
        let groupElem = obj.groupElement;
        let i;
        let iLen = ruleList.length;
        let groupCount = 0;
        for (i = 0; i < iLen; i++) {
            childElem = ruleList[i];
            if (childElem.className.indexOf('e-group-container') > -1) {
                obj.level.push(groupCount);
                this.levelColl[childElem.id] = obj.level.slice();
                groupCount++;
                obj.groupElement = childElem;
                obj = this.refreshLevel(obj);
            }
        }
        let ruleListElem = closest(groupElem, '.e-rule-list');
        obj.groupElement = ruleListElem ? closest(ruleListElem, '.e-group-container') : groupElem;
        obj.level = this.levelColl[obj.groupElement.id].slice();
        return obj;
    }
    groupTemplate() {
        let groupElem;
        let grpBodyElem;
        let groupHdrElem;
        let rulesElem;
        let glueElem;
        let inputElem;
        let labelElem;
        let grpActElem;
        let groupBtn;
        groupElem = this.createElement('div', { attrs: { class: 'e-group-container' } });
        groupHdrElem = this.createElement('div', { attrs: { class: 'e-group-header' } });
        grpBodyElem = this.createElement('div', { attrs: { class: 'e-group-body' } });
        rulesElem = this.createElement('div', { attrs: { class: 'e-rule-list' } });
        groupElem.appendChild(groupHdrElem);
        grpBodyElem.appendChild(rulesElem);
        groupElem.appendChild(grpBodyElem);
        // create button group in OR and AND process
        glueElem = this.createElement('div', { attrs: { class: 'e-lib e-btn-group' } });
        if (this.enableNotCondition) {
            inputElem = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' } });
            glueElem.appendChild(inputElem);
        }
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-and', value: 'AND' } });
        inputElem.setAttribute('checked', 'true');
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-lib e-btn e-btngroup-and-lbl e-small' },
            innerHTML: this.l10n.getConstant('AND') });
        glueElem.appendChild(labelElem);
        inputElem = this.createElement('input', { attrs: { type: 'radio', class: 'e-btngroup-or', value: 'OR' } });
        glueElem.appendChild(inputElem);
        labelElem = this.createElement('label', { attrs: { class: 'e-lib e-btn e-btngroup-or-lbl e-small' },
            innerHTML: this.l10n.getConstant('OR') });
        glueElem.appendChild(labelElem);
        groupHdrElem.appendChild(glueElem);
        grpActElem = this.createElement('div', { attrs: { class: 'e-group-action' } });
        groupBtn = this.createElement('button', { attrs: { type: 'button', class: 'e-add-btn' } });
        grpActElem.appendChild(groupBtn);
        groupHdrElem.appendChild(grpActElem);
        return groupElem;
    }
    ruleTemplate() {
        let ruleElem;
        let filterElem;
        let tempElem;
        let delBtnElem;
        let fieldElem;
        let clsName;
        ruleElem = this.createElement('div');
        fieldElem = this.createElement('div', { attrs: { class: 'e-rule-field' } });
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-filter' } });
        filterElem = this.createElement('input', { attrs: { type: 'text', class: 'e-filter-input' } });
        tempElem.appendChild(filterElem);
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-operator' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value' } });
        fieldElem.appendChild(tempElem);
        tempElem = this.createElement('div', { attrs: { class: 'e-rule-value-delete' } });
        if (this.showButtons.ruleDelete) {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small';
        }
        else {
            clsName = 'e-removerule e-rule-delete e-css e-btn e-small e-button-hide';
        }
        delBtnElem = this.createElement('button', { attrs: { class: clsName } });
        tempElem.appendChild(delBtnElem);
        fieldElem.appendChild(tempElem);
        ruleElem.appendChild(fieldElem);
        return ruleElem;
    }
    addGroupElement(isGroup, target, condition, isBtnClick) {
        let args = { groupID: target.id.replace(this.element.id + '_', ''), cancel: false, type: 'insertGroup' };
        if (!this.isImportRules && !this.isInitialLoad) {
            this.trigger('beforeChange', args, (observedChangeArgs) => {
                this.addGroupSuccess(observedChangeArgs, isGroup, target, condition, isBtnClick);
            });
        }
        else {
            this.isInitialLoad = false;
            this.addGroupSuccess(args, isGroup, target, condition, isBtnClick);
        }
    }
    addGroupSuccess(args, isGroup, eventTarget, condition, isBtnClick) {
        if (!args.cancel && (this.element.querySelectorAll('.e-group-container').length <= this.maxGroupCount)) {
            let target = eventTarget;
            let dltGroupBtn;
            let groupElem = this.groupElem.cloneNode(true);
            groupElem.setAttribute('id', this.element.id + '_group' + this.groupIdCounter);
            this.groupIdCounter++;
            let andInpElem = groupElem.querySelector('.e-btngroup-and');
            let orInpElem = groupElem.querySelector('.e-btngroup-or');
            let andLblElem = groupElem.querySelector('.e-btngroup-and-lbl');
            let orLblElem = groupElem.querySelector('.e-btngroup-or-lbl');
            let notElem = groupElem.querySelector('.e-qb-toggle');
            andInpElem.setAttribute('id', this.element.id + '_and' + this.btnGroupId);
            orInpElem.setAttribute('id', this.element.id + '_or' + this.btnGroupId);
            andInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
            orInpElem.setAttribute('name', this.element.id + '_and' + this.btnGroupId);
            andLblElem.setAttribute('for', this.element.id + '_and' + this.btnGroupId);
            orLblElem.setAttribute('for', this.element.id + '_or' + this.btnGroupId);
            this.btnGroupId++;
            if (isGroup) {
                let clsName = this.showButtons.groupDelete ? 'e-deletegroup' : 'e-deletegroup e-button-hide';
                dltGroupBtn = this.createElement('button', { attrs: { class: clsName } });
                let button = new Button({ iconCss: 'e-icons e-delete-icon', cssClass: 'e-small e-round' });
                button.appendTo(dltGroupBtn);
                let tooltip = new Tooltip({ content: this.l10n.getConstant('DeleteGroup') });
                tooltip.appendTo(dltGroupBtn);
                rippleEffect(dltGroupBtn, { selector: '.deletegroup' });
                groupElem.querySelector('.e-group-action').appendChild(dltGroupBtn);
                let ruleList = target.querySelector('.e-rule-list');
                let childElems = ruleList.children;
                let grpLen = 0;
                for (let j = 0, jLen = childElems.length; j < jLen; j++) {
                    if (childElems[j].className.indexOf('e-group-container') > -1) {
                        grpLen += 1;
                    }
                }
                ruleList.appendChild(groupElem);
                let level = this.levelColl[target.id].slice(0);
                level.push(grpLen);
                this.levelColl[groupElem.id] = level;
                if (!this.isImportRules) {
                    this.addGroups([], target.id.replace(this.element.id + '_', ''));
                    if (isBtnClick) {
                        this.addRuleElement(groupElem, {});
                    }
                }
            }
            else {
                target.appendChild(groupElem);
                this.levelColl[groupElem.id] = [0];
            }
            if (this.enableNotCondition) {
                let tglBtn = new Button({ content: this.l10n.getConstant('NOT'), cssClass: 'e-btn e-small' });
                tglBtn.appendTo(notElem);
                groupElem.querySelector('.e-btngroup-and-lbl').classList.add('e-not');
                if (this.updatedRule && this.updatedRule.not) {
                    addClass([notElem], 'e-active-toggle');
                }
            }
            this.updatedRule = null;
            let groupBtn = groupElem.querySelector('.e-add-btn');
            let btnObj = new DropDownButton({
                items: this.items,
                cssClass: 'e-round e-small e-caret-hide e-addrulegroup',
                iconCss: 'e-icons e-add-icon',
                beforeOpen: this.selectBtn.bind(this, groupBtn),
                select: this.selectBtn.bind(this, groupBtn)
            });
            btnObj.appendTo(groupBtn);
            if (!this.isImportRules) {
                let grpId = target.id.replace(this.element.id + '_', '');
                let chgrpId = groupElem.id.replace(this.element.id + '_', '');
                this.trigger('change', { groupID: grpId, type: 'insertGroup', childGroupID: chgrpId });
            }
        }
    }
    /**
     * notify the changes to component.
     * @returns void.
     */
    notifyChange(value, element, type) {
        let grpElement = closest(element, '.e-group-container');
        let rules = this.getParentGroup(grpElement);
        let ruleElement = closest(element, '.e-rule-container');
        let index = 0;
        while (ruleElement && ruleElement.previousElementSibling !== null) {
            ruleElement = ruleElement.previousElementSibling;
            index++;
        }
        let rule = rules.rules[index];
        let column = this.getColumn(rule.field);
        let format = this.getFormat(column.format);
        if (column.type === 'date') {
            if (value instanceof Date) {
                value = this.intl.formatDate(value, format);
            }
            else if (value instanceof Array) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i] && value[i] instanceof Date) {
                        value[i] = this.intl.formatDate(value[i], format);
                    }
                }
            }
        }
        if (column.ruleTemplate) {
            this.templateChange(element, value, type);
        }
        else {
            let tempColl = closest(element, '.e-rule-value').querySelectorAll('.e-template');
            let filterElem = closest(element, '.e-rule-container').querySelector('.e-filter-input');
            let dropDownObj = getComponent(filterElem, 'dropdownlist');
            column = dropDownObj.getDataByValue(dropDownObj.value);
            let valueColl = [];
            for (let i = 0, iLen = tempColl.length; i < iLen; i++) {
                if (tempColl.length > 1 && column.type === 'date' && value[i] && value[i] instanceof Date) {
                    valueColl.push(this.intl.formatDate(value[i], format));
                }
                else {
                    valueColl = value;
                }
            }
            this.updateRules(element, (tempColl.length > 1) ? valueColl : value);
        }
    }
    // tslint:disable-next-line:no-any
    templateChange(element, value, type) {
        let grpElem = closest(element, '.e-group-container');
        let rules = this.getParentGroup(grpElem);
        let ruleElem = closest(element, '.e-rule-container');
        let index = 0;
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        let rule = rules.rules[index];
        if (type === 'field') {
            this.selectedColumn = this.getColumn(value);
        }
        else if (rule) {
            this.selectedColumn = this.getColumn(rule.field);
        }
        let operVal;
        this.previousColumn = this.getColumn(rule.field);
        let beforeRules = this.getValidRules(this.rule);
        if (this.selectedColumn) {
            if (this.selectedColumn.operators) {
                operVal = this.selectedColumn.operators;
            }
            else {
                operVal = this.customOperators[this.selectedColumn.type + 'Operator'];
            }
        }
        let arrOper = ['in', 'notin', 'between', 'notbetween'];
        let prevOper;
        switch (type) {
            case 'field':
                rule.field = value;
                rule.label = this.selectedColumn.label;
                rule.type = this.selectedColumn.type;
                rule.value = '';
                rule.operator = operVal[0].value;
                break;
            case 'operator':
                prevOper = rule.operator;
                rule.operator = value;
                if (arrOper.indexOf(rule.operator) > -1) {
                    rule.value = [];
                }
                else if (arrOper.indexOf(prevOper) > -1) {
                    rule.value = '';
                }
                break;
            case 'value':
                rule.value = value;
        }
        this.changeRuleTemplate(this.selectedColumn, element, rule, type);
        this.filterRules(beforeRules, this.getValidRules(this.rule), type);
        if (this.selectedColumn && this.selectedColumn.ruleTemplate) {
            if (type === 'field' || type === 'operator') {
                let grpEle = closest(element, '.e-rule-container');
                this.destroyControls(grpEle, true);
                detach(grpEle.querySelector('.e-rule-field'));
                let ruleElement = this.appendRuleElem(closest(grpEle, '.e-group-container'), this.selectedColumn, 'change', grpEle.id, type, rule);
                if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                    ruleElement.className = 'e-rule-container e-vertical-mode';
                }
                else {
                    ruleElement.className = 'e-rule-container e-horizontal-mode';
                }
                if (ruleElement.previousElementSibling && ruleElement.previousElementSibling.className.indexOf('e-rule-container') > -1) {
                    if (ruleElement.className.indexOf('e-joined-rule') < 0) {
                        ruleElement.className += ' e-joined-rule';
                    }
                    if (ruleElement.previousElementSibling.className.indexOf('e-prev-joined-rule') < 0) {
                        ruleElement.previousElementSibling.className += ' e-prev-joined-rule';
                    }
                }
                if (ruleElement.previousElementSibling && ruleElement.previousElementSibling.className.indexOf('e-group-container') > -1 &&
                    ruleElement.className.indexOf('e-separate-rule') < 0) {
                    ruleElement.className += ' e-separate-rule';
                }
                let args = { requestType: 'template-create', action: type, ruleID: grpEle.id,
                    fields: this.fields, rule: rule };
                this.trigger('actionBegin', args);
            }
        }
    }
    changeValue(i, args) {
        let groupID;
        let ruleID;
        let element;
        if (args.event) {
            element = args.event.target;
        }
        else {
            let multiSelectArgs = args;
            element = multiSelectArgs.element;
        }
        if (element.className.indexOf('e-day') > -1 || element.className.indexOf('e-cell') > -1) {
            let calenderArgs = args;
            element = calenderArgs.element;
        }
        let groupElem = closest(element, '.e-group-container');
        let ruleElem = closest(element, '.e-rule-container');
        groupID = groupElem && groupElem.id.replace(this.element.id + '_', '');
        ruleID = ruleElem.id.replace(this.element.id + '_', '');
        let dateElement = args;
        if (dateElement.element && dateElement.element.className.indexOf('e-datepicker') > -1) {
            element = dateElement.element;
        }
        let value;
        let rbValue;
        let dropDownObj;
        if (element.className.indexOf('e-radio') > -1) {
            rbValue = parseInt(element.id.split('valuekey')[1], 0);
            dropDownObj =
                getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input'), 'dropdownlist');
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
            if (this.selectedColumn.values) {
                value = this.selectedColumn.values[rbValue];
            }
            else {
                let valColl = [true, false];
                value = valColl[rbValue];
            }
        }
        else if (element.className.indexOf('e-multiselect') > -1) {
            value = getComponent(element, 'multiselect').value;
        }
        else {
            value = args.value;
        }
        if (args.name === 'input' && this.immediateModeDelay) {
            window.clearInterval(this.timer);
            this.timer = window.setInterval(() => { this.filterValue(groupID, ruleID, value, i, element); }, this.immediateModeDelay);
        }
        else {
            this.filterValue(groupID, ruleID, value, i, element);
        }
    }
    filterValue(grID, rlID, value, i, ele) {
        let eventsArgs = { groupID: grID, ruleID: rlID, value: value, cancel: false, type: 'value' };
        window.clearInterval(this.timer);
        if (!this.isImportRules) {
            this.trigger('beforeChange', eventsArgs, (observedChangeArgs) => {
                this.changeValueSuccessCallBack(observedChangeArgs, ele, i, grID, rlID);
            });
        }
        else {
            this.changeValueSuccessCallBack(eventsArgs, ele, i, grID, rlID);
        }
    }
    changeValueSuccessCallBack(args, element, i, groupID, ruleID) {
        if (!args.cancel) {
            this.updateRules(element, args.value, i);
            if (!this.isImportRules) {
                this.trigger('change', { groupID: groupID, ruleID: ruleID, value: args.value, cancel: false, type: 'value' });
            }
        }
    }
    changeField(args) {
        if (args.isInteracted) {
            let column = this.getColumn(args.value);
            if (column && column.ruleTemplate) {
                this.templateChange(args.element, column.field, 'field');
            }
            else {
                let groupElem = closest(args.element, '.e-group-container');
                let rules = this.getParentGroup(groupElem);
                let ruleElem = closest(args.element, '.e-rule-container');
                let index = 0;
                while (ruleElem && ruleElem.previousElementSibling !== null) {
                    ruleElem = ruleElem.previousElementSibling;
                    index++;
                }
                this.changeRule(rules.rules[index], args);
            }
        }
    }
    changeRule(rule, ddlArgs) {
        if (!ddlArgs.itemData) {
            return;
        }
        let tempRule = {};
        let filterElem = closest(ddlArgs.element, '.e-rule-filter');
        let ddlObj = getComponent(ddlArgs.element, 'dropdownlist');
        let element = closest(ddlArgs.element, '.e-group-container');
        let groupID = element.id.replace(this.element.id + '_', '');
        this.changeFilter(filterElem, ddlObj, groupID, rule, tempRule, ddlArgs);
    }
    changeFilter(flt, dl, grID, rl, tmpRl, dArg) {
        if (flt) {
            this.selectedColumn = dl.getDataByValue(dl.value);
            let ruleElem = closest(flt, '.e-rule-container');
            let eventsArgs;
            let ruleID = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedField: dl.value, cancel: false, type: 'field' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, (observedChangeArgs) => {
                    this.fieldChangeSuccess(observedChangeArgs, tmpRl, flt, rl, dArg);
                });
            }
            else {
                this.fieldChangeSuccess(eventsArgs, tmpRl, flt, rl, dArg);
            }
        }
        else {
            let operatorElem = closest(dArg.element, '.e-rule-operator');
            this.changeOperator(flt, operatorElem, dl, grID, rl, tmpRl, dArg);
        }
    }
    changeOperator(flt, opr, dl, grID, rl, tmpRl, dArg) {
        let ruleElem;
        let ruleID;
        let eventsArgs;
        if (opr) {
            ruleElem = closest(opr, '.e-rule-container');
            ruleID = ruleElem.id.replace(this.element.id + '_', '');
            eventsArgs = { groupID: grID, ruleID: ruleID, selectedIndex: dl.index, cancel: false, type: 'operator' };
            if (!this.isImportRules) {
                this.trigger('beforeChange', eventsArgs, (observedChangeArgs) => {
                    this.operatorChangeSuccess(observedChangeArgs, flt, tmpRl, rl, dArg);
                });
            }
            else {
                this.operatorChangeSuccess(eventsArgs, flt, tmpRl, rl, dArg);
            }
        }
        else {
            this.changeRuleValues(flt, rl, tmpRl, dArg);
        }
    }
    fieldChangeSuccess(args, tempRule, filterElem, rule, ddlArgs) {
        let ruleElem = closest(filterElem, '.e-rule-container');
        let operatorElem = closest(ddlArgs.element, '.e-rule-operator');
        let element = closest(ddlArgs.element, '.e-group-container');
        let groupID = element.id.replace(this.element.id + '_', '');
        let ddlObj = getComponent(ddlArgs.element, 'dropdownlist');
        let tooltipElem = ruleElem.querySelectorAll('.e-tooltip.e-input-group');
        for (let i = 0; i < tooltipElem.length; i++) {
            getComponent(tooltipElem[i], 'tooltip').destroy();
        }
        if (!args.cancel) {
            tempRule.type = this.selectedColumn.type;
            if (ruleElem.querySelector('.e-template')) {
                rule.value = '';
            }
            this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        }
        else {
            this.changeOperator(filterElem, operatorElem, ddlObj, groupID, rule, tempRule, ddlArgs);
        }
    }
    operatorChangeSuccess(eventsArgs, filterElem, tempRule, rule, ddlArgs) {
        if (!eventsArgs.cancel) {
            let operatorElem = closest(ddlArgs.element, '.e-rule-operator');
            let valElem = operatorElem.nextElementSibling;
            let dropDownObj = getComponent(ddlArgs.element, 'dropdownlist');
            let prevOper = rule.operator ? rule.operator.toString().toLowerCase() : '';
            tempRule.operator = dropDownObj.value.toString();
            let currOper = tempRule.operator.toLowerCase();
            if (tempRule.operator.toLowerCase().indexOf('between') > -1 || (tempRule.operator.toLowerCase().indexOf('in') > -1
                && tempRule.operator.toLowerCase().indexOf('contains') < 0)) {
                filterElem = operatorElem.previousElementSibling;
                tempRule.type = rule.type;
                if (tempRule.operator.toLowerCase().indexOf('in') < 0 || prevOper.indexOf('in') < 0) {
                    rule.value = [];
                }
            }
            else if (typeof rule.value === 'object' && rule.value != null) {
                rule.value = rule.value.length > 0 ? rule.value[0] : '';
            }
            if (ddlArgs.previousItemData) {
                let prevValue = ddlArgs.previousItemData.value.toString().toLowerCase();
                if ((prevValue.indexOf('between') > -1 || (prevValue.indexOf('in') > -1 || (prevValue.indexOf('null') > -1)
                    || (prevValue.indexOf('empty') > -1)) && prevValue.indexOf('contains') < 0)) {
                    filterElem = operatorElem.previousElementSibling;
                    tempRule.type = rule.type;
                }
            }
            if ((prevOper.indexOf('in') > -1 && prevOper.indexOf('in') < 5) && (currOper.indexOf('in') > -1
                && currOper.indexOf('in') < 5)) {
                filterElem = null;
            }
            if (tempRule.operator.indexOf('null') > -1 || (tempRule.operator.indexOf('empty') > -1)) {
                let parentElem = operatorElem.parentElement.querySelector('.e-rule-value');
                removeClass([parentElem], 'e-show');
                addClass([parentElem], 'e-hide');
            }
            if (valElem && valElem.querySelector('.e-template')) {
                filterElem = operatorElem.previousElementSibling;
            }
            this.changeRuleValues(filterElem, rule, tempRule, ddlArgs);
        }
    }
    changeRuleValues(filterElem, rule, tempRule, ddlArgs) {
        let operatorElem = closest(ddlArgs.element, '.e-rule-operator');
        let ddlObj;
        let operatorList;
        let oprElem;
        if (filterElem) {
            operatorElem = filterElem.nextElementSibling;
            addClass([operatorElem], 'e-operator');
            if (operatorElem.childElementCount) {
                ddlObj = getComponent(operatorElem.querySelector('.e-dropdownlist'), 'dropdownlist');
                tempRule.operator = ddlObj.value;
                let itemData = ddlArgs.itemData;
                this.renderValues(operatorElem, itemData, ddlArgs.previousItemData, true, rule, tempRule, ddlArgs.element);
            }
            else {
                let ruleId = closest(operatorElem, '.e-rule-container').id;
                oprElem = this.createElement('input', { attrs: { type: 'text', id: ruleId + '_operatorkey' } });
                operatorElem.appendChild(oprElem);
                if (this.selectedColumn.operators) {
                    operatorList = this.selectedColumn.operators;
                }
                else if (ddlArgs.itemData) {
                    operatorList = this.customOperators[this.selectedColumn.type + 'Operator'];
                }
                let height = (this.element.className.indexOf('e-device') > -1) ? '250px' : '200px';
                let value = operatorList[0].value;
                value = rule ? (rule.operator !== '' ? rule.operator : value) : value;
                let dropDownList = new DropDownList({
                    dataSource: operatorList,
                    fields: { text: 'key', value: 'value' },
                    placeholder: this.l10n.getConstant('SelectOperator'),
                    popupHeight: ((operatorList.length > 5) ? height : 'auto'),
                    change: this.changeField.bind(this),
                    index: 0,
                    value: value
                });
                dropDownList.appendTo('#' + ruleId + '_operatorkey');
                tempRule.operator = (rule && rule.operator !== '') ? rule.operator : operatorList[0].value;
                if (this.isImportRules) {
                    tempRule.type = this.selectedColumn.type;
                    tempRule.operator = rule.operator;
                }
                this.renderValues(operatorElem, this.selectedColumn, ddlArgs.previousItemData, false, rule, tempRule, ddlArgs.element);
            }
        }
        if (!this.isImportRules) {
            this.updateRules(ddlArgs.element, ddlArgs.item);
        }
    }
    // tslint:disable-next-line:no-any
    destroyControls(target, isRuleTemplate) {
        let element = isRuleTemplate ? target : target.nextElementSibling;
        let inputElement;
        inputElement = element.querySelectorAll('input.e-control');
        let divElement;
        divElement = element.querySelectorAll('div.e-control:not(.e-handle)');
        let columns = this.columns;
        for (let i = 0, len = inputElement.length; i < len; i++) {
            if (inputElement[i].classList.contains('e-textbox')) {
                getComponent(inputElement[i], 'textbox').destroy();
                detach(select('input#' + inputElement[i].id, element));
            }
            else if (inputElement[i].classList.contains('e-dropdownlist')) {
                if (this.allowValidation && inputElement[i].parentElement.className.indexOf('e-tooltip') > -1) {
                    getComponent(inputElement[i].parentElement, 'tooltip').destroy();
                }
                getComponent(inputElement[i], 'dropdownlist').destroy();
            }
            else if (inputElement[i].classList.contains('e-radio')) {
                getComponent(inputElement[i], 'radio').destroy();
            }
            else if (inputElement[i].classList.contains('e-numerictextbox')) {
                getComponent(inputElement[i], 'numerictextbox').destroy();
                detach(select('input#' + inputElement[i].id, element));
            }
            else if (inputElement[i].classList.contains('e-datepicker')) {
                getComponent(inputElement[i], 'datepicker').destroy();
            }
            else if (inputElement[i].classList.contains('e-multiselect')) {
                getComponent(inputElement[i], 'multiselect').destroy();
            }
            else if (inputElement[i].className.indexOf('e-template') > -1) {
                let clsName = inputElement[i].className;
                for (let j = 0, jLen = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], inputElement[i].id);
                        break;
                    }
                }
            }
            if (document.getElementById(inputElement[i].id)) {
                detach(inputElement[i]);
            }
        }
        for (let i = 0, len = divElement.length; i < len; i++) {
            if (divElement[i].className.indexOf('e-template') > -1) {
                let clsName = divElement[i].className;
                for (let j = 0, jLen = columns.length; j < jLen; j++) {
                    if (columns[j].template && clsName.indexOf(columns[j].field) > -1) {
                        this.templateDestroy(columns[j], divElement[i].id);
                        break;
                    }
                }
            }
            detach(divElement[i]);
        }
        let templateElement;
        templateElement = element.querySelectorAll('.e-template:not(.e-control)');
        for (let i = 0, len = templateElement.length; i < len; i++) {
            detach(templateElement[i]);
        }
    }
    templateDestroy(column, elemId) {
        let template;
        if (typeof column.template !== 'string' || column.template.destroy === undefined) {
            template = column.template;
        }
        else {
            return;
        }
        let temp = template.destroy;
        if (template.destroy) {
            let templateElements;
            if (document.getElementById(elemId)) {
                templateElements = closest(document.getElementById(elemId), '.e-rule-field').querySelectorAll('.e-template');
            }
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
                temp({ field: column.field, elementId: elemId, elements: templateElements });
            }
            else {
                template.destroy({ field: column.field, elementId: elemId, elements: templateElements });
            }
        }
    }
    /**
     * return values bound to the column.
     * @returns object[].
     */
    getValues(field) {
        let original = {};
        let result = [];
        let value;
        let fieldColl = [];
        if (this.separator.length > 0) {
            fieldColl = field.split(this.separator);
        }
        let dataSource = this.dataColl;
        if (this.dataColl[1]) {
            for (let i = 0, iLen = dataSource.length; i < iLen; i++) {
                let data = {};
                if (fieldColl.length > 1) {
                    let dataObj = dataSource[i];
                    let fieldStr;
                    for (let j = 0, jLen = fieldColl.length; j < jLen; j++) {
                        fieldStr = fieldColl[j];
                        if (fieldColl.length === (j + 1)) {
                            value = dataObj[fieldStr];
                            if (Number(dataObj[fieldStr]) === dataObj[fieldStr] && dataObj[fieldStr] % 1 !== 0) {
                                value = dataObj[fieldStr].toString();
                            }
                        }
                        else {
                            dataObj = dataObj[fieldStr];
                        }
                    }
                }
                else {
                    value = dataSource[i][field];
                    if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                        value = dataSource[i][field].toString();
                    }
                }
                if (!(value in original)) {
                    original[value] = 1;
                    if (fieldColl.length > 1) {
                        this.createNestedObject(data, fieldColl, value);
                    }
                    else {
                        data[field] = value;
                    }
                    result.push(data);
                }
            }
        }
        return result;
    }
    createNestedObject(obj, fieldColl, value) {
        let key;
        let lastIndex = fieldColl.length - 1;
        for (let k = 0; k < lastIndex; ++k) {
            key = fieldColl[k];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        obj[fieldColl[lastIndex]] = value;
    }
    getDistinctValues(dataSource, field) {
        let original = {};
        let result = [];
        for (let i = 0, iLen = dataSource.length; i < iLen; i++) {
            let value = dataSource[i][field];
            if (Number(dataSource[i][field]) === dataSource[i][field] && dataSource[i][field] % 1 !== 0) {
                value = dataSource[i][field].toString();
            }
            let data = {};
            if (!(value in original)) {
                original[value] = 1;
                data[field] = value;
                result.push(data);
            }
        }
        return result;
    }
    renderMultiSelect(rule, parentId, i, selectedValue, values) {
        let isFetched = false;
        let ds;
        let isValues = false;
        if (this.dataColl[1]) {
            if (Object.keys(this.dataColl[1]).indexOf(rule.field) > -1) {
                isFetched = true;
                ds = this.getDistinctValues(this.dataColl, rule.field);
            }
        }
        if (!this.dataColl.length && values.length) {
            isValues = true;
        }
        let multiSelectObj = new MultiSelect({
            dataSource: isValues ? values : (isFetched ? ds : this.dataManager),
            query: new Query([rule.field]),
            fields: { text: rule.field, value: rule.field },
            placeholder: this.l10n.getConstant('SelectValue'),
            value: selectedValue,
            mode: 'CheckBox',
            width: '100%',
            change: this.changeValue.bind(this, i),
            close: this.closePopup.bind(this, i),
            actionBegin: this.multiSelectOpen.bind(this, parentId + '_valuekey' + i)
        });
        multiSelectObj.appendTo('#' + parentId + '_valuekey' + i);
        this.updateRules(multiSelectObj.element, selectedValue, 0);
    }
    multiSelectOpen(parentId, args) {
        if (this.dataSource instanceof DataManager) {
            let element = document.getElementById(parentId);
            let dropDownObj = getComponent(closest(element, '.e-rule-container').querySelector('.e-filter-input'), 'dropdownlist');
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
            let value = this.selectedColumn.field;
            let isFetched = false;
            if (this.dataColl[1]) {
                if (Object.keys(this.dataColl[1]).indexOf(value) > -1) {
                    isFetched = true;
                }
            }
            if (!isFetched) {
                args.cancel = true;
                if (isBlazor()) {
                    this.bindBlazorMultiSelectData(element, value);
                }
                else {
                    this.bindMultiSelectData(element, value);
                }
            }
        }
    }
    bindBlazorMultiSelectData(element, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getMultiSelectData(element, value);
            return;
        });
    }
    bindMultiSelectData(element, value) {
        this.getMultiSelectData(element, value);
    }
    getMultiSelectData(element, value) {
        let dummyData;
        let deferred = new Deferred();
        let data = this.dataManager.executeQuery(new Query().select(value));
        let multiselectObj = getComponent(element, 'multiselect');
        multiselectObj.hideSpinner();
        this.createSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        showSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        data.then((e) => {
            if (e.actual && e.actual.result) {
                dummyData = e.actual.result;
            }
            else {
                dummyData = e.result;
            }
            this.dataColl = extend(this.dataColl, dummyData, [], true);
            multiselectObj.dataSource = this.getDistinctValues(this.dataColl, value);
            hideSpinner(closest(element, '.e-multi-select-wrapper').parentElement);
        }).catch((e) => {
            deferred.reject(e);
        });
    }
    createSpinner(element) {
        let spinnerElem = this.createElement('span', { attrs: { class: 'e-qb-spinner' } });
        element.appendChild(spinnerElem);
        createSpinner({ target: spinnerElem, width: Browser.isDevice ? '16px' : '14px' });
    }
    closePopup(i, args) {
        let element = document.getElementById(args.popup.element.id.replace('_popup', ''));
        let value = getComponent(element, 'multiselect').value;
        this.updateRules(element, value, i);
    }
    processTemplate(target, itemData, rule, tempRule) {
        let container = closest(target, '.e-rule-container');
        let ddlObj;
        let tempElements = container.querySelectorAll('.e-template');
        ddlObj = getComponent(container.querySelector('.e-rule-filter .e-filter-input'), 'dropdownlist');
        let column = this.getColumn(ddlObj.value);
        if (typeof itemData.template === 'string' || itemData.template.write === undefined) {
            let args = { rule: rule, ruleID: container.id, operator: tempRule.operator, field: column.field,
                requestType: 'value-template-create' };
            this.trigger('actionBegin', args);
        }
        else {
            let template = itemData.template;
            if (typeof template.write === 'string') {
                getValue(template.write, window)({ elements: tempElements.length > 1 ? tempElements : tempElements[0], values: rule.value,
                    operator: tempRule.operator, field: column.field, dataSource: column.values });
            }
            else {
                itemData.template.write({ elements: tempElements.length > 1 ? tempElements : tempElements[0],
                    values: rule.value, operator: tempRule.operator, field: column.field, dataSource: column.values });
            }
        }
    }
    getItemData(parentId) {
        let fieldObj = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist');
        return this.getColumn(fieldObj.value);
    }
    setDefaultValue(parentId, isArryValue, isNumber) {
        let itemData = this.getItemData(parentId);
        if (isNullOrUndefined(itemData.value)) {
            return isNumber ? isArryValue ? [0, 0] : 0 : isArryValue ? [] : '';
        }
        if (isArryValue) {
            if (!(itemData.value instanceof Array)) {
                return [itemData.value];
            }
        }
        else {
            if (itemData.value instanceof Array) {
                return itemData.value[0];
            }
        }
        // this.updateRules(ruleValElem, itemData.defaultValue, idx);
        return itemData.value;
    }
    renderStringValue(parentId, rule, operator, idx, ruleValElem) {
        let selectedVal;
        let columnData = this.getItemData(parentId);
        let selectedValue;
        if (this.isImportRules || this.isPublic) {
            selectedValue = rule.value;
        }
        else {
            selectedValue = this.setDefaultValue(parentId, false, false);
        }
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values)) {
            selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.displayMode === 'Vertical' || this.element.className.indexOf('e-device') > -1) {
                ruleValElem.style.width = '100%';
            }
            else {
                ruleValElem.style.width = null;
                ruleValElem.style.minWidth = '200px';
            }
        }
        else {
            if (operator === 'in' || operator === 'notin') {
                selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
                selectedValue = selectedVal.join(',');
            }
            let inputobj = new TextBox({
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selectedValue;
            inputobj.dataBind();
        }
    }
    renderNumberValue(parentId, rule, operator, idx, ruleValElem, itemData, length) {
        let columnData = this.getItemData(parentId);
        let selectedVal = (this.isImportRules || this.isPublic) ? rule.value : this.setDefaultValue(parentId, false, true);
        if ((operator === 'in' || operator === 'notin') && (this.dataColl.length || columnData.values)) {
            selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
            this.renderMultiSelect(columnData, parentId, idx, selectedVal, columnData.values);
            if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                ruleValElem.style.width = '100%';
            }
            else {
                ruleValElem.style.minWidth = '200px';
                ruleValElem.style.width = null;
            }
        }
        else if (operator === 'in' || operator === 'notin') {
            selectedVal = this.isImportRules ? rule.value : this.setDefaultValue(parentId, true, false);
            let selVal = selectedVal.join(',');
            let inputobj = new TextBox({
                placeholder: this.l10n.getConstant('SelectValue'),
                input: this.changeValue.bind(this, idx)
            });
            inputobj.appendTo('#' + parentId + '_valuekey' + idx);
            inputobj.value = selVal;
            inputobj.dataBind();
        }
        else {
            let fieldObj = getComponent(document.getElementById(parentId + '_filterkey'), 'dropdownlist');
            itemData = this.getColumn(fieldObj.value);
            let min = (itemData.validation && itemData.validation.min) ? itemData.validation.min : 0;
            let max = (itemData.validation && itemData.validation.max) ? itemData.validation.max : Number.MAX_VALUE;
            let format = itemData.format ? itemData.format : 'n';
            if (length > 1 && rule) {
                selectedVal = rule.value[idx] ? rule.value[idx] : this.setDefaultValue(parentId, true, true);
            }
            let numeric = new NumericTextBox({
                value: (selectedVal instanceof Array) ? selectedVal[idx] : selectedVal,
                format: format, min: min, max: max, width: '100%',
                step: itemData.step ? itemData.step : 1,
                change: this.changeValue.bind(this, idx)
            });
            numeric.appendTo('#' + parentId + '_valuekey' + idx);
        }
    }
    processValueString(value, type) {
        let numArr = [];
        let strArr = value.split(',');
        if (type === 'string') {
            return strArr;
        }
        else {
            for (let k = 0, kLen = strArr.length; k < kLen; k++) {
                numArr.push(Number(strArr[k]));
            }
            return numArr;
        }
    }
    parseDate(value, format) {
        let formatOpt;
        let selectedValue;
        if (format) {
            let dParser = this.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
            formatOpt = this.getFormat(format);
            selectedValue = dParser(value);
            if (isNullOrUndefined(selectedValue)) {
                selectedValue = this.intl.parseDate(value, formatOpt);
            }
        }
        else {
            selectedValue = new Date(value);
        }
        return selectedValue;
    }
    renderControls(target, itemData, rule, tempRule) {
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-value');
        removeClass([target.parentElement.querySelector('.e-rule-value')], 'e-hide');
        addClass([target.parentElement.querySelector('.e-rule-value')], 'e-show');
        if (itemData.template) {
            this.processTemplate(target, itemData, rule, tempRule);
        }
        else {
            let length;
            if (tempRule.type === 'boolean') {
                length = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
            }
            else {
                length = tempRule.operator && tempRule.operator.toString().toLowerCase().indexOf('between') > -1 ? 2 : 1;
            }
            let parentId = closest(target, '.e-rule-container').id;
            let ruleValElem;
            let operator;
            operator = tempRule.operator.toString();
            if (target.className.indexOf('e-rule-operator') > -1 || target.className.indexOf('e-rule-filter') > -1) {
                ruleValElem = target.parentElement.querySelector('.e-rule-value');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    ruleValElem.style.width = '100%';
                }
                else {
                    if (operator !== 'in' && operator !== 'notin') {
                        addClass([ruleValElem], 'e-custom-value');
                    }
                    else {
                        removeClass([ruleValElem], 'e-custom-value');
                    }
                }
                for (let i = 0; i < length; i++) {
                    switch (tempRule.type) {
                        case 'string':
                            {
                                this.renderStringValue(parentId, rule, operator, i, ruleValElem);
                            }
                            break;
                        case 'number':
                            {
                                this.renderNumberValue(parentId, rule, operator, i, ruleValElem, itemData, length);
                            }
                            break;
                        case 'boolean':
                            this.processBoolValues(itemData, rule, parentId, i);
                            break;
                        case 'date':
                            {
                                let selectedValue = new Date();
                                let selVal;
                                let column;
                                let format = itemData.format;
                                let datepick;
                                let place = this.l10n.getConstant('SelectValue');
                                if (itemData.value) {
                                    if (itemData.value instanceof Date) {
                                        selectedValue = itemData.value;
                                    }
                                    else if (itemData.value instanceof Number) {
                                        selectedValue = new Date(itemData.value);
                                    }
                                    else {
                                        selectedValue = this.parseDate(itemData.value, itemData.format);
                                    }
                                }
                                if ((this.isImportRules || this.isPublic) && rule) {
                                    column = this.getColumn(rule.field);
                                    format = column.format;
                                    if (rule.value) {
                                        selVal = (length > 1) ? rule.value[i] : rule.value;
                                        selectedValue = this.parseDate(selVal, column.format);
                                    }
                                    else {
                                        selectedValue = rule.value;
                                    }
                                }
                                if (format) {
                                    let formatObj = this.getFormat(format);
                                    if (formatObj.skeleton) {
                                        datepick = new DatePicker({ locale: this.getLocale(), value: selectedValue,
                                            placeholder: place, format: formatObj, change: this.changeValue.bind(this, i) });
                                    }
                                    else {
                                        datepick = new DatePicker({ value: selectedValue, locale: this.getLocale(),
                                            placeholder: place, format: formatObj.format, change: this.changeValue.bind(this, i) });
                                    }
                                }
                                else {
                                    datepick = new DatePicker({ locale: this.getLocale(),
                                        value: selectedValue, placeholder: place, change: this.changeValue.bind(this, i) });
                                }
                                datepick.appendTo('#' + parentId + '_valuekey' + i);
                                if (!rule.value) {
                                    this.updateRules(document.getElementById(parentId + '_valuekey' + i), selectedValue);
                                }
                            }
                            break;
                    }
                }
            }
        }
    }
    processBoolValues(itemData, rule, parentId, i) {
        let isCheck = false;
        let value;
        let orgValue;
        if (isNullOrUndefined(rule.type) && itemData) {
            rule.type = itemData.type;
        }
        let label;
        if (itemData.values) {
            let values = itemData.values;
            if (rule.type === 'boolean' && !isNullOrUndefined(rule.value)) {
                isCheck = values[i].toLowerCase() === rule.value.toString().toLowerCase();
            }
            else if (itemData.value) {
                isCheck = values[i].toLowerCase() === itemData.value.toString().toLowerCase();
            }
            else if (i === 0) {
                isCheck = true;
            }
            orgValue = value = label = values[i];
        }
        else {
            let values = [true, false];
            if (rule.type === 'boolean' && !isNullOrUndefined(rule.value)) {
                isCheck = values[i].toString().toLowerCase() === rule.value.toString().toLowerCase();
            }
            else if (itemData.value) {
                isCheck = values[i].toString().toLowerCase() === itemData.value.toString().toLowerCase();
            }
            else if (i === 0) {
                isCheck = true;
            }
            value = values[i].toString();
            orgValue = values[i];
            label = this.l10n.getConstant(['True', 'False'][i]);
        }
        let radiobutton = new RadioButton({
            label: label, name: parentId + 'default', checked: isCheck, value: value,
            change: this.changeValue.bind(this, i)
        });
        radiobutton.appendTo('#' + parentId + '_valuekey' + i);
        if (isCheck) {
            this.updateRules(radiobutton.element, orgValue, 0);
        }
    }
    getOperatorIndex(ddlObj, rule) {
        let i;
        let dataSource = ddlObj.dataSource;
        let len = dataSource.length;
        for (i = 0; i < len; i++) {
            if (rule.operator === ddlObj.dataSource[i].value) {
                return i;
            }
        }
        return 0;
    }
    getPreviousItemData(prevItemData, column) {
        if (column.template && prevItemData && Object.keys(prevItemData).length < 4) {
            prevItemData.template = column.template;
        }
        return prevItemData;
    }
    renderValues(target, itemData, prevItemData, isRender, rule, tempRule, element) {
        let filtElem = document.getElementById(element.id.replace('operatorkey', 'filterkey'));
        let filtObj = getComponent(filtElem, 'dropdownlist');
        let column = this.getColumn(filtObj.value);
        if (isRender) {
            let ddlObj = getComponent(target.querySelector('input'), 'dropdownlist');
            if (itemData.operators) {
                ddlObj.value = null;
                ddlObj.dataBind();
                ddlObj.dataSource = itemData.operators;
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value;
                ddlObj.dataBind();
            }
            else if (itemData.type) {
                ddlObj.value = null;
                ddlObj.dataBind();
                ddlObj.dataSource = this.customOperators[itemData.type + 'Operator'];
                ddlObj.index = this.getOperatorIndex(ddlObj, rule);
                ddlObj.value = tempRule.operator = ddlObj.dataSource[ddlObj.index].value;
                ddlObj.dataBind();
            }
        }
        let operator = tempRule.operator.toString();
        if (!(operator.indexOf('null') > -1 || operator.indexOf('empty') > -1)) {
            let parentId = closest(target, '.e-rule-container').id;
            prevItemData = this.getPreviousItemData(prevItemData, column);
            if (prevItemData && prevItemData.template) {
                this.templateDestroy(prevItemData, parentId + '_valuekey0');
                if (isBlazor()) {
                    if (!(prevItemData.field === itemData.field)) {
                        blazorTemplates[this.element.id + prevItemData.field] = [];
                        resetBlazorTemplate(this.element.id + prevItemData.field, 'Template');
                        detach(target.nextElementSibling.querySelector('.e-blazor-template'));
                    }
                }
                else {
                    let elem = select('#' + parentId + '_valuekey0', target.nextElementSibling);
                    if (elem && !elem.classList.contains('e-control')) {
                        detach(select('#' + parentId + '_valuekey0', target.nextElementSibling));
                    }
                }
                if (typeof prevItemData.template === 'string' || prevItemData.template.create === undefined) {
                    target.nextElementSibling.innerHTML = '';
                    this.clearQBTemplate([parentId]);
                }
            }
            if (isRender) {
                if (isBlazor() && !prevItemData.template) {
                    this.destroyControls(target);
                }
                else if (!isBlazor()) {
                    this.destroyControls(target);
                }
            }
            itemData.template = column.template;
            if (itemData.template) {
                if (isBlazor() && itemData.field) {
                    this.columnTemplateFn = this.templateParser(itemData.template);
                    let templateID = this.element.id + itemData.field;
                    let template = this.columnTemplateFn(itemData, this, 'Template', templateID);
                    target.nextElementSibling.appendChild(template[0]);
                    updateBlazorTemplate(templateID, 'Template', column, false);
                }
                addClass([target.nextElementSibling], 'e-template-value');
                itemData.template = column.template;
                this.setColumnTemplate(itemData, parentId, column.field, itemData.value || operator, target, rule);
                let parentElem = target.parentElement.querySelector('.e-rule-value');
                if (this.element.className.indexOf('e-device') > -1 || this.displayMode === 'Vertical') {
                    parentElem.style.width = '100%';
                }
                else {
                    parentElem.style.width = '200px';
                }
            }
            else {
                removeClass([target.nextElementSibling], 'e-template-value');
                let inputLen = 1;
                if (tempRule.type === 'boolean') {
                    inputLen = this.selectedColumn.values ? this.selectedColumn.values.length : 2;
                }
                else {
                    inputLen = (operator && operator.toLowerCase().indexOf('between') > -1) ? 2 : 1;
                }
                for (let i = 0; i < inputLen; i++) {
                    let valElem;
                    valElem = this.createElement('input', { attrs: { type: 'text', id: parentId + '_valuekey' + i } });
                    target.nextElementSibling.appendChild(valElem);
                }
            }
            this.renderControls(target, itemData, rule, tempRule);
        }
        else {
            let parentElem = target.parentElement.querySelector('.e-rule-value');
            if (parentElem) {
                removeClass([parentElem], 'e-show');
                addClass([parentElem], 'e-hide');
            }
        }
    }
    setColumnTemplate(itemData, ruleID, field, operator, target, rule) {
        let valElem;
        let args;
        if (itemData.template) {
            if (typeof itemData.template === 'string' || itemData.template.create === undefined) {
                args = { requestType: 'value-template-initialize', ruleID: ruleID, field: field, operator: operator, rule: rule };
                this.trigger('actionBegin', args);
                this.columnTemplateFn = this.templateParser(itemData.template);
                let templateID = this.element.id + field;
                // tslint:disable
                if (this.isReact || this.isAngular) {
                    valElem = this.columnTemplateFn(args, this, ruleID, templateID)[0];
                }
                else {
                    valElem = this.columnTemplateFn(args, this, 'Template', templateID)[0];
                }
                target.nextElementSibling.appendChild(valElem);
                this.renderReactTemplates();
            }
            else {
                let template = itemData.template;
                if (typeof template.create === 'string') {
                    valElem = getValue(template.create, window)({ field: field, operator: operator });
                }
                else {
                    valElem = template.create({ field: field, operator: operator });
                }
                if (valElem instanceof Element) {
                    valElem.id = ruleID + '_valuekey0';
                    addClass([valElem], 'e-template');
                    addClass([valElem], 'e-' + field);
                    target.nextElementSibling.appendChild(valElem);
                }
                else if (valElem instanceof Array) {
                    addClass(valElem, 'e-template');
                    for (let i = 0, iLen = valElem.length; i < iLen; i++) {
                        valElem[i].id = ruleID + '_valuekey' + i;
                        target.nextElementSibling.appendChild(valElem[i]);
                    }
                }
            }
        }
    }
    updateValues(element, rule) {
        let idx = 1;
        if (element.className.indexOf('e-template') > -1) {
            idx = 3;
        }
        let controlName = element.className.split(' e-')[idx];
        let i = parseInt(element.id.slice(-1), 2);
        switch (controlName) {
            case 'textbox':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'dropdownlist':
                rule.value = getComponent(element, controlName).value;
                break;
            case 'radio':
                let radioBtnObj = getComponent(element, controlName);
                if (radioBtnObj.checked) {
                    if (typeof rule.value === 'boolean') {
                        rule.value = radioBtnObj.value === 'true';
                    }
                    else {
                        if (this.getColumn(rule.field).values) {
                            rule.value = radioBtnObj.value;
                        }
                        else {
                            rule.value = radioBtnObj.value === 'true';
                        }
                    }
                }
                radioBtnObj.refresh();
                break;
            case 'numerictextbox':
                if (rule.operator.indexOf('between') > -1) {
                    if (typeof rule.value === 'string') {
                        rule.value = [];
                    }
                    rule.value[i] = getComponent(element, controlName).value;
                }
                else {
                    rule.value = getComponent(element, controlName).value;
                }
                break;
            case 'datepicker':
                let column = this.getColumn(rule.field);
                let format = this.getFormat(column.format);
                let selectedDate = getComponent(element, controlName).value;
                if (rule.operator.indexOf('between') > -1) {
                    if (typeof rule.value === 'string') {
                        rule.value = [];
                    }
                    rule.value[i] = selectedDate;
                }
                else if (isNullOrUndefined(format.format) && selectedDate) {
                    rule.value = this.intl.formatDate(selectedDate);
                }
                else if (selectedDate) {
                    rule.value = this.intl.formatDate(selectedDate, format);
                }
                else {
                    rule.value = '';
                }
                break;
            case 'multiselect':
                rule.value = getComponent(element, controlName).value;
                break;
        }
    }
    updateRules(target, selectedValue, i) {
        let groupElem = closest(target, '.e-group-container');
        let rule = this.getParentGroup(groupElem);
        let ruleElem = closest(target, '.e-rule-container');
        let index = 0;
        let dropDownObj;
        let eventsArgs;
        let groupID = groupElem.id.replace(this.element.id + '_', '');
        let ruleID;
        let beforeRules = this.getValidRules(this.rule);
        while (ruleElem && ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        let operator = rule.rules[index].operator.toString();
        ruleElem = closest(target, '.e-rule-container');
        ruleID = ruleElem.id.replace(this.element.id + '_', '');
        if (closest(target, '.e-rule-filter')) {
            dropDownObj = getComponent(target, 'dropdownlist');
            let column = this.getColumn(dropDownObj.value);
            if (!this.isImportRules && rule.rules[index].field.toLowerCase() !== column.field.toLowerCase()) {
                if (!(ruleElem.querySelectorAll('.e-template')) && !(operator.indexOf('null') > -1)
                    || (operator.indexOf('empty') > -1)) {
                    rule.rules[index].value = '';
                }
            }
            this.selectedColumn = dropDownObj.getDataByValue(dropDownObj.value);
            rule.rules[index].field = this.selectedColumn.field;
            rule.rules[index].type = this.selectedColumn.type;
            rule.rules[index].label = this.selectedColumn.label;
            let ruleElement = closest(target, '.e-rule-filter');
            let element = ruleElement.nextElementSibling.querySelector('input.e-control');
            operator = getComponent(element, 'dropdownlist').value.toString();
            rule.rules[index].operator = operator;
            // Value Fields
            let valueContainer = ruleElement.nextElementSibling.nextElementSibling;
            let elementCln = valueContainer.querySelectorAll('input.e-control');
            if (elementCln.length < 1) {
                elementCln = valueContainer.querySelectorAll('.e-template');
            }
            for (let i = 0; i < elementCln.length; i++) {
                if (!elementCln[i]) {
                    elementCln[i] = ruleElement.nextElementSibling.nextElementSibling.querySelector('div.e-control');
                }
                if (!elementCln[i]) {
                    elementCln[i] = ruleElement.nextElementSibling.nextElementSibling.querySelector('.e-template');
                }
                eventsArgs = { groupID: groupID, ruleID: ruleID, value: rule.rules[index].field, type: 'field' };
                if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                    rule.rules[index].value = null;
                    continue;
                }
                this.updateValues(elementCln[i], rule.rules[index]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            if (this.allowValidation && rule.rules[index].field && target.parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(target.parentElement, 'tooltip').destroy();
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'field');
        }
        else if (closest(target, '.e-rule-operator')) {
            dropDownObj = getComponent(target, 'dropdownlist');
            rule.rules[index].operator = dropDownObj.value.toString();
            let inputElem;
            let parentElem = target.parentElement;
            inputElem = ruleElem.querySelectorAll('.e-rule-value input.e-control');
            eventsArgs = { groupID: groupID, ruleID: ruleID, value: dropDownObj.value, type: 'operator' };
            if (this.allowValidation && rule.rules[index].operator && target.parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(target.parentElement, 'tooltip').destroy();
            }
            if (inputElem.length > 1 && !(inputElem[0].className.indexOf('e-template') > -1)) {
                rule.rules[index].value = [];
            }
            for (let i = 0; i < inputElem.length; i++) {
                if (rule.rules[index].operator.indexOf('null') > -1 || rule.rules[index].operator.indexOf('empty') > -1) {
                    rule.rules[index].value = null;
                    continue;
                }
                else if (inputElem[i].classList.contains('e-template')) {
                    continue;
                }
                this.updateValues(inputElem[i], rule.rules[index]);
            }
            if (!this.isImportRules) {
                this.trigger('change', eventsArgs);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'operator');
        }
        else if (closest(target, '.e-rule-value')) {
            this.ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i);
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'value');
        }
    }
    filterRules(beforeRule, afterRule, type) {
        let beforeRuleStr = JSON.stringify({ condition: beforeRule.condition, not: beforeRule.not, rule: beforeRule.rules });
        let afetrRuleStr = JSON.stringify({ condition: afterRule.condition, not: afterRule.not, rule: afterRule.rules });
        if (beforeRuleStr !== afetrRuleStr) {
            if (!this.isImportRules) {
                this.trigger('ruleChange', { previousRule: beforeRule, rule: afterRule, type: type });
            }
        }
    }
    ruleValueUpdate(target, selectedValue, rule, index, groupElem, ruleElem, i) {
        let eventsArgs;
        let oper;
        let arrOperator = ['in', 'between', 'notin', 'notbetween'];
        if (rule.rules[index].operator) {
            oper = rule.rules[index].operator.toString().toLowerCase();
        }
        if (selectedValue !== null) {
            if (target.className.indexOf('e-multiselect') > -1 && rule.rules[index].type === 'number' &&
                !(target.className.indexOf('e-template') > -1)) {
                let selVal = [];
                let dupSelectedValue = selectedValue;
                for (let k = 0, kLen = dupSelectedValue.length; k < kLen; k++) {
                    if (typeof dupSelectedValue[k] === 'string') {
                        selVal.push(parseFloat(dupSelectedValue[k]));
                    }
                }
                if (selVal.length) {
                    selectedValue = selVal;
                }
            }
            if (target.classList.contains('e-blazor-template') || target.className.indexOf('e-template') > -1) {
                rule.rules[index].value = selectedValue;
                eventsArgs = { groupID: groupElem.id, ruleID: ruleElem.id, value: rule.rules[index].value, type: 'value' };
                if (!this.isImportRules) {
                    this.trigger('change', eventsArgs);
                }
            }
            else if (target.className.indexOf('e-spin') > -1 || target.className.indexOf('e-numeric') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    rule.rules[index].value[i] = selectedValue;
                }
                else {
                    rule.rules[index].value = selectedValue;
                }
            }
            else if (target.className.indexOf('e-radio') > -1) {
                rule.rules[index].value = selectedValue;
            }
            else if (target.className.indexOf('e-multiselect') > -1) {
                rule.rules[index].value = selectedValue;
            }
            else if (target.className.indexOf('e-textbox') > -1) {
                if (oper === 'in' || oper === 'notin') {
                    if (rule.rules[index].type === 'string') {
                        rule.rules[index].value = this.processValueString(selectedValue, rule.rules[index].type);
                    }
                    else {
                        rule.rules[index].value = this.processValueString(selectedValue, rule.rules[index].type);
                    }
                }
                else {
                    rule.rules[index].value = selectedValue;
                }
            }
            else if (target.className.indexOf('e-datepicker') > -1) {
                let ddlInst = getInstance(ruleElem.querySelector('.e-rule-filter input'), DropDownList);
                let format = this.getFormat(this.getColumn(ddlInst.value).format);
                if (format.type) {
                    if (arrOperator.indexOf(oper) > -1) {
                        if (typeof rule.rules[index].value === 'string') {
                            rule.rules[index].value = [];
                        }
                        rule.rules[index].value[i] = this.intl.formatDate(selectedValue, format);
                    }
                    else {
                        rule.rules[index].value = this.intl.formatDate(selectedValue, format);
                    }
                }
            }
            this.validatValue(rule, index, ruleElem);
        }
        else {
            if (target.className.indexOf('e-datepicker') > -1) {
                if (arrOperator.indexOf(oper) > -1) {
                    if (typeof rule.rules[index].value === 'string') {
                        rule.rules[index].value = [];
                    }
                    rule.rules[index].value[i] = selectedValue;
                }
                else {
                    rule.rules[index].value = selectedValue;
                }
            }
            else {
                rule.rules[index].value = selectedValue;
            }
        }
    }
    validatValue(rule, index, ruleElem) {
        if (this.allowValidation && rule.rules[index].value) {
            let valElem = ruleElem.querySelectorAll('.e-rule-value .e-control');
            if (valElem[0].className.indexOf('e-tooltip') > -1) {
                getComponent(valElem[0], 'tooltip').destroy();
            }
            else if (valElem[0].parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(valElem[0].parentElement, 'tooltip').destroy();
            }
            if (valElem[1] && valElem[1].parentElement.className.indexOf('e-tooltip') > -1) {
                getComponent(valElem[1].parentElement, 'tooltip').destroy();
            }
        }
    }
    getFormat(format) {
        let formatOptions;
        if (format) {
            if (typeof (format) === 'string') {
                formatOptions = { type: 'dateTime', format: format };
                if (format === 'short') {
                    formatOptions.skeleton = format;
                }
            }
            else {
                formatOptions = { type: 'dateTime', skeleton: format.skeleton };
            }
        }
        else {
            formatOptions = { type: 'dateTime', skeleton: 'yMd' };
        }
        return formatOptions;
    }
    findGroupByIdx(groupIdx, rule, isRoot) {
        let ruleColl = rule.rules;
        let dupRuleColl = [];
        if (!isRoot) {
            for (let j = 0, jLen = ruleColl.length; j < jLen; j++) {
                rule = ruleColl[j];
                if (rule.rules) {
                    dupRuleColl.push(rule);
                }
            }
            return dupRuleColl[groupIdx];
        }
        return rule;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy() {
        let queryElement = this.element;
        if (!queryElement) {
            return;
        }
        let element;
        let i;
        let len;
        let tooltip;
        super.destroy();
        element = this.element.querySelectorAll('.e-addrulegroup');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdown-btn').destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-filter .e-control.e-tooltip');
        for (i = 0; i < tooltip.length; i++) {
            getComponent(tooltip[i], 'tooltip').destroy();
        }
        element = this.element.querySelectorAll('.e-rule-filter .e-control:not(.e-tooltip)');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdownlist').destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-operator .e-control.e-tooltip');
        for (i = 0; i < tooltip.length; i++) {
            getComponent(tooltip[i], 'tooltip').destroy();
        }
        element = this.element.querySelectorAll('.e-rule-operator .e-control:not(.e-tooltip)');
        len = element.length;
        for (i = 0; i < len; i++) {
            getComponent(element[i], 'dropdownlist').destroy();
            detach(element[i]);
        }
        tooltip = this.element.querySelectorAll('.e-rule-value .e-control.e-tooltip');
        for (i = 0; i < tooltip.length; i++) {
            getComponent(tooltip[i], 'tooltip').destroy();
        }
        this.isImportRules = false;
        this.unWireEvents();
        this.levelColl[this.element.id + '_group0'] = [0];
        this.element.innerHTML = '';
        // tslint:disable
        if (this.portals && this.portals.length) {
            this.clearQBTemplate();
        }
        classList(this.element, [], ['e-rtl', 'e-responsive', 'e-device']);
    }
    /**
     * Adds single or multiple rules.
     * @returns void.
     */
    addRules(rule, groupID) {
        groupID = this.element.id + '_' + groupID;
        this.isPublic = true;
        for (let i = 0, len = rule.length; i < len; i++) {
            this.addRuleElement(document.getElementById(groupID), rule[i]);
        }
        this.isPublic = false;
    }
    /**
     * Adds single or multiple groups, which contains the collection of rules.
     * @returns void.
     */
    addGroups(groups, groupID) {
        groupID = this.element.id + '_' + groupID;
        let groupElem = document.getElementById(groupID);
        let rule = this.getParentGroup(groupElem);
        let grouplen = groups.length;
        if (grouplen) {
            this.isPublic = true;
            for (let i = 0, len = groups.length; i < len; i++) {
                this.updatedRule = { condition: groups[i].condition, not: groups[i].not };
                this.importRules(groups[i], groupElem);
            }
            this.isPublic = false;
        }
        else {
            let condition = 'and';
            let not = false;
            if (this.updatedRule) {
                condition = this.updatedRule.condition;
                not = this.updatedRule.not;
            }
            if (this.enableNotCondition) {
                rule.rules.push({ 'condition': condition, 'not': not, rules: [] });
            }
            else {
                rule.rules.push({ 'condition': condition, rules: [] });
            }
        }
        let andElem = groupElem.querySelector('.e-btngroup-and');
        let orElem = groupElem.querySelector('.e-btngroup-or');
        if (andElem.disabled) {
            andElem.removeAttribute('disabled');
            andElem.checked = true;
            orElem.removeAttribute('disabled');
        }
    }
    initWrapper() {
        this.isInitialLoad = true;
        if (this.cssClass) {
            addClass([this.element], this.cssClass);
        }
        if (this.enableRtl) {
            addClass([this.element], 'e-rtl');
        }
        if (this.width) {
            this.element.style.width = this.width;
        }
        if (this.height) {
            this.element.style.height = this.height;
        }
        if (this.rule.rules.length) {
            this.isImportRules = true;
        }
        else {
            this.addGroupElement(false, this.element);
        }
        if (Browser.isDevice || this.displayMode === 'Vertical') {
            if (Browser.isDevice) {
                this.element.style.width = '100%';
                this.element.classList.add('e-device');
            }
            removeClass(this.element.querySelectorAll('.e-rule-container'), 'e-horizontal-mode');
            addClass(this.element.querySelectorAll('.e-rule-container'), 'e-vertical-mode');
            this.displayMode = 'Vertical';
        }
        else {
            this.displayMode = 'Horizontal';
        }
        if (this.summaryView) {
            if (this.isImportRules) {
                this.renderSummary();
            }
            else {
                this.renderSummaryCollapse();
            }
        }
        else {
            if (this.columns.length && this.isImportRules) {
                this.addGroupElement(false, this.element, this.rule.condition);
                let mRules = extend({}, this.rule, {}, true);
                this.isRefreshed = true;
                this.setGroupRules(mRules);
                this.isRefreshed = false;
            }
            else if (this.columns.length) {
                this.addRuleElement(this.element.querySelector('.e-group-container'), {});
            }
            this.notGroupRtl();
            if (this.readonly) {
                this.enableReadonly();
            }
            let buttons = this.element.querySelectorAll('label.e-btn');
            let button;
            for (let i = 0; i < buttons.length; i++) {
                button = buttons.item(i);
                rippleEffect(button, { selector: '.e-btn' });
            }
        }
    }
    renderSummary() {
        let contentElem = this.createElement('div', {
            attrs: {
                class: 'e-summary-content',
                id: this.element.id + '_summary_content'
            }
        });
        let textElem = this.createElement('textarea', { attrs: { class: 'e-summary-text', readonly: 'true' }, styles: 'max-height:500px' });
        let editElem = this.createElement('button', { attrs: { class: 'e-edit-rule e-css e-btn e-small e-flat e-primary' } });
        let divElem = this.createElement('div', { attrs: { class: 'e-summary-btndiv' } });
        contentElem.appendChild(textElem);
        textElem.textContent = this.getSqlFromRules(this.rule);
        editElem.textContent = this.l10n.getConstant('Edit');
        divElem.appendChild(editElem);
        contentElem.appendChild(divElem);
        this.element.appendChild(contentElem);
    }
    renderSummaryCollapse() {
        let collapseElem = this.createElement('div', {
            attrs: {
                class: 'e-collapse-rule e-icons',
                title: this.l10n.getConstant('SummaryViewTitle')
            }
        });
        this.element.querySelector('.e-group-header').appendChild(collapseElem);
    }
    columnSort() {
        if (this.sortDirection.toLowerCase() === 'descending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortByDesc('field'));
        }
        else if (this.sortDirection.toLowerCase() === 'ascending') {
            this.columns = new DataManager(this.columns).executeLocal(new Query().sortBy('field'));
        }
    }
    onChangeNotGroup() {
        this.element.innerHTML = '';
        this.groupIdCounter = 0;
        if (this.enableNotCondition) {
            if (this.enableNotCondition) {
                let inputElem = this.createElement('button', { attrs: { type: 'button', class: 'e-qb-toggle' } });
                this.groupElem.querySelector('.e-btn-group').insertBefore(inputElem, this.groupElem.querySelector('.e-btngroup-and'));
            }
        }
        else {
            this.groupElem.querySelector('.e-qb-toggle').remove();
        }
        this.rule = this.checkNotGroup(this.rule);
        this.initWrapper();
    }
    notGroupRtl() {
        if (this.enableRtl) {
            addClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        }
        else {
            removeClass(this.element.querySelectorAll('.e-btn-group'), 'e-rtl');
        }
    }
    checkNotGroup(rule) {
        let orgRule;
        if (rule.rules) {
            for (let i = 0; i < rule.rules.length; i++) {
                orgRule = rule.rules[i];
                orgRule = this.checkNotGroup(orgRule);
                rule.rules[i] = orgRule;
            }
        }
        if (!isNullOrUndefined(rule.not)) {
            if (this.enableNotCondition) {
                rule.not = false;
            }
            delete rule.not;
        }
        else if (this.enableNotCondition && !isNullOrUndefined(rule.condition)) {
            rule.not = false;
        }
        return rule;
    }
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        let properties = Object.keys(newProp);
        for (let prop of properties) {
            switch (prop) {
                case 'summaryView':
                    let groupElem = this.element.querySelector('.e-group-container');
                    let summaryElem = this.element.querySelector('.e-summary-content');
                    if (newProp.summaryView) {
                        groupElem.style.display = 'none';
                        if (this.element.querySelectorAll('.e-summary-content').length < 1) {
                            this.renderSummary();
                            summaryElem = this.element.querySelector('.e-summary-content');
                        }
                        else {
                            this.element.querySelector('.e-summary-text').textContent = this.getSqlFromRules(this.rule);
                        }
                        summaryElem.style.display = 'block';
                    }
                    else {
                        if (groupElem.querySelectorAll('.e-collapse-rule').length > -1) {
                            this.renderSummaryCollapse();
                        }
                        groupElem.style.display = 'block';
                        summaryElem.style.display = 'none';
                    }
                    break;
                case 'displayMode':
                    this.refresh();
                    break;
                case 'showButtons':
                    if (newProp.showButtons.ruleDelete) {
                        removeClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    }
                    else {
                        addClass(this.element.querySelectorAll('.e-rule-delete'), 'e-button-hide');
                    }
                    if (newProp.showButtons.groupDelete) {
                        removeClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    }
                    else {
                        addClass(this.element.querySelectorAll('.e-deletegroup'), 'e-button-hide');
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        addClass([this.element], 'e-rtl');
                        this.notGroupRtl();
                    }
                    else {
                        removeClass([this.element], 'e-rtl');
                        this.notGroupRtl();
                    }
                    break;
                case 'enablePersistence':
                    this.enablePersistence = newProp.enablePersistence;
                    break;
                case 'dataSource':
                    this.dataSource = newProp.dataSource;
                    this.refresh();
                    break;
                case 'columns':
                    if (isBlazor()) {
                        let columnIndex = Object.keys(newProp.columns).toString();
                        let columnValue = newProp.columns[columnIndex].values;
                        while (!this.target.classList.contains('e-blazor-template')) {
                            this.target = this.target.parentElement;
                        }
                        this.updateRules(this.target, columnValue);
                    }
                    else {
                        this.columns = newProp.columns;
                    }
                    this.columnSort();
                    break;
                case 'sortDirection':
                    this.sortDirection = newProp.sortDirection;
                    this.columnSort();
                    break;
                case 'maxGroupCount':
                    this.maxGroupCount = newProp.maxGroupCount;
                    break;
                case 'height':
                    this.height = newProp.height;
                    this.element.style.height = this.height;
                    break;
                case 'rule':
                    this.rule = newProp.rule;
                    newProp.rule = this.getRuleCollection(this.rule, false);
                    break;
                case 'width':
                    this.width = newProp.width;
                    this.element.style.width = this.width;
                    break;
                case 'locale':
                    this.locale = newProp.locale;
                    this.intl = new Internationalization(this.locale);
                    this.isLocale = true;
                    this.refresh();
                    this.isLocale = false;
                    break;
                case 'enableNotCondition':
                    this.onChangeNotGroup();
                    break;
                case 'readonly':
                    this.isReadonly = newProp.readonly;
                    this.enableReadonly();
                    break;
            }
        }
    }
    preRender() {
        this.element.id = this.element.id || getUniqueID('ej2-querybuilder');
        this.defaultLocale = {
            StartsWith: 'Starts With',
            EndsWith: 'Ends With',
            Contains: 'Contains',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            Between: 'Between',
            NotBetween: 'Not Between',
            In: 'In',
            NotIn: 'Not In',
            Remove: 'REMOVE',
            SelectField: 'Select a field',
            SelectOperator: 'Select operator',
            DeleteRule: 'Remove this condition',
            DeleteGroup: 'Delete group',
            AddGroup: 'Add Group',
            AddCondition: 'Add Condition',
            Edit: 'EDIT',
            ValidationMessage: 'This field is required',
            SummaryViewTitle: 'Summary View',
            OtherFields: 'Other Fields',
            AND: 'AND',
            OR: 'OR',
            NOT: 'NOT',
            SelectValue: 'Enter Value',
            IsEmpty: 'Is Empty',
            IsNotEmpty: 'Is Not Empty',
            IsNull: 'Is Null',
            IsNotNull: 'Is Not Null',
            True: 'true',
            False: 'false'
        };
        this.l10n = new L10n('querybuilder', this.defaultLocale, this.locale);
        this.intl = new Internationalization(this.locale);
        this.groupIdCounter = 0;
        this.ruleIdCounter = 0;
        this.btnGroupId = 0;
        this.isImportRules = false;
        this.parser = [];
        this.customOperators = {
            stringOperator: [
                { value: 'startswith', key: this.l10n.getConstant('StartsWith') },
                { value: 'endswith', key: this.l10n.getConstant('EndsWith') },
                { value: 'contains', key: this.l10n.getConstant('Contains') },
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') },
                { value: 'isempty', key: this.l10n.getConstant('IsEmpty') },
                { value: 'isnotempty', key: this.l10n.getConstant('IsNotEmpty') }
            ],
            dateOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }
            ],
            booleanOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') }
            ],
            numberOperator: [
                { value: 'equal', key: this.l10n.getConstant('Equal') },
                { value: 'greaterthanorequal', key: this.l10n.getConstant('GreaterThanOrEqual') },
                { value: 'greaterthan', key: this.l10n.getConstant('GreaterThan') },
                { value: 'between', key: this.l10n.getConstant('Between') },
                { value: 'lessthan', key: this.l10n.getConstant('LessThan') },
                { value: 'notbetween', key: this.l10n.getConstant('NotBetween') },
                { value: 'lessthanorequal', key: this.l10n.getConstant('LessThanOrEqual') },
                { value: 'notequal', key: this.l10n.getConstant('NotEqual') },
                { value: 'in', key: this.l10n.getConstant('In') },
                { value: 'notin', key: this.l10n.getConstant('NotIn') }
            ],
        };
        this.operators = {
            equal: '=', notequal: '!=', greaterthan: '>', greaterthanorequal: '>=', lessthan: '<', in: 'IN', notin: 'NOT IN',
            lessthanorequal: '<=', startswith: 'LIKE', endswith: 'LIKE', between: 'BETWEEN', notbetween: 'NOT BETWEEN', contains: 'LIKE',
            isnull: 'IS NULL', isnotnull: 'IS NOT NULL', isempty: 'IS EMPTY', isnotempty: 'IS NOT EMPTY', notstartswith: 'NOT LIKE',
            notendswith: 'NOT LIKE', notcontains: 'NOT LIKE'
        };
        if (!this.fields) {
            this.fields = { text: 'label', value: 'field' };
        }
    }
    render() {
        this.levelColl = {};
        this.items = [
            {
                text: this.l10n.getConstant('AddGroup'),
                iconCss: 'e-icons e-add-icon e-addgroup'
            },
            {
                text: this.l10n.getConstant('AddCondition'),
                iconCss: 'e-icons e-add-icon e-addrule',
            }
        ];
        this.ruleElem = this.ruleTemplate();
        this.groupElem = this.groupTemplate();
        if (!isBlazor()) {
            let stringOper = [
                { value: 'isnull', key: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
            ];
            let numberOper = [
                { value: 'isnull', key: this.l10n.getConstant('IsNull') },
                { value: 'isnotnull', key: this.l10n.getConstant('IsNotNull') }
            ];
            this.customOperators['stringOperator'] = this.customOperators['stringOperator'].concat(stringOper); // tslint:disable-line
            this.customOperators['numberOperator'] = this.customOperators['numberOperator'].concat(numberOper); // tslint:disable-line
        }
        if (this.dataSource instanceof DataManager) {
            this.dataManager = this.dataSource;
            this.executeDataManager(new Query().take(1));
        }
        else {
            this.dataManager = new DataManager(this.dataSource);
            this.dataColl = this.dataManager.executeLocal(new Query());
            this.initControl();
        }
        this.renderComplete();
    }
    templateParser(template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }
    executeDataManager(query) {
        let data = this.dataManager.executeQuery(query);
        let deferred = new Deferred();
        data.then((e) => {
            if (e.actual && e.actual.result) {
                this.dataColl = e.actual.result;
            }
            else {
                this.dataColl = e.result;
            }
            this.initControl();
        }).catch((e) => {
            deferred.reject(e);
        });
    }
    initControl() {
        this.initialize();
        this.initWrapper();
        this.wireEvents();
    }
    wireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.add(wrapper, 'click', this.clickEventHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusEventHandler, this);
        EventHandler.add(wrapper, 'focusin', this.focusEventHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyBoardHandler, this);
    }
    unWireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.remove(wrapper, 'click', this.clickEventHandler);
        EventHandler.remove(wrapper, 'focusout', this.focusEventHandler);
        EventHandler.remove(wrapper, 'focusin', this.focusEventHandler);
        EventHandler.remove(this.element, 'keydown', this.keyBoardHandler);
    }
    getParentGroup(target, isParent) {
        let groupLevel = (target instanceof Element) ? this.levelColl[target.id] : this.levelColl[target];
        let len = isParent ? groupLevel.length - 1 : groupLevel.length;
        let rule = this.rule;
        for (let i = 0; i < len; i++) {
            rule = this.findGroupByIdx(groupLevel[i], rule, i === 0);
        }
        return rule;
    }
    deleteGroup(target) {
        let groupElem = target;
        let groupId = groupElem.id.replace(this.element.id + '_', '');
        let args = { groupID: groupId, cancel: false, type: 'deleteGroup' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, (observedChangeArgs) => {
                this.deleteGroupSuccessCallBack(observedChangeArgs, target);
            });
        }
        else {
            this.deleteGroupSuccessCallBack(args, target);
        }
    }
    deleteGroupSuccessCallBack(args, target) {
        if (!args.cancel) {
            if (this.actionButton) {
                getComponent(this.actionButton, 'tooltip').destroy();
            }
            let groupElem = target;
            let rule = this.getParentGroup(groupElem, true);
            let index = 0;
            let i;
            let len;
            let beforeRules = this.getValidRules(this.rule);
            let nextElem = groupElem.nextElementSibling;
            let prevElem = groupElem.previousElementSibling;
            let element = groupElem.querySelectorAll('.e-group-container');
            let valElem = groupElem.querySelectorAll('.e-tooltip');
            len = valElem.length;
            for (i = 0; i < len; i++) {
                getComponent(valElem[i], 'tooltip').destroy();
            }
            for (i = 0, len = element.length; i < len; i++) {
                delete this.levelColl[element[i].id];
            }
            while (groupElem.previousElementSibling !== null) {
                groupElem = groupElem.previousElementSibling;
                index++;
            }
            if (nextElem && nextElem.className.indexOf('e-separate-rule') > -1) {
                removeClass([nextElem], 'e-separate-rule');
                addClass([nextElem], 'e-joined-rule');
                if (prevElem && prevElem.className.indexOf('e-rule-container') > -1) {
                    addClass([prevElem], 'e-prev-joined-rule');
                }
            }
            let elem = groupElem.parentElement.parentElement.parentElement;
            let removeString = [];
            // tslint:disable
            if (this.isReact || this.isAngular) {
                let remRule = rule.rules[index];
                let ruleElemColl = target.querySelectorAll('.e-rule-container');
                if (remRule && remRule.rules) {
                    for (let r = 0; r < remRule.rules.length; r++) {
                        let column = this.getColumn(remRule.rules[r].field);
                        if (column && (column.ruleTemplate || this.isPlatformTemplate(column))) {
                            removeString.push(ruleElemColl[r].id);
                        }
                    }
                }
            }
            detach(target);
            if (removeString.length) {
                this.clearQBTemplate(removeString);
            }
            rule.rules.splice(index, 1);
            delete this.levelColl[args.groupID];
            this.refreshLevelColl();
            this.disableRuleCondition(elem, rule);
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteGroup');
        }
    }
    isPlatformTemplate(column) {
        let isTemp = false;
        isTemp = column.template && (typeof column.template === 'string' || column.template.create === undefined);
        return isTemp;
    }
    deleteRule(target) {
        let groupElem = closest(target, '.e-group-container');
        let ruleID;
        let groupID;
        groupID = groupElem.id.replace(this.element.id + '_', '');
        ruleID = closest(target, '.e-rule-container').id.replace(this.element.id + '_', '');
        let args = { groupID: groupID, ruleID: ruleID, cancel: false, type: 'deleteRule' };
        if (!this.isImportRules) {
            this.trigger('beforeChange', args, (observedChangeArgs) => {
                this.deleteRuleSuccessCallBack(observedChangeArgs, target);
            });
        }
        else {
            this.deleteRuleSuccessCallBack(args, target);
        }
    }
    deleteRuleSuccessCallBack(args, target) {
        if (!args.cancel) {
            if (this.actionButton && this.actionButton.className.indexOf('e-tooltip') > -1) {
                getComponent(this.actionButton, 'tooltip').destroy();
            }
            let groupElem = closest(target, '.e-group-container');
            let rule = this.getParentGroup(groupElem);
            let ruleElem = closest(target, '.e-rule-container');
            let beforeRules = this.getValidRules(this.rule);
            let clnruleElem = ruleElem;
            let nextElem = ruleElem.nextElementSibling;
            let prevElem = ruleElem.previousElementSibling;
            let index = 0;
            let valElem = ruleElem.querySelectorAll('.e-tooltip');
            let i;
            let len = valElem.length;
            let column;
            for (i = 0; i < len; i++) {
                getComponent(valElem[i], 'tooltip').destroy();
            }
            while (ruleElem.previousElementSibling !== null) {
                ruleElem = ruleElem.previousElementSibling;
                index++;
            }
            column = this.getColumn(rule.rules[index].field);
            if (column && column.template && clnruleElem.querySelector('.e-template')) {
                this.templateDestroy(column, clnruleElem.querySelector('.e-template').id);
            }
            if (!prevElem || prevElem.className.indexOf('e-rule-container') < 0) {
                if (nextElem) {
                    removeClass([nextElem], 'e-joined-rule');
                }
            }
            if (!nextElem || nextElem.className.indexOf('e-rule-container') < 0) {
                if (prevElem) {
                    removeClass([prevElem], 'e-prev-joined-rule');
                }
            }
            detach(clnruleElem);
            if (column && column.ruleTemplate) {
                this.clearQBTemplate([ruleElem.id]);
            }
            if (column && this.isPlatformTemplate(column)) {
                this.clearQBTemplate([clnruleElem.id]);
            }
            rule.rules.splice(index, 1);
            if (!(rule.rules[0] && rule.rules[0].rules)) {
                this.disableRuleCondition(groupElem, rule);
            }
            if (!this.isImportRules) {
                this.trigger('change', args);
            }
            this.filterRules(beforeRules, this.getValidRules(this.rule), 'deleteRule');
        }
    }
    setGroupRules(rule) {
        this.reset();
        this.groupIdCounter = 1;
        this.ruleIdCounter = 0;
        this.isImportRules = true;
        this.rule = rule;
        rule = this.getRuleCollection(this.rule, false);
        this.importRules(this.rule, this.element.querySelector('.e-group-container'), true);
        this.isImportRules = false;
    }
    keyBoardHandler(e) {
        if (this.readonly && (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13)) {
            e.preventDefault();
        }
    }
    clearQBTemplate(ruleElemColl) {
        // tslint:disable
        if (this.isReact || this.isAngular) {
            this.clearTemplate(ruleElemColl);
        }
    }
    disableRuleCondition(groupElem, rules) {
        if (this.readonly) {
            return;
        }
        let count = groupElem.querySelector('.e-rule-list').childElementCount;
        let andElem = groupElem.querySelector('.e-btngroup-and');
        let orElem = groupElem.querySelector('.e-btngroup-or');
        if (count > 1) {
            andElem.disabled = false;
            orElem.disabled = false;
            if (orElem.nextElementSibling.classList.contains('e-btn-disable') ||
                andElem.nextElementSibling.classList.contains('e-btn-disable')) {
                orElem.nextElementSibling.classList.remove('e-btn-disable');
                andElem.nextElementSibling.classList.remove('e-btn-disable');
            }
            rules && rules.condition === 'or' ? orElem.checked = true : andElem.checked = true;
        }
        else {
            andElem.checked = false;
            andElem.disabled = true;
            orElem.checked = false;
            orElem.disabled = true;
            if (rules) {
                orElem.nextElementSibling.classList.add('e-btn-disable');
                andElem.nextElementSibling.classList.add('e-btn-disable');
            }
        }
    }
    /**
     * return the valid rule or rules collection.
     * @returns RuleModel.
     */
    getValidRules(currentRule) {
        if (!currentRule) {
            currentRule = this.getRules();
        }
        let ruleCondtion = currentRule.condition;
        let notCondition = currentRule.not;
        let ruleColl = extend([], currentRule.rules, [], true);
        let rule = this.getRuleCollection({ condition: ruleCondtion, rules: ruleColl, not: notCondition }, true);
        return rule;
    }
    getRuleCollection(rule, isValidRule) {
        let orgRule;
        if (rule.rules && rule.rules.length && (Object.keys(rule.rules[0]).length > 6 || isValidRule)) {
            let jLen = rule.rules.length;
            for (let j = 0; j < jLen; j++) {
                orgRule = rule.rules[j];
                orgRule = this.getRuleCollection(orgRule, isValidRule);
                rule.rules[j] = orgRule;
                if (Object.keys(orgRule).length < 1 && isValidRule) {
                    rule.rules.splice(j, 1);
                    j--;
                    jLen--;
                }
            }
        }
        if (!rule.condition && rule.condition !== '') {
            if (rule.operator) {
                if (rule.operator.toString().indexOf('null') > -1 || rule.operator.toString().indexOf('empty') > -1) {
                    rule.value = null;
                }
            }
            if ((this.isRefreshed && this.enablePersistence) || (this.rule.field !== '' && rule.operator !== '' && rule.value !== '')) {
                // tslint:disable-next-line:no-any
                let customObj = rule.custom;
                rule = {
                    'label': rule.label, 'field': rule.field, 'operator': rule.operator, 'type': rule.type, 'value': rule.value
                };
                if (customObj) {
                    // tslint:disable-next-line:no-any
                    rule.custom = customObj;
                }
            }
            else {
                rule = {};
            }
        }
        else {
            if (this.enableNotCondition) {
                rule = { 'condition': rule.condition, 'rules': rule.rules, 'not': rule.not };
            }
            else {
                rule = { 'condition': rule.condition, 'rules': rule.rules };
            }
        }
        return rule;
    }
    /**
     * Set the rule or rules collection.
     * @returns void.
     */
    setRules(rule) {
        let mRules = extend({}, rule, {}, true);
        this.setGroupRules(mRules);
    }
    /**
     * Gets the rule or rule collection.
     * @returns object.
     */
    getRules() {
        if (this.enableNotCondition) {
            return { condition: this.rule.condition, rules: this.rule.rules, not: this.rule.not };
        }
        else {
            return { condition: this.rule.condition, rules: this.rule.rules };
        }
    }
    /**
     * Gets the rule.
     * @returns object.
     */
    getRule(elem) {
        let ruleElem;
        let ruleId;
        let index = 0;
        if (elem instanceof HTMLElement) {
            ruleElem = closest(elem, '.e-rule-container');
        }
        else {
            ruleId = this.element.id + '_' + elem;
            ruleElem = document.getElementById(ruleId);
        }
        let groupElem = closest(ruleElem, '.e-group-container');
        let rule = this.getParentGroup(groupElem);
        while (ruleElem.previousElementSibling !== null) {
            ruleElem = ruleElem.previousElementSibling;
            index++;
        }
        return rule.rules[index];
    }
    /**
     * Gets the group.
     * @returns object.
     */
    getGroup(target) {
        if (target instanceof Element && target.className.indexOf('e-group-container') < 1) {
            target = closest(target, '.e-group-container');
        }
        let groupId = (target instanceof Element) ? target.id : this.element.id + '_' + target;
        let rule = this.getParentGroup(groupId);
        if (this.enableNotCondition) {
            return { rules: rule.rules, condition: rule.condition, not: rule.not };
        }
        else {
            return { rules: rule.rules, condition: rule.condition };
        }
    }
    /**
     * Deletes the group or groups based on the group ID.
     * @returns void.
     */
    deleteGroups(groupIdColl) {
        let i;
        let len = groupIdColl.length;
        let groupID;
        for (i = 0; i < len; i++) {
            groupID = this.element.id + '_' + groupIdColl[i];
            this.deleteGroup(document.getElementById(groupID));
        }
    }
    /**
     * return the Query from current rules collection.
     * @returns Promise.
     * @blazorType object
     */
    getFilteredRecords() {
        let predicate = this.getPredicate(this.getValidRules(this.rule));
        let dataManagerQuery;
        dataManagerQuery = isNullOrUndefined(predicate) ? new Query() : new Query().where(predicate);
        if (isBlazor()) {
            let adaptr = new UrlAdaptor();
            let dm = new DataManager({ url: '', adaptor: new UrlAdaptor });
            let state = adaptr.processQuery(dm, dataManagerQuery);
            let data = JSON.parse(state.data);
            return Object.keys(data).length ? data : null;
        }
        else {
            return this.dataManager.executeQuery(dataManagerQuery);
        }
    }
    /**
     * Deletes the rule or rules based on the rule ID.
     * @returns void.
     */
    deleteRules(ruleIdColl) {
        let i;
        let len = ruleIdColl.length;
        let ruleID;
        for (i = 0; i < len; i++) {
            ruleID = this.element.id + '_' + ruleIdColl[i];
            this.deleteRule(document.getElementById(ruleID));
        }
    }
    /**
     * Gets the query for Data Manager.
     * @returns string.
     */
    getDataManagerQuery(rule) {
        let predicate = this.getPredicate(rule);
        let query;
        let fields = [];
        for (let i = 0, len = Object.keys(this.columns); i < len.length; i++) {
            fields.push(this.columns[i].field);
        }
        if (rule.rules.length) {
            query = new Query().select(fields).where(predicate);
        }
        else {
            query = new Query().select(fields);
        }
        return query;
    }
    /**
     * Get the predicate from collection of rules.
     * @returns null
     */
    getPredicate(rule) {
        let ruleColl = rule.rules;
        let pred;
        let pred2;
        let ruleValue;
        let ignoreCase = false;
        let column;
        let ignoreOper = ['notcontains', 'notstartswith', 'notendswith'];
        if (!ruleColl) {
            return pred;
        }
        for (let i = 0, len = ruleColl.length; i < len; i++) {
            let keys = Object.keys(ruleColl[i]);
            ignoreCase = false;
            if (keys.indexOf('rules') > -1 && ruleColl[i].rules) {
                pred2 = this.getPredicate(ruleColl[i]);
                if (pred2) {
                    if (pred) {
                        if (rule.condition === 'and') {
                            pred = pred.and(pred2);
                        }
                        else {
                            pred = pred.or(pred2);
                        }
                    }
                    else {
                        pred = pred2;
                    }
                }
            }
            else if (ruleColl[i].operator.length) {
                let oper = ruleColl[i].operator.toLowerCase();
                let isDateFilter = false;
                let dateOperColl = ['equal', 'notequal', 'greaterthan', 'lessthanorequal'];
                if (ruleColl[i].type === 'string') {
                    ignoreCase = this.matchCase ? false : true;
                }
                if (ruleColl[i].type === 'date' && dateOperColl.indexOf(oper) > -1) {
                    ignoreCase = true;
                }
                column = this.getColumn(ruleColl[i].field);
                if (oper.indexOf('null') > -1 || oper.indexOf('empty') > -1) {
                    ruleColl[i].value = null;
                }
                else if (ruleColl[i].type === 'date' && !(ruleColl[i].value instanceof Array)) {
                    let format = this.getFormat(column.format);
                    ruleValue = this.getDate(ruleColl[i].value, format);
                    if (dateOperColl.indexOf(oper) > -1) {
                        isDateFilter = true;
                    }
                }
                else {
                    ruleValue = ruleColl[i].value;
                }
                if (i === 0) {
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 || oper.indexOf('null') > -1 ||
                        oper.indexOf('empty') > -1) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i], ruleValue) : this.arrayPredicate(ruleColl[i]);
                    }
                    else {
                        let value = ruleValue;
                        if (value !== '' && ignoreOper.indexOf(oper) < 0) {
                            pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                        }
                    }
                }
                else {
                    if (ignoreOper.indexOf(oper) > -1) {
                        continue;
                    }
                    if (isDateFilter || (oper.indexOf('in') > -1 || oper.indexOf('between') > -1 ||
                        oper.indexOf('null') > -1 || oper.indexOf('empty') > -1) && oper.indexOf('contains') < 0) {
                        pred = isDateFilter ? this.datePredicate(ruleColl[i], ruleValue, pred, rule.condition) :
                            this.arrayPredicate(ruleColl[i], pred, rule.condition);
                    }
                    else {
                        if (rule.condition === 'and') {
                            let value = ruleValue;
                            if (pred && value !== '') {
                                pred
                                    = pred.and(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                            else if (value !== '') {
                                pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                        }
                        else {
                            let value = ruleValue;
                            if (pred && value !== '') {
                                pred = pred.or(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                            else if (value !== '') {
                                pred = new Predicate(ruleColl[i].field, ruleColl[i].operator, ruleValue, ignoreCase);
                            }
                        }
                    }
                }
            }
        }
        return pred;
    }
    getLocale() {
        let gregorianFormat = isBlazor() ? '.dates.days.short' : '.dates.calendars.gregorian.days.format.short';
        let localeString = this.locale;
        let mainVal = isBlazor() ? '' : 'main.';
        let cultureObj = getValue(mainVal + '' + this.locale + gregorianFormat, cldrData);
        if (!cultureObj) {
            localeString = 'en';
        }
        return localeString;
    }
    getColumn(field) {
        if (this.separator.length > 0) {
            field = field.split(this.separator)[0];
        }
        let columns = this.columns;
        let column;
        for (let i = 0, iLen = columns.length; i < iLen; i++) {
            if (columns[i].field === field) {
                column = columns[i];
            }
        }
        return column;
    }
    /**
     * return the operator bound to the column.
     * @returns {[key: string]: Object}[].
     */
    getOperators(field) {
        let column = this.getColumn(field);
        return column.operators;
    }
    datePredicate(ruleColl, value, predicate, condition) {
        let pred;
        let dummyDate = new Date(value.getTime());
        let nextDate = new Date(dummyDate.setDate(dummyDate.getDate() + 1));
        switch (ruleColl.operator) {
            case 'equal':
                pred = new Predicate(ruleColl.field, 'greaterthanorequal', value);
                pred = pred.and(ruleColl.field, 'lessthan', nextDate);
                break;
            case 'notequal':
                pred = new Predicate(ruleColl.field, 'lessthan', value);
                pred = pred.or(ruleColl.field, 'greaterthanorequal', nextDate);
                break;
            case 'greaterthan':
                pred = new Predicate(ruleColl.field, 'greaterthanorequal', nextDate);
                break;
            case 'lessthanorequal':
                pred = new Predicate(ruleColl.field, 'lessthan', nextDate);
                break;
        }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                }
                else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            }
            else {
                predicate = pred;
            }
        }
        return predicate;
    }
    arrayPredicate(ruleColl, predicate, condition) {
        let value = ruleColl.value;
        let operator = ruleColl.operator.toString();
        let nullValue = ruleColl.value;
        let format;
        let pred;
        let column = this.getColumn(ruleColl.field);
        format = this.getFormat(column.format);
        if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
            switch (operator) {
                case 'isnull':
                    pred = new Predicate(ruleColl.field, 'isnull', nullValue);
                    break;
                case 'isnotnull':
                    pred = new Predicate(ruleColl.field, 'notnull', nullValue);
                    break;
                case 'isempty':
                    pred = new Predicate(ruleColl.field, 'equal', '');
                    break;
                case 'isnotempty':
                    pred = new Predicate(ruleColl.field, 'notequal', '');
                    break;
            }
        }
        if (!(operator.indexOf('null') > -1 || operator.indexOf('empty') > -1)) {
            for (let j = 0, jLen = value.length; j < jLen; j++) {
                if (value[j] !== '') {
                    if (j === 0) {
                        let gte = 'greaterthanorequal';
                        let lt = 'lessthan';
                        switch (operator) {
                            case 'between':
                                if (column.type === 'date') {
                                    pred = new Predicate(ruleColl.field, gte, value[j] ? this.getDate(value[j], format) : null);
                                }
                                else {
                                    pred = new Predicate(ruleColl.field, gte, value[j]);
                                }
                                break;
                            case 'notbetween':
                                if (column.type === 'date') {
                                    pred = new Predicate(ruleColl.field, lt, value[j] ? this.getDate(value[j], format) : null);
                                }
                                else {
                                    pred = new Predicate(ruleColl.field, lt, value[j]);
                                }
                                break;
                            case 'in':
                                pred = new Predicate(ruleColl.field, 'equal', value[j]);
                                break;
                            case 'notin':
                                pred = new Predicate(ruleColl.field, 'notequal', value[j]);
                                break;
                        }
                    }
                    else {
                        let gt = 'greaterthan';
                        switch (ruleColl.operator) {
                            case 'between':
                                if (column.type === 'date') {
                                    if (value[j]) {
                                        let currDate = this.getDate(value[j], format);
                                        let nextDate = new Date(currDate.setDate(currDate.getDate() + 1));
                                        pred = pred.and(ruleColl.field, 'lessthan', nextDate);
                                    }
                                    else {
                                        pred = pred.and(ruleColl.field, 'lessthan', value[j]);
                                    }
                                }
                                else {
                                    pred = pred.and(ruleColl.field, 'lessthanorequal', value[j]);
                                }
                                break;
                            case 'notbetween':
                                if (column.type === 'date') {
                                    pred = pred.or(ruleColl.field, gt, value[j] ? this.getDate(value[j], format) : value[j]);
                                }
                                else {
                                    pred = pred.or(ruleColl.field, 'greaterthan', value[j]);
                                }
                                break;
                            case 'in':
                                pred = pred.or(ruleColl.field, 'equal', value[j]);
                                break;
                            case 'notin':
                                pred = pred.and(ruleColl.field, 'notequal', value[j]);
                                break;
                        }
                    }
                }
            }
        }
        if (pred) {
            if (predicate) {
                if (condition === 'and') {
                    predicate = predicate.and(pred);
                }
                else if (condition === 'or') {
                    predicate = predicate.or(pred);
                }
            }
            else {
                predicate = pred;
            }
        }
        return predicate;
    }
    getDate(value, format) {
        let currDate = this.intl.parseDate(value, format);
        if (value.indexOf(':') > -1 && (value.indexOf('/') < 0 || value.indexOf(',') < 0)) {
            currDate.setDate(new Date().getDate());
        }
        return currDate;
    }
    importRules(rule, parentElem, isReset) {
        if (!isReset) {
            parentElem = this.renderGroup(rule.condition, parentElem);
        }
        else {
            if (rule.rules.length > 1) {
                // enable/disable conditions when rule group is added
                let orElem = parentElem.querySelector('.e-btngroup-or');
                let andElem = parentElem.querySelector('.e-btngroup-and');
                orElem.disabled = false;
                andElem.disabled = false;
                if (rule.condition === 'or') {
                    orElem.checked = true;
                }
                else {
                    andElem.checked = true;
                }
            }
            else {
                // enable/disable conditions when rule condition is added
                this.disableRuleCondition(parentElem);
            }
            if (this.enableNotCondition) {
                let tglBtnElem = parentElem.querySelector('.e-qb-toggle');
                if (rule.not) {
                    addClass([tglBtnElem], 'e-active-toggle');
                }
                else {
                    removeClass([tglBtnElem], 'e-active-toggle');
                }
            }
        }
        let ruleColl = rule.rules;
        if (!isNullOrUndefined(ruleColl)) {
            for (let i = 0, len = ruleColl.length; i < len; i++) {
                let keys = Object.keys(ruleColl[i]);
                if (!isNullOrUndefined(ruleColl[i].rules) && keys.indexOf('rules') > -1) {
                    parentElem = this.renderGroup(ruleColl[i].condition, parentElem);
                    parentElem = this.importRules(ruleColl[i], parentElem, true);
                }
                else {
                    this.renderRule(ruleColl[i], parentElem);
                }
            }
        }
        parentElem = closest(parentElem, '.e-rule-list');
        if (parentElem) {
            parentElem = closest(parentElem, '.e-group-container');
        }
        return parentElem;
    }
    renderGroup(condition, parentElem) {
        this.addGroupElement(true, parentElem, condition); //Child group
        let element = parentElem.querySelectorAll('.e-group-container');
        return element[element.length - 1];
    }
    renderRule(rule, parentElem) {
        if (parentElem.className.indexOf('e-group-container') > -1) {
            this.addRuleElement(parentElem, rule); //Create rule
        }
        else {
            this.addRuleElement(parentElem.querySelector('.e-group-container'), rule); //Create group
        }
    }
    enableReadonly() {
        let target = this.element;
        let elem = target.querySelectorAll('.e-dropdownlist, .e-numerictextbox, .e-textbox, .e-datepicker, .e-multiselect .e-lib, .e-radio');
        for (let i = 0; i < elem.length; i++) {
            if (elem[i].classList.contains('e-dropdownlist')) {
                let dropDownObj = getInstance(elem[i], DropDownList);
                dropDownObj.readonly = this.isReadonly;
            }
            else if (elem[i].classList.contains('e-numerictextbox')) {
                let numericTextBoxObj = getInstance(elem[i], NumericTextBox);
                numericTextBoxObj.readonly = this.isReadonly;
            }
            else if (elem[i].classList.contains('e-textbox')) {
                let textBoxObj = getInstance(elem[i], TextBox);
                textBoxObj.readonly = this.isReadonly;
            }
            else if (elem[i].classList.contains('e-datepicker')) {
                let datePickerObj = getInstance(elem[i], DatePicker);
                datePickerObj.readonly = this.isReadonly;
            }
            else if (elem[i].classList.contains('e-multiselect')) {
                let multiSelectObj = getInstance(elem[i], MultiSelect);
                multiSelectObj.readonly = this.isReadonly;
            }
            else if (elem[i].classList.contains('e-radio')) {
                let radioButtonObj = getInstance(elem[i], RadioButton);
                if (!radioButtonObj.checked) {
                    if (this.isReadonly) {
                        elem[i].parentElement.style.display = 'none';
                    }
                    else {
                        elem[i].parentElement.style.display = 'inherit';
                    }
                }
            }
        }
        let deleteGroupElems = this.element.querySelectorAll('.e-deletegroup');
        let addRuleGroupElems = this.element.querySelectorAll('.e-addrulegroup');
        let removeRuleElems = this.element.querySelectorAll('.e-removerule');
        if (!this.isReadonly && this.ruleElem.classList.contains('e-readonly')) {
            this.ruleElem.classList.remove('e-readonly');
        }
        let elems = [deleteGroupElems, addRuleGroupElems, removeRuleElems];
        for (let i = 0; i < elems.length; i++) {
            elems[i].forEach((elem) => {
                if (elem.classList.contains('e-readonly')) {
                    elem.classList.remove('e-readonly');
                }
                else {
                    elem.classList.add('e-readonly');
                }
            });
        }
        this.enableBtnGroup();
    }
    enableBtnGroup() {
        let elems = this.element.querySelectorAll('.e-btngroup-and-lbl, .e-btngroup-or-lbl, .e-qb-toggle');
        let not = false;
        elems.forEach((elem) => {
            if (elem.classList.contains('e-qb-toggle') && !elem.classList.contains('e-active-toggle')
                && !elem.classList.contains('e-readonly')) {
                elem.classList.add('e-readonly');
                not = false;
            }
            else if (elem.classList.contains('e-qb-toggle') && elem.classList.contains('e-not-readonly')) {
                elem.classList.remove('e-not-readonly');
            }
            else if (elem.classList.contains('e-qb-toggle') && elem.classList.contains('e-readonly')) {
                elem.classList.remove('e-readonly');
            }
            else if (elem.classList.contains('e-active-toggle')) {
                elem.classList.add('e-not-readonly');
                not = true;
            }
            else if (elem.previousElementSibling.checked || elem.classList.contains('e-readonly')) {
                elem.classList.remove('e-readonly');
                if (not) {
                    if (elem.textContent === 'AND') {
                        elem.classList.add('e-readonly-and');
                    }
                    else {
                        elem.classList.add('e-readonly-or');
                    }
                }
                else {
                    if (elem.textContent === 'AND' && this.isReadonly) {
                        elem.classList.remove('e-not');
                        elem.classList.add('e-readonly-and');
                    }
                    else {
                        if (this.enableNotCondition) {
                            elem.classList.add('e-not');
                        }
                        elem.classList.remove('e-readonly-and');
                    }
                    if (elem.textContent === 'OR' && this.isReadonly) {
                        elem.classList.add('e-readonly-or-not');
                    }
                    else {
                        elem.classList.remove('e-readonly-or-not');
                    }
                }
            }
            else if (elem.classList.contains('e-btn-disable')) {
                // do nothing
            }
            else {
                elem.classList.add('e-readonly');
            }
        });
    }
    getSqlString(rules, enableEscape, queryStr) {
        let isRoot = false;
        if (!queryStr && queryStr !== '') {
            queryStr = '';
            isRoot = true;
        }
        else {
            queryStr += '(';
        }
        let condition = rules.condition;
        if (rules.not) {
            if (isRoot) {
                queryStr += 'NOT (';
            }
            else {
                queryStr += ' NOT (';
            }
        }
        for (let j = 0, jLen = rules.rules.length; j < jLen; j++) {
            if (rules.rules[j].rules) {
                queryStr = this.getSqlString(rules.rules[j], enableEscape, queryStr);
            }
            else {
                let rule = rules.rules[j];
                let valueStr = '';
                if (rule.value instanceof Array) {
                    if (rule.operator.toString().indexOf('between') > -1) {
                        if (rule.type === 'date') {
                            valueStr += '"' + rule.value[0] + '" AND "' + rule.value[1] + '"';
                        }
                        else {
                            valueStr += rule.value[0] + ' AND ' + rule.value[1];
                        }
                    }
                    else {
                        if (typeof rule.value[0] === 'string' && rule.value !== null) {
                            valueStr += '("' + rule.value[0] + '"';
                            for (let k = 1, kLen = rule.value.length; k < kLen; k++) {
                                valueStr += ',"' + rule.value[k] + '"';
                            }
                            valueStr += ')';
                        }
                        else {
                            valueStr += '(' + rule.value + ')';
                        }
                    }
                }
                else {
                    if (rule.operator.toString().indexOf('startswith') > -1) {
                        valueStr += rule.value ? '("' + rule.value + '%")' : '(' + rule.value + ')';
                    }
                    else if (rule.operator.toString().indexOf('endswith') > -1) {
                        valueStr += rule.value ? '("%' + rule.value + '")' : '(' + rule.value + ')';
                    }
                    else if (rule.operator.toString().indexOf('contains') > -1) {
                        valueStr += rule.value ? '("%' + rule.value + '%")' : '(' + rule.value + ')';
                    }
                    else {
                        if (rule.type === 'number' || typeof rule.value === 'boolean' || rule.value === null) {
                            valueStr += rule.value;
                        }
                        else {
                            valueStr += '"' + rule.value + '"';
                        }
                    }
                }
                if (rule.operator.toString().indexOf('null') > -1 || (rule.operator.toString().indexOf('empty') > -1)) {
                    if (enableEscape) {
                        rule.field = '`' + rule.field + '`';
                    }
                    queryStr += rule.field + ' ' + this.operators[rule.operator];
                }
                else {
                    if (enableEscape) {
                        rule.field = '`' + rule.field + '`';
                    }
                    queryStr += rule.field + ' ' + this.operators[rule.operator] + ' ' + valueStr;
                }
            }
            if (j !== jLen - 1) {
                queryStr += ' ' + condition.toUpperCase() + ' ';
            }
        }
        if (!isRoot) {
            queryStr += ')';
        }
        if (rules.not) {
            queryStr += ')';
        }
        return queryStr;
    }
    /**
     * Sets the rules from the sql query.
     */
    setRulesFromSql(sqlString) {
        sqlString = sqlString.replace(/`/g, '');
        let ruleModel = this.getRulesFromSql(sqlString);
        this.setRules({ condition: ruleModel.condition, not: ruleModel.not, rules: ruleModel.rules });
    }
    /**
     * Get the rules from SQL query.
     * @returns object.
     */
    getRulesFromSql(sqlString) {
        this.parser = [];
        this.sqlParser(sqlString);
        this.rule = { condition: 'and', not: false, rules: [] };
        let rule = this.processParser(this.parser, this.rule, [0]);
        if (this.enableNotCondition) {
            return { condition: rule.condition, not: rule.not, rules: rule.rules };
        }
        else {
            return { condition: rule.condition, rules: rule.rules };
        }
    }
    /**
     * Gets the sql query from rules.
     * @returns object.
     */
    getSqlFromRules(rule, allowEscape) {
        if (!rule) {
            rule = this.getValidRules();
        }
        rule = this.getRuleCollection(rule, false);
        return this.getSqlString(this.getValidRules(rule), allowEscape).replace(/"/g, '\'');
    }
    sqlParser(sqlString) {
        let st = 0;
        let str;
        do {
            str = sqlString.slice(st);
            st += this.parseSqlStrings(str);
        } while (str !== '');
        return this.parser;
    }
    parseSqlStrings(sqlString) {
        let operators = ['=', '!=', '<=', '>=', '<', '>'];
        let conditions = ['AND', 'OR', 'NOT'];
        let subOp = ['IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL',
            'IS EMPTY', 'IS NOT EMPTY'];
        let regexStr;
        let regex;
        let matchValue;
        for (let i = 0, iLen = operators.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(operators[i]) ? '\\b' : '';
            regex = new RegExp('^(' + operators[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['Operators', operators[i].toLowerCase()]);
                return operators[i].length;
            }
        }
        let lastPasrser = this.parser[this.parser.length - 1];
        if (!lastPasrser || (lastPasrser && lastPasrser[0] !== 'Literal')) {
            for (let i = 0, iLen = conditions.length; i < iLen; i++) {
                regexStr = /^\w+$/.test(conditions[i]) ? '\\b' : '';
                regex = new RegExp('^(' + conditions[i] + ')' + regexStr, 'ig');
                if (regex.exec(sqlString)) {
                    this.parser.push(['Conditions', conditions[i].toLowerCase()]);
                    return conditions[i].length;
                }
            }
        }
        for (let i = 0, iLen = subOp.length; i < iLen; i++) {
            regexStr = /^\w+$/.test(subOp[i]) ? '\\b' : '';
            regex = new RegExp('^(' + subOp[i] + ')' + regexStr, 'ig');
            if (regex.exec(sqlString)) {
                this.parser.push(['SubOperators', subOp[i].toLowerCase()]);
                return subOp[i].length;
            }
        }
        //Left Parenthesis
        if (/^\(/.exec(sqlString)) {
            this.parser.push(['Left', '(']);
            return 1;
        }
        //Right Parenthesis
        if (/^\)/.exec(sqlString)) {
            this.parser.push(['Right', ')']);
            return 1;
        }
        //Boolean
        if (/^(true|false)/.exec(sqlString)) {
            matchValue = /^(true|false)/.exec(sqlString)[0];
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        //Null
        if (/^null/.exec(sqlString)) {
            matchValue = /^null/.exec(sqlString)[0];
            this.parser.push(['String', null]);
            return matchValue.length;
        }
        //Literals
        if (/^`?([a-z_][a-z0-9_.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)) {
            matchValue = /^`?([a-z_][a-z0-9_.\[\]\(\)]{0,}(\:(number|float|string|date|boolean))?)`?/i.exec(sqlString)[1];
            this.parser.push(['Literal', matchValue]);
            return matchValue.length;
        }
        //String
        if (/^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)) {
            matchValue = /^'((?:[^\\']+?|\\.|'')*)'(?!')/.exec(sqlString)[0];
            this.parser.push(['String', matchValue]);
            return matchValue.length;
        }
        //Double String
        if (/^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)) {
            matchValue = /^"([^\\"]*(?:\\.[^\\"]*)*)"/.exec(sqlString)[0];
            this.parser.push(['DoubleString', matchValue]);
            return matchValue.length;
        }
        //Number
        if (/^[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            matchValue = /^[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        //Negative Number
        if (/^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)) {
            matchValue = /^-?[0-9]+(\.[0-9]+)?/.exec(sqlString)[0];
            this.parser.push(['Number', matchValue]);
            return matchValue.length;
        }
        return 1;
    }
    getOperator(value, operator) {
        let operators = {
            '=': 'equal', '!=': 'notequal', '<': 'lessthan', '>': 'greaterthan', '<=': 'lessthanorequal',
            '>=': 'greaterthanorequal', 'in': 'in', 'not in': 'notin', 'between': 'between', 'not between': 'notbetween',
            'is empty': 'isempty', 'is null': 'isnull', 'is not null': 'isnotnull', 'is not empty': 'isnotempty'
        };
        if (value) {
            if (value.indexOf('%') === 0 && value[value.length - 1] === '%') {
                return (operator === 'not like') ? 'notcontains' : 'contains';
            }
            else if (value.indexOf('%') !== 0 && value.indexOf('%') === value.length - 1) {
                return (operator === 'not like') ? 'notstartswith' : 'startswith';
            }
            else if (value.indexOf('%') === 0 && value.indexOf('%') !== value.length - 1) {
                return (operator === 'not like') ? 'notendswith' : 'endswith';
            }
        }
        else {
            if (operator === 'not like') {
                return 'notequal';
            }
            else if (operator === 'like') {
                return 'equal';
            }
        }
        return operators[operator];
    }
    getTypeFromColumn(rules) {
        let columnData = this.columns;
        for (let i = 0; i < columnData.length; i++) {
            if (columnData[i].field === rules.field) {
                rules.type = columnData[i].type;
                break;
            }
        }
        return rules.type;
    }
    processParser(parser, rules, levelColl) {
        let j;
        let jLen;
        let rule;
        let subRules;
        let numVal = [];
        let strVal = [];
        let k;
        let kLen;
        let l;
        let lLen;
        let grpCount;
        let operator;
        for (let i = 0, iLen = parser.length; i < iLen; i++) {
            if (parser[i][0] === 'Literal') {
                rule = { label: parser[i][1], field: parser[i][1] };
                if (parser[i + 1][0] === 'SubOperators') {
                    if (parser[i + 1][1].indexOf('null') > -1 || parser[i + 1][1].indexOf('empty') > -1) {
                        rule.operator = this.getOperator(' ', parser[i + 1][1]);
                        rule.value = null;
                        rule.type = this.getTypeFromColumn(rule);
                    }
                    else {
                        let oper = parser[i + 3][1] ? parser[i + 3][1].replace(/'/g, '') : parser[i + 3][1];
                        rule.operator = this.getOperator(oper, parser[i + 1][1]);
                    }
                    operator = parser[i + 1][1];
                    i++;
                    j = i + 1;
                    jLen = iLen;
                    for (j = i + 1; j < jLen; j++) {
                        if (parser[j][0] === 'Right') {
                            i = j;
                            break;
                        }
                        else {
                            if (operator.indexOf('null') > -1 || operator.indexOf('empty') > -1) {
                                break;
                            }
                            if (operator.indexOf('like') > -1 && parser[j][0] === 'String') {
                                let val = parser[j][1] ? parser[j][1].replace(/'/g, '').replace(/%/g, '') : parser[j][1];
                                rule.value = val;
                                rule.type = 'string';
                            }
                            else if (operator.indexOf('between') > -1) {
                                if (parser[j][0] === 'Literal' || parser[j][0] === 'Left') {
                                    break;
                                }
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                }
                                else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                            else {
                                if (parser[j][0] === 'Number') {
                                    numVal.push(Number(parser[j][1]));
                                }
                                else if (parser[j][0] === 'String') {
                                    strVal.push(parser[j][1].replace(/'/g, ''));
                                }
                            }
                            rule.type = this.getTypeFromColumn(rule);
                        }
                    }
                    if (operator.indexOf('like') < 0) {
                        if (parser[j - 1][0] === 'Number') {
                            rule.value = numVal;
                            rule.type = 'number';
                        }
                        else if (parser[j - 1][0] === 'String') {
                            rule.value = strVal;
                            rule.type = 'string';
                        }
                        else if (operator.indexOf('between') > -1 && parser[j - 1][0] === 'Conditions') {
                            rule.value = numVal;
                            rule.type = 'number';
                        }
                        numVal = [];
                        strVal = [];
                        rule.type = this.getTypeFromColumn(rule);
                    }
                }
                else if (parser[i + 1][0] === 'Operators') {
                    rule.operator = this.getOperator(parser[i + 2][1], parser[i + 1][1]);
                    if (parser[i + 2][0] === 'Number') {
                        rule.type = 'number';
                        rule.value = Number(parser[i + 2][1]);
                    }
                    else {
                        rule.type = 'string';
                        rule.value = parser[i + 2][1] ? parser[i + 2][1].replace(/'/g, '') : parser[i + 2][1];
                    }
                    rule.type = this.getTypeFromColumn(rule);
                }
                rules.rules.push(rule);
            }
            else if (parser[i][0] === 'Left') {
                if (!(parser[0][0] === 'Left') && parser[i - 1][1] === 'not') {
                    continue;
                }
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                if (this.enableNotCondition) {
                    subRules = { condition: 'and', rules: [], not: false };
                }
                else {
                    subRules = { condition: 'and', rules: [] };
                }
                grpCount = 0;
                kLen = rules.rules.length;
                for (k = 0; k < kLen; k++) { //To get the group position
                    if (rules.rules[k].rules) {
                        grpCount++;
                    }
                }
                levelColl.push(grpCount);
                rules.rules.push(subRules);
                subRules = this.processParser(this.parser, subRules, levelColl);
                return rules;
            }
            else if (parser[i][0] === 'Conditions') {
                if (parser[i][1] === 'not') {
                    rules.not = true;
                }
                else {
                    rules.condition = parser[i][1];
                }
            }
            else if (parser[i][0] === 'Right') {
                this.parser = parser.splice(i + 1, iLen - (i + 1));
                levelColl.pop(); //To get the parent Group
                rules = this.rule;
                lLen = levelColl.length;
                for (l = 0; l < lLen; l++) {
                    rules = this.findGroupByIdx(levelColl[l], rules, l === 0);
                }
                return this.processParser(this.parser, rules, levelColl);
            }
        }
        return rules;
    }
};
__decorate([
    Event()
], QueryBuilder.prototype, "created", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "actionBegin", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "beforeChange", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "change", void 0);
__decorate([
    Event()
], QueryBuilder.prototype, "ruleChange", void 0);
__decorate([
    Property({ ruleDelete: true, groupInsert: true, groupDelete: true })
], QueryBuilder.prototype, "showButtons", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "summaryView", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "allowValidation", void 0);
__decorate([
    Property([])
], QueryBuilder.prototype, "columns", void 0);
__decorate([
    Property('')
], QueryBuilder.prototype, "cssClass", void 0);
__decorate([
    Property([])
], QueryBuilder.prototype, "dataSource", void 0);
__decorate([
    Property('Horizontal')
], QueryBuilder.prototype, "displayMode", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "enablePersistence", void 0);
__decorate([
    Property('Default')
], QueryBuilder.prototype, "sortDirection", void 0);
__decorate([
    Property(5)
], QueryBuilder.prototype, "maxGroupCount", void 0);
__decorate([
    Property('auto')
], QueryBuilder.prototype, "height", void 0);
__decorate([
    Property('auto')
], QueryBuilder.prototype, "width", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "matchCase", void 0);
__decorate([
    Property(0)
], QueryBuilder.prototype, "immediateModeDelay", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "enableNotCondition", void 0);
__decorate([
    Property(false)
], QueryBuilder.prototype, "readonly", void 0);
__decorate([
    Property('')
], QueryBuilder.prototype, "separator", void 0);
__decorate([
    Complex({ condition: 'and', rules: [] }, Rule)
], QueryBuilder.prototype, "rule", void 0);
QueryBuilder = __decorate([
    NotifyPropertyChanges
], QueryBuilder);

/**
 * QueryBuilder modules
 */

/**
 * QueryBuilder all modules
 */

export { Columns, Rule, ShowButtons, QueryBuilder };
//# sourceMappingURL=ej2-querybuilder.es2015.js.map
