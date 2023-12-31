import { select, detach } from '@syncfusion/ej2-base';
import { VScroll } from './v-scroll';
import { HScroll } from './h-scroll';
/**
 * Used to add scroll in menu.
 * @hidden
 */
export function addScrolling(createElement, container, content, scrollType, enableRtl, offset) {
    var containerOffset;
    var contentOffset;
    if (scrollType === 'vscroll') {
        containerOffset = offset || container.offsetHeight;
        contentOffset = content.offsetHeight;
    }
    else {
        containerOffset = container.offsetWidth;
        contentOffset = content.offsetWidth;
    }
    if (containerOffset < contentOffset) {
        var scrollEle = createElement('div', { className: 'e-menu-' + scrollType });
        container.appendChild(scrollEle);
        scrollEle.appendChild(content);
        if (offset) {
            scrollEle.style.overflow = 'hidden';
            scrollEle.style.height = offset + 'px';
        }
        else {
            scrollEle.style.maxHeight = container.style.maxHeight;
            container.style.overflow = 'hidden';
        }
        var scrollObj = void 0;
        if (scrollType === 'vscroll') {
            scrollObj = new VScroll({ enableRtl: enableRtl }, scrollEle);
            scrollObj.scrollStep = select('.e-' + scrollType + '-bar', container).offsetHeight / 2;
        }
        else {
            scrollObj = new HScroll({ enableRtl: enableRtl }, scrollEle);
            scrollObj.scrollStep = select('.e-' + scrollType + '-bar', container).offsetWidth;
        }
        return scrollEle;
    }
    else {
        return content;
    }
}
/**
 * Used to destroy the scroll option.
 * @hidden
 */
export function destroyScroll(scrollObj, element, skipEle) {
    if (scrollObj) {
        var menu = select('.e-menu-parent', element);
        if (menu) {
            if (!skipEle || skipEle === menu) {
                scrollObj.destroy();
                element.parentElement.appendChild(menu);
                detach(element);
            }
        }
        else {
            scrollObj.destroy();
            detach(element);
        }
    }
}
