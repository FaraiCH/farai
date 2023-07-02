import { Browser, setStyleAttribute as setBaseStyleAttribute, getComponent } from '@syncfusion/ej2-base';
import { clearViewer, deleteImage, createImageElement, refreshImgCellObj } from './index';
import { getRowsHeight, getColumnsWidth, getSwapRange, clearCells } from '../../workbook/index';
import { getRangeIndexes, wrap, setRowHeight, insertModel, } from '../../workbook/index';
import { initiateSort, getIndexesFromAddress, getRowHeight, setMerge } from '../../workbook/index';
import { setValidation, removeValidation, clearCFRule, setCFRule } from '../../workbook/index';
import { removeSheetTab, rowHeightChanged } from './index';
import { getCellIndexes, getCell, getColumnWidth, setChart, refreshChartSize } from '../../workbook/index';
import { deleteChart } from '../../spreadsheet/index';
/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
export function getUpdateUsingRaf(fn) {
    requestAnimationFrame(function () {
        fn();
    });
}
/**
 * The function used to remove the dom element children.
 * @param  parent -
 * @hidden
 */
export function removeAllChildren(parent, index) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
/**
 * The function used to get colgroup width based on the row index.
 * @param  parent -
 * @hidden
 */
export function getColGroupWidth(index) {
    var width = 30;
    if (index.toString().length > 3) {
        width = index.toString().length * 10;
    }
    return width;
}
var scrollAreaWidth = null;
/** @hidden */
export function getScrollBarWidth() {
    if (scrollAreaWidth !== null) {
        return scrollAreaWidth;
    }
    var htmlDivNode = document.createElement('div');
    var result = 0;
    htmlDivNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(htmlDivNode);
    result = (htmlDivNode.offsetWidth - htmlDivNode.clientWidth) | 0;
    document.body.removeChild(htmlDivNode);
    return scrollAreaWidth = result;
}
var classes = ['e-ribbon', 'e-formula-bar-panel', 'e-sheet-tab-panel', 'e-header-toolbar'];
/** @hidden */
export function getSiblingsHeight(element, classList) {
    if (classList === void 0) { classList = classes; }
    var previous = getHeightFromDirection(element, 'previous', classList);
    var next = getHeightFromDirection(element, 'next', classList);
    return previous + next;
}
function getHeightFromDirection(element, direction, classList) {
    // tslint:disable-next-line:no-any
    var sibling = (element)[direction + 'ElementSibling'];
    var result = 0;
    while (sibling) {
        if (classList.some(function (value) { return sibling.classList.contains(value); })) {
            result += sibling.offsetHeight;
        }
        // tslint:disable-next-line:no-any
        sibling = (sibling)[direction + 'ElementSibling'];
    }
    return result;
}
/**
 * @hidden
 */
export function inView(context, range, isModify) {
    if (context.scrollSettings.enableVirtualization) {
        var topIdx = context.viewport.topIndex;
        var leftIdx = context.viewport.leftIndex;
        var bottomIdx = topIdx + context.viewport.rowCount + context.getThreshold('row') * 2;
        var rightIdx = leftIdx + context.viewport.colCount + context.getThreshold('col') * 2;
        var inView_1 = topIdx <= range[0] && bottomIdx >= range[2] && leftIdx <= range[1] && rightIdx >= range[3];
        if (inView_1) {
            return true;
        }
        if (isModify) {
            if (range[0] < topIdx && range[2] < topIdx || range[0] > bottomIdx && range[2] > bottomIdx) {
                return false;
            }
            else {
                if (range[0] < topIdx && range[2] > topIdx) {
                    range[0] = topIdx;
                    inView_1 = true;
                }
                if (range[2] > bottomIdx) {
                    range[2] = bottomIdx;
                    inView_1 = true;
                }
            }
            if (range[1] < leftIdx && range[3] < leftIdx || range[1] > rightIdx && range[3] > rightIdx) {
                return false;
            }
            else {
                if (range[1] < leftIdx && range[3] > leftIdx) {
                    range[1] = leftIdx;
                    inView_1 = true;
                }
                if (range[3] > rightIdx) {
                    range[3] = rightIdx;
                    inView_1 = true;
                }
            }
        }
        return inView_1;
    }
    else {
        return true;
    }
}
/**
 * To get the top left cell position in viewport.
 * @hidden
 */
export function getCellPosition(sheet, indexes, offset) {
    if (offset === void 0) { offset = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } }; }
    var i;
    var top = offset.top.size;
    var left = offset.left.size;
    for (i = offset.top.idx; i < indexes[0]; i++) {
        top += getRowsHeight(sheet, i);
    }
    for (i = offset.left.idx; i < indexes[1]; i++) {
        left += getColumnsWidth(sheet, i);
    }
    return { top: top, left: left };
}
/**
 * Position element with given range
 * @hidden
 */
