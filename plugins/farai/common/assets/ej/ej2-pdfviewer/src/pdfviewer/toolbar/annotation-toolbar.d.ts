import { Toolbar as Tool } from '@syncfusion/ej2-navigations';
import { PdfViewer, PdfViewerBase, Toolbar } from '../index';
import { ColorPicker } from '@syncfusion/ej2-inputs';
/**
 * @hidden
 */
export declare class AnnotationToolbar {
    private pdfViewer;
    private pdfViewerBase;
    /**
     * @private
     */
    primaryToolbar: Toolbar;
    /**
     * @private
     */
    toolbarElement: HTMLElement;
    private highlightItem;
    private underlineItem;
    private strikethroughItem;
    private deleteItem;
    /**
     * @private
     */
    freeTextEditItem: HTMLElement;
    /**
     * @private
     */
    colorDropDownElement: HTMLElement;
    /**
     * @private
     */
    colorDropDownElementInBlazor: HTMLElement;
    /**
     * @private
     */
    strokeDropDownElementInBlazor: HTMLElement;
    /**
     * @private
     */
    fontColorElementInBlazor: HTMLElement;
    private strokeDropDownElement;
    private thicknessElement;
    private shapeElement;
    private calibrateElement;
    private stampElement;
    private opacityDropDownElement;
    private colorDropDown;
    private opacityDropDown;
    private strokeDropDown;
    private thicknessDropDown;
    private shapeDropDown;
    private calibrateDropDown;
    private commentItem;
    private closeItem;
    private opacityIndicator;
    private thicknessIndicator;
    private HighlightElement;
    private UnderlineElement;
    private StrikethroughElement;
    /**
     * @private
     */
    toolbar: Tool;
    /**
     * @private
     */
    colorPalette: ColorPicker;
    private strokeColorPicker;
    private opacitySlider;
    private thicknessSlider;
    private toolbarBorderHeight;
    /**
     * @private
     */
    isToolbarHidden: boolean;
    /**
     * @private
     */
    isMobileAnnotEnabled: boolean;
    private isHighlightEnabled;
    private isUnderlineEnabled;
    private isStrikethroughEnabled;
    private isHighlightBtnVisible;
    private isUnderlineBtnVisible;
    private isStrikethroughBtnVisible;
    private isColorToolVisible;
    private isOpacityToolVisible;
    private isDeleteAnnotationToolVisible;
    private isCurrentAnnotationOpacitySet;
    private isStampBtnVisible;
    private isShapeBtnVisible;
    private isSignatureBtnVisible;
    private isInkBtnVisible;
    private isFontFamilyToolVisible;
    private isFontSizeToolVisible;
    private isFontAlignToolVisible;
    private isFontColorToolVisible;
    private isFontStylesToolVisible;
    private isCommentPanelBtnVisible;
    private isFreeTextBtnVisible;
    private isCalibrateBtnVisible;
    private isStrokeColorToolVisible;
    private isThicknessToolVisible;
    private menuItems;
    private fontSize;
    private fontFamily;
    private stampMenu;
    private stampParentID;
    private fontColorPalette;
    private fontFamilyElement;
    private fontSizeElement;
    private fontColorElement;
    private textAlignElement;
    private textPropElement;
    private alignmentToolbar;
    private propertiesToolbar;
    private fontColorDropDown;
    private textAlignDropDown;
    private textPropertiesDropDown;
    /**
     * @private
     */
    handWrittenSignatureItem: HTMLElement;
    /**
     * @private
     */
    inkAnnotationItem: HTMLElement;
    /**
     * @private
     */
    inkAnnotationSelected: boolean;
    /**
     * @private
     */
    openSignaturePopup: boolean;
    constructor(viewer: PdfViewer, viewerBase: PdfViewerBase, toolbar: Toolbar);
    /**
     * @private
     */
    initializeAnnotationToolbar(): void;
    createMobileAnnotationToolbar(isEnable: boolean, isPath?: boolean): void;
    hideMobileAnnotationToolbar(): void;
    private createMobileToolbarItems;
    private goBackToToolbar;
    private createToolbarItems;
    private createSignContainer;
    private updateSignatureCount;
    private openSignature;
    private hoverSignatureDelete;
    private leaveSignatureDelete;
    private addSignature;
    renderAddedSignature(): void;
    deleteSavedSign(event: any): void;
    private getTemplate;
    private createStampContainer;
    addStampImage: (args: any) => void;
    checkStampAnnotations(): void;
    private createDropDowns;
    private opacityDropDownOpen;
    private onColorPickerCancelClick;
    private onStrokePickerCancelClick;
    private colorDropDownBeforeOpen;
    /**
     * @private
     */
    setCurrentColorInPicker(): void;
    private colorDropDownOpen;
    private strokeDropDownBeforeOpen;
    private setCurrentStrokeColorInPicker;
    private strokeDropDownOpen;
    private onFontColorChange;
    private onFontFamilyChange;
    private onFontSizeChange;
    private textAlignDropDownBeforeOpen;
    private textPropertiesDropDownBeforeOpen;
    private onClickTextAlignment;
    private onClickTextProperties;
    private opacityChange;
    private opacityDropDownBeforeOpen;
    private thicknessDropDownBeforeOpen;
    private thicknessDropDownOpen;
    private calculateToolbarPosition;
    private thicknessChangeInBlazor;
    private thicknessChange;
    private ShapeThickness;
    private createDropDownButton;
    private createShapeOptions;
    private createPropDropDownButton;
    private textAlignmentToolbarItems;
    private afterAlignmentToolbarCreation;
    private afterPropertiesToolbarCreation;
    private createDropDownListForSize;
    private createDropDownListForFamily;
    private textPropertiesToolbarItems;
    private createShapeToolbarItems;
    private createCalibrateToolbarItems;
    private onShapeToolbarClicked;
    private onCalibrateToolbarClicked;
    private onShapeDrawSelection;
    private afterShapeToolbarCreation;
    private afterCalibrateToolbarCreation;
    private createColorPicker;
    private onColorPickerChange;
    private onStrokePickerChange;
    /**
     * @private
     */
    updateColorInIcon(element: HTMLElement, color: string): void;
    /**
     * @private
     */
    updateTextPropertySelection(currentOption: string): void;
    /**
     * @private
     */
    updateFontFamilyInIcon(family: string): void;
    /**
     * @private
     */
    updateTextAlignInIcon(align: string): void;
    /**
     * @private
     */
    updateFontSizeInIcon(size: number): void;
    private updateOpacityIndicator;
    private updateThicknessIndicator;
    private createSlider;
    private createThicknessSlider;
    private afterToolbarCreation;
    private onToolbarClicked;
    private addInkAnnotation;
    /**
     * @private
     */
    deselectInkAnnotation(): void;
    private drawInkAnnotation;
    resetFreeTextAnnot(): void;
    private updateInkannotationItems;
    private showSignaturepanel;
    private handleFreeTextEditor;
    private updateFontFamily;
    private updateFontFamilyIcon;
    /**
     * @private
     */
    showAnnotationToolbar(element?: HTMLElement): void;
    private enablePropertiesTool;
    private applyAnnotationToolbarSettings;
    private showInkAnnotationTool;
    private showSeparator;
    private showHighlightTool;
    private showUnderlineTool;
    private showStrikethroughTool;
    private showShapeAnnotationTool;
    private showCalibrateAnnotationTool;
    private showFreeTextAnnotationTool;
    private showStampAnnotationTool;
    private showSignatureTool;
    private showInkTool;
    private showFontFamilyAnnotationTool;
    private showFontSizeAnnotationTool;
    private showFontAlignAnnotationTool;
    private showFontColorAnnotationTool;
    private showFontStylesAnnotationTool;
    private showColorEditTool;
    private showStrokeColorEditTool;
    private showThicknessEditTool;
    private showOpacityEditTool;
    private showAnnotationDeleteTool;
    private showCommentPanelTool;
    private applyHideToToolbar;
    /**
     * @private
     */
    adjustViewer(isAdjust: boolean): void;
    private updateContentContainerHeight;
    private getToolbarHeight;
    private getNavigationToolbarHeight;
    private handleHighlight;
    private handleUnderline;
    private handleStrikethrough;
    /**
     * @private
     */
    deselectAllItems(): void;
    private updateInteractionTools;
    /**
     * @private
     */
    selectAnnotationDeleteItem(isEnable: boolean): void;
    /**
     * @private
     */
    enableTextMarkupAnnotationPropertiesTools(isEnable: boolean): void;
    private checkAnnotationPropertiesChange;
    /**
     * @private
     */
    enableAnnotationPropertiesTools(isEnable: boolean): void;
    /**
     * @private
     */
    enableSignaturePropertiesTools(isEnable: boolean): void;
    /**
     * @private
     */
    enableStampAnnotationPropertiesTools(isEnable: boolean): void;
    /**
     * @private
     */
    enableFreeTextAnnotationPropertiesTools(isEnable: boolean): void;
    /**
     * @private
     */
    enableAnnotationAddTools(isEnable: boolean): void;
    /**
     * @private
     */
    isAnnotationButtonsEnabled(): boolean;
    /**
     * @private
     */
    enableCommentPanelTool(isEnable: boolean): void;
    private updateToolbarItems;
    private enableTextMarkupAddTools;
    /**
     * @private
     */
    updateAnnnotationPropertyItems(): void;
    private getColorHexValue;
    private setColorInPicker;
    /**
     * @private
     */
    resetToolbar(): void;
    /**
     * @private
     */
    clearTextMarkupMode(): void;
    /**
     * @private
     */
    clearShapeMode(): void;
    /**
     * @private
     */
    clearMeasureMode(): void;
    /**
     * @private
     */
    clear(): void;
    /**
     * @private
     */
    destroy(): void;
    private getElementHeight;
    private updateViewerHeight;
    private resetViewerHeight;
    private afterAnnotationToolbarCreationInBlazor;
    private addClassToToolbarInBlazor;
    private handleHighlightInBlazor;
    private handleUnderlineInBlazor;
    private handleStrikethroughInBlazor;
}
