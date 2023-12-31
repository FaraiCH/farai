import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
/**
 * @private
 */
var HtmlExport = /** @class */ (function () {
    function HtmlExport() {
        /* tslint:disable:no-any */
        this.document = undefined;
        this.prevListLevel = undefined;
        this.isOrdered = undefined;
        /* tslint:disable:no-any */
        /**
         * @private
         */
        this.fieldCheck = 0;
        /* tslint:enable:no-any */
    }
    /* tslint:disable:no-any */
    /**
     * @private
     */
    HtmlExport.prototype.writeHtml = function (document) {
        this.document = document;
        var html = '';
        for (var i = 0; i < document.sections.length; i++) {
            html += this.serializeSection(document.sections[i]);
        }
        return html;
    };
    /**
     * @private
     */
    HtmlExport.prototype.serializeSection = function (section) {
        var string = '';
        for (var i = 0; i < section.blocks.length; i++) {
            var block = section.blocks[i];
            if (block.hasOwnProperty('inlines')) {
                string += this.serializeParagraph(block);
            }
            else if (block.hasOwnProperty('blocks')) {
                string += this.serializeSection(block);
            }
            else {
                string += this.closeList();
                string += this.serializeTable(block);
            }
        }
        string += this.closeList();
        this.prevListLevel = undefined;
        this.isOrdered = undefined;
        return string;
    };
    // Serialize Paragraph 
    /**
     * @private
     */
    HtmlExport.prototype.serializeParagraph = function (paragraph) {
        var blockStyle = '';
        var startString = undefined;
        var isList = false;
        var isPreviousList = false;
        if (!isNullOrUndefined(this.prevListLevel)) {
            isPreviousList = true;
        }
        var tagAttributes = [];
        var listLevel = undefined;
        if (!isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
            listLevel = this.getListLevel(paragraph);
            if (!isPreviousList) {
                this.prevListLevel = listLevel;
            }
            if (this.prevListLevel !== listLevel) {
                isPreviousList = false;
            }
            this.prevListLevel = listLevel;
        }
        if (!isPreviousList) {
            blockStyle += this.closeList();
        }
        if (!isNullOrUndefined(listLevel)) {
            isList = true;
        }
        if (isList && !isPreviousList) {
            blockStyle += this.getHtmlList(listLevel, paragraph.paragraphFormat.listFormat.listLevelNumber);
        }
        tagAttributes.push('style="' + this.serializeParagraphStyle(paragraph, '', isList) + '"');
        if (isList) {
            blockStyle += this.createAttributesTag('li', tagAttributes);
        }
        else {
            this.prevListLevel = undefined;
            this.isOrdered = undefined;
            blockStyle += this.createAttributesTag(this.getStyleName(paragraph.paragraphFormat.styleName), tagAttributes);
        }
        if (paragraph.inlines.length === 0) {
            //Handled to preserve non breaking space for empty paragraphs similar to MS Word behavior.
            blockStyle += '&nbsp';
        }
        else {
            blockStyle = this.serializeInlines(paragraph, blockStyle);
        }
        if (isList) {
            blockStyle += this.endTag('li');
            if (blockStyle.indexOf('<ul') > -1) {
                this.isOrdered = false;
            }
            else if (blockStyle.indexOf('<ol') > -1) {
                this.isOrdered = true;
            }
        }
        else {
            blockStyle += this.endTag(this.getStyleName(paragraph.paragraphFormat.styleName));
        }
        return blockStyle;
    };
    HtmlExport.prototype.closeList = function () {
        var blockStyle = '';
        if (!isNullOrUndefined(this.isOrdered)) {
            if (this.isOrdered) {
                blockStyle = this.endTag('ol');
            }
            else {
                blockStyle = this.endTag('ul');
            }
            this.isOrdered = undefined;
        }
        return blockStyle;
    };
    HtmlExport.prototype.getListLevel = function (paragraph) {
        var listLevel = undefined;
        var list = undefined;
        for (var i = 0; i < this.document.lists.length; i++) {
            if (this.document.lists[i].listId === paragraph.paragraphFormat.listFormat.listId) {
                list = this.document.lists[i];
                break;
            }
        }
        if (list) {
            for (var j = 0; j < this.document.abstractLists.length; j++) {
                if (this.document.abstractLists[j].abstractListId === list.abstractListId) {
                    listLevel = this.document.abstractLists[j].levels[paragraph.paragraphFormat.listFormat.listLevelNumber];
                    break;
                }
            }
        }
        return listLevel;
    };
    HtmlExport.prototype.getHtmlList = function (listLevel, levelNumer) {
        //if (start == null || (start != null && start.Paragraph != this)) {
        //    let block: BlockAdv = this.GetPreviousBlock();
        //    if (block instanceof ParagraphAdv) {
        //        let previousListLevel: ListLevelAdv = (block as ParagraphAdv).ParagraphFormat.ListFormat.ListLevel;
        //        if (previousListLevel == listLevel)
        //            return "";
        //    }
        //}
        var html = '';
        if (listLevel.listLevelPattern === 'Bullet') {
            html += '<ul type=\"';
            switch (levelNumer) {
                case 0:
                    html += 'disc';
                    listLevel.characterFormat.fontFamily = 'Symbol';
                    break;
                case 1:
                    html += 'circle';
                    listLevel.characterFormat.fontFamily = 'Symbol';
                    break;
                case 2:
                    html += 'square';
                    listLevel.characterFormat.fontFamily = 'Wingdings';
                    break;
                default:
                    html += 'disc';
                    listLevel.characterFormat.fontFamily = 'Symbol';
                    break;
            }
            html += '\">';
        }
        else {
            html += '<ol type=\"';
            switch (listLevel.listLevelPattern) {
                case 'LowLetter':
                    html += 'a';
                    break;
                case 'UpLetter':
                    html += 'A';
                    break;
                case 'LowRoman':
                    html += 'i';
                    break;
                case 'UpRoman':
                    html += 'I';
                    break;
                default:
                    html += '1';
                    break;
            }
            html += '\" start=\"' + listLevel.startAt.toString() + '\">';
        }
        return html;
    };
    //SerializeInlines
    /**
     * @private
     */
    HtmlExport.prototype.serializeInlines = function (paragraph, blockStyle) {
        var inline = undefined;
        var i = 0;
        while (paragraph.inlines.length > i) {
            inline = paragraph.inlines[i];
            if (inline.hasOwnProperty('inlines')) {
                blockStyle += this.serializeContentInlines(inline, blockStyle);
                i++;
                continue;
            }
            if (inline.hasOwnProperty('imageString')) {
                blockStyle += this.serializeImageContainer(inline);
            }
            else if (inline.hasOwnProperty('fieldType')) {
                if (inline.fieldType === 0) {
                    var fieldCode = paragraph.inlines[i + 1];
                    if (!isNullOrUndefined(fieldCode) && !isNullOrUndefined(fieldCode.text) &&
                        (fieldCode.text.indexOf('TOC') >= 0 || fieldCode.text.indexOf('HYPERLINK') >= 0)) {
                        this.fieldCheck = 1;
                        var tagAttributes = [];
                        tagAttributes.push('style="' + this.serializeInlineStyle(inline.characterFormat, '') + '"');
                        blockStyle += this.createAttributesTag('a', tagAttributes);
                    }
                    else {
                        this.fieldCheck = undefined;
                    }
                }
                else if (inline.fieldType === 2) {
                    if (!isNullOrUndefined(this.fieldCheck)) {
                        this.fieldCheck = 2;
                    }
                    else {
                        this.fieldCheck = 0;
                    }
                }
                else {
                    if (!isNullOrUndefined(this.fieldCheck) && this.fieldCheck !== 0) {
                        blockStyle += this.endTag('a');
                    }
                    this.fieldCheck = 0;
                }
            }
            else {
                var text = isNullOrUndefined(inline.text) ? '' : inline.text;
                if (this.fieldCheck === 0) {
                    blockStyle += this.serializeSpan(text, inline.characterFormat);
                }
                if (this.fieldCheck === 1) {
                    var hyperLink = text.replace(/"/g, '');
                    blockStyle += ' href= \"' + hyperLink.replace('HYPERLINK', '').trim();
                    blockStyle += '\"';
                    blockStyle += '>';
                }
                if (this.fieldCheck === 2) {
                    blockStyle += text;
                }
            }
            i++;
        }
        return blockStyle;
    };
    HtmlExport.prototype.serializeContentInlines = function (inline, inlineStyle) {
        inlineStyle += this.serializeInlines(inline, inlineStyle);
        return inlineStyle;
    };
    // Serialize Span
    /**
     * @private
     */
    HtmlExport.prototype.serializeSpan = function (spanText, characterFormat) {
        var spanClass = '';
        if (spanText.indexOf('\v') !== -1) {
            spanClass += '<br>';
            return spanClass.toString();
        }
        else if (spanText.indexOf('\f') !== -1) {
            spanClass += '<br style = "page-break-after:always;"/>';
            return spanClass.toString();
        }
        var tagAttributes = [];
        this.serializeInlineStyle(characterFormat, '');
        tagAttributes.push('style="' + this.serializeInlineStyle(characterFormat, '') + '"');
        spanClass += this.createAttributesTag('span', tagAttributes);
        var ignoreFirstSpace = false;
        // Todo: Need to handle it.
        // If the text starts with white-space, need to check whether it is a continuous space.
        // if (characterFormat.ownerBase instanceof WInline) {
        //     let inline: WInline = (characterFormat.ownerBase as WInline);
        //     tslint:disable:max-line-length            
        //     if (inline instanceof WSpan && !isNullOrUndefined(inline.text) && inline.text !== '' && (inline as WSpan).text[0] === ' ') {
        //         Check previous inline until, it has valid rendered text.
        //         do {
        //             inline = WInline.getPreviousTextInline((inline as WSpan));
        //         } while (inline instanceof WSpan && !isNullOrUndefined(inline.text));
        //     } else {
        //         inline = undefined;
        //     }
        //     If current white-space is a continuation of consecutive spaces, this will be set true.
        //     ignoreFirstSpace = inline instanceof WSpan && !isNullOrUndefined(inline.text)
        //         && (inline as WSpan).text[(inline as WSpan).text.length - 1] === ' ';
        // }
        var text = this.decodeHtmlNames(spanText.toString());
        if (text.length === 0) {
            text = '&nbsp';
        }
        spanClass += text;
        spanClass += this.endTag('span');
        return spanClass.toString();
    };
    /**
     * @private
     */
    HtmlExport.prototype.getStyleName = function (style) {
        switch (style) {
            case 'Heading 1':
                return 'h1';
            case 'Heading 2':
                return 'h2';
            case 'Heading 3':
                return 'h3';
            case 'Heading 4':
                return 'h4';
            case 'Heading 5':
                return 'h5';
            default:
                return 'p';
        }
    };
    //Serialize Image
    /**
     * @private
     */
    HtmlExport.prototype.serializeImageContainer = function (image) {
        var imageStyle = '';
        var tagAttributes = [];
        this.serializeInlineStyle(image.characterFormat, '');
        var imageSource = '';
        if (!isNullOrUndefined(image.imageString)) {
            imageSource = image.imageString;
        }
        var width = HelperMethods.convertPointToPixel(image.width);
        var height = HelperMethods.convertPointToPixel(image.height);
        tagAttributes.push('width="' + width.toString() + '"');
        tagAttributes.push('height="' + height.toString() + '"');
        tagAttributes.push('src="' + imageSource + '"');
        imageStyle += this.createAttributesTag('img', tagAttributes);
        imageStyle += (this.endTag('img'));
        return imageStyle.toString();
    };
    // Serialize Table Cell
    /**
     * @private
     */
    HtmlExport.prototype.serializeCell = function (cell) {
        var blockStyle = '';
        var tagAttributes = [];
        var cellHtml = '';
        tagAttributes = [];
        if (!isNullOrUndefined(cell.cellFormat)) {
            //if (cell.cellFormat.shading.backgroundColor !== Color.FromArgb(0, 0, 0, 0)) {
            if (!isNullOrUndefined(cell.cellFormat.shading.backgroundColor)) {
                tagAttributes.push('bgcolor="' + HelperMethods.getColor(cell.cellFormat.shading.backgroundColor) + '"');
            }
            // }
            if (!isNullOrUndefined(cell.cellFormat.columnSpan) && cell.cellFormat.columnSpan > 1) {
                tagAttributes.push('colspan="' + cell.cellFormat.columnSpan.toString() + '"');
            }
            if (!isNullOrUndefined(cell.cellFormat.rowSpan) && cell.cellFormat.rowSpan > 1) {
                tagAttributes.push('rowspan="' + cell.cellFormat.rowSpan.toString() + '"');
            }
            if (!isNullOrUndefined(cell.cellFormat.cellWidth) && cell.cellFormat.cellWidth !== 0) {
                var cellWidth = HelperMethods.convertPointToPixel(cell.cellFormat.cellWidth);
                tagAttributes.push('width="' + cellWidth.toString() + '"');
            }
            var cellAlignment = isNullOrUndefined(cell.cellFormat.verticalAlignment) ? 'top' :
                cell.cellFormat.verticalAlignment.toString().toLowerCase();
            tagAttributes.push('valign="' + cellAlignment + '"');
            if (!isNullOrUndefined(cell.cellFormat.leftMargin) && cell.cellFormat.leftMargin !== 0) {
                cellHtml += ('padding-left:' + cell.cellFormat.leftMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.rightMargin) && cell.cellFormat.rightMargin !== 0) {
                cellHtml += ('padding-right:' + cell.cellFormat.rightMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.topMargin) && cell.cellFormat.topMargin !== 0) {
                cellHtml += ('padding-top:' + cell.cellFormat.topMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.bottomMargin) && cell.cellFormat.bottomMargin !== 0) {
                cellHtml += ('padding-bottom:' + cell.cellFormat.bottomMargin.toString() + 'pt;');
            }
            if (!isNullOrUndefined(cell.cellFormat.borders)) {
                cellHtml += this.serializeCellBordersStyle(cell.cellFormat.borders);
            }
        }
        if (cellHtml.length !== 0) {
            tagAttributes.push('style="' + cellHtml + '"');
        }
        blockStyle += (this.createAttributesTag('td', tagAttributes));
        for (var k = 0; k < cell.blocks.length; k++) {
            var block = cell.blocks[k];
            if (block.hasOwnProperty('rows')) {
                blockStyle += this.serializeTable(block);
            }
            else {
                blockStyle += this.serializeParagraph(block);
            }
        }
        blockStyle += (this.endTag('td'));
        return blockStyle;
    };
    // Serialize Table
    /**
     * @private
     */
    HtmlExport.prototype.serializeTable = function (table) {
        var html = '';
        html += this.createTableStartTag(table);
        for (var j = 0; j < table.rows.length; j++) {
            html += this.serializeRow(table.rows[j]);
        }
        html += this.createTableEndTag();
        return html;
    };
    // Serialize Row
    /**
     * @private
     */
    HtmlExport.prototype.serializeRow = function (row) {
        var html = '';
        html += this.createRowStartTag(row);
        for (var k = 0; k < row.cells.length; k++) {
            html += this.serializeCell(row.cells[k]);
        }
        return html;
    };
    // Serialize Styles
    /**
     * @private
     */
    HtmlExport.prototype.serializeParagraphStyle = function (paragraph, className, isList) {
        var paragraphClass = '';
        paragraphClass += this.serializeCharacterFormat(paragraph.characterFormat);
        paragraphClass += this.serializeParagraphFormat(paragraph.paragraphFormat, isList);
        return paragraphClass;
    };
    /**
     * @private
     */
    HtmlExport.prototype.serializeInlineStyle = function (characterFormat, className) {
        return this.serializeCharacterFormat(characterFormat);
    };
    /**
     * @private
     */
    HtmlExport.prototype.serializeTableBorderStyle = function (borders) {
        var borderStyle = '';
        if (!isNullOrUndefined(borders.left.lineStyle)) {
            borderStyle += ('border-left-style:' + this.convertBorderLineStyle(borders.left.lineStyle));
            borderStyle += ';';
        }
        if (borders.left.lineWidth) {
            borderStyle += ('border-left-width:' + borders.left.lineWidth.toString() + 'pt');
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.left.color)) {
            borderStyle += ('border-left-color:' + HelperMethods.getColor(borders.left.color));
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.right.lineStyle)) {
            borderStyle += ('border-right-style:' + this.convertBorderLineStyle(borders.right.lineStyle));
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.right.lineWidth)) {
            borderStyle += ('border-right-width:' + borders.right.lineWidth.toString() + 'pt');
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.right.color)) {
            borderStyle += ('border-right-color:' + HelperMethods.getColor(borders.right.color));
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.top.lineStyle)) {
            borderStyle += ('border-top-style:' + this.convertBorderLineStyle(borders.top.lineStyle));
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.top.lineWidth)) {
            borderStyle += ('border-top-width:' + borders.top.lineWidth.toString() + 'pt');
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.top.color)) {
            borderStyle += ('border-top-color:' + HelperMethods.getColor(borders.bottom.color));
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.bottom.lineStyle)) {
            borderStyle += ('border-bottom-style:' + this.convertBorderLineStyle(borders.bottom.lineStyle));
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.bottom.lineWidth)) {
            borderStyle += ('border-bottom-width:' + borders.bottom.lineWidth.toString() + 'pt');
            borderStyle += ';';
        }
        if (!isNullOrUndefined(borders.bottom.color)) {
            borderStyle += ('border-bottom-color:' + HelperMethods.getColor(borders.bottom.color));
            borderStyle += ';';
        }
        return borderStyle;
    };
    /**
     * @private
     */
    HtmlExport.prototype.serializeCellBordersStyle = function (borders) {
        var borderStyle = '';
        borderStyle = 'border:solid 1px;';
        // if (borders.left.color) {
        //     borderStyle += ('border-left-color:' + HelperMethods.getColor(borders.left.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.left, 'left');
        // if (!isNullOrUndefined(borders.right.color)) {
        //     borderStyle += ('border-right-color:' + HelperMethods.getColor(borders.right.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.right, 'right');
        // if (!isNullOrUndefined(borders.top.color)) {
        //     borderStyle += ('border-top-color:' + HelperMethods.getColor(borders.top.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.top, 'top');
        // if (!isNullOrUndefined(borders.bottom.color)) {
        //     borderStyle += ('border-bottom-color:' + HelperMethods.getColor(borders.bottom.color));
        //     borderStyle += ';';
        // }
        // borderStyle += this.serializeBorderStyle(borders.bottom, 'bottom');
        // Todo: handle
        // let border: WBorder = undefined;
        // //LeftBorder
        // border = WCell.getCellLeftBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'left');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-left-style:none;');
        // }
        // //RightBorder
        // border = WCell.getCellRightBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'right');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-right-style:none');
        // }
        // //TopBorder
        // border = WCell.getCellTopBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'top');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-top-style:none');
        // }
        // //BottomBorder
        // border = WCell.getCellBottomBorder(WCell.getCellOf(borders));
        // if (!isNullOrUndefined(border) && border.lineStyle !== 'None') {
        //     borderStyle += this.serializeBorderStyle(border, 'bottom');
        // } else if (!isNullOrUndefined(border) && border.hasNoneStyle) {
        //     borderStyle += ('border-bottom-style:none');
        // }
        return borderStyle;
    };
    /**
     * @private
     */
    HtmlExport.prototype.serializeBorderStyle = function (border, borderPosition) {
        var borderStyle = '';
        borderStyle += ('border-' + borderPosition + '-style:' + this.convertBorderLineStyle(border.lineStyle));
        borderStyle += ';';
        if (border.lineWidth > 0) {
            borderStyle += ('border-' + borderPosition + '-width:' + border.lineWidth.toString() + 'pt;');
        }
        //if (border.color !== Color.FromArgb(0, 0, 0, 0))
        if (!isNullOrUndefined(border.color)) {
            borderStyle += ('border-' + borderPosition + '-color:' + HelperMethods.getColor(border.color) + ';');
        }
        return borderStyle;
    };
    /**
     * @private
     */
    HtmlExport.prototype.convertBorderLineStyle = function (lineStyle) {
        switch (lineStyle) {
            case 'None':
                return 'none';
            case 'Single':
                return 'solid';
            case 'Dot':
                return 'dotted';
            case 'DashSmallGap':
            case 'DashLargeGap':
            case 'DashDot':
            case 'DashDotDot':
                return 'dashed';
            case 'Double':
            case 'Triple':
            case 'ThinThickSmallGap':
            case 'ThickThinSmallGap':
            case 'ThinThickThinSmallGap':
            case 'ThinThickMediumGap':
            case 'ThickThinMediumGap':
            case 'ThinThickThinMediumGap':
            case 'ThinThickLargeGap':
            case 'ThickThinLargeGap':
            case 'ThinThickThinLargeGap':
                return 'double';
            case 'SingleWavy':
                return 'solid';
            case 'DoubleWavy':
                return 'double';
            case 'DashDotStroked':
                return 'solid';
            case 'Emboss3D':
                return 'ridge';
            case 'Engrave3D':
                return 'groove';
            case 'Outset':
                return 'outset';
            case 'Inset':
                return 'inset';
            default:
                return 'solid';
        }
    };
    // Serialize Format
    /**
     * @private
     */
    HtmlExport.prototype.serializeCharacterFormat = function (characterFormat) {
        if (!isNullOrUndefined(characterFormat.inlineFormat)) {
            return this.serializeCharacterFormat(characterFormat.inlineFormat);
        }
        var propertyValue;
        var charStyle = '';
        charStyle += 'font-weight';
        charStyle += ':';
        charStyle += characterFormat.bold ? 'bold' : 'normal';
        charStyle += ';';
        charStyle += 'font-style';
        charStyle += ':';
        if (characterFormat.italic) {
            charStyle += 'italic';
        }
        else {
            charStyle += 'normal';
        }
        charStyle += ';';
        // Double strike through will become Single strike through while saving HTML using MS Word.
        if (characterFormat.strikethrough === 'SingleStrike' || characterFormat.strikethrough === 'DoubleStrike') {
            charStyle += 'text-decoration';
            charStyle += ':';
            charStyle += 'line-through';
            charStyle += ';';
        }
        //Text Baseline Alignment
        // tslint:disable-next-line:max-line-length
        if (characterFormat.baselineAlignment === 'Superscript' || characterFormat.baselineAlignment === 'Subscript') {
            charStyle += 'vertical-align';
            charStyle += ':';
            charStyle += characterFormat.baselineAlignment === 'Superscript' ? 'super' : 'sub';
            charStyle += ';';
        }
        //Text Foreground and Background Color 
        if (!isNullOrUndefined(characterFormat.highlightColor) && characterFormat.highlightColor !== 'NoColor') {
            charStyle += 'background-color';
            charStyle += ':';
            charStyle += HelperMethods.getColor(characterFormat.highlightColor.toString());
            charStyle += ';';
        }
        //Font Color
        propertyValue = characterFormat.fontColor;
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'color';
            charStyle += ':';
            charStyle += HelperMethods.getColor(propertyValue);
            charStyle += ';';
        }
        if (!isNullOrUndefined(characterFormat.underline) && characterFormat.underline !== 'None') {
            charStyle += 'text-decoration';
            charStyle += ':';
            charStyle += 'underline';
            charStyle += ';';
        }
        if (!isNullOrUndefined(characterFormat.allCaps) && (characterFormat.allCaps)) {
            charStyle += 'text-transform';
            charStyle += ':';
            charStyle += 'uppercase';
            charStyle += ';';
        }
        propertyValue = characterFormat.fontSize;
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'font-size';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += 'pt';
            charStyle += ';';
        }
        propertyValue = characterFormat.fontFamily;
        if (!isNullOrUndefined(propertyValue)) {
            charStyle += 'font-family';
            charStyle += ':';
            charStyle += propertyValue.toString();
            charStyle += ';';
        }
        return charStyle.toString();
    };
    /**
     * @private
     */
    HtmlExport.prototype.serializeParagraphFormat = function (paragraphFormat, isList) {
        if (!isNullOrUndefined(paragraphFormat.inlineFormat)) {
            return this.serializeParagraphFormat(paragraphFormat.inlineFormat, isList);
        }
        var propertyValue;
        var paraStyle = '';
        propertyValue = paragraphFormat.textAlignment;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'text-align:' + propertyValue.toLowerCase() + ';';
        }
        propertyValue = paragraphFormat.beforeSpacing;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-top:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.rightIndent;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-right:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.afterSpacing;
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-bottom:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.leftIndent;
        if (isList) {
            // if (isNullOrUndefined(propertyValue)) {
            //     propertyValue = -36;
            // } else {
            //     propertyValue -= 36;
            // }
            propertyValue = 0;
        }
        if (!isNullOrUndefined(propertyValue)) {
            paraStyle += 'margin-left:' + propertyValue.toString() + 'pt; ';
        }
        propertyValue = paragraphFormat.firstLineIndent;
        if (isList) {
            // if (isNullOrUndefined(propertyValue)) {
            //     propertyValue = 18;
            // } else {
            //     propertyValue += 18;
            // }
            propertyValue = 0;
        }
        if (!isNullOrUndefined(propertyValue) && propertyValue !== 0) {
            paraStyle += 'text-indent:' + propertyValue.toString() + 'pt;';
        }
        propertyValue = paragraphFormat.lineSpacing;
        if (!isNullOrUndefined(propertyValue)) {
            if (paragraphFormat.lineSpacingType === 'Multiple') {
                propertyValue = Math.round(propertyValue * 10) / 10;
            }
            else {
                propertyValue = propertyValue.toString() + 'pt;';
            }
            paraStyle += 'line-height:' + propertyValue;
        }
        return paraStyle.toString();
    };
    /**
     * @private
     */
    HtmlExport.prototype.createAttributesTag = function (tagValue, localProperties) {
        var sb = '';
        sb += '<';
        sb += tagValue;
        for (var i = 0; i < localProperties.length; i++) {
            sb += ' ';
            sb += localProperties[i];
        }
        if (tagValue !== 'a') {
            sb += '>';
        }
        return sb;
    };
    /**
     * @private
     */
    HtmlExport.prototype.createTag = function (tagValue) {
        var s = '';
        s += '<';
        s += tagValue;
        s += '>';
        return s;
    };
    /**
     * @private
     */
    HtmlExport.prototype.endTag = function (tagValue) {
        var sb = '';
        sb += '<';
        sb += '/';
        sb += tagValue;
        sb += '>';
        return sb;
    };
    /**
     * @private
     */
    HtmlExport.prototype.createTableStartTag = function (table) {
        var blockStyle = '';
        var tableStyle = '';
        var tagAttributes = [];
        tagAttributes.push('border="' + '1"');
        if (!isNullOrUndefined(table.tableFormat)) {
            //if (table.tableFormat.shading.backgroundColor !== Color.FromArgb(0, 0, 0, 0)) {
            if (!isNullOrUndefined(table.tableFormat.shading) && !isNullOrUndefined(table.tableFormat.shading.backgroundColor)) {
                tagAttributes.push('bgcolor="' + HelperMethods.getColor(table.tableFormat.shading.backgroundColor) + '"');
            }
            //}
            if (!isNullOrUndefined(table.tableFormat.leftIndent) && table.tableFormat.leftIndent !== 0) {
                tagAttributes.push('left-indent="' + (table.tableFormat.leftIndent.toString() + 'pt;') + '"');
            }
            if (!isNullOrUndefined(table.tableFormat.cellSpacing) && table.tableFormat.cellSpacing > 0) {
                tagAttributes.push('cellspacing="' + (((table.tableFormat.cellSpacing * 72) / 96) * 2).toString() + '"');
            }
            else {
                tableStyle += ('border-collapse:collapse;');
            }
            tagAttributes.push('cellpadding="' + '0"');
            if (!isNullOrUndefined(table.tableFormat.borders)) {
                tableStyle += this.serializeTableBorderStyle(table.tableFormat.borders);
            }
        }
        if (tableStyle.length !== 0) {
            tagAttributes.push('style="', tableStyle.toString() + '"');
        }
        return blockStyle += (this.createAttributesTag('table', tagAttributes));
    };
    /**
     * @private
     */
    HtmlExport.prototype.createTableEndTag = function () {
        var blockStyle = '';
        blockStyle += (this.endTag('table'));
        return blockStyle;
    };
    /**
     * @private
     */
    HtmlExport.prototype.createRowStartTag = function (row) {
        var blockStyle = '';
        var tagAttributes = [];
        if (row.rowFormat.isHeader) {
            blockStyle += (this.createTag('thead'));
        }
        if (!isNullOrUndefined(row.rowFormat.height) && row.rowFormat.height > 0) {
            var height = HelperMethods.convertPointToPixel(row.rowFormat.height);
            tagAttributes.push('height="' + height + '"');
        }
        return blockStyle + this.createAttributesTag('tr', tagAttributes);
    };
    /**
     * @private
     */
    HtmlExport.prototype.createRowEndTag = function (row) {
        var blockStyle = '';
        blockStyle += (this.endTag('tr'));
        if (row.rowFormat.isHeader) {
            blockStyle += (this.endTag('thead'));
        }
        return blockStyle;
    };
    /**
     * @private
     */
    HtmlExport.prototype.decodeHtmlNames = function (text) {
        if (text === '\t') {
            return '&emsp;';
        }
        text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var splittedText = text.split(' ');
        var htmlText = '';
        if (splittedText.length > 0) {
            htmlText = splittedText[0];
            for (var i = 0; i < splittedText.length - 1; i++) {
                htmlText += ' ' + splittedText[i + 1];
            }
        }
        return htmlText;
    };
    return HtmlExport;
}());
export { HtmlExport };