export function locateElem(ele, range, sheet, isRtl, offset) {
    var swapRange = getSwapRange(range);
    var cellPosition = getCellPosition(sheet, swapRange, offset);
    var startIndex = [skipHiddenIdx(sheet, 0, true), skipHiddenIdx(sheet, 0, true, 'columns')];
    var attrs = {
        'top': (swapRange[0] === startIndex[0] ? cellPosition.top : cellPosition.top - 1) + 'px',
        'height': getRowsHeight(sheet, range[0], range[2]) + (swapRange[0] === startIndex[0] ? 0 : 1) + 'px',
        'width': getColumnsWidth(sheet, range[1], range[3]) + (swapRange[1] === startIndex[1] ? 0 : 1) + 'px'
    };
    attrs[isRtl ? 'right' : 'left'] = (swapRange[1] === startIndex[1] ? cellPosition.left : cellPosition.left - 1) + 'px';
    setStyleAttribute([{ element: ele, attrs: attrs }]);
}
/**
 * To update element styles using request animation frame
 * @hidden
 */
export function setStyleAttribute(styles) {
    requestAnimationFrame(function () {
        styles.forEach(function (style) {
            setBaseStyleAttribute(style.element, style.attrs);
        });
    });
}
/**
 * @hidden
 */
export function getStartEvent() {
    return (Browser.isPointer ? 'pointerdown' : 'mousedown touchstart');
}
/**
 * @hidden
 */
export function getMoveEvent() {
    return (Browser.isPointer ? 'pointermove' : 'mousemove touchmove');
}
/**
 * @hidden
 */
export function getEndEvent() {
    return (Browser.isPointer ? 'pointerup' : 'mouseup touchend');
}
/**
 * @hidden
 */
export function isTouchStart(e) {
    return e.type === 'touchstart' || (e.type === 'pointerdown' && e.pointerType === 'touch');
}
/**
 * @hidden
 */
export function isTouchMove(e) {
    return e.type === 'touchmove' || (e.type === 'pointermove' && e.pointerType === 'touch');
}
/**
 * @hidden
 */
export function isTouchEnd(e) {
    return e.type === 'touchend' || (e.type === 'pointerup' && e.pointerType === 'touch');
}
/**
 * @hidden
 */
export function getClientX(e) {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}
/**
 * @hidden
 */
export function getClientY(e) {
    return e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
}
var config = {
    role: 'role',
    selected: 'aria-selected',
    multiselectable: 'aria-multiselectable',
    busy: 'aria-busy',
    colcount: 'aria-colcount'
};
/** @hidden */
export function setAriaOptions(target, options) {
    var props = Object.keys(options);
    props.forEach(function (name) {
        if (target) {
            target.setAttribute(config[name], options[name]);
        }
    });
}
/**
 * @hidden
 */
export function destroyComponent(element, component) {
    if (element) {
        var compObj = getComponent(element, component);
        if (compObj) {
            compObj.destroy();
        }
    }
}
/**
 * @hidden
 */
