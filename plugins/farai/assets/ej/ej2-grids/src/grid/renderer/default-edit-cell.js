import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { isEditable, getComplexFieldID } from '../base/util';
import { TextBox } from '@syncfusion/ej2-inputs';
/**
 * `DefaultEditCell` is used to handle default cell type editing.
 * @hidden
 */
var DefaultEditCell = /** @class */ (function () {
    function DefaultEditCell(parent) {
        this.parent = parent;
    }
    DefaultEditCell.prototype.create = function (args) {
        var col = args.column;
        var input = this.parent.createElement('input', {
            className: 'e-field e-input e-defaultcell', attrs: {
                type: 'text', value: !isNullOrUndefined(args.value) ? args.value : '', 'e-mappinguid': col.uid,
                id: this.parent.element.id + getComplexFieldID(col.field), name: getComplexFieldID(col.field),
                style: 'text-align:' + col.textAlign,
            }
        });
        return input;
    };
    DefaultEditCell.prototype.read = function (element) {
        return element.value;
    };
    DefaultEditCell.prototype.write = function (args) {
        var col = args.column;
        var isInline = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new TextBox(extend({
            element: args.element, floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
            enableRtl: this.parent.enableRtl, enabled: isEditable(args.column, args.requestType, args.element),
            placeholder: isInline ? '' : args.column.headerText,
        }, col.edit.params));
        this.obj.appendTo(args.element);
    };
    DefaultEditCell.prototype.destroy = function () {
        if (this.obj) {
            this.obj.destroy();
        }
    };
    return DefaultEditCell;
}());
export { DefaultEditCell };
