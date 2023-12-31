import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from './dictionary';
/**
 * @private
 */
var WUniqueFormat = /** @class */ (function () {
    function WUniqueFormat(type) {
        this.referenceCount = 0;
        this.uniqueFormatType = type;
        this.propertiesHash = new Dictionary();
    }
    /**
     * @private
     */
    WUniqueFormat.prototype.isEqual = function (source, property, modifiedValue) {
        var isEqual = false;
        switch (this.uniqueFormatType) {
            case 1:
                isEqual = this.isBorderEqual(source, property, modifiedValue);
                break;
            case 2:
                isEqual = this.isCharacterFormatEqual(source, property, modifiedValue);
                break;
            case 3:
                isEqual = this.isParagraphFormatEqual(source, property, modifiedValue);
                break;
            case 4:
                isEqual = this.isCellFormatEqual(source, property, modifiedValue);
                break;
            case 5:
                isEqual = this.isShadingEqual(source, property, modifiedValue);
                break;
            case 6:
                isEqual = this.isRowFormatEqual(source, property, modifiedValue);
                break;
            case 7:
                isEqual = this.isListFormatEqual(source, property, modifiedValue);
                break;
            case 8:
                isEqual = this.isTableFormatEqual(source, property, modifiedValue);
                break;
            case 9:
                isEqual = this.isListLevelEqual(source, property, modifiedValue);
                break;
            case 10:
                isEqual = this.isSectionFormatEqual(source, property, modifiedValue);
                break;
            default:
                break;
        }
        return isEqual;
    };
    // tslint:disable-next-line:max-line-length
    WUniqueFormat.prototype.isNotEqual = function (property, source, modifiedProperty, modifiedValue, uniqueFormatType) {
        var targetValue = undefined;
        var propertyType = WUniqueFormat.getPropertyType(uniqueFormatType, property);
        if (this.propertiesHash.containsKey(propertyType)) {
            targetValue = this.propertiesHash.get(propertyType);
        }
        var sourceValue = undefined;
        if (property === modifiedProperty) {
            sourceValue = modifiedValue;
        }
        else if (source.containsKey(propertyType)) {
            sourceValue = source.get(propertyType);
        }
        // tslint:disable-next-line:max-line-length
        if (!(targetValue === sourceValue || (!isNullOrUndefined(targetValue) && !isNullOrUndefined(sourceValue) && targetValue === sourceValue))) {
            return true;
        }
        return false;
    };
    /**
     * @private
     */
    WUniqueFormat.getPropertyType = function (uniqueFormatType, property) {
        var type = 0;
        switch (uniqueFormatType) {
            case 1:
                type = this.getBorderPropertyType(property);
                break;
            case 2:
                type = this.getCharacterFormatPropertyType(property);
                break;
            case 3:
                type = this.getParaFormatPropertyType(property);
                break;
            case 4:
                type = this.getCellFormatPropertyType(property);
                break;
            case 5:
                type = this.getShadingPropertyType(property);
                break;
            case 6:
                type = this.getRowFormatType(property);
                break;
            case 7:
                type = this.getListFormatType(property);
                break;
            case 8:
                type = this.getTableFormatType(property);
                break;
            case 9:
                type = this.getListLevelType(property);
                break;
            case 10:
                type = this.getSectionFormatType(property);
                break;
            default:
                break;
        }
        return type;
    };
    WUniqueFormat.getRowFormatType = function (property) {
        if (property === 'allowBreakAcrossPages') {
            return 1;
        }
        if (property === 'isHeader') {
            return 2;
        }
        if (property === 'height') {
            return 3;
        }
        if (property === 'heightType') {
            return 4;
        }
        if (property === 'gridBefore') {
            return 5;
        }
        if (property === 'gridBeforeWidth') {
            return 6;
        }
        if (property === 'gridBeforeWidthType') {
            return 7;
        }
        if (property === 'gridAfter') {
            return 8;
        }
        if (property === 'gridAfterWidth') {
            return 9;
        }
        if (property === 'gridAfterWidthType') {
            return 10;
        }
        if (property === 'leftMargin') {
            return 11;
        }
        if (property === 'topMargin') {
            return 12;
        }
        if (property === 'bottomMargin') {
            return 13;
        }
        if (property === 'rightMargin') {
            return 14;
        }
        if (property === 'leftIndent') {
            return 15;
        }
        return 0;
    };
    WUniqueFormat.getListFormatType = function (property) {
        if (property === 'listId') {
            return 1;
        }
        if (property === 'listLevelNumber') {
            return 2;
        }
        return 0;
    };
    WUniqueFormat.getTableFormatType = function (property) {
        if (property === 'leftMargin') {
            return 1;
        }
        if (property === 'rightMargin') {
            return 2;
        }
        if (property === 'topMargin') {
            return 3;
        }
        if (property === 'bottomMargin') {
            return 4;
        }
        if (property === 'cellSpacing') {
            return 5;
        }
        if (property === 'leftIndent') {
            return 6;
        }
        if (property === 'tableAlignment') {
            return 7;
        }
        if (property === 'preferredWidth') {
            return 8;
        }
        if (property === 'preferredWidthType') {
            return 9;
        }
        if (property === 'bidi') {
            return 10;
        }
        if (property === 'allowAutoFit') {
            return 11;
        }
        if (property === 'horizontalPositionAbs') {
            return 12;
        }
        if (property === 'horizontalPosition') {
            return 13;
        }
        return 0;
    };
    WUniqueFormat.getListLevelType = function (property) {
        if (property === 'listLevelPattern') {
            return 1;
        }
        if (property === 'startAt') {
            return 2;
        }
        if (property === 'followCharacter') {
            return 3;
        }
        if (property === 'numberFormat') {
            return 4;
        }
        if (property === 'restartLevel') {
            return 5;
        }
        return 0;
    };
    WUniqueFormat.getShadingPropertyType = function (property) {
        if (property === 'backgroundColor') {
            return 1;
        }
        if (property === 'foregroundColor') {
            return 2;
        }
        if (property === 'textureStyle') {
            return 3;
        }
        return 0;
    };
    WUniqueFormat.getCellFormatPropertyType = function (property) {
        if (property === 'leftMargin') {
            return 1;
        }
        if (property === 'rightMargin') {
            return 2;
        }
        if (property === 'topMargin') {
            return 3;
        }
        if (property === 'bottomMargin') {
            return 4;
        }
        if (property === 'columnSpan') {
            return 5;
        }
        if (property === 'rowSpan') {
            return 6;
        }
        if (property === 'verticalAlignment') {
            return 7;
        }
        if (property === 'preferredWidthType') {
            return 8;
        }
        if (property === 'preferredWidth') {
            return 9;
        }
        if (property === 'cellWidth') {
            return 10;
        }
        return 0;
    };
    WUniqueFormat.getBorderPropertyType = function (property) {
        if (property === 'color') {
            return 1;
        }
        if (property === 'lineStyle') {
            return 2;
        }
        if (property === 'lineWidth') {
            return 3;
        }
        if (property === 'shadow') {
            return 4;
        }
        if (property === 'space') {
            return 5;
        }
        if (property === 'hasNoneStyle') {
            return 6;
        }
        return 0;
    };
    WUniqueFormat.getCharacterFormatPropertyType = function (property) {
        if (property === 'fontColor') {
            return 1;
        }
        if (property === 'fontFamily') {
            return 2;
        }
        if (property === 'fontSize') {
            return 3;
        }
        if (property === 'bold') {
            return 4;
        }
        if (property === 'italic') {
            return 5;
        }
        if (property === 'underline') {
            return 6;
        }
        if (property === 'strikethrough') {
            return 7;
        }
        if (property === 'baselineAlignment') {
            return 8;
        }
        if (property === 'highlightColor') {
            return 9;
        }
        if (property === 'bidi') {
            return 10;
        }
        if (property === 'bdo') {
            return 11;
        }
        if (property === 'boldBidi') {
            return 12;
        }
        if (property === 'italicBidi') {
            return 13;
        }
        if (property === 'fontFamilyBidi') {
            return 14;
        }
        if (property === 'fontSizeBidi') {
            return 15;
        }
        if (property === 'allCaps') {
            return 16;
        }
        return 0;
    };
    WUniqueFormat.getParaFormatPropertyType = function (property) {
        if (property === 'leftIndent') {
            return 1;
        }
        if (property === 'rightIndent') {
            return 2;
        }
        if (property === 'firstLineIndent') {
            return 3;
        }
        if (property === 'textAlignment') {
            return 4;
        }
        if (property === 'beforeSpacing') {
            return 5;
        }
        if (property === 'afterSpacing') {
            return 6;
        }
        if (property === 'lineSpacing') {
            return 7;
        }
        if (property === 'lineSpacingType') {
            return 8;
        }
        if (property === 'outlineLevel') {
            return 9;
        }
        if (property === 'bidi') {
            return 10;
        }
        if (property === 'contextualSpacing') {
            return 11;
        }
        return 0;
    };
    WUniqueFormat.getSectionFormatType = function (property) {
        if (property === 'headerDistance') {
            return 1;
        }
        if (property === 'footerDistance') {
            return 2;
        }
        if (property === 'differentFirstPage') {
            return 3;
        }
        if (property === 'differentOddAndEvenPages') {
            return 4;
        }
        if (property === 'pageWidth') {
            return 5;
        }
        if (property === 'pageHeight') {
            return 6;
        }
        if (property === 'leftMargin') {
            return 7;
        }
        if (property === 'topMargin') {
            return 8;
        }
        if (property === 'rightMargin') {
            return 9;
        }
        if (property === 'bottomMargin') {
            return 10;
        }
        if (property === 'bidi') {
            return 11;
        }
        if (property === 'restartPageNumbering') {
            return 12;
        }
        if (property === 'pageStartingNumber') {
            return 13;
        }
        if (property === 'endnoteNumberFormat') {
            return 14;
        }
        if (property === 'endnotePosition') {
            return 15;
        }
        if (property === 'footNoteNumberFormat') {
            return 16;
        }
        if (property === 'footnotePosition') {
            return 17;
        }
        if (property === 'restartIndexForEndnotes') {
            return 18;
        }
        if (property === 'restartIndexForFootnotes') {
            return 19;
        }
        if (property === 'initialFootNoteNumber') {
            return 20;
        }
        if (property === 'initialEndNoteNumber') {
            return 21;
        }
        return 0;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isBorderEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('color', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('lineStyle', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('lineWidth', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('shadow', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('space', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        if (this.isNotEqual('hasNoneStyle', source, modifiedProperty, modifiedValue, 1)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isCharacterFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('fontColor', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontFamily', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontSize', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('bold', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('italic', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('underline', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('strikethrough', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('baselineAlignment', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('highlightColor', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('bdo', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontColor', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontFamilyBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('fontSizeBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('boldBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('italicBidi', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        if (this.isNotEqual('allCaps', source, modifiedProperty, modifiedValue, 2)) {
            return false;
        }
        return true;
    };
    WUniqueFormat.prototype.isParagraphFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('leftIndent', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('rightIndent', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('firstLineIndent', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('textAlignment', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('beforeSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('afterSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('lineSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('lineSpacingType', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('outlineLevel', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        if (this.isNotEqual('contextualSpacing', source, modifiedProperty, modifiedValue, 3)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isCellFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('columnSpan', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('rowSpan', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('verticalAlignment', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('preferredWidthType', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('preferredWidth', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        if (this.isNotEqual('cellWidth', source, modifiedProperty, modifiedValue, 4)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isShadingEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('backgroundColor', source, modifiedProperty, modifiedValue, 5)) {
            return false;
        }
        if (this.isNotEqual('foregroundColor', source, modifiedProperty, modifiedValue, 5)) {
            return false;
        }
        if (this.isNotEqual('textureStyle', source, modifiedProperty, modifiedValue, 5)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isRowFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('allowBreakAcrossPages', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('isHeader', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('height', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('heightType', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridBefore', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridBeforeWidth', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridBeforeWidthType', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridAfter', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridAfterWidth', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('gridAfterWidthType', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        if (this.isNotEqual('leftIndent', source, modifiedProperty, modifiedValue, 6)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isListFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('listId', source, modifiedProperty, modifiedValue, 7)) {
            return false;
        }
        if (this.isNotEqual('listLevelNumber', source, modifiedProperty, modifiedValue, 7)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isTableFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('cellSpacing', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('leftIndent', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('tableAlignment', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('preferredWidth', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('preferredWidthType', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('allowAutoFit', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('horizontalPositionAbs', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        if (this.isNotEqual('horizontalPosition', source, modifiedProperty, modifiedValue, 8)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isListLevelEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('listLevelPattern', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('startAt', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('followCharacter', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('numberFormat', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        if (this.isNotEqual('restartLevel', source, modifiedProperty, modifiedValue, 9)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.isSectionFormatEqual = function (source, modifiedProperty, modifiedValue) {
        if (this.isNotEqual('headerDistance', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('footerDistance', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('differentFirstPage', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('differentOddAndEvenPages', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('pageWidth', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('pageHeight', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('leftMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('topMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('rightMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('bottomMargin', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('bidi', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('restartPageNumbering', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('pageStartingNumber', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('endnoteNumberFormat', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('endnotePosition', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('footNoteNumberFormat', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('footnotePosition', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('restartIndexForEndnotes', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('restartIndexForFootnotes', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('initialFootNoteNumber', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        if (this.isNotEqual('initialEndNoteNumber', source, modifiedProperty, modifiedValue, 10)) {
            return false;
        }
        return true;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.cloneItems = function (format, property, value, uniqueFormatType) {
        var propertyType = WUniqueFormat.getPropertyType(uniqueFormatType, property);
        var keys = format.propertiesHash.keys;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === propertyType) {
                this.propertiesHash.add(propertyType, value);
            }
            else {
                this.propertiesHash.add(keys[i], format.propertiesHash.get(keys[i]));
            }
        }
        if (!format.propertiesHash.containsKey(propertyType)) {
            this.propertiesHash.add(propertyType, value);
        }
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.mergeProperties = function (format) {
        var hash = format.cloneProperties();
        var keys = this.propertiesHash.keys;
        for (var i = 0; i < keys.length; i++) {
            if (!hash.containsKey(keys[i])) {
                hash.add(keys[i], this.propertiesHash.get(keys[i]));
            }
        }
        return hash;
    };
    /**
     * @private
     */
    WUniqueFormat.prototype.cloneProperties = function () {
        var hash = new Dictionary();
        var keys = this.propertiesHash.keys;
        for (var i = 0; i < keys.length; i++) {
            hash.add(keys[i], this.propertiesHash.get(keys[i]));
        }
        return hash;
    };
    // public cloneItemsInternal(format: WUniqueFormat): void {
    //     let keys: number[] = format.propertiesHash.getItem();
    //     for (let i: number = 0; i < keys.length; i++) {
    //         this.propertiesHash.add(keys[i], format.propertiesHash.get(keys[i]));
    //     }
    //     this.referenceCount = format.referenceCount;
    // }
    /**
     * @private
     */
    WUniqueFormat.prototype.destroy = function () {
        if (!isNullOrUndefined(this.propertiesHash)) {
            this.propertiesHash.destroy();
        }
        this.propertiesHash = undefined;
        this.referenceCount = undefined;
        this.uniqueFormatType = undefined;
    };
    return WUniqueFormat;
}());
export { WUniqueFormat };