// tslint:disable-next-line:max-func-body-length
export function setResize(index, value, isCol, parent) {
    var curEle;
    var curEleH;
    var curEleC;
    var preEle;
    var preEleH;
    var preEleC;
    var nxtEle;
    var nxtEleH;
    var nxtEleC;
    var sheet = parent.getActiveSheet();
    if (isCol) {
        curEle = parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('th')[index];
        curEleH = parent.element.getElementsByClassName('e-column-header')[0].getElementsByTagName('col')[index];
        curEleC = parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('col')[index];
    }
    else {
        curEle = parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
        curEleH = parent.element.getElementsByClassName('e-row-header')[0].getElementsByTagName('tr')[index];
        curEleC = parent.element.getElementsByClassName('e-sheet-content')[0].getElementsByTagName('tr')[index];
        curEleH.style.height = parseInt(value, 10) > 0 ? value : '2px';
        curEleC.style.height = parseInt(value, 10) > 0 ? value : '0px';
        var hdrRow = parent.getRowHeaderContent().getElementsByClassName('e-row');
        var hdrClone = [];
        hdrClone[0] = hdrRow[index].getElementsByTagName('td')[0].cloneNode(true);
        var hdrFntSize = findMaxValue(parent.getRowHeaderTable(), hdrClone, false, parent) + 1;
        var contentRow = parent.getMainContent().getElementsByClassName('e-row');
        var contentClone = [];
        for (var idx = 0; idx < contentRow[index].getElementsByTagName('td').length; idx++) {
            contentClone[idx] = contentRow[index].getElementsByTagName('td')[idx].cloneNode(true);
        }
        var cntFntSize = findMaxValue(parent.getContentTable(), contentClone, false, parent) + 1;
        var fntSize = hdrFntSize >= cntFntSize ? hdrFntSize : cntFntSize;
        if (parseInt(curEleC.style.height, 10) < fntSize ||
            (curEle.classList.contains('e-reach-fntsize') && parseInt(curEleC.style.height, 10) === fntSize)) {
            curEle.classList.add('e-reach-fntsize');
            curEleH.style.lineHeight = parseInt(value, 10) >= 4 ? ((parseInt(value, 10)) - 4) + 'px' :
                parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
            curEleC.style.lineHeight = parseInt(value, 10) > 0 ? ((parseInt(value, 10)) - 1) + 'px' : '0px';
        }
        else {
            curEleH.style.removeProperty('line-height');
            curEleC.style.removeProperty('line-height');
            if (curEle.classList.contains('e-reach-fntsize')) {
                curEle.classList.remove('e-reach-fntsize');
            }
        }
    }
    preEle = curEle.previousElementSibling;
    nxtEle = curEle.nextElementSibling;
    if (preEle) {
        preEle = curEle.previousElementSibling;
        preEleH = curEleH.previousElementSibling;
        preEleC = curEleC.previousElementSibling;
    }
    if (nxtEle) {
        nxtEle = curEle.nextElementSibling;
        nxtEleH = curEleH.nextElementSibling;
        nxtEleC = curEleC.nextElementSibling;
    }
    if (parseInt(value, 10) <= 0 && !(curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start'))) {
        if (preEle && nxtEle) {
            if (isCol) {
                curEleH.style.width = '2px';
                curEleC.style.width = '0px';
            }
            else {
                curEleH.style.height = '2px';
                curEleC.style.height = '0px';
            }
            if (preEle.classList.contains('e-zero-start')) {
                curEle.classList.add('e-zero-start');
                curEleC.classList.add('e-zero-start');
            }
            else {
                curEle.classList.add('e-zero');
                curEleC.classList.add('e-zero');
            }
            if (!nxtEle.classList.contains('e-zero') && !nxtEle.classList.contains('e-zero-last')) {
                curEle.classList.add('e-zero-last');
                curEleC.classList.add('e-zero-last');
            }
            if (preEle.classList.contains('e-zero-last')) {
                preEle.classList.remove('e-zero-last');
                preEleC.classList.remove('e-zero-last');
            }
            if (preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero-end')) {
                    setWidthAndHeight(preEleH, -2, isCol);
                }
                else {
                    setWidthAndHeight(preEleH, -2, isCol);
                }
            }
            else {
                setWidthAndHeight(preEleH, -1, isCol);
            }
            if (preEle.classList.contains('e-zero-start')) {
                setWidthAndHeight(curEleH, -1, isCol);
            }
            if (nxtEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero-start')) {
                    while (nxtEle) {
                        if (nxtEle.classList.contains('e-zero') && (parseInt(nxtEleH.style.height, 10) !== 0 && !isCol) ||
                            (parseInt(nxtEleH.style.width, 10) !== 0 && isCol)) {
                            if (isCol) {
                                curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                                nxtEleH.style.width = parseInt(nxtEleH.style.width, 10) - 1 + 'px';
                            }
                            else {
                                curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                                nxtEleH.style.height = parseInt(nxtEleH.style.height, 10) - 1 + 'px';
                            }
                            nxtEle.classList.remove('e-zero');
                            nxtEle.classList.add('e-zero-start');
                            break;
                        }
                        else {
                            var nxtIndex = void 0;
                            nxtEle.classList.remove('e-zero');
                            nxtEle.classList.add('e-zero-start');
                            if (isCol) {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-colindex'), 10) - 1;
                                nxtEle = parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                                nxtEleH = parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                            }
                            else {
                                nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                                nxtEle = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                                nxtEleH = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                            }
                        }
                    }
                }
                else {
                    setWidthAndHeight(curEleH, -2, isCol);
                }
            }
            else {
                if (nxtEle.classList.contains('e-zero-end')) {
                    if (isCol) {
                        curEleH.style.width = '0px';
                    }
                    else {
                        curEleH.style.height = '0px';
                    }
                }
                else {
                    setWidthAndHeight(nxtEleH, -1, isCol);
                }
            }
        }
        else if (preEle) {
            if (isCol) {
                curEleH.style.width = '1px';
                curEleC.style.width = '0px';
            }
            else {
                curEleH.style.height = '1px';
                curEleC.style.height = '0px';
            }
            curEle.classList.add('e-zero-end');
            curEleC.classList.add('e-zero-end');
            curEle.classList.add('e-zero-last');
            curEleC.classList.add('e-zero-last');
            if (preEle.classList.contains('e-zero')) {
                setWidthAndHeight(preEleH, -2, isCol);
            }
            else {
                setWidthAndHeight(preEleH, -1, isCol);
            }
        }
        else if (nxtEle) {
            curEle.classList.add('e-zero-start');
            curEleC.classList.add('e-zero-start');
            if (!nxtEle.classList.contains('e-zero')) {
                curEle.classList.add('e-zero-last');
                curEleC.classList.add('e-zero-last');
            }
            if (isCol) {
                curEleH.style.width = '1px';
                curEleC.style.width = '0px';
            }
            else {
                curEleH.style.height = '1px';
                curEleC.style.height = '0px';
            }
            if (nxtEle.classList.contains('e-zero')) {
                while (nxtEle) {
                    if (nxtEle.classList.contains('e-zero') && (parseInt(nxtEleH.style.width, 10) !== 0
                        && isCol) || (parseInt(nxtEleH.style.height, 10) !== 0 && !isCol)) {
                        if (isCol) {
                            nxtEleH.style.width = parseInt(nxtEleH.style.width, 10) - 1 + 'px';
                            curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        }
                        else {
                            nxtEleH.style.height = parseInt(nxtEleH.style.height, 10) - 1 + 'px';
                            curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        }
                        nxtEle.classList.add('e-zero-start');
                        nxtEle.classList.remove('e-zero');
                        break;
                    }
                    else {
                        var nxtIndex = void 0;
                        nxtEle.classList.add('e-zero-start');
                        nxtEle.classList.remove('e-zero');
                        if (isCol) {
                            nxtIndex = parseInt(nxtEle.getAttribute('aria-colindex'), 10) - 1;
                            nxtEleH = parent.getColHeaderTable().getElementsByTagName('col')[nxtIndex + 1];
                            nxtEle = parent.getColHeaderTable().getElementsByTagName('th')[nxtIndex + 1];
                        }
                        else {
                            nxtIndex = parseInt(nxtEle.getAttribute('aria-rowindex'), 10) - 1;
                            nxtEleH = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                            nxtEle = parent.getRowHeaderTable().getElementsByTagName('tr')[nxtIndex + 1];
                        }
                    }
                }
            }
            else {
                setWidthAndHeight(nxtEleH, -1, isCol);
            }
        }
    }
    else if (parseInt(value, 10) > 0) {
        if (isCol) {
            curEleH.style.width = value;
            curEleC.style.width = value;
        }
        else {
            curEleH.style.height = value;
            curEleC.style.height = value;
        }
        if (preEle && nxtEle) {
            if (preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero')) {
                    if (isCol) {
                        preEleH.style.width = parseInt(preEleH.style.width, 10) + 2 + 'px';
                        curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                    }
                    else {
                        preEleH.style.height = parseInt(preEleH.style.height, 10) + 2 + 'px';
                        curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                    }
                }
                else {
                    setWidthAndHeight(curEleH, -1, isCol);
                }
            }
            else {
                if (curEle.classList.contains('e-zero')) {
                    setWidthAndHeight(preEleH, 1, isCol);
                }
                else {
                    if (curEle.classList.contains('e-zero-start')) {
                        if (isCol) {
                            preEleH.style.width = parseInt(preEleH.style.width, 10) + 1 + 'px';
                            curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        }
                        else {
                            preEleH.style.height = parseInt(preEleH.style.height, 10) + 1 + 'px';
                            curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        }
                    }
                }
            }
            if (nxtEle.classList.contains('e-zero')) {
                setWidthAndHeight(curEleH, -1, isCol);
            }
            else {
                if (curEle.classList.contains('e-zero') || curEle.classList.contains('e-zero-start')) {
                    setWidthAndHeight(nxtEleH, 1, isCol);
                }
            }
            if (curEle.classList.contains('e-zero')) {
                curEle.classList.remove('e-zero');
            }
            if (curEle.classList.contains('e-zero-start')) {
                curEle.classList.remove('e-zero-start');
            }
            if (curEleC.classList.contains('e-zero')) {
                curEleC.classList.remove('e-zero');
            }
            if (curEleC.classList.contains('e-zero-start')) {
                curEleC.classList.remove('e-zero-start');
            }
            if (curEle.classList.contains('e-zero-last')) {
                curEle.classList.remove('e-zero-last');
            }
            if (curEleC.classList.contains('e-zero-last')) {
                curEleC.classList.remove('e-zero-last');
            }
            if (preEle.classList.contains('e-zero') || preEle.classList.contains('e-zero-start')) {
                preEle.classList.add('e-zero-last');
                preEleC.classList.add('e-zero-last');
            }
        }
        else if (preEle) {
            if (preEle.classList.contains('e-zero')) {
                if (curEle.classList.contains('e-zero')) {
                    if (isCol) {
                        curEleH.style.width = parseInt(curEleH.style.width, 10) - 1 + 'px';
                        preEleH.style.width = parseInt(preEleH.style.width, 10) + 2 + 'px';
                    }
                    else {
                        curEleH.style.height = parseInt(curEleH.style.height, 10) - 1 + 'px';
                        preEleH.style.height = parseInt(preEleH.style.height, 10) + 2 + 'px';
                    }
                }
                else {
                    setWidthAndHeight(curEleH, -1, isCol);
                }
            }
            else {
                if (curEle.classList.contains('e-zero')) {
                    setWidthAndHeight(preEleH, 1, isCol);
                }
                else {
                    setWidthAndHeight(curEleH, -1, isCol);
                }
            }
            if (curEle.classList.contains('e-zero')) {
                curEle.classList.remove('e-zero');
            }
            if (curEle.classList.contains('e-zero-end')) {
                curEle.classList.remove('e-zero-end');
            }
            if (curEleC.classList.contains('e-zero')) {
                curEleC.classList.remove('e-zero');
            }
            if (curEleC.classList.contains('e-zero-end')) {
                curEleC.classList.remove('e-zero-end');
            }
        }
        else if (nxtEle) {
            if (nxtEle.classList.contains('e-zero')) {
                setWidthAndHeight(curEleH, -1, isCol);
            }
            else if (curEle.classList.contains('e-zero-start')) {
                setWidthAndHeight(nxtEleH, 1, isCol);
                curEle.classList.remove('e-zero-start');
            }
            if (curEle.classList.contains('e-zero')) {
                curEle.classList.remove('e-zero');
            }
            if (curEleC.classList.contains('e-zero')) {
                curEleC.classList.remove('e-zero');
            }
            if (curEle.classList.contains('e-zero-start')) {
                curEle.classList.remove('e-zero-start');
            }
            if (curEleC.classList.contains('e-zero-start')) {
                curEleC.classList.remove('e-zero-start');
            }
        }
    }
}
/**
 * @hidden
 */
