import { WCharacterFormat } from '../index';
import { TextElementBox, ListTextElementBox, ParagraphWidget } from './page';
import { DocumentHelper } from './viewer';
import { RtlInfo } from '../editor/editor-helper';
import { BiDirectionalOverride } from '../../index';
/**
 * @private
 */
export interface TextSizeInfo {
    Height?: number;
    BaselineOffset?: number;
    Width?: number;
}
/**
 * @private
 */
export interface TextHeightInfo {
    [key: string]: TextSizeInfo;
}
/**
 * @private
 */
export declare class TextHelper {
    private documentHelper;
    private context;
    private paragraphMarkInfo;
    private readonly paragraphMark;
    private readonly lineBreakMark;
    /**
     * @private
     */
    getEnSpaceCharacter(): string;
    /**
     * @private
     */
    repeatChar(char: string, count: number): string;
    /**
     * documentHelper definition
     */
    constructor(documentHelper: DocumentHelper);
    /**
     * @private
     */
    getParagraphMarkWidth(characterFormat: WCharacterFormat): number;
    /**
     * @private
     */
    getParagraphMarkSize(characterFormat: WCharacterFormat): TextSizeInfo;
    /**
     * @private
     */
    getTextSize(elementBox: TextElementBox, characterFormat: WCharacterFormat): number;
    /**
     * @private
     */
    getHeight(characterFormat: WCharacterFormat): TextSizeInfo;
    /**
     * @private
     */
    getFormatText(characterFormat: WCharacterFormat): string;
    /**
     * @private
     */
    getHeightInternal(characterFormat: WCharacterFormat): TextSizeInfo;
    /**
     * @private
     */
    measureTextExcludingSpaceAtEnd(text: string, characterFormat: WCharacterFormat): number;
    /**
     * @private
     */
    getWidth(text: string, characterFormat: WCharacterFormat): number;
    setText(textToRender: string, isBidi: boolean, bdo: BiDirectionalOverride, isRender?: boolean): string;
    /**
     * @private
     */
    applyStyle(spanElement: HTMLSpanElement, characterFormat: WCharacterFormat): void;
    /**
     * @private
     */
    measureText(text: string, characterFormat: WCharacterFormat): TextSizeInfo;
    /**
     * @private
     */
    updateTextSize(elementBox: ListTextElementBox, paragraph: ParagraphWidget): void;
    /**
     * @private
     * @param text
     */
    containsSpecialCharAlone(text: string): boolean;
    /**
     * @private
     * @param ch
     */
    inverseCharacter(ch: string): string;
    /**
     * @private
     * @param text
     */
    containsSpecialChar(text: string): boolean;
    /**
     * @private
     */
    isRTLText(text: string): boolean;
    /**
     * @private
     */
    getRtlLanguage(text: string): RtlInfo;
    destroy(): void;
}
