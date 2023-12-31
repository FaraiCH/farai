import { createElement, isNullOrUndefined, classList, L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { Query } from '@syncfusion/ej2-data';
/**
 * Paragraph Properties
 * @private
 */
var Paragraph = /** @class */ (function () {
    function Paragraph(container) {
        var _this = this;
        this.isRetrieving = false;
        this.appliedBulletStyle = 'dot';
        this.appliedNumberingStyle = 'arabic';
        this.appliedLineSpacing = '';
        this.splitButtonClass = 'e-de-prop-splitbutton';
        this.updateSelectedBulletListType = function (listText) {
            switch (listText) {
                case '\uf0b7':
                    _this.dotBullet.classList.add('de-list-item-selected');
                    break;
                case '\uf06f' + '\u0020':
                    _this.circleBullet.classList.add('de-list-item-selected');
                    break;
                case '\uf0a7':
                    _this.squareBullet.classList.add('de-list-item-selected');
                    break;
                case '\uf076':
                    _this.flowerBullet.classList.add('de-list-item-selected');
                    break;
                case '\uf0d8':
                    _this.arrowBullet.classList.add('de-list-item-selected');
                    break;
                case '\uf0fc':
                    _this.tickBullet.classList.add('de-list-item-selected');
                    break;
                default:
                    _this.noneBulletTag.classList.add('de-list-item-selected');
                    break;
            }
        };
        this.updateSelectedNumberedListType = function (listText) {
            switch (listText) {
                case '1.':
                    _this.numberList.classList.add('de-list-item-selected');
                    break;
                case 'I.':
                    _this.upRoman.classList.add('de-list-item-selected');
                    break;
                case 'A.':
                    _this.upLetter.classList.add('de-list-item-selected');
                    break;
                case 'a.':
                    _this.lowLetter.classList.add('de-list-item-selected');
                    break;
                case 'i.':
                    _this.lowRoman.classList.add('de-list-item-selected');
                    break;
                default:
                    _this.noneNumberTag.classList.add('de-list-item-selected');
                    break;
            }
        };
        this.removeSelectedList = function () {
            var className = 'de-list-item-selected';
            _this.noneNumberTag.classList.remove(className);
            _this.numberList.classList.remove(className);
            _this.lowLetter.classList.remove(className);
            _this.upLetter.classList.remove(className);
            _this.lowRoman.classList.remove(className);
            _this.upRoman.classList.remove(className);
            _this.noneBulletTag.classList.remove(className);
            _this.dotBullet.classList.remove(className);
            _this.circleBullet.classList.remove(className);
            _this.squareBullet.classList.remove(className);
            _this.flowerBullet.classList.remove(className);
            _this.arrowBullet.classList.remove(className);
            _this.tickBullet.classList.remove(className);
        };
        this.applyLastAppliedNumbering = function () {
            switch (_this.appliedNumberingStyle) {
                case 'arabic':
                    _this.numberedNumberDotClick();
                    break;
                case 'lowletter':
                    _this.numberedLowLetterClick();
                    break;
                case 'upletter':
                    _this.numberedUpLetterClick();
                    break;
                case 'lowroman':
                    _this.numberedLowRomanClick();
                    break;
                case 'uproman':
                    _this.numberedUpRomanClick();
                    break;
            }
        };
        this.applyLastAppliedBullet = function () {
            switch (_this.appliedBulletStyle) {
                case 'dot':
                    _this.bulletDotClick();
                    break;
                case 'circle':
                    _this.bulletCircleClick();
                    break;
                case 'square':
                    _this.bulletSquareClick();
                    break;
                case 'arrow':
                    _this.bulletArrowClick();
                    break;
                case 'tick':
                    _this.bulletTickClick();
                    break;
                case 'flower':
                    _this.bulletFlowerClick();
                    break;
            }
        };
        /* tslint:disable:no-any */
        this.updateOptions = function (args) {
            _this.updateStyleNames();
            args.popup.element.getElementsByClassName('e-de-ctnr-dropdown-ftr')[0].addEventListener('click', _this.createStyle);
        };
        this.createStyle = function () {
            _this.style.hidePopup();
            if (!_this.documentEditor.isReadOnly) {
                _this.documentEditor.showDialog('Styles');
            }
        };
        this.leftAlignmentAction = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (!_this.documentEditor.isReadOnly && _this.documentEditor.editor) {
                _this.documentEditor.editor.toggleTextAlignment('Left');
            }
        };
        this.lineSpacingAction = function (args) {
            if (_this.isRetrieving) {
                return;
            }
            var text = args.item.text;
            switch (text) {
                case _this.localObj.getConstant('Single'):
                    _this.documentEditor.selection.paragraphFormat.lineSpacing = 1;
                    break;
                case '1.15':
                    _this.documentEditor.selection.paragraphFormat.lineSpacing = 1.15;
                    break;
                case '1.5':
                    _this.documentEditor.selection.paragraphFormat.lineSpacing = 1.5;
                    break;
                case _this.localObj.getConstant('Double'):
                    _this.documentEditor.selection.paragraphFormat.lineSpacing = 2;
                    break;
            }
            setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
        };
        this.selectStyleValue = function (args) {
            if (_this.isRetrieving || !args.isInteracted) {
                return;
            }
            setTimeout(function () { _this.applyStyleValue(args); }, 10);
        };
        /* tslint:enable:no-any */
        this.rightAlignmentAction = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (!_this.documentEditor.isReadOnly && _this.documentEditor.editor) {
                _this.documentEditor.editor.toggleTextAlignment('Right');
            }
        };
        this.centerAlignmentAction = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (!_this.documentEditor.isReadOnly && _this.documentEditor.editor) {
                _this.documentEditor.editor.toggleTextAlignment('Center');
            }
        };
        this.justifyAction = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (!_this.documentEditor.isReadOnly && _this.documentEditor.editor) {
                _this.documentEditor.editor.toggleTextAlignment('Justify');
            }
        };
        this.increaseIndentAction = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (!_this.documentEditor.isReadOnly && _this.documentEditor.editor) {
                _this.documentEditor.editor.increaseIndent();
            }
        };
        this.decreaseIndentAction = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (!_this.documentEditor.isReadOnly && _this.documentEditor.editor) {
                _this.documentEditor.editor.decreaseIndent();
            }
        };
        this.numberedNoneClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.documentEditor.editor.clearList();
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.numberedNumberDotClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedNumberingStyle = 'arabic';
                _this.documentEditor.editor.applyNumbering('%1.', 'Arabic');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.numberedUpRomanClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedNumberingStyle = 'uproman';
                _this.documentEditor.editor.applyNumbering('%1.', 'UpRoman');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.numberedUpLetterClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedNumberingStyle = 'upletter';
                _this.documentEditor.editor.applyNumbering('%1.', 'UpLetter');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.numberedLowLetterClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedNumberingStyle = 'lowletter';
                _this.documentEditor.editor.applyNumbering('%1.', 'LowLetter');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.numberedLowRomanClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedNumberingStyle = 'lowroman';
                _this.documentEditor.editor.applyNumbering('%1.', 'LowRoman');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.bulletDotClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedBulletStyle = 'dot';
                _this.documentEditor.editor.applyBullet('\uf0b7', 'Symbol');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.bulletCircleClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedBulletStyle = 'circle';
                _this.documentEditor.editor.applyBullet('\uf06f' + '\u0020', 'Symbol');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.bulletSquareClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedBulletStyle = 'square';
                _this.documentEditor.editor.applyBullet('\uf0a7', 'Wingdings');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.bulletFlowerClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedBulletStyle = 'flower';
                _this.documentEditor.editor.applyBullet('\uf076', 'Wingdings');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.bulletArrowClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedBulletStyle = 'arrow';
                _this.documentEditor.editor.applyBullet('\uf0d8', 'Wingdings');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.bulletTickClick = function () {
            if (_this.isRetrieving) {
                return;
            }
            if (_this.documentEditor.editor) {
                _this.appliedBulletStyle = 'tick';
                _this.documentEditor.editor.applyBullet('\uf0fc', 'Wingdings');
                setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
            }
        };
        this.container = container;
    }
    Object.defineProperty(Paragraph.prototype, "documentEditor", {
        get: function () {
            return this.container.documentEditor;
        },
        enumerable: true,
        configurable: true
    });
    Paragraph.prototype.initializeParagraphPropertiesDiv = function (wholeDiv, isRtl) {
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        this.isRtl = isRtl;
        if (this.isRtl) {
            this.splitButtonClass = 'e-rtl ' + this.splitButtonClass;
        }
        this.textProperties = wholeDiv;
        var element = this.documentEditor.element.id + '_font_properties';
        var paragraphDiv = this.createDivElement(element + '_paragraph', wholeDiv, '');
        classList(paragraphDiv, ['e-de-cntr-pane-padding'], []);
        var label = createElement('label', { styles: 'width:26px;', className: 'e-de-ctnr-prop-label' });
        label.innerHTML = this.localObj.getConstant('Paragraph');
        paragraphDiv.appendChild(label);
        var styleDiv = this.createDivElement(element + '_styleDiv', paragraphDiv);
        styleDiv.classList.add('e-de-ctnr-segment', 'e-de-ctnr-style-div');
        // tslint:disable-next-line:max-line-length
        var styleSelect = createElement('input', { id: element + '_style', styles: 'width:248px;font-size: 12px;letter-spacing: 0.05px;' });
        styleDiv.appendChild(styleSelect);
        this.createStyleDropDownList(styleSelect);
        var indentWholeDiv = this.createDivElement(element + '_indentWholeDiv', paragraphDiv);
        indentWholeDiv.style.display = 'flex';
        indentWholeDiv.classList.add('e-de-ctnr-segment');
        if (isRtl) {
            classList(indentWholeDiv, ['e-de-ctnr-segment-rtl'], []);
        }
        // tslint:disable-next-line:max-line-length
        var indentDiv = this.createDivElement(element + '_indentDiv', indentWholeDiv, 'display:flex;');
        var indentClassName = 'e-de-ctnr-group-btn e-de-char-fmt-btn-left e-btn-group';
        if (isRtl) {
            indentClassName = 'e-rtl ' + indentClassName;
        }
        indentDiv.className = indentClassName;
        // tslint:disable-next-line:max-line-length
        this.leftAlignment = this.createButtonTemplate(element + '_leftIndent', 'e-de-ctnr-alignleft e-icons', indentDiv, 'e-de-prop-indent-button', '40.5', this.localObj.getConstant('Align left Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.centerAlignment = this.createButtonTemplate(element + '_centerIndent', 'e-de-ctnr-aligncenter e-icons', indentDiv, 'e-de-prop-indent-button', '40.5', this.localObj.getConstant('Center Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.rightAlignment = this.createButtonTemplate(element + '_rightIndent', 'e-de-ctnr-alignright e-icons', indentDiv, 'e-de-prop-indent-button', '40.5', this.localObj.getConstant('Align right Tooltip'));
        // tslint:disable-next-line:max-line-length
        this.justify = this.createButtonTemplate(element + '_justify', 'e-de-ctnr-justify e-icons', indentDiv, 'e-de-prop-indent-last-button', '40.5', this.localObj.getConstant('Justify Tooltip'));
        var increaseIndentIconCss = 'e-de-ctnr-increaseindent e-icons';
        var decreaseIndentIconCss = 'e-de-ctnr-decreaseindent e-icons';
        var incDecIndentDiv = this.createDivElement(element + '_indentDiv', indentWholeDiv, 'display:flex;');
        indentClassName = 'e-de-ctnr-group-btn e-de-char-fmt-btn-right e-btn-group';
        if (isRtl) {
            indentClassName = 'e-rtl ' + indentClassName;
            increaseIndentIconCss += ' e-de-flip';
            decreaseIndentIconCss += ' e-de-flip';
        }
        incDecIndentDiv.className = indentClassName;
        // tslint:disable-next-line:max-line-length
        this.decreaseIndent = this.createButtonTemplate(element + '_decreaseIndent', decreaseIndentIconCss, incDecIndentDiv, 'e-de-prop-indent-button', '37', this.localObj.getConstant('Decrease indent'));
        // tslint:disable-next-line:max-line-length
        this.increaseIndent = this.createButtonTemplate(element + '_increaseIndent', increaseIndentIconCss, incDecIndentDiv, 'e-de-prop-indent-last-button', '37', this.localObj.getConstant('Increase indent'));
        var listDiv = this.createDivElement(element + '_listDiv', paragraphDiv, 'display:flex;');
        classList(listDiv, ['e-de-ctnr-segment', 'e-de-ctnr-group-btn'], []);
        if (isRtl) {
            classList(listDiv, ['e-de-ctnr-segment-rtl', 'e-de-ctnr-group-btn'], []);
        }
        var lineHeight = createElement('button', { id: element + '_lineHeight', attrs: { type: 'button' } });
        listDiv.appendChild(lineHeight);
        this.lineSpacing = this.createLineSpacingDropdown(lineHeight);
        var listDropDown = this.createDivElement(element + '_listDropDiv', listDiv);
        listDropDown.className = 'de-split-button';
        var bulletButton = createElement('button', { id: element + '_bullet', attrs: { type: 'button' } });
        listDropDown.appendChild(bulletButton);
        var numberingList = createElement('button', { id: element + '_numberingList', attrs: { type: 'button' } });
        listDropDown.appendChild(numberingList);
        var bulletIconCss = 'e-de-ctnr-bullets e-icons';
        var numberIconCss = 'e-de-ctnr-numbering e-icons';
        if (isRtl) {
            bulletIconCss += ' e-de-flip';
            numberIconCss += ' e-de-flip';
        }
        this.createBulletListDropButton(bulletIconCss, bulletButton);
        this.createNumberListDropButton(numberIconCss, numberingList);
    };
    Paragraph.prototype.createSeparator = function (parentDiv) {
        var separator = createElement('div', { className: 'e-de-prop-vline' });
        parentDiv.appendChild(separator);
    };
    Paragraph.prototype.createDivElement = function (id, parentDiv, style) {
        var element;
        if (style) {
            element = createElement('div', { id: id, styles: style });
        }
        else {
            element = createElement('div', { id: id });
        }
        parentDiv.appendChild(element);
        return element;
    };
    // tslint:disable-next-line:max-line-length
    Paragraph.prototype.createButtonTemplate = function (id, iconcss, div, buttonClass, width, toolTipText) {
        var buttonElement = createElement('Button', { id: id, attrs: { type: 'button' } });
        // buttonElement.style.width = width + 'px';
        // buttonElement.style.height = 32 + 'px';
        div.appendChild(buttonElement);
        var btn = new Button({
            cssClass: buttonClass, iconCss: iconcss
        });
        btn.appendTo(buttonElement);
        buttonElement.setAttribute('title', toolTipText);
        return buttonElement;
    };
    Paragraph.prototype.createLineSpacingDropdown = function (button) {
        var _this = this;
        var items = [{
                text: this.localObj.getConstant('Single')
            }, {
                text: '1.15'
            }, {
                text: '1.5'
            }, {
                text: this.localObj.getConstant('Double')
            }];
        var dropdown = new DropDownButton({
            items: items,
            iconCss: 'e-de-ctnr-linespacing e-icons',
            enableRtl: this.isRtl,
            select: this.lineSpacingAction,
            cssClass: this.splitButtonClass,
            beforeItemRender: function (args) {
                args.element.innerHTML = '<span></span>' + args.item.text;
                var span = args.element.children[0];
                if (args.item.text === _this.appliedLineSpacing) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-item e-icons e-de-linespacing');
                }
                else {
                    args.element.children[0].style.marginRight = '25px';
                    args.element.children[0].classList.remove('e-de-selected-item');
                }
            }
        });
        dropdown.appendTo(button);
        button.setAttribute('title', this.localObj.getConstant('Line spacing'));
        return dropdown;
    };
    Paragraph.prototype.createNumberListDropButton = function (iconcss, button) {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var div = createElement('div', { id: 'target', styles: 'width: 211px;height: auto;display:none' });
        var ulTag = createElement('ul', {
            styles: 'display: block; outline: 0px;',
            id: 'listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        div.appendChild(ulTag);
        this.noneNumberTag = this.createNumberNoneListTag(ulTag);
        this.noneNumberTag.addEventListener('click', this.numberedNoneClick);
        this.numberList = this.createNumberListTag(ulTag, '1.', '2.', '3.');
        this.numberList.addEventListener('click', this.numberedNumberDotClick);
        this.lowLetter = this.createNumberListTag(ulTag, 'a.', 'b.', 'c.');
        this.lowLetter.addEventListener('click', this.numberedLowLetterClick);
        this.upLetter = this.createNumberListTag(ulTag, 'A.', 'B.', 'C.');
        this.upLetter.addEventListener('click', this.numberedUpLetterClick);
        this.lowRoman = this.createNumberListTag(ulTag, 'i.', 'ii.', 'iii.');
        this.lowRoman.addEventListener('click', this.numberedLowRomanClick);
        this.upRoman = this.createNumberListTag(ulTag, 'I.', 'II.', 'III.');
        this.upRoman.addEventListener('click', this.numberedUpRomanClick);
        var menuOptions = {
            target: div,
            iconCss: iconcss,
            cssClass: this.splitButtonClass,
            beforeOpen: function () {
                div.style.display = 'block';
                _this.updateSelectedNumberedListType(_this.documentEditor.selection.paragraphFormat.listText);
            },
            beforeClose: function () {
                div.style.display = 'none';
                _this.removeSelectedList();
            }
        };
        this.numberedListBtn = new SplitButton(menuOptions);
        this.numberedListBtn.click = function () {
            _this.applyLastAppliedNumbering();
        };
        this.numberedListBtn.appendTo(button);
        button.parentElement.setAttribute('title', this.localObj.getConstant('Numbering'));
    };
    Paragraph.prototype.createBulletListDropButton = function (iconcss, button) {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var div = createElement('div', { id: 'bullet_list', styles: 'width: 196px;height: auto;display:none' });
        var ulTag = createElement('ul', {
            styles: 'display: block; outline: 0px;', id: 'listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });
        div.appendChild(ulTag);
        this.noneBulletTag = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-none e-icons e-de-ctnr-list');
        this.noneBulletTag.addEventListener('click', this.numberedNoneClick);
        this.dotBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-dot e-icons e-de-ctnr-list');
        this.dotBullet.addEventListener('click', this.bulletDotClick);
        this.circleBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-circle e-icons e-de-ctnr-list');
        this.circleBullet.addEventListener('click', this.bulletCircleClick);
        this.squareBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-square e-icons e-de-ctnr-list');
        this.squareBullet.addEventListener('click', this.bulletSquareClick);
        this.flowerBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-flower e-icons e-de-ctnr-list');
        this.flowerBullet.addEventListener('click', this.bulletFlowerClick);
        this.arrowBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list');
        this.arrowBullet.addEventListener('click', this.bulletArrowClick);
        this.tickBullet = this.createBulletListTag(ulTag, 'e-de-ctnr-bullet-tick e-icons e-de-ctnr-list');
        this.tickBullet.addEventListener('click', this.bulletTickClick);
        var menuOptions = {
            target: div,
            iconCss: iconcss,
            cssClass: this.splitButtonClass,
            beforeOpen: function () {
                div.style.display = 'block';
                _this.updateSelectedBulletListType(_this.documentEditor.selection.paragraphFormat.listText);
            },
            beforeClose: function () {
                div.style.display = 'none';
                _this.removeSelectedList();
            }
        };
        this.bulletListBtn = new SplitButton(menuOptions);
        this.bulletListBtn.click = function () {
            _this.applyLastAppliedBullet();
        };
        this.bulletListBtn.appendTo(button);
        button.parentElement.setAttribute('title', this.localObj.getConstant('Bullets'));
    };
    Paragraph.prototype.createNumberListTag = function (ulTag, text1, text2, text3) {
        var liTag = createElement('li', {
            styles: 'display:block',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        // tslint:disable-next-line:max-line-length
        var innerHTML = '<div>' + text1 + '<span class="e-de-list-line"></span></div><div>' + text2 + '<span class="e-de-list-line">';
        innerHTML += '</span></div><div>' + text3 + '<span class="e-de-list-line"> </span></div >';
        var liInnerDiv = createElement('div', {
            className: 'e-de-list-header-presetmenu',
            id: 'ui-zlist0', innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    };
    Paragraph.prototype.createNumberNoneListTag = function (ulTag) {
        var liTag = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-floating-menuitem e-de-floating-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        var innerHTML = '<div><span class="e-de-bullets">None</span></div>';
        var liInnerDiv = createElement('div', {
            className: 'e-de-list-header-presetmenu', styles: 'position:relative;left:11px;top:13px',
            id: 'ui-zlist0', innerHTML: innerHTML
        });
        liTag.appendChild(liInnerDiv);
        return liTag;
    };
    Paragraph.prototype.createBulletListTag = function (ulTag, iconCss) {
        var liTag = createElement('li', {
            styles: 'display:block;',
            className: 'e-de-floating-menuitem e-de-floating-bullet-menuitem-md e-de-list-items  e-de-list-item-size'
        });
        ulTag.appendChild(liTag);
        var liInnerDiv = createElement('div', { className: 'e-de-bullet-list-header-presetmenu', id: 'ui-zlist0' });
        var spanDiv = createElement('div');
        liInnerDiv.appendChild(spanDiv);
        var span = createElement('span', { className: iconCss });
        spanDiv.appendChild(span);
        liTag.appendChild(liInnerDiv);
        return liTag;
    };
    Paragraph.prototype.createStyleDropDownList = function (selectElement) {
        this.style = new DropDownList({
            dataSource: [{ StyleName: 'Normal', Class: 'e-icons e-edit-font' }],
            cssClass: 'e-de-prop-dropdown',
            popupHeight: '240px',
            enableRtl: this.isRtl,
            query: new Query().select(['StyleName', 'Style']),
            fields: { text: 'StyleName', value: 'StyleName' },
            change: this.selectStyleValue
        });
        if (!this.container.enableCsp) {
            this.style.open = this.updateOptions;
            this.style.itemTemplate = '<span style="${Style}">${StyleName}</span>';
            this.style.footerTemplate = '<span class="e-de-ctnr-dropdown-ftr">'
                + this.localObj.getConstant('Manage Styles') + '...' + '</span>';
            this.style.isStringTemplate = true;
        }
        this.style.appendTo(selectElement);
        selectElement.parentElement.setAttribute('title', this.localObj.getConstant('Styles'));
    };
    Paragraph.prototype.updateStyleNames = function () {
        this.styleName = !isNullOrUndefined(this.style.itemData) ? this.style.itemData.StyleName : undefined;
        this.style.dataSource = this.constructStyleDropItems(this.documentEditor.getStyles('Paragraph'));
        this.style.dataBind();
        this.onSelectionChange();
    };
    Paragraph.prototype.constructStyleDropItems = function (styles) {
        var collection = [];
        for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
            var styleObj = styles_1[_i];
            var obj = {};
            obj.StyleName = styleObj.name;
            obj.Style = this.parseStyle(styleObj.style);
            collection.push(obj);
        }
        return collection;
    };
    Paragraph.prototype.parseStyle = function (style) {
        var domStyle = '';
        var styleObj = JSON.parse(style);
        var textDecoration = '';
        if (!isNullOrUndefined(styleObj.characterFormat.baselineAlignment) && styleObj.characterFormat.baselineAlignment !== 'Normal') {
            var vAlign = '';
            switch (styleObj.characterFormat.baselineAlignment) {
                case 'Superscript':
                    vAlign = 'super';
                    break;
                case 'Subscript':
                    vAlign = 'sub';
                    break;
            }
            if (vAlign.length > 1) {
                domStyle += 'vertical-align:' + vAlign + ';';
            }
        }
        if (!isNullOrUndefined(styleObj.characterFormat.underline) && styleObj.characterFormat.underline !== 'None') {
            textDecoration += 'underline ';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.strikethrough) && styleObj.characterFormat.strikethrough !== 'None') {
            textDecoration += 'line-through ';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.fontSize)) {
            domStyle += 'font-size:' + styleObj.characterFormat.fontSize + 'px;';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.fontFamily)) {
            domStyle += 'font-family:' + styleObj.characterFormat.fontFamily + ';';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.bold) && styleObj.characterFormat.bold) {
            domStyle += 'font-weight:bold;';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.italic) && styleObj.characterFormat.italic) {
            domStyle += 'font-style:italic;';
        }
        // if (!isNullOrUndefined(styleObj.characterFormat.fontColor)) {
        //     domStyle += 'color: ' + styleObj.characterFormat.fontColor + ';';
        // }
        if (textDecoration.length > 1) {
            domStyle += 'text-decoration:' + textDecoration + ';';
        }
        return domStyle;
    };
    Paragraph.prototype.wireEvent = function () {
        var _this = this;
        this.leftAlignment.addEventListener('click', function () { _this.leftAlignmentAction(); });
        this.rightAlignment.addEventListener('click', function () { _this.rightAlignmentAction(); });
        this.centerAlignment.addEventListener('click', function () { _this.centerAlignmentAction(); });
        this.justify.addEventListener('click', function () { _this.justifyAction(); });
        this.increaseIndent.addEventListener('click', function () { _this.increaseIndentAction(); });
        this.decreaseIndent.addEventListener('click', function () { _this.decreaseIndentAction(); });
        /* tslint:disable-next-line:max-line-length */
        this.lineSpacing.addEventListener('select', function (args) { _this.lineSpacingAction(args); });
    };
    Paragraph.prototype.unwireEvents = function () {
        this.leftAlignment.click = undefined;
        this.rightAlignment.click = undefined;
        this.centerAlignment.click = undefined;
        this.justify.click = undefined;
        this.increaseIndent.click = undefined;
        this.decreaseIndent.click = undefined;
        this.lineSpacing.select = undefined;
        this.style.select = undefined;
    };
    Paragraph.prototype.setLineSpacing = function () {
        var lineSpacing = this.documentEditor.selection.paragraphFormat.lineSpacing;
        if (lineSpacing === 1) {
            this.appliedLineSpacing = this.localObj.getConstant('Single');
        }
        else if (lineSpacing === 1.15) {
            this.appliedLineSpacing = '1.15';
        }
        else if (lineSpacing === 1.5) {
            this.appliedLineSpacing = '1.5';
        }
        else if (lineSpacing === 2) {
            this.appliedLineSpacing = this.localObj.getConstant('Double');
        }
        else {
            this.appliedLineSpacing = '';
        }
    };
    Paragraph.prototype.applyStyleValue = function (args) {
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.applyStyle(args.itemData.StyleName, true);
        }
    };
    Paragraph.prototype.onSelectionChange = function () {
        this.isRetrieving = true;
        if (this.documentEditor.editor) {
            //#region paragraph format
            var style = this.documentEditor.selection.paragraphFormat.styleName;
            if (style) {
                this.style.value = style;
                this.style.dataBind();
            }
            else {
                this.style.value = null;
            }
            classList(this.leftAlignment, [], ['e-btn-toggle']);
            classList(this.rightAlignment, [], ['e-btn-toggle']);
            classList(this.centerAlignment, [], ['e-btn-toggle']);
            classList(this.justify, [], ['e-btn-toggle']);
            if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Left') {
                classList(this.leftAlignment, ['e-btn-toggle'], []);
            }
            else if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Right') {
                classList(this.rightAlignment, ['e-btn-toggle'], []);
            }
            else if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Center') {
                classList(this.centerAlignment, ['e-btn-toggle'], []);
            }
            else if (this.documentEditor.selection.paragraphFormat.textAlignment === 'Justify') {
                classList(this.justify, ['e-btn-toggle'], []);
            }
            //#endregion
        }
        this.setLineSpacing();
        this.isRetrieving = false;
    };
    Paragraph.prototype.destroy = function () {
        this.container = undefined;
        if (this.lineSpacing) {
            this.lineSpacing.destroy();
            this.lineSpacing = undefined;
        }
        if (this.style) {
            this.style.destroy();
            this.style = undefined;
        }
        if (this.bulletListBtn) {
            this.bulletListBtn.destroy();
            this.bulletListBtn = undefined;
        }
        if (this.numberedListBtn) {
            this.numberedListBtn.destroy();
            this.numberedListBtn = undefined;
        }
    };
    return Paragraph;
}());
export { Paragraph };