export function setWidthAndHeight(trgt, value, isCol) {
    if (isCol) {
        trgt.style.width = parseInt(trgt.style.width, 10) + value + 'px';
    }
    else {
        trgt.style.height = parseInt(trgt.style.height, 10) + value + 'px';
    }
}
/**
 * @hidden
 */
export function findMaxValue(table, text, isCol, parent, prevData, isWrap) {
    var myTableDiv = parent.createElement('div', { className: parent.element.className, styles: 'display: block' });
    var myTable = parent.createElement('table', {
        className: table.className + 'e-resizetable',
        styles: 'width: auto;height: auto'
    });
    var myTr = parent.createElement('tr');
    if (isCol) {
        text.forEach(function (element) {
            var tr = myTr.cloneNode();
            tr.appendChild(element);
            myTable.appendChild(tr);
        });
    }
    else {
        text.forEach(function (element) {
            myTr.appendChild(element.cloneNode(true));
        });
        myTable.appendChild(myTr);
    }
    myTableDiv.appendChild(myTable);
    document.body.appendChild(myTableDiv);
    var offsetWidthValue;
    var offsetHeightValue;
    if (!isWrap) {
        offsetHeightValue = myTable.getBoundingClientRect().height;
        offsetWidthValue = myTable.getBoundingClientRect().width;
    }
    else {
        offsetHeightValue = parseInt(prevData, 10);
        offsetWidthValue = parseInt(prevData, 10);
    }
    document.body.removeChild(myTableDiv);
    if (isCol) {
        return Math.ceil(offsetWidthValue);
    }
    else {
        return Math.ceil(offsetHeightValue);
    }
}
/**
 * @hidden
 */
