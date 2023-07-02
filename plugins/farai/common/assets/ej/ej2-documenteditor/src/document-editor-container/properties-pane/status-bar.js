import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Represents document editor status bar.
 * @private
 */
var StatusBar = /** @class */ (function () {
    function StatusBar(parentElement, docEditor) {
        var _this = this;
        this.startPage = 1;
        this.initializeStatusBar = function () {
            var isRtl = _this.container.enableRtl;
            _this.documentEditor.enableSpellCheck = (_this.container.enableSpellCheck) ? true : false;
            // tslint:disable-next-line:max-line-length
            _this.localObj = new L10n('documenteditorcontainer', _this.container.defaultLocale, _this.container.locale);
            // tslint:disable-next-line:max-line-length
            var styles = isRtl ? 'padding-right:16px' : 'padding-left:16px';
            // tslint:disable-next-line:max-line-length
            var div = createElement('div', { className: (_this.container.enableSpellCheck) ? 'e-de-ctnr-pg-no' : 'e-de-ctnr-pg-no-spellout', styles: styles });
            _this.statusBarDiv.appendChild(div);
            var label = createElement('label');
            label.textContent = _this.localObj.getConstant('Page') + ' ';
            div.appendChild(label);
            // tslint:disable-next-line:max-line-length
            _this.pageNumberInput = createElement('input', { styles: 'text-transform:capitalize;white-space:pre;overflow:hidden;user-select:none;cursor:text', attrs: { type: 'text' }, className: 'e-de-pagenumber-input' });
            _this.editablePageNumber = createElement('div', { styles: 'display: inline-flex', className: 'e-input e-de-pagenumber-text' });
            _this.editablePageNumber.appendChild(_this.pageNumberInput);
            if (isRtl) {
                label.style.marginLeft = '6px';
                _this.editablePageNumber.style.marginLeft = '6px';
            }
            else {
                label.style.marginRight = '6px';
                _this.editablePageNumber.style.marginRight = '6px';
            }
            _this.updatePageNumber();
            div.appendChild(_this.editablePageNumber);
            // tslint:disable-next-line:max-line-length
            _this.editablePageNumber.setAttribute('title', _this.localObj.getConstant('Current Page Number'));
            var label1 = createElement('label', { styles: 'width:16px' });
            label1.textContent = ' ' + _this.localObj.getConstant('of') + ' ';
            div.appendChild(label1);
            _this.pageCount = createElement('label');
            div.appendChild(_this.pageCount);
            _this.updatePageCount();
            if (_this.documentEditor.enableSpellCheck) {
                var verticalLine = createElement('div', { className: 'e-de-statusbar-separator' });
                _this.statusBarDiv.appendChild(verticalLine);
                var spellCheckBtn = _this.addSpellCheckElement();
                _this.spellCheckButton.appendTo(spellCheckBtn);
            }
            // tslint:disable-next-line:max-line-length   
            _this.pageButton = _this.createButtonTemplate((_this.container.enableSpellCheck) ? 'e-de-statusbar-pageweb e-btn-pageweb-spellcheck' : 'e-de-statusbar-pageweb', 'e-de-printlayout e-icons', _this.localObj.getConstant('Print layout'), _this.statusBarDiv, _this.pageButton, (_this.documentEditor.layoutType === 'Pages') ? true : false);
            // tslint:disable-next-line:max-line-length   
            _this.webButton = _this.createButtonTemplate('e-de-statusbar-pageweb', 'e-de-weblayout e-icons', _this.localObj.getConstant('Web layout'), _this.statusBarDiv, _this.webButton, (_this.documentEditor.layoutType === 'Continuous') ? true : false);
            _this.pageButton.addEventListener('click', function () {
                _this.documentEditor.layoutType = 'Pages';
                _this.addRemoveClass(_this.pageButton, _this.webButton);
            });
            _this.webButton.addEventListener('click', function () {
                _this.documentEditor.layoutType = 'Continuous';
                _this.addRemoveClass(_this.webButton, _this.pageButton);
            });
            var zoomBtn = createElement('button', {
                // tslint:disable-next-line:max-line-length
                className: 'e-de-statusbar-zoom', attrs: { type: 'button' }
            });
            _this.statusBarDiv.appendChild(zoomBtn);
            zoomBtn.setAttribute('title', 'Zoom level. Click or tap to open the Zoom options.');
            var items = [
                {
                    text: '200%',
                },
                {
                    text: '175%',
                },
                {
                    text: '150%',
                },
                {
                    text: '125%',
                },
                {
                    text: '100%',
                },
                {
                    text: '75%',
                },
                {
                    text: '50%',
                },
                {
                    text: '25%',
                },
                {
                    separator: true
                },
                {
                    text: _this.localObj.getConstant('Fit one page')
                },
                {
                    text: _this.localObj.getConstant('Fit page width'),
                },
            ];
            // tslint:disable-next-line:max-line-length
            _this.zoom = new DropDownButton({ content: '100%', items: items, enableRtl: _this.container.enableRtl, select: _this.onZoom });
            _this.zoom.isStringTemplate = true;
            _this.zoom.appendTo(zoomBtn);
        };
        this.onZoom = function (args) {
            _this.setZoomValue(args.item.text);
            _this.updateZoomContent();
        };
        this.onSpellCheck = function (args) {
            _this.setSpellCheckValue(args.item.text, args.element);
        };
        this.updateZoomContent = function () {
            _this.zoom.content = Math.round(_this.documentEditor.zoomFactor * 100) + '%';
        };
        this.setSpellCheckValue = function (text, element) {
            _this.spellCheckButton.content = 'Spelling';
            if (text.match(_this.localObj.getConstant('Spell Check'))) {
                _this.documentEditor.spellChecker.enableSpellCheck = (_this.documentEditor.spellChecker.enableSpellCheck) ? false : true;
                setTimeout(function () {
                    if (_this.documentEditor.enableSpellCheck && _this.documentEditor.spellChecker.enableSpellCheck) {
                        _this.documentEditor.documentHelper.triggerElementsOnLoading = true;
                        _this.documentEditor.documentHelper.triggerSpellCheck = true;
                    }
                    /* tslint:disable */
                }, 50);
                /* tslint:enable */
                _this.documentEditor.documentHelper.triggerSpellCheck = false;
                _this.documentEditor.documentHelper.triggerElementsOnLoading = false;
                // tslint:disable-next-line:max-line-length
            }
            else if (text.match(_this.localObj.getConstant('Underline errors'))) {
                if (_this.documentEditor.enableSpellCheck && _this.documentEditor.spellChecker.enableSpellCheck) {
                    // tslint:disable-next-line:max-line-length
                    _this.documentEditor.spellChecker.removeUnderline = (_this.documentEditor.spellChecker.removeUnderline) ? false : true;
                }
            }
        };
        this.setZoomValue = function (text) {
            if (text.match(_this.localObj.getConstant('Fit one page'))) {
                _this.documentEditor.fitPage('FitOnePage');
            }
            else if (text.match(_this.localObj.getConstant('Fit page width'))) {
                _this.documentEditor.fitPage('FitPageWidth');
            }
            else {
                _this.documentEditor.zoomFactor = parseInt(text, 0) / 100;
            }
        };
        /**
         * Updates page count.
         */
        this.updatePageCount = function () {
            _this.pageCount.textContent = _this.editorPageCount.toString();
        };
        /**
         * Updates page number.
         */
        this.updatePageNumber = function () {
            _this.pageNumberInput.value = _this.startPage.toString();
            _this.updatePageNumberWidth();
        };
        this.updatePageNumberOnViewChange = function (args) {
            if (_this.documentEditor.selection
                && _this.documentEditor.selection.startPage >= args.startPage && _this.documentEditor.selection.startPage <= args.endPage) {
                _this.startPage = _this.documentEditor.selection.startPage;
            }
            else {
                _this.startPage = args.startPage;
            }
            _this.updatePageNumber();
            _this.updatePageCount();
        };
        this.wireEvents = function () {
            _this.pageNumberInput.addEventListener('keydown', function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    var pageNumber = parseInt(_this.pageNumberInput.value, 0);
                    if (pageNumber > _this.editorPageCount) {
                        _this.updatePageNumber();
                    }
                    else {
                        if (_this.documentEditor.selection) {
                            _this.documentEditor.selection.goToPage(parseInt(_this.pageNumberInput.value, 0));
                        }
                        else {
                            _this.documentEditor.scrollToPage(parseInt(_this.pageNumberInput.value, 0));
                        }
                    }
                    _this.pageNumberInput.contentEditable = 'false';
                    if (_this.pageNumberInput.value === '') {
                        _this.updatePageNumber();
                    }
                }
                if (e.which > 64) {
                    e.preventDefault();
                }
            });
            _this.pageNumberInput.addEventListener('keyup', function () {
                _this.updatePageNumberWidth();
            });
            _this.pageNumberInput.addEventListener('blur', function () {
                if (_this.pageNumberInput.value === '' || parseInt(_this.pageNumberInput.value, 0) > _this.editorPageCount) {
                    _this.updatePageNumber();
                }
                _this.pageNumberInput.contentEditable = 'false';
            });
            _this.pageNumberInput.addEventListener('focus', function () {
                _this.pageNumberInput.select();
            });
        };
        this.addRemoveClass = function (addToElement, removeFromElement) {
            addToElement.classList.add('e-btn-toggle');
            if (removeFromElement.classList.contains('e-btn-toggle')) {
                removeFromElement.classList.remove('e-btn-toggle');
            }
        };
        this.statusBarDiv = parentElement;
        this.container = docEditor;
        this.initializeStatusBar();
        this.wireEvents();
    }
    Object.defineProperty(StatusBar.prototype, "documentEditor", {
        get: function () {
            return this.container ? this.container.documentEditor : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StatusBar.prototype, "editorPageCount", {
        get: function () {
            return this.documentEditor ? this.documentEditor.pageCount : 1;
        },
        enumerable: true,
        configurable: true
    });
    StatusBar.prototype.addSpellCheckElement = function () {
        var _this = this;
        var spellCheckBtn = createElement('button', {
            className: 'e-de-statusbar-spellcheck'
        });
        this.statusBarDiv.appendChild(spellCheckBtn);
        spellCheckBtn.setAttribute('title', 'Spell Checker options');
        var spellCheckItems = [
            {
                text: 'Spell Check',
            },
            {
                text: 'Underline errors',
            },
        ];
        // tslint:disable-next-line:max-line-length
        this.spellCheckButton = new DropDownButton({
            content: 'Spelling', items: spellCheckItems, enableRtl: this.container.enableRtl, select: this.onSpellCheck,
            beforeItemRender: function (args) {
                args.element.innerHTML = '<span></span>' + args.item.text;
                if (isNullOrUndefined(_this.currentLanguage)) {
                    _this.currentLanguage = _this.documentEditor.spellChecker.languageID;
                }
                if (isNullOrUndefined(_this.allowSuggestion)) {
                    _this.allowSuggestion = _this.documentEditor.spellChecker.allowSpellCheckAndSuggestion;
                }
                var span = args.element.children[0];
                if (args.item.text === 'Spell Check' && _this.documentEditor.enableSpellCheck &&
                    _this.documentEditor.spellChecker.enableSpellCheck) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-spellcheck-item');
                    // tslint:disable-next-line:max-line-length
                }
                else if (args.item.text === 'Underline errors' && _this.documentEditor.enableSpellCheck &&
                    _this.documentEditor.spellChecker.enableSpellCheck && !_this.documentEditor.spellChecker.removeUnderline) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-underline-item');
                }
                else {
                    span.style.marginRight = '25px';
                    args.element.children[0].classList.remove('e-de-selected-spellcheck-item');
                    args.element.children[0].classList.remove('e-de-selected-underline-item');
                }
            }
        });
        return spellCheckBtn;
    };
    StatusBar.prototype.updatePageNumberWidth = function () {
        if (this.pageNumberInput) {
            this.pageNumberInput.style.width = this.pageNumberInput.value.length >= 3 ? '30px' : '22px';
        }
    };
    /**
     * @private
     */
    StatusBar.prototype.toggleWebLayout = function () {
        this.addRemoveClass(this.pageButton, this.webButton);
    };
    // tslint:disable-next-line:max-line-length
    StatusBar.prototype.createButtonTemplate = function (className, iconcss, toolTipText, div, appendDiv, toggle) {
        appendDiv = createElement('Button', { className: className, attrs: { type: 'button' } });
        div.appendChild(appendDiv);
        var btn = new Button({
            cssClass: className, iconCss: iconcss, enableRtl: this.container.enableRtl
        });
        if (toggle === true) {
            appendDiv.classList.add('e-btn-toggle');
        }
        btn.appendTo(appendDiv);
        appendDiv.setAttribute('title', toolTipText);
        return appendDiv;
    };
    /**
     * @private
     */
    StatusBar.prototype.destroy = function () {
        this.container = undefined;
        if (this.zoom) {
            this.zoom.destroy();
            this.zoom = undefined;
        }
        if (this.spellCheckButton) {
            this.spellCheckButton.destroy();
            this.spellCheckButton = undefined;
        }
        if (this.pageButton) {
            this.pageButton = undefined;
        }
        if (this.webButton) {
            this.webButton = undefined;
        }
    };
    return StatusBar;
}());
export { StatusBar };
