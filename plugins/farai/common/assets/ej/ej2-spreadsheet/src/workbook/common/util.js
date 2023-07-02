/**
 * Check whether the text is formula or not.
 * @param text
 */
export function checkIsFormula(text) {
    return text && text[0] === '=' && text.length > 1;
}
/**
 * Check whether the value is cell reference or not.
 * @param {string} value - Specify the value to check.
 */
export function isCellReference(value) {
    var text = value;
    var startNum = 0;
    var endNum = 0;
    var j = 0;
    var numArr = [89, 71, 69];
    // XFD is the last column, for that we are using ascii values of Z, G, E (89, 71, 69) to restrict the flow.
    var cellText = '';
    var textLength = text.length;
    for (var i = 0; i < textLength; i++) {
        if (isChar(text[i])) {
            endNum++;
        }
    }
    cellText = text.substring(startNum, endNum);
    var cellTextLength = cellText.length;
    if (cellTextLength !== textLength) {
        if (cellTextLength < 4) {
            if (textLength !== 1 && (isNaN(parseInt(text, 10)))) {
                while (j < cellTextLength) {
                    if ((cellText[j]) && cellText[j].charCodeAt(0) < numArr[j]) {
                        j++;
                        continue;
                    }
                    else if (!(cellText[j]) && j > 0) {
                        break;
                    }
                    else {
                        return false;
                    }
                }
                var cellNumber = parseFloat(text.substring(endNum, textLength));
                if (cellNumber > 0 && cellNumber < 1048577) { // 1048576 - Maximum number of rows in excel.
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * Check whether the value is character or not.
 * @param {string} value - Specify the value to check.
 */
export function isChar(value) {
    if ((value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) || (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122)) {
        return true;
    }
    return false;
}
export function inRange(range, rowIdx, colIdx) {
    return range && (rowIdx >= range[0] && rowIdx <= range[2] && colIdx >= range[1] && colIdx <= range[3]);
}
/**
 * Check whether the cell is locked or not
 * @hidden
 */
export function isLocked(cell, column) {
    if (!cell) {
        cell = {};
    }
    if (cell.isLocked) {
        return true;
    }
    else if (cell.isLocked === false) {
        return false;
    }
    else if (column && column.isLocked) {
        return true;
    }
    else if (!cell.isLocked && (column && column.isLocked !== false)) {
        return true;
    }
    return false;
}
