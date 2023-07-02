import { IFontMapping } from '../../common/model/interface';
import { ChartTheme } from '../../chart/utils/enum';
import { BulletChart } from '../index';
import { IBulletStyle } from '../model/bullet-interface';
/**
 *
 */
export declare namespace BulletChartTheme {
    /** @private */
    let axisLabelFont: IFontMapping;
    /** @private */
    let tooltipLabelFont: IFontMapping;
    /** @private */
    let legendLabelFont: IFontMapping;
    /** @private */
    let dataLabelFont: IFontMapping;
    /** @private */
    let titleFont: IFontMapping;
    /** @private */
    let subTitleFont: IFontMapping;
}
/** @private */
export declare function getBulletThemeColor(theme: ChartTheme, bullet: BulletChart): IBulletStyle;
