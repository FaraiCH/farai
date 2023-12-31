"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e2e_1 = require("@syncfusion/ej2-base/helpers/e2e");
class TreeGridHelper extends e2e_1.TestHelper {
    constructor(id, wrapperFn) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }
    getDataGridElement() {
        return this.selector('#' + this.id);
    }
    getHeaderElement() {
        return this.selector('#' + this.id + ' .e-gridheader');
    }
    getContentElement() {
        return this.selector('#' + this.id + ' .e-gridcontent');
    }
    getFooterElement() {
        return this.selector('#' + this.id + ' .e-gridfooter');
    }
    getPagerElement() {
        return this.selector('#' + this.id + ' .e-gridpager');
    }
    getDialogElement() {
        return this.selector('#' + this.id + '_gridcontrol_dialogEdit_wrapper');
    }
    getFilterPopupElement() {
        return this.selector('#' + this.id + ' .e-filter-popup');
    }
    getToolbarElement() {
        return this.selector('#' + this.id + '_gridcontrol_toolbarItems');
    }
    getCurrentPagerElement() {
        return this.selector('#' + this.id + ' .e-numericitem.e-currentitem');
    }
    getPagerDropDownElement() {
        return this.selector('#' + this.id + ' .e-pagerdropdown');
    }
    getExpandedElements() {
        return this.selector('#' + this.id + ' .e-treegridexpand');
    }
    getCollapsedElements() {
        return this.selector('#' + this.id + ' .e-treegridcollapsed');
    }
    setModel(property, value) {
        let cy;
        return cy.get('#' + this.id).then((ele) => {
            return ele[0].ej2_instances[0][property] = value;
        });
    }
    getModel(property) {
        let cy;
        return cy.get('#' + this.id).then((ele) => {
            return ele[0].ej2_instances[0][property];
        });
    }
    invoke(fName, args = []) {
        let cy;
        return cy.get('#' + this.id).then((ele) => {
            var inst = ele[0].ej2_instances[0];
            return inst[fName].apply(inst, args);
        });
    }
}
exports.TreeGridHelper = TreeGridHelper;