// tslint:disable-next-line
export function updateAction(options, spreadsheet, isRedo) {
    /* tslint:disable-next-line no-any */
    var eventArgs = options.eventArgs;
    switch (options.action) {
        case 'sorting':
            var args = {
                range: options.eventArgs.range,
                sortOptions: options.eventArgs.sortOptions,
                cancel: false
            };
            var promise = new Promise(function (resolve, reject) {
                resolve((function () { })());
            });
            var sortArgs = { args: args, promise: promise };
            spreadsheet.notify(initiateSort, sortArgs);
            sortArgs.promise.then(function (args) {
                spreadsheet.serviceLocator.getService('cell').refreshRange(getIndexesFromAddress(args.range));
            });
            break;
        case 'cellSave':
            var cellEvtArgs = options.eventArgs;
            var cellValue = eventArgs.formula ? { formula: cellEvtArgs.formula } : { value: cellEvtArgs.value };
            spreadsheet.updateCell(cellValue, cellEvtArgs.address);
            break;
        case 'format':
            if (eventArgs.requestType === 'CellFormat') {
                spreadsheet.cellFormat(eventArgs.style, eventArgs.range);
            }
            else {
                spreadsheet.numberFormat(eventArgs.format, eventArgs.range);
            }
            break;
        case 'clipboard':
            if (eventArgs.copiedInfo.isCut && !isRedo) {
                return;
            }
            var clipboardPromise = eventArgs.copiedInfo.isCut ? spreadsheet.cut(eventArgs.copiedRange)
                : spreadsheet.copy(eventArgs.copiedRange);
            clipboardPromise.then(function (args) {
                spreadsheet.paste(eventArgs.pastedRange, eventArgs.type);
            });
            break;
        case 'gridLines':
            spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.sheetIdx], 'showGridLines', eventArgs.isShow);
            break;
        case 'headers':
            spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.sheetIdx], 'showHeaders', eventArgs.isShow);
            break;
        case 'resize':
        case 'resizeToFit':
            if (eventArgs.isCol) {
                if (eventArgs.hide === undefined) {
                    spreadsheet.setColWidth(eventArgs.width, eventArgs.index, eventArgs.sheetIdx);
                }
                else {
                    spreadsheet.hideColumn(eventArgs.index, eventArgs.index, eventArgs.hide);
                }
            }
            else {
                if (eventArgs.hide === undefined) {
                    spreadsheet.setRowHeight(eventArgs.height, eventArgs.index, eventArgs.sheetIdx);
                }
                else {
                    spreadsheet.hideRow(eventArgs.index, eventArgs.index, eventArgs.hide);
                }
            }
            break;
        case 'renameSheet':
            spreadsheet.setSheetPropertyOnMute(spreadsheet.sheets[eventArgs.index - 1], 'name', eventArgs.value);
            break;
        case 'removeSheet':
            spreadsheet.notify(removeSheetTab, {
                index: eventArgs.index,
                isAction: true,
                count: eventArgs.sheetCount,
                clicked: true
            });
            break;
        case 'wrap':
            wrap(options.eventArgs.address, options.eventArgs.wrap, spreadsheet);
            break;
        case 'hideShow':
            eventArgs.isCol ? spreadsheet.hideColumn(eventArgs.startIndex, eventArgs.endIndex, eventArgs.hide) :
                spreadsheet.hideRow(eventArgs.startIndex, eventArgs.endIndex, eventArgs.hide);
            break;
        case 'replace':
            spreadsheet.updateCell({ value: eventArgs.compareVal }, eventArgs.address);
            break;
        case 'insert':
            if (isRedo === false) {
                spreadsheet.delete(options.eventArgs.index, options.eventArgs.index + (options.eventArgs.model.length - 1), options.eventArgs.modelType);
            }
            else {
                spreadsheet.notify(insertModel, {
                    model: options.eventArgs.modelType === 'Sheet' ? spreadsheet :
                        spreadsheet.getActiveSheet(), start: options.eventArgs.index, end: options.eventArgs.index +
                        (options.eventArgs.model.length - 1), modelType: options.eventArgs.modelType,
                    isAction: false, checkCount: options.eventArgs.sheetCount,
                    activeSheetIndex: options.eventArgs.activeSheetIndex
                });
            }
            break;
        case 'delete':
            if (isRedo === false) {
                spreadsheet.notify(insertModel, {
                    model: options.eventArgs.modelType === 'Sheet' ? spreadsheet :
                        spreadsheet.getActiveSheet(), start: options.eventArgs.deletedModel, modelType: options.eventArgs.modelType,
                    isAction: false, columnCellsModel: options.eventArgs.deletedCellsModel
                });
            }
            else {
                spreadsheet.delete(options.eventArgs.startIndex, options.eventArgs.endIndex, options.eventArgs.modelType);
            }
            break;
        case 'validation':
            if (isRedo) {
                var rules = {
                    type: eventArgs.type, operator: eventArgs.operator, value1: eventArgs.value1,
                    value2: eventArgs.value2, ignoreBlank: eventArgs.ignoreBlank, inCellDropDown: eventArgs.inCellDropDown
                };
                spreadsheet.notify(setValidation, { rules: rules, range: eventArgs.range });
            }
            else {
                spreadsheet.notify(removeValidation, { range: eventArgs.range });
            }
            break;
        case 'merge':
            options.eventArgs.isAction = false;
            spreadsheet.notify(setMerge, options.eventArgs);
            break;
        case 'clear':
            spreadsheet.notify(clearViewer, { options: options.eventArgs, isPublic: true });
            break;
        case 'conditionalFormat':
            if (isRedo) {
                var conditionalFormat = {
                    type: eventArgs.type, cFColor: eventArgs.cFColor, value: eventArgs.value,
                    range: eventArgs.range
                };
                spreadsheet.notify(setCFRule, { conditionalFormat: conditionalFormat });
            }
            else {
                spreadsheet.notify(clearCFRule, { range: eventArgs.range });
            }
            break;
        case 'clearCF':
            if (isRedo) {
                spreadsheet.notify(clearCFRule, { range: eventArgs.selectedRange });
            }
            else {
                spreadsheet.notify(clearCells, {
                    conditionalFormats: eventArgs.cFormats,
                    oldRange: eventArgs.oldRange, selectedRange: eventArgs.selectedRange
                });
            }
            break;
        case 'insertImage':
            if (isRedo) {
                spreadsheet.notify(createImageElement, {
                    options: {
                        src: options.eventArgs.imageData,
                        height: options.eventArgs.imageHeight, width: options.eventArgs.imageWidth, imageId: options.eventArgs.id
                    },
                    range: options.eventArgs.range, isPublic: false, isUndoRedo: true
                });
            }
            else {
                spreadsheet.notify(deleteImage, {
                    id: options.eventArgs.id, sheetIdx: options.eventArgs.sheetIndex + 1, range: options.eventArgs.range
                });
            }
            break;
        case 'imageRefresh':
            var element = document.getElementById(options.eventArgs.id);
            if (isRedo) {
                options.eventArgs.isUndoRedo = true;
                spreadsheet.notify(refreshImgCellObj, options.eventArgs);
            }
            else {
                spreadsheet.notify(refreshImgCellObj, {
                    prevTop: options.eventArgs.currentTop, prevLeft: options.eventArgs.currentLeft,
                    currentTop: options.eventArgs.prevTop, currentLeft: options.eventArgs.prevLeft, id: options.eventArgs.id,
                    currentHeight: options.eventArgs.prevHeight, currentWidth: options.eventArgs.prevWidth, requestType: 'imageRefresh',
                    prevHeight: options.eventArgs.currentHeight, prevWidth: options.eventArgs.currentWidth, isUndoRedo: true
                });
            }
            element.style.height = isRedo ? options.eventArgs.currentHeight + 'px' : options.eventArgs.prevHeight + 'px';
            element.style.width = isRedo ? options.eventArgs.currentWidth + 'px' : options.eventArgs.prevWidth + 'px';
            element.style.top = isRedo ? options.eventArgs.currentTop + 'px' : options.eventArgs.prevTop + 'px';
            element.style.left = isRedo ? options.eventArgs.currentLeft + 'px' : options.eventArgs.prevLeft + 'px';
            break;
        case 'insertChart':
            if (isRedo) {
                var chartOptions = [{
                        type: eventArgs.type, theme: eventArgs.theme, isSeriesInRows: eventArgs.isSeriesInRows,
                        range: eventArgs.range, id: eventArgs.id
                    }];
                spreadsheet.notify(setChart, {
                    chart: chartOptions, isInitCell: eventArgs.isInitCell, isUndoRedo: false, range: eventArgs.posRange
                });
            }
            else {
                spreadsheet.notify(deleteChart, { id: eventArgs.id });
            }
            break;
        case 'deleteChart':
            if (isRedo) {
                spreadsheet.notify(deleteChart, { id: eventArgs.id });
            }
            else {
                var chartOpts = [{
                        type: eventArgs.type, theme: eventArgs.theme, isSeriesInRows: eventArgs.isSeriesInRows,
                        range: eventArgs.range, id: eventArgs.id
                    }];
                spreadsheet.notify(setChart, {
                    chart: chartOpts, isInitCell: eventArgs.isInitCell, isUndoRedo: false, range: eventArgs.posRange
                });
            }
            break;
        case 'chartRefresh':
            var chartElement = document.getElementById(options.eventArgs.id);
            if (chartElement) {
                chartElement.style.height = isRedo ? options.eventArgs.currentHeight + 'px' : options.eventArgs.prevHeight + 'px';
                chartElement.style.width = isRedo ? options.eventArgs.currentWidth + 'px' : options.eventArgs.prevWidth + 'px';
                chartElement.style.top = isRedo ? options.eventArgs.currentTop + 'px' : options.eventArgs.prevTop + 'px';
                chartElement.style.left = isRedo ? options.eventArgs.currentLeft + 'px' : options.eventArgs.prevLeft + 'px';
            }
            if (isRedo) {
                options.eventArgs.isUndoRedo = true;
                spreadsheet.notify(refreshChartSize, {
                    height: chartElement.style.height, width: chartElement.style.width, overlayEle: chartElement
                });
            }
            else {
                spreadsheet.notify(refreshChartSize, {
                    height: chartElement.style.height, width: chartElement.style.width, overlayEle: chartElement
                });
            }
            break;
    }
}
/**
 * @hidden
 */
