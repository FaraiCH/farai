import { createElement, append, isBlazor } from '@syncfusion/ej2-base';
/**
 * `PagerMessage` module is used to display pager information.
 */
var PagerMessage = /** @class */ (function () {
    /**
     * Constructor for externalMessage module
     * @hidden
     */
    function PagerMessage(pagerModule) {
        this.pagerModule = pagerModule;
    }
    /**
     * The function is used to render pager message
     * @hidden
     */
    PagerMessage.prototype.render = function () {
        var div = createElement('div', { className: 'e-parentmsgbar', attrs: { 'aria-label': 'Pager Information' } });
        this.pageNoMsgElem = createElement('span', { className: 'e-pagenomsg', styles: 'textalign:right' });
        this.pageCountMsgElem = createElement('span', { className: 'e-pagecountmsg', styles: 'textalign:right' });
        append([this.pageNoMsgElem, this.pageCountMsgElem], div);
        this.pagerModule.element.appendChild(div);
        this.refresh();
    };
    /**
     * Refreshes the pager information.
     */
    PagerMessage.prototype.refresh = function () {
        var pagerObj = this.pagerModule;
        if (isBlazor()) {
            this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('CurrentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                    pagerObj.currentPage, pagerObj.totalPages || 0]) + ' ';
            this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('TotalItemsInfo'), [pagerObj.totalRecordsCount || 0]);
        }
        else {
            this.pageNoMsgElem.textContent = this.format(pagerObj.getLocalizedLabel('currentPageInfo'), [pagerObj.totalRecordsCount === 0 ? 0 :
                    pagerObj.currentPage, pagerObj.totalPages || 0, pagerObj.totalRecordsCount || 0]) + ' ';
            this.pageCountMsgElem.textContent = this.format(pagerObj.getLocalizedLabel(pagerObj.totalRecordsCount <= 1 ? 'totalItemInfo' : 'totalItemsInfo'), [pagerObj.totalRecordsCount || 0, pagerObj.totalRecordsCount ? (pagerObj.pageSize * (pagerObj.currentPage - 1)) + 1 : 0,
                pagerObj.pageSize * pagerObj.currentPage > pagerObj.totalRecordsCount ? pagerObj.totalRecordsCount :
                    pagerObj.pageSize * pagerObj.currentPage]);
        }
        this.pageNoMsgElem.parentElement.setAttribute('aria-label', this.pageNoMsgElem.textContent + this.pageCountMsgElem.textContent);
    };
    /**
     * Hides the Pager information.
     */
    PagerMessage.prototype.hideMessage = function () {
        if (this.pageNoMsgElem) {
            this.pageNoMsgElem.style.display = 'none';
        }
        if (this.pageCountMsgElem) {
            this.pageCountMsgElem.style.display = 'none';
        }
    };
    /**
     * Shows the Pager information.
     */
    PagerMessage.prototype.showMessage = function () {
        if (!this.pageNoMsgElem) {
            this.render();
        }
        this.pageNoMsgElem.style.display = '';
        this.pageCountMsgElem.style.display = '';
    };
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}
     * @hidden
     */
    PagerMessage.prototype.destroy = function () {
        //destroy
    };
    PagerMessage.prototype.format = function (str, args) {
        var regx;
        for (var i = 0; i < args.length; i++) {
            regx = new RegExp('\\{' + (i) + '\\}', 'gm');
            str = str.replace(regx, args[i].toString());
        }
        return str;
    };
    return PagerMessage;
}());
export { PagerMessage };
