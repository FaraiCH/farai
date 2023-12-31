import * as EVENTS from '../../common/constant';
import { createElement, isNullOrUndefined as isNOU, detach } from '@syncfusion/ej2-base';
/**
 * PasteCleanup for MsWord content
 * @hidden
 * @deprecated
 */
var MsWordPaste = /** @class */ (function () {
    function MsWordPaste(parent) {
        this.olData = [
            'decimal',
            'lower-alpha',
            'lower-roman',
            'upper-alpha',
            'upper-roman',
            'lower-greek'
        ];
        this.ulData = [
            'disc',
            'square',
            'circle',
            'disc',
            'square',
            'circle'
        ];
        this.ignorableNodes = ['A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
            'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
            'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
            'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
            'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
            'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
            'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'];
        this.blockNode = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
            'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
            'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
            'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'];
        this.borderStyle = ['border-top', 'border-right', 'border-bottom', 'border-left'];
        this.removableElements = ['o:p', 'style'];
        this.listContents = [];
        this.parent = parent;
        this.addEventListener();
    }
    MsWordPaste.prototype.addEventListener = function () {
        this.parent.observer.on(EVENTS.MS_WORD_CLEANUP_PLUGIN, this.wordCleanup, this);
    };
    MsWordPaste.prototype.wordCleanup = function (e) {
        var wordPasteStyleConfig = e.allowedStylePropertiesArray;
        var listNodes = [];
        var tempHTMLContent = e.args.clipboardData.getData('text/HTML');
        var rtfData = e.args.clipboardData.getData('text/rtf');
        var elm = createElement('p');
        elm.setAttribute('id', 'MSWord-Content');
        elm.innerHTML = tempHTMLContent;
        var patern = /class='?Mso|style='[^ ]*\bmso-/i;
        var patern2 = /class="?Mso|style="[^ ]*\bmso-/i;
        var patern3 = /(class="?Mso|class='?Mso|class="?Xl|class='?Xl|class=Xl|style="[^"]*\bmso-|style='[^']*\bmso-|w:WordDocument)/gi;
        var pattern4 = /style='mso-width-source:/i;
        if (patern.test(tempHTMLContent) || patern2.test(tempHTMLContent) || patern3.test(tempHTMLContent) ||
            pattern4.test(tempHTMLContent)) {
            this.imageConversion(elm, rtfData);
            tempHTMLContent = tempHTMLContent.replace(/<img[^>]+>/i, '');
            listNodes = this.cleanUp(elm, listNodes);
            if (!isNOU(listNodes[0]) && listNodes[0].parentElement.tagName !== 'UL' &&
                listNodes[0].parentElement.tagName !== 'OL') {
                this.listConverter(listNodes);
            }
            this.styleCorrection(elm, wordPasteStyleConfig);
            this.removingComments(elm);
            this.removeUnwantedElements(elm);
            this.removeEmptyElements(elm);
            this.breakLineAddition(elm);
            this.removeClassName(elm);
            if (pattern4.test(tempHTMLContent)) {
                this.addTableBorderClass(elm);
            }
            e.callBack(elm.innerHTML);
        }
        else {
            e.callBack(elm.innerHTML);
        }
    };
    MsWordPaste.prototype.addTableBorderClass = function (elm) {
        var allTableElm = elm.querySelectorAll('table');
        var hasTableBorder = false;
        for (var i = 0; i < allTableElm.length; i++) {
            for (var j = 0; j < this.borderStyle.length; j++) {
                if (allTableElm[i].innerHTML.indexOf(this.borderStyle[j]) >= 0) {
                    hasTableBorder = true;
                    break;
                }
            }
            if (hasTableBorder) {
                allTableElm[i].classList.add('e-rte-table-border');
                hasTableBorder = false;
            }
        }
    };
    MsWordPaste.prototype.imageConversion = function (elm, rtfData) {
        this.checkVShape(elm);
        var imgElem = elm.querySelectorAll('img');
        var imgSrc = [];
        var base64Src = [];
        var imgName = [];
        if (imgElem.length > 0) {
            for (var i = 0; i < imgElem.length; i++) {
                imgSrc.push(imgElem[i].getAttribute('src'));
                imgName.push(imgElem[i].getAttribute('src').split('/')[imgElem[i].getAttribute('src').split('/').length - 1].split('.')[0]);
            }
            var hexValue = this.hexConversion(rtfData);
            for (var i = 0; i < hexValue.length; i++) {
                base64Src.push(this.convertToBase64(hexValue[i]));
            }
            for (var i = 0; i < imgElem.length; i++) {
                imgElem[i].setAttribute('src', base64Src[i]);
                imgElem[i].setAttribute('id', 'msWordImg-' + imgName[i]);
            }
        }
    };
    MsWordPaste.prototype.checkVShape = function (elm) {
        var allNodes = elm.querySelectorAll('*');
        for (var i = 0; i < allNodes.length; i++) {
            switch (allNodes[i].nodeName) {
                case 'V:SHAPETYPE':
                    detach(allNodes[i]);
                    break;
                case 'V:SHAPE':
                    if (allNodes[i].firstElementChild.nodeName === 'V:IMAGEDATA') {
                        var src = allNodes[i].firstElementChild.getAttribute('src');
                        var imgElement = createElement('img');
                        imgElement.setAttribute('src', src);
                        allNodes[i].parentElement.insertBefore(imgElement, allNodes[i]);
                        detach(allNodes[i]);
                    }
                    break;
            }
        }
    };
    MsWordPaste.prototype.convertToBase64 = function (hexValue) {
        var base64;
        var byteArr = this.conHexStringToBytes(hexValue.hex);
        var base64String = this.conBytesToBase64(byteArr);
        base64 = hexValue.type ? 'data:' + hexValue.type + ';base64,' + base64String : null;
        return base64;
    };
    MsWordPaste.prototype.conBytesToBase64 = function (byteArr) {
        var base64Str = '';
        var base64Char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var byteArrLen = byteArr.length;
        for (var i = 0; i < byteArrLen; i += 3) {
            var array3 = byteArr.slice(i, i + 3);
            var array3length = array3.length;
            var array4 = [];
            if (array3length < 3) {
                for (var j = array3length; j < 3; j++) {
                    array3[j] = 0;
                }
            }
            array4[0] = (array3[0] & 0xFC) >> 2;
            array4[1] = ((array3[0] & 0x03) << 4) | (array3[1] >> 4);
            array4[2] = ((array3[1] & 0x0F) << 2) | ((array3[2] & 0xC0) >> 6);
            array4[3] = array3[2] & 0x3F;
            for (var j = 0; j < 4; j++) {
                if (j <= array3length) {
                    base64Str += base64Char.charAt(array4[j]);
                }
                else {
                    base64Str += '=';
                }
            }
        }
        return base64Str;
    };
    MsWordPaste.prototype.conHexStringToBytes = function (hex) {
        var byteArr = [];
        var byteArrLen = hex.length / 2;
        for (var i = 0; i < byteArrLen; i++) {
            byteArr.push(parseInt(hex.substr(i * 2, 2), 16));
        }
        return byteArr;
    };
    MsWordPaste.prototype.hexConversion = function (rtfData) {
        var picHead = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/;
        var pic = new RegExp('(?:(' + picHead.source + '))([\\da-fA-F\\s]+)\\}', 'g');
        var fullImg = rtfData.match(pic);
        var imgType;
        var result = [];
        if (!isNOU(fullImg)) {
            for (var i = 0; i < fullImg.length; i++) {
                if (picHead.test(fullImg[i])) {
                    if (fullImg[i].indexOf('\\pngblip') !== -1) {
                        imgType = 'image/png';
                    }
                    else if (fullImg[i].indexOf('\\jpegblip') !== -1) {
                        imgType = 'image/jpeg';
                    }
                    else {
                        continue;
                    }
                    result.push({
                        hex: imgType ? fullImg[i].replace(picHead, '').replace(/[^\da-fA-F]/g, '') : null,
                        type: imgType
                    });
                }
            }
        }
        return result;
    };
    MsWordPaste.prototype.removeClassName = function (elm) {
        var elmWithClass = elm.querySelectorAll('*[class]');
        for (var i = 0; i < elmWithClass.length; i++) {
            elmWithClass[i].removeAttribute('class');
        }
    };
    MsWordPaste.prototype.breakLineAddition = function (elm) {
        var allElements = elm.querySelectorAll('*');
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].children.length === 0 && allElements[i].innerHTML === '&nbsp;' &&
                (allElements[i].innerHTML === '&nbsp;' && !allElements[i].closest('li')) &&
                !allElements[i].closest('td')) {
                var detachableElement = this.findDetachElem(allElements[i]);
                var brElement = createElement('br');
                if (!isNOU(detachableElement.parentElement)) {
                    detachableElement.parentElement.insertBefore(brElement, detachableElement);
                    detach(detachableElement);
                }
            }
        }
    };
    MsWordPaste.prototype.findDetachElem = function (element) {
        var removableElement;
        if (!isNOU(element.parentElement) &&
            element.parentElement.textContent.trim() === '' && element.parentElement.tagName !== 'TD') {
            removableElement = this.findDetachElem(element.parentElement);
        }
        else {
            removableElement = element;
        }
        return removableElement;
    };
    MsWordPaste.prototype.removeUnwantedElements = function (elm) {
        var innerElement = elm.innerHTML;
        for (var i = 0; i < this.removableElements.length; i++) {
            var regExpStartElem = new RegExp('<' + this.removableElements[i] + '>', 'g');
            var regExpEndElem = new RegExp('</' + this.removableElements[i] + '>', 'g');
            innerElement = innerElement.replace(regExpStartElem, '');
            innerElement = innerElement.replace(regExpEndElem, '');
        }
        elm.innerHTML = innerElement;
        elm.querySelectorAll(':empty');
    };
    MsWordPaste.prototype.findDetachEmptyElem = function (element) {
        var removableElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' &&
                element.parentElement.getAttribute('id') !== 'MSWord-Content' &&
                isNOU(element.parentElement.querySelector('img'))) {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            }
            else {
                removableElement = element;
            }
        }
        else {
            removableElement = null;
        }
        return removableElement;
    };
    MsWordPaste.prototype.removeEmptyElements = function (element) {
        var emptyElements = element.querySelectorAll(':empty');
        for (var i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR' &&
                emptyElements[i].tagName !== 'IFRAME' && emptyElements[i].tagName !== 'TD' &&
                emptyElements[i].tagName !== 'HR') {
                var detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    };
    MsWordPaste.prototype.styleCorrection = function (elm, wordPasteStyleConfig) {
        var styleElement = elm.querySelectorAll('style');
        if (styleElement.length > 0) {
            var styles = styleElement[0].innerHTML.match(/[\S ]+\s+{[\s\S]+?}/gi);
            var styleClassObject_1 = !isNOU(styles) ? this.findStyleObject(styles) : null;
            var keys = Object.keys(styleClassObject_1);
            var values = keys.map(function (key) { return styleClassObject_1[key]; });
            values = this.removeUnwantedStyle(values, wordPasteStyleConfig);
            this.filterStyles(elm, wordPasteStyleConfig);
            var resultElem = void 0;
            var fromClass = false;
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].split('.')[0] === '') {
                    resultElem = elm.getElementsByClassName(keys[i].split('.')[1]);
                    fromClass = true;
                }
                else if (keys[i].split('.').length === 1 && keys[i].split('.')[0].indexOf('@') >= 0) {
                    continue;
                }
                else if (keys[i].split('.').length === 1 && keys[i].split('.')[0].indexOf('@') < 0) {
                    resultElem = elm.getElementsByTagName(keys[i]);
                }
                else {
                    resultElem = elm.querySelectorAll(keys[i]);
                }
                for (var j = 0; j < resultElem.length; j++) {
                    var styleProperty = resultElem[j].getAttribute('style');
                    if (!isNOU(styleProperty) && styleProperty.trim() !== '') {
                        var valueSplit = values[i].split(';');
                        if (!fromClass) {
                            for (var k = 0; k < valueSplit.length; k++) {
                                if (styleProperty.indexOf(valueSplit[k].split(':')[0]) >= 0) {
                                    valueSplit.splice(k, 1);
                                    k--;
                                }
                            }
                        }
                        values[i] = valueSplit.join(';') + ';';
                        var changedValue = styleProperty + values[i];
                        resultElem[j].setAttribute('style', changedValue);
                    }
                    else {
                        resultElem[j].setAttribute('style', values[i]);
                    }
                }
                fromClass = false;
            }
        }
    };
    MsWordPaste.prototype.filterStyles = function (elm, wordPasteStyleConfig) {
        var elmWithStyles = elm.querySelectorAll('*[style]');
        for (var i = 0; i < elmWithStyles.length; i++) {
            var elemStyleProperty = elmWithStyles[i].getAttribute('style').split(';');
            var styleValue = '';
            for (var j = 0; j < elemStyleProperty.length; j++) {
                if (wordPasteStyleConfig.indexOf(elemStyleProperty[j].split(':')[0].trim()) >= 0) {
                    styleValue += elemStyleProperty[j] + ';';
                }
            }
            elmWithStyles[i].setAttribute('style', styleValue);
        }
    };
    MsWordPaste.prototype.removeUnwantedStyle = function (values, wordPasteStyleConfig) {
        for (var i = 0; i < values.length; i++) {
            var styleValues = values[i].split(';');
            values[i] = '';
            for (var j = 0; j < styleValues.length; j++) {
                if (wordPasteStyleConfig.indexOf(styleValues[j].split(':')[0]) >= 0) {
                    values[i] += styleValues[j] + ';';
                }
            }
        }
        return values;
    };
    MsWordPaste.prototype.findStyleObject = function (styles) {
        var styleClassObject = {};
        for (var i = 0; i < styles.length; i++) {
            var tempStyle = styles[i];
            var classNameCollection = tempStyle.replace(/([\S ]+\s+){[\s\S]+?}/gi, '$1');
            var stylesCollection = tempStyle.replace(/[\S ]+\s+{([\s\S]+?)}/gi, '$1');
            classNameCollection = classNameCollection.replace(/^[\s]|[\s]$/gm, '');
            stylesCollection = stylesCollection.replace(/^[\s]|[\s]$/gm, '');
            classNameCollection = classNameCollection.replace(/\n|\r|\n\r/g, '');
            stylesCollection = stylesCollection.replace(/\n|\r|\n\r/g, '');
            for (var classNames = classNameCollection.split(', '), j = 0; j < classNames.length; j++) {
                styleClassObject[classNames[j]] = stylesCollection;
            }
        }
        return styleClassObject;
    };
    MsWordPaste.prototype.removingComments = function (elm) {
        var innerElement = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    };
    MsWordPaste.prototype.cleanUp = function (node, listNodes) {
        var temp = '';
        var tempCleaner = [];
        var prevflagState;
        var allNodes = node.querySelectorAll('*');
        for (var index = 0; index < allNodes.length; index++) {
            if (this.ignorableNodes.indexOf(allNodes[index].nodeName) === -1 ||
                (allNodes[index].nodeType === 3 && allNodes[index].textContent.trim() === '')) {
                tempCleaner.push(allNodes[index]);
                continue;
            }
            else if (allNodes[index].className &&
                allNodes[index].className.toLowerCase().indexOf('msolistparagraph') !== -1 &&
                allNodes[index].childElementCount !== 1) {
                listNodes.push(allNodes[index]);
            }
            if (prevflagState && (this.blockNode.indexOf(allNodes[index].nodeName.toLowerCase()) !== -1) &&
                !(allNodes[index].className &&
                    allNodes[index].className.toLowerCase().indexOf('msolistparagraph') !== -1)) {
                listNodes.push(null);
            }
            if (this.blockNode.indexOf(allNodes[index].nodeName.toLowerCase()) !== -1) {
                if (allNodes[index].className &&
                    allNodes[index].className.toLowerCase().indexOf('msolistparagraph') !== -1) {
                    prevflagState = true;
                }
                else {
                    prevflagState = false;
                }
            }
        }
        if (listNodes.length && (listNodes[listNodes.length - 1] !== null)) {
            listNodes.push(null);
        }
        return listNodes;
    };
    MsWordPaste.prototype.listConverter = function (listNodes) {
        var level;
        var data = [];
        var collection = [];
        var content = '';
        var stNode;
        for (var i = 0; i < listNodes.length; i++) {
            if (listNodes[i] === null) {
                data.push({ content: this.makeConversion(collection), node: listNodes[i - 1] });
                collection = [];
                continue;
            }
            content = listNodes[i].getAttribute('style');
            if (content && content.indexOf('level') !== -1) {
                level = parseInt(content.charAt(content.indexOf('level') + 5), null);
            }
            else {
                level = 1;
            }
            this.listContents = [];
            this.getListContent(listNodes[i]);
            var type = void 0;
            if (!isNOU(this.listContents[0])) {
                type = this.listContents[0].trim().length > 1 ? 'ol' : 'ul';
                var tempNode = [];
                for (var j = 1; j < this.listContents.length; j++) {
                    tempNode.push(this.listContents[j]);
                }
                collection.push({ listType: type, content: tempNode, nestedLevel: level });
            }
        }
        stNode = listNodes.shift();
        while (stNode) {
            var elemColl = [];
            for (var temp1 = 0; temp1 < data.length; temp1++) {
                if (data[temp1].node === stNode) {
                    for (var index = 0; index < data[temp1].content.childNodes.length; index++) {
                        elemColl.push(data[temp1].content.childNodes[index]);
                    }
                    for (var index = 0; index < elemColl.length; index++) {
                        stNode.parentElement.insertBefore(elemColl[index], stNode);
                    }
                    break;
                }
            }
            stNode.remove();
            stNode = listNodes.shift();
            if (!stNode) {
                stNode = listNodes.shift();
            }
        }
    };
    MsWordPaste.prototype.makeConversion = function (collection) {
        var root = createElement('div');
        var temp;
        var pLevel = 1;
        var prevList;
        var listCount = 0;
        var elem;
        for (var index = 0; index < collection.length; index++) {
            var pElement = createElement('p');
            pElement.innerHTML = collection[index].content.join(' ');
            if ((collection[index].nestedLevel === 1) && listCount === 0 && collection[index].content) {
                root.appendChild(temp = createElement(collection[index].listType));
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            }
            else if (collection[index].nestedLevel === pLevel) {
                if (prevList.parentElement.tagName.toLowerCase() === collection[index].listType) {
                    prevList.parentElement.appendChild(prevList = createElement('li'));
                    prevList.appendChild(pElement);
                }
                else {
                    temp = createElement(collection[index].listType);
                    prevList.parentElement.parentElement.appendChild(temp);
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                }
            }
            else if (collection[index].nestedLevel > pLevel) {
                if (!isNOU(prevList)) {
                    for (var j = 0; j < collection[index].nestedLevel - pLevel; j++) {
                        prevList.appendChild(temp = createElement(collection[index].listType));
                        prevList = createElement('li', { styles: 'list-style-type: none;' });
                        temp.appendChild(prevList);
                    }
                    prevList.appendChild(pElement);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                    temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                    temp.childNodes[0].style.listStyle =
                        this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                }
                else {
                    root.appendChild(temp = createElement(collection[index].listType));
                    prevList = createElement('li');
                    prevList.appendChild(pElement);
                    temp.appendChild(prevList);
                    temp.setAttribute('level', collection[index].nestedLevel.toString());
                    temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                }
            }
            else if (collection[index].nestedLevel === 1) {
                if (root.lastChild.tagName.toLowerCase() === collection[index].listType) {
                    temp = root.lastChild;
                }
                else {
                    root.appendChild(temp = createElement(collection[index].listType));
                }
                prevList = createElement('li');
                prevList.appendChild(pElement);
                temp.appendChild(prevList);
                temp.setAttribute('level', collection[index].nestedLevel.toString());
                temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
            }
            else {
                elem = prevList;
                while (elem.parentElement) {
                    elem = elem.parentElement;
                    if (elem.attributes.getNamedItem('level')) {
                        if (parseInt(elem.attributes.getNamedItem('level').textContent, null) === collection[index].nestedLevel) {
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            elem.appendChild(prevList);
                            break;
                        }
                        else if (collection[index].nestedLevel > parseInt(elem.attributes.getNamedItem('level').textContent, null)) {
                            elem.appendChild(temp = createElement(collection[index].listType));
                            prevList = createElement('li');
                            prevList.appendChild(pElement);
                            temp.appendChild(prevList);
                            temp.setAttribute('level', collection[index].nestedLevel.toString());
                            temp.style.listStyle = this.getListStyle(collection[index].listType, collection[index].nestedLevel);
                            break;
                        }
                    }
                    continue;
                }
            }
            pLevel = collection[index].nestedLevel;
            listCount++;
        }
        return root;
    };
    MsWordPaste.prototype.getListStyle = function (listType, nestedLevel) {
        nestedLevel = (nestedLevel > 0) ? nestedLevel - 1 : nestedLevel;
        if (listType === 'ol') {
            return (nestedLevel < this.olData.length ? this.olData[nestedLevel] : this.olData[0]);
        }
        else {
            return (nestedLevel < this.ulData.length ? this.ulData[nestedLevel] : this.ulData[0]);
        }
    };
    MsWordPaste.prototype.getListContent = function (elem) {
        var pushContent = '';
        if (elem.firstElementChild.textContent.trim() === '' &&
            !isNOU(elem.firstElementChild.firstElementChild) &&
            elem.firstElementChild.firstElementChild.nodeName === 'IMG') {
            pushContent = elem.innerHTML.trim();
            this.listContents.push('');
            this.listContents.push(pushContent);
        }
        else {
            pushContent = elem.firstElementChild.textContent.trim();
            this.listContents.push(pushContent);
        }
        detach(elem.firstElementChild);
        this.listContents.push(elem.innerHTML);
    };
    return MsWordPaste;
}());
export { MsWordPaste };