export function hasTemplate(workbook, rowIdx, colIdx, sheetIdx) {
    var sheet = workbook.sheets[sheetIdx];
    var ranges = sheet.ranges;
    var range;
    for (var i = 0, len = ranges.length; i < len; i++) {
        if (ranges[i].template) {
            range = getRangeIndexes(ranges[i].address.length ? ranges[i].address : ranges[i].startCell);
            if (range[0] <= rowIdx && range[1] <= colIdx && range[2] >= rowIdx && range[3] >= colIdx) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Setting row height in view an model.
 * @hidden
 */
export function setRowEleHeight(parent, sheet, height, rowIdx, row, hRow, notifyRowHgtChange) {
    if (notifyRowHgtChange === void 0) { notifyRowHgtChange = true; }
    var prevHgt = getRowHeight(sheet, rowIdx);
    var edit = parent.element.querySelector('.e-spreadsheet-edit');
    if (edit && (edit.innerHTML.indexOf('\n') > -1)) {
        var actCell = getCellIndexes(parent.getActiveSheet().activeCell);
        var cell = getCell(actCell[0], actCell[1], sheet);
        var i = void 0;
        var splitVal = edit.innerHTML.split('\n');
        var n = 0;
        var valLength = splitVal.length;
        for (i = 0; i < valLength; i++) {
            var lines = getLines(splitVal[i], getColumnWidth(sheet, actCell[1]), cell.style, parent.cellStyle);
            if (lines === 0) {
                lines = 1; // for empty new line
            }
            n = n + lines;
        }
        height = getTextHeight(parent, cell.style || parent.cellStyle, n) + 1;
    }
    (row || parent.getRow(rowIdx)).style.height = height + "px";
    if (sheet.showHeaders) {
        (hRow || parent.getRow(rowIdx, parent.getRowHeaderTable())).style.height = height + "px";
    }
    setRowHeight(sheet, rowIdx, height);
    parent.setProperties({ sheets: parent.sheets }, true);
    if (notifyRowHgtChange) {
        parent.notify(rowHeightChanged, { rowIdx: rowIdx, threshold: height - prevHgt });
    }
}
/** @hidden */
export function getTextHeight(context, style, lines) {
    if (lines === void 0) { lines = 1; }
    var fontSize = (style && style.fontSize) || context.cellStyle.fontSize;
    var fontSizePx = fontSize.indexOf('pt') > -1 ? parseInt(fontSize, 10) * 1.33 : parseInt(fontSize, 10);
    return Math.ceil(fontSizePx * (style && style.fontFamily === 'Arial Black' ? 1.44 : 1.24) * lines);
}
/** @hidden */
export function getTextWidth(text, style, parentStyle) {
    if (!style) {
        style = parentStyle;
    }
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = (style.fontStyle || parentStyle.fontStyle) + ' ' + (style.fontWeight || parentStyle.fontWeight) + ' '
        + (style.fontSize || parentStyle.fontSize) + ' ' + (style.fontFamily || parentStyle.fontFamily);
    return context.measureText(text).width;
}
/**
 * @hidden
 */
export function getLines(text, colwidth, style, parentStyle) {
    var width;
    var prevWidth = 0;
    var textArr = text.toString().split(' ');
    var spaceWidth = getTextWidth(' ', style, parentStyle);
    var lines;
    var cnt = 0;
    colwidth -= 5; // for padding
    textArr.forEach(function (txt) {
        var lWidth = 0;
        var cWidth = 0;
        width = getTextWidth(txt, style, parentStyle);
        lines = (prevWidth + width) / colwidth;
        if (lines >= 1) {
            if (prevWidth) {
                cnt++;
            }
            if (width / colwidth >= 1) {
                txt.split('').forEach(function (val) {
                    cWidth = getTextWidth(val, style, parentStyle);
                    lWidth += cWidth;
                    if (lWidth > colwidth) {
                        cnt++;
                        lWidth = cWidth;
                    }
                });
                prevWidth = lWidth + spaceWidth;
            }
            else {
                prevWidth = width + spaceWidth;
            }
        }
        else {
            prevWidth += (width + spaceWidth);
        }
    });
    if (prevWidth) {
        cnt += Math.ceil((prevWidth - spaceWidth) / colwidth);
    }
    return cnt;
}
/**
 * Setting maximum height while doing formats and wraptext
 * @hidden
 */
export function setMaxHgt(sheet, rIdx, cIdx, hgt) {
    if (!sheet.maxHgts[rIdx]) {
        sheet.maxHgts[rIdx] = {};
    }
    sheet.maxHgts[rIdx][cIdx] = hgt;
}
/**
 * Getting maximum height by comparing each cell's modified height.
 * @hidden
 */
export function getMaxHgt(sheet, rIdx) {
    var maxHgt = 0;
    var rowHgt = sheet.maxHgts[rIdx];
    if (rowHgt) {
        Object.keys(rowHgt).forEach(function (key) {
            if (rowHgt[key] > maxHgt) {
                maxHgt = rowHgt[key];
            }
        });
    }
    return maxHgt;
}
/** @hidden */
export function skipHiddenIdx(sheet, index, increase, layout) {
    if (layout === void 0) { layout = 'rows'; }
    if (index < 0) {
        index = -1;
    }
    if ((sheet[layout])[index] && (sheet[layout])[index].hidden) {
        increase ? index++ : index--;
        index = skipHiddenIdx(sheet, index, increase, layout);
    }
    return index;
}
