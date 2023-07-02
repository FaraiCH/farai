import { ChildProperty } from '@syncfusion/ej2-base';
import { FontFamily, TextAlign, VerticalAlign, FontWeight, FontStyle, TextDecoration, HighlightCell, chartType, chartTheme } from './enum';
import { ValidationType, ValidationOperator, TopBottom, DataBar, ColorScale, IconSet, CFColor } from './enum';
import { CellStyleModel, FormatModel } from './class-model';
import { CellModel } from '../base';
/**
 * Represents the cell style.
 */
export declare class CellStyle extends ChildProperty<CellStyle> {
    /**
     * Specifies font family to the cell.
     * @default 'Calibri'
     */
    fontFamily: FontFamily;
    /**
     * Specifies vertical align to the cell.
     * @default 'bottom'
     */
    verticalAlign: VerticalAlign;
    /**
     * Specifies text align style to the cell.
     * @default 'left'
     */
    textAlign: TextAlign;
    /**
     * Specifies text indent style to the cell.
     * @default '0pt'
     */
    textIndent: string;
    /**
     * Specifies font color to the cell.
     * @default '#000000'
     */
    color: string;
    /**
     * Specifies background color to the cell.
     * @default '#ffffff'
     */
    backgroundColor: string;
    /**
     * Specifies font weight to the cell.
     * @default 'normal'
     */
    fontWeight: FontWeight;
    /**
     * Specifies font style to the cell.
     * @default 'normal'
     */
    fontStyle: FontStyle;
    /**
     * Specifies font size to the cell.
     * @default '11pt'
     */
    fontSize: string;
    /**
     * Specifies text decoration to the cell.
     * @default 'none'
     * @aspIgnore
     */
    textDecoration: TextDecoration;
    /**
     * Specifies border of the cell.
     * @default ''
     */
    border: string;
    /**
     * Specifies top border of the cell.
     * @default ''
     */
    borderTop: string;
    /**
     * Specifies bottom border of the cell.
     * @default ''
     */
    borderBottom: string;
    /**
     * Specifies left border of the cell.
     * @default ''
     */
    borderLeft: string;
    /**
     * Specifies right border of the cell.
     * @default ''
     */
    borderRight: string;
    /** @hidden */
    bottomPriority: boolean;
}
/**
 * Represents the DefineName.
 */
export declare class DefineName extends ChildProperty<DefineName> {
    /**
     * Specifies name for the defined name, which can be used in formula.
     * @default ''
     */
    name: string;
    /**
     * Specifies scope for the defined name.
     * @default ''
     */
    scope: string;
    /**
     * Specifies comment for the defined name.
     * @default ''
     */
    comment: string;
    /**
     * Specifies reference for the defined name.
     * @default ''
     */
    refersTo: string;
}
/**
 * Configures the Protect behavior for the spreadsheet.
 */
export declare class ProtectSettings extends ChildProperty<ProtectSettings> {
    /**
     * specifies to allow selection in spreadsheet.
     * @default false
     */
    selectCells: boolean;
    /**
     * specifies to allow formating in cells.
     * @default false
     */
    formatCells: boolean;
    /**
     * specifies to allow format rows in spreadsheet.
     * @default false
     */
    formatRows: boolean;
    /**
     * Specifies to allow format columns in spreadsheet.
     * @default false
     */
    formatColumns: boolean;
    /**
     * Specifies to allow insert Hyperlink in Spreadsheet.
     * @default false
     */
    insertLink: boolean;
}
/**
 * Represents the Hyperlink.
 */
export declare class Hyperlink extends ChildProperty<Hyperlink> {
    /**
     * Specifies Hyperlink Address.
     * @default ''
     */
    address: string;
}
/**
 * Represents the DataValidation.
 */
export declare class Validation extends ChildProperty<Validation> {
    /**
     * Specifies Validation Type.
     * @default 'WholeNumber'
     */
    type: ValidationType;
    /**
     * Specifies Validation Operator.
     * @default 'Between'
     */
    operator: ValidationOperator;
    /**
     * Specifies Validation Minimum Value.
     * @default ''
     */
    value1: string;
    /**
     * Specifies Validation Maximum Value.
     * @default ''
     */
    value2: string;
    /**
     * Specifies IgnoreBlank option in Data Validation.
     * @default true
     */
    ignoreBlank: boolean;
    /**
     * Specifies InCellDropDown option in Data Validation.
     * @default true
     */
    inCellDropDown: boolean;
    /**
     * specifies to allow Highlight Invalid Data.
     * @default false
     */
    isHighlighted: boolean;
}
/**
 * Represents the Format.
 */
export declare class Format extends ChildProperty<FormatModel> {
    /**
     * Specifies the number format code to display value in specified number format.
     * @default 'General'
     */
    format: string;
    /**
     * Specifies the cell style options.
     * @default {}
     */
    style: CellStyleModel;
    /**
     * Specifies the range is locked or not, for allow edit range in spreadsheet protect option.
     * @default true
     */
    isLocked: boolean;
}
/**
 * Represents the Conditional Formatting.
 */
export declare class ConditionalFormat extends ChildProperty<ConditionalFormat> {
    /**
     * Specifies Conditional formatting Type.
     * @default 'GreaterThan'
     * @aspIgnore
     */
    type: HighlightCell | TopBottom | DataBar | ColorScale | IconSet;
    /**
     * Specifies format.
     * @default {}
     */
    format: FormatModel;
    /**
     * Specifies Conditional formatting Highlight Color.
     * @default 'RedFT'
     */
    cFColor: CFColor;
    /**
     * Specifies Conditional formatting Value.
     * @default ''
     */
    value: string;
    /**
     * Specifies Conditional formatting range.
     * @default ''
     */
    range: string;
}
/**
 * Represents the Chart.
 */
export declare class Chart extends ChildProperty<CellModel> {
    /**
     * Specifies the type of a chart.
     * @default 'Line'
     */
    type: chartType;
    /**
     * Specifies the theme of a chart.
     * @default 'Material'
     */
    theme: chartTheme;
    /**
     * Specifies to switch the row or a column.
     * @default false
     */
    isSeriesInRows: boolean;
    /**
     * Specifies the selected range or specified range.
     * @default ''
     */
    range: string;
    /**
     * Specifies chart element id.
     * @default ''
     */
    id: string;
}
/**
 * Represents the Image.
 */
export declare class Image extends ChildProperty<CellModel> {
    /**
     * Specifies the image source.
     * @default ''
     */
    src: string;
    /**
     * Specifies image element id.
     * @default ''
     */
    id: string;
    /**
     * Specifies the height of the image.
     * @default 300
     * @asptype int
     */
    height: number;
    /**
     * Specifies the width of the image.
     * @default 400
     * @asptype int
     */
    width: number;
    /**
     * Specifies the height of the image.
     * @default 0
     * @asptype int
     */
    top: number;
    /**
     * Specifies the width of the image.
     * @default 0
     * @asptype int
     */
    left: number;
}
