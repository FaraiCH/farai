import { Component, INotifyPropertyChanged, ChildProperty, L10n } from '@syncfusion/ej2-base';
import { ModuleDeclaration, EmitType } from '@syncfusion/ej2-base';
import { PdfViewerModel, HighlightSettingsModel, UnderlineSettingsModel, StrikethroughSettingsModel, LineSettingsModel, ArrowSettingsModel, RectangleSettingsModel, CircleSettingsModel, PolygonSettingsModel, StampSettingsModel, StickyNotesSettingsModel, CustomStampSettingsModel, VolumeSettingsModel, RadiusSettingsModel, AreaSettingsModel, PerimeterSettingsModel, DistanceSettingsModel, MeasurementSettingsModel, FreeTextSettingsModel, AnnotationSelectorSettingsModel, TextSearchColorSettingsModel, DocumentTextCollectionSettingsModel, TextDataSettingsModel, RectangleBoundsModel, SignatureFieldSettingsModel, SignatureIndicatorSettingsModel } from './pdfviewer-model';
import { ToolbarSettingsModel, ShapeLabelSettingsModel } from './pdfviewer-model';
import { ServerActionSettingsModel, AjaxRequestSettingsModel, CustomStampModel, HandWrittenSignatureSettingsModel, AnnotationSettingsModel, TileRenderingSettingsModel, ScrollSettingsModel, FormFieldModel, InkAnnotationSettingsModel } from './pdfviewer-model';
import { PdfViewerBase } from './index';
import { Navigation } from './index';
import { Magnification } from './index';
import { Toolbar } from './index';
import { ToolbarItem } from './index';
import { LinkTarget, InteractionMode, SignatureFitMode, AnnotationType, AnnotationToolbarItem, LineHeadStyle, ContextMenuAction, FontStyle, TextAlignment, AnnotationResizerShape, AnnotationResizerLocation, ZoomMode, PrintMode, CursorType, ContextMenuItem, DynamicStampItem, SignStampItem, StandardBusinessStampItem, FormFieldType, AllowedInteraction, AnnotationDataFormat, SignatureType, CommentStatus } from './base/types';
import { Annotation } from './index';
import { LinkAnnotation } from './index';
import { ThumbnailView } from './index';
import { BookmarkView } from './index';
import { TextSelection } from './index';
import { TextSearch } from './index';
import { FormFields } from './index';
import { Print, CalibrationUnit } from './index';
import { UnloadEventArgs, LoadEventArgs, LoadFailedEventArgs, AjaxRequestFailureEventArgs, PageChangeEventArgs, PageClickEventArgs, ZoomChangeEventArgs, HyperlinkClickEventArgs, HyperlinkMouseOverArgs, ImportStartEventArgs, ImportSuccessEventArgs, ImportFailureEventArgs, ExportStartEventArgs, ExportSuccessEventArgs, ExportFailureEventArgs, AjaxRequestInitiateEventArgs } from './index';
import { AnnotationAddEventArgs, AnnotationRemoveEventArgs, AnnotationPropertiesChangeEventArgs, AnnotationResizeEventArgs, AnnotationSelectEventArgs, AnnotationMoveEventArgs, AnnotationDoubleClickEventArgs, AnnotationMouseoverEventArgs, PageMouseoverEventArgs, AnnotationMouseLeaveEventArgs, ButtonFieldClickEventArgs } from './index';
import { TextSelectionStartEventArgs, TextSelectionEndEventArgs, DownloadStartEventArgs, DownloadEndEventArgs, ExtractTextCompletedEventArgs, PrintStartEventArgs, PrintEndEventArgs } from './index';
import { TextSearchStartEventArgs, TextSearchCompleteEventArgs, TextSearchHighlightEventArgs } from './index';
import { PdfAnnotationBase, ZOrderPageTable } from './drawing/pdf-annotation';
import { PdfAnnotationBaseModel } from './drawing/pdf-annotation-model';
import { Drawing, ClipBoardObject } from './drawing/drawing';
import { SelectorModel } from './drawing/selector-model';
import { PointModel, IElement, Rect } from '@syncfusion/ej2-drawings';
import { ThumbnailClickEventArgs } from './index';
import { ValidateFormFieldsArgs, BookmarkClickEventArgs, AnnotationUnSelectEventArgs, BeforeAddFreeTextEventArgs, FormFieldFocusOutEventArgs, CommentEventArgs } from './base';
import { AddSignatureEventArgs, RemoveSignatureEventArgs, MoveSignatureEventArgs, SignaturePropertiesChangeEventArgs, ResizeSignatureEventArgs, SignatureSelectEventArgs } from './base';
import { ContextMenuSettingsModel } from './pdfviewer-model';
/**
 * The `ToolbarSettings` module is used to provide the toolbar settings of PDF viewer.
 */
export declare class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /**
     * Enable or disables the toolbar of PdfViewer.
     */
    showTooltip: boolean;
    /**
     * shows only the defined options in the PdfViewer.
     */
    toolbarItems: ToolbarItem[];
    /**
     * Provide option to customize the annotation toolbar of the PDF Viewer.
     */
    annotationToolbarItems: AnnotationToolbarItem[];
}
/**
 * The `AjaxRequestSettings` module is used to set the ajax Request Headers of PDF viewer.
 */
export declare class AjaxRequestSettings extends ChildProperty<AjaxRequestSettings> {
    /**
     * set the ajax Header values in the PdfViewer.
     */
    ajaxHeaders: IAjaxHeaders[];
    /**
     * set the ajax credentials for the pdfviewer.
     */
    withCredentials: boolean;
}
export interface IAjaxHeaders {
    /**
     * specifies the ajax Header Name of the PdfViewer.
     */
    headerName: string;
    /**
     * specifies the ajax Header Value of the PdfViewer.
     */
    headerValue: string;
}
export declare class CustomStamp extends ChildProperty<CustomStamp> {
    /**
     * Defines the custom stamp name to be added in stamp menu of the PDF Viewer toolbar.
     */
    customStampName: string;
    /**
     * Defines the custom stamp images source to be added in stamp menu of the PDF Viewer toolbar.
     */
    customStampImageSource: string;
}
/**
 * The `AnnotationToolbarSettings` module is used to provide the annotation toolbar settings of the PDF viewer.
 */
export declare class AnnotationToolbarSettings extends ChildProperty<AnnotationToolbarSettings> {
    /**
     * Enable or disables the tooltip of the toolbar.
     */
    showTooltip: boolean;
    /**
     * shows only the defined options in the PdfViewer.
     */
    annotationToolbarItem: AnnotationToolbarItem[];
}
/**
 * The `SignatureFieldSettings` module is used to set the properties of signature field in PDF Viewer
 */
export declare class SignatureFieldSettings extends ChildProperty<SignatureFieldSettings> {
    /**
     * Specifies the properties of the signature indicator in the signature field.
     */
    signatureIndicatorSettings: SignatureIndicatorSettingsModel;
}
/**
 * The `SignatureIndicatorSettings` module is used to provide the properties of signature Indicator in the signature field
 */
export declare class SignatureIndicatorSettings extends ChildProperty<SignatureIndicatorSettings> {
    /**
     * Specifies the opacity of the signature indicator.
     */
    opacity: number;
    /**
     * Specifies the color of the signature indicator.
     */
    backgroundColor: string;
    /**
     * Specifies the width of the signature indicator. Maximum width is half the width of the signature field.
     * Minimum width is the default value.
     */
    width: number;
    /**
     * Specifies the height of the signature indicator. Maximum height is half the height of the signature field.
     * Minimum height is the default value.
     */
    height: number;
    /**
     * Specifies the signature Indicator's font size. The maximum size of the font is half the height of the signature field.
     */
    fontSize: number;
    /**
     * Specifies the text of the signature Indicator.
     */
    text: string;
    /**
     * Specifies the color of the text of signature indicator.
     */
    color: string;
}
/**
 * The `ServerActionSettings` module is used to provide the server action methods of PDF viewer.
 */
export declare class ServerActionSettings extends ChildProperty<ServerActionSettings> {
    /**
     * specifies the load action of PdfViewer.
     */
    load: string;
    /**
     * specifies the unload action of PdfViewer.
     */
    unload: string;
    /**
     * specifies the render action of PdfViewer.
     */
    renderPages: string;
    /**
     * specifies the print action of PdfViewer.
     */
    print: string;
    /**
     * specifies the download action of PdfViewer.
     */
    download: string;
    /**
     * specifies the download action of PdfViewer.
     */
    renderThumbnail: string;
    /**
     * specifies the annotation comments action of PdfViewer.
     */
    renderComments: string;
    /**
     * specifies the imports annotations action of PdfViewer.
     */
    importAnnotations: string;
    /**
     * specifies the export annotations action of PdfViewer.
     */
    exportAnnotations: string;
    /**
     * specifies the imports action of PdfViewer.
     */
    importFormFields: string;
    /**
     * specifies the export action of PdfViewer.
     */
    exportFormFields: string;
    /**
     * specifies the export action of PdfViewer.
     */
    renderTexts: string;
}
/**
 * The `StrikethroughSettings` module is used to provide the properties to Strikethrough annotation.
 */
export declare class StrikethroughSettings extends ChildProperty<StrikethroughSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the color of the annotation.
     */
    color: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * @default false
     */
    enableMultiPageAnnotation: boolean;
    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    enableTextMarkupResizer: boolean;
    /**
     * Gets or sets the allowed interactions for the locked strikethrough annotations.
     * IsLock can be configured using strikethrough settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `UnderlineSettings` module is used to provide the properties to Underline annotation.
 */
export declare class UnderlineSettings extends ChildProperty<UnderlineSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the color of the annotation.
     */
    color: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * @default false
     */
    enableMultiPageAnnotation: boolean;
    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    enableTextMarkupResizer: boolean;
    /**
     * Gets or sets the allowed interactions for the locked underline annotations.
     * IsLock can be configured using underline settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `HighlightSettings` module is used to provide the properties to Highlight annotation.
 */
export declare class HighlightSettings extends ChildProperty<HighlightSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the color of the annotation.
     */
    color: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * @default false
     */
    enableMultiPageAnnotation: boolean;
    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    enableTextMarkupResizer: boolean;
    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using highlight settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `LineSettings` module is used to provide the properties to line annotation.
 */
export declare class LineSettings extends ChildProperty<LineSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle: LineHeadStyle;
    /**
     * specifies the line head end style of the annotation.
     */
    lineHeadEndStyle: LineHeadStyle;
    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked highlight annotations.
     * IsLock can be configured using line settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `ArrowSettings` module is used to provide the properties to arrow annotation.
 */
export declare class ArrowSettings extends ChildProperty<ArrowSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle: LineHeadStyle;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadEndStyle: LineHeadStyle;
    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked arrow annotations.
     * IsLock can be configured using arrow settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `RectangleSettings` module is used to provide the properties to rectangle annotation.
 */
export declare class RectangleSettings extends ChildProperty<RectangleSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked rectangle annotations.
     * IsLock can be configured using rectangle settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `CircleSettings` module is used to provide the properties to circle annotation.
 */
export declare class CircleSettings extends ChildProperty<CircleSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked circle annotations.
     * IsLock can be configured using circle settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `ShapeLabelSettings` module is used to provide the properties to rectangle annotation.
 */
export declare class ShapeLabelSettings extends ChildProperty<ShapeLabelSettings> {
    /**
     * specifies the opacity of the label.
     */
    opacity: number;
    /**
     * specifies the fill color of the label.
     */
    fillColor: string;
    /**
     * specifies the border color of the label.
     */
    fontColor: string;
    /**
     * specifies the font size of the label.
     */
    fontSize: number;
    /**
     * specifies the max-width of the label.
     */
    fontFamily: string;
    /**
     * specifies the default content of the label.
     */
    labelContent: string;
    /**
     * specifies the default content of the label.
     */
    notes: string;
}
/**
 * The `PolygonSettings` module is used to provide the properties to polygon annotation.
 */
export declare class PolygonSettings extends ChildProperty<PolygonSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked polygon annotations.
     * IsLock can be configured using polygon settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `stampSettings` module is used to provide the properties to stamp annotation.
 */
export declare class StampSettings extends ChildProperty<StampSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Provide option to define the required dynamic stamp items to be displayed in annotation toolbar menu.
     */
    dynamicStamps: DynamicStampItem[];
    /**
     * Provide option to define the required sign stamp items to be displayed in annotation toolbar menu.
     */
    signStamps: SignStampItem[];
    /**
     * Provide option to define the required standard business stamp items to be displayed in annotation toolbar menu.
     */
    standardBusinessStamps: StandardBusinessStampItem[];
    /**
     * Gets or sets the allowed interactions for the locked stamp annotations.
     * IsLock can be configured using stamp settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `CustomStampSettings` module is used to provide the properties to customstamp annotation.
 */
export declare class CustomStampSettings extends ChildProperty<CustomStampSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the width of the annotation.
     */
    width: number;
    /**
     * specifies the height of the annotation.
     */
    height: number;
    /**
     * specifies the left position of the annotation.
     */
    left: number;
    /**
     * specifies the top position of the annotation.
     */
    top: number;
    /**
     * Specifies to maintain the newly added custom stamp element in the menu items.
     */
    isAddToMenu: boolean;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * Define the custom image path and it's name to be displayed in the menu items.
     */
    customStamps: CustomStampModel[];
    /**
     * If it is set as false. then the custom stamp items won't be visible in the annotation toolbar stamp menu items.
     */
    enableCustomStamp: boolean;
    /**
     * Gets or sets the allowed interactions for the locked custom stamp annotations.
     * IsLock can be configured using custom stamp settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `DistanceSettings` module is used to provide the properties to distance calibrate annotation.
 */
export declare class DistanceSettings extends ChildProperty<DistanceSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle: LineHeadStyle;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadEndStyle: LineHeadStyle;
    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * specifies the leader length of the annotation.
     */
    leaderLength: number;
    /**
     * Defines the cursor type for distance annotation.
     */
    resizeCursorType: CursorType;
    /**
     * Gets or sets the allowed interactions for the locked distance annotations.
     * IsLock can be configured using distance settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `PerimeterSettings` module is used to provide the properties to perimeter calibrate annotation.
 */
export declare class PerimeterSettings extends ChildProperty<PerimeterSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadStartStyle: LineHeadStyle;
    /**
     * specifies the line head start style of the annotation.
     */
    lineHeadEndStyle: LineHeadStyle;
    /**
     * specifies the border dash array  of the annotation.
     */
    borderDashArray: number;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * Gets or sets the allowed interactions for the locked perimeter annotations.
     * IsLock can be configured using perimeter settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `AreaSettings` module is used to provide the properties to area calibrate annotation.
 */
export declare class AreaSettings extends ChildProperty<AreaSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * Gets or sets the allowed interactions for the locked area annotations.
     * IsLock can be configured using area settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `RadiusSettings` module is used to provide the properties to radius calibrate annotation.
 */
export declare class RadiusSettings extends ChildProperty<RadiusSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked radius annotations.
     * IsLock can be configured using area settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `VolumeSettings` module is used to provide the properties to volume calibrate annotation.
 */
export declare class VolumeSettings extends ChildProperty<VolumeSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * Gets or sets the allowed interactions for the locked volume annotations.
     * IsLock can be configured using volume settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `Ink` module is used to provide the properties to Ink annotation.
 */
export declare class InkAnnotationSettings extends ChildProperty<InkAnnotationSettings> {
    /**
     * Sets the opacity value for ink annotation.By default value is 1. It range varies from 0 to 1.
     */
    opacity: number;
    /**
     * Sets the stroke color for ink annotation.By default values is #FF0000.
     */
    strokeColor: string;
    /**
     * Sets the thickness for the ink annotation. By default value is 1. It range varies from 1 to 10.
     */
    thickness: number;
    /**
     * Define the default option to customize the selector for ink annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * If it is set as true, can't interact with annotation. Otherwise can interact the annotations. By default it is false.
     */
    isLock: boolean;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * Gets or sets the allowed interactions for the locked ink annotations.
     * IsLock can be configured using ink settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies the custom data of the annotation
     */
    customData: object;
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `stickyNotesSettings` module is used to provide the properties to sticky notes annotation.
 */
export declare class StickyNotesSettings extends ChildProperty<StickyNotesSettings> {
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * specifies the lock action of the annotation.
     */
    isLock: boolean;
    /**
     * Gets or sets the allowed interactions for the locked sticky notes annotations.
     * IsLock can be configured using sticky notes settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `MeasurementSettings` module is used to provide the settings to measurement annotations.
 */
export declare class MeasurementSettings extends ChildProperty<MeasurementSettings> {
    /**
     * specifies the scale ratio of the annotation.
     */
    scaleRatio: number;
    /**
     * specifies the unit of the annotation.
     */
    conversionUnit: CalibrationUnit;
    /**
     * specifies the unit of the annotation.
     */
    displayUnit: CalibrationUnit;
    /**
     * specifies the depth of the volume annotation.
     */
    depth: number;
}
/**
 * The `FreeTextSettings` module is used to provide the properties to free text annotation.
 */
export declare class FreeTextSettings extends ChildProperty<FreeTextSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the border color of the annotation.
     */
    borderColor: string;
    /**
     * specifies the border with of the annotation.
     */
    borderWidth: number;
    /**
     * specifies the border style of the annotation.
     */
    borderStyle: string;
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the background fill color of the annotation.
     */
    fillColor: string;
    /**
     * specifies the text box font size of the annotation.
     */
    fontSize: number;
    /**
     * specifies the width of the annotation.
     */
    width: number;
    /**
     * specifies the height of the annotation.
     */
    height: number;
    /**
     * specifies the text box font color of the annotation.
     */
    fontColor: string;
    /**
     * specifies the text box font family of the annotation.
     */
    fontFamily: string;
    /**
     * setting the default text for annotation.
     */
    defaultText: string;
    /**
     * applying the font styles for the text.
     */
    fontStyle: FontStyle;
    /**
     * Aligning the text in the annotation.
     */
    textAlignment: TextAlignment;
    /**
     * specifies the allow text only action of the free text annotation.
     */
    allowEditTextOnly: boolean;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked free text annotations.
     * IsLock can be configured using free text settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
    /**
     * specifies whether the individual annotations are included or not in print actions.
     */
    isPrint: boolean;
}
/**
 * The `AnnotationSelectorSettings` module is used to provide the properties to annotation selectors.
 */
export declare class AnnotationSelectorSettings extends ChildProperty<AnnotationSelectorSettings> {
    /**
     * Specifies the selection border color.
     */
    selectionBorderColor: string;
    /**
     * Specifies the border color of the resizer.
     * @ignore
     */
    resizerBorderColor: string;
    /**
     * Specifies the fill color of the resizer.
     * @ignore
     */
    resizerFillColor: string;
    /**
     * Specifies the size of the resizer.
     * @ignore
     */
    resizerSize: number;
    /**
     * Specifies the thickness of the border of selection.
     */
    selectionBorderThickness: number;
    /**
     * Specifies the shape of the resizer.
     */
    resizerShape: AnnotationResizerShape;
    /**
     * Specifies the border dash array of the selection.
     */
    selectorLineDashArray: number[];
    /**
     * Specifies the location of the resizer.
     */
    resizerLocation: AnnotationResizerLocation;
    /**
     * specifies the cursor type of resizer
     */
    resizerCursorType: CursorType;
}
/**
 * The `TextSearchColorSettings` module is used to set the settings for the color of the text search highlight.
 */
export declare class TextSearchColorSettings extends ChildProperty<TextSearchColorSettings> {
    /**
     * Gets or Sets the color of the current occurrence of the text searched string.
     */
    searchHighlightColor: string;
    /**
     * Gets or Sets the color of the other occurrence of the text searched string.
     */
    searchColor: string;
}
/**
 * The `HandWrittenSignatureSettings` module is used to provide the properties to handwritten signature.
 */
export declare class HandWrittenSignatureSettings extends ChildProperty<HandWrittenSignatureSettings> {
    /**
     * specifies the opacity of the annotation.
     */
    opacity: number;
    /**
     * specifies the stroke color of the annotation.
     */
    strokeColor: string;
    /**
     * specified the thickness of the annotation.
     */
    thickness: number;
    /**
     * specified the width of the annotation.
     */
    width: number;
    /**
     * specified the height of the annotation.
     */
    height: number;
    /**
     * specifies the annotation selector settings of the annotation.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
}
/**
 * The `AnnotationSettings` module is used to provide the properties to annotations.
 */
export declare class AnnotationSettings extends ChildProperty<AnnotationSettings> {
    /**
     * specifies the author of the annotation.
     */
    author: string;
    /**
     * specifies the minHeight of the annotation.
     */
    minHeight: number;
    /**
     * specifies the minWidth of the annotation.
     */
    minWidth: number;
    /**
     * specifies the minHeight of the annotation.
     */
    maxHeight: number;
    /**
     * specifies the maxWidth of the annotation.
     */
    maxWidth: number;
    /**
     * specifies the locked action of the annotation.
     */
    isLock: boolean;
    /**
     * specifies whether the annotations are included or not in print actions.
     */
    skipPrint: boolean;
    /**
     * specifies whether the annotations are included or not in download actions.
     */
    skipDownload: boolean;
    /**
     * specifies the custom data of the annotation.
     */
    customData: object;
    /**
     * Gets or sets the allowed interactions for the locked annotations.
     * IsLock can be configured using annotation settings.
     * @default ['None']
     */
    allowedInteractions: AllowedInteraction[];
}
/**
 * The `DocumentTextCollectionSettings` module is used to provide the properties to DocumentTextCollection.
 */
export declare class DocumentTextCollectionSettings extends ChildProperty<DocumentTextCollectionSettings> {
    /**
     * specifies the text data of the document.
     */
    textData: TextDataSettingsModel[];
    /**
     * specifies the page text of the document.
     */
    pageText: string;
    /**
     * specifies the page size of the document.
     */
    pageSize: number;
}
/**
 * The `TextDataSettings` module is used to provide the properties of text data.
 */
export declare class TextDataSettings extends ChildProperty<TextDataSettings> {
    /**
     * specifies the bounds of the rectangle.
     */
    bounds: RectangleBoundsModel;
    /**
     * specifies the text of the document.
     */
    text: string;
}
/**
 * The `RectangleBounds` module is used to provide the properties of rectangle bounds.
 */
export declare class RectangleBounds extends ChildProperty<RectangleBounds> {
    /**
     * specifies the size of the rectangle.
     */
    size: number;
    /**
     * specifies the x co-ordinate of the upper-left corner of the rectangle.
     */
    x: number;
    /**
     * specifies the y co-ordinate of the upper-left corner of the rectangle.
     */
    y: number;
    /**
     * specifies the width of the rectangle.
     */
    width: number;
    /**
     * specifies the height of the rectangle.
     */
    height: number;
    /**
     * specifies the left value of the rectangle.
     */
    left: number;
    /**
     * specifies the top value of the rectangle.
     */
    top: number;
    /**
     * specifies the right of the rectangle.
     */
    right: number;
    /**
     * specifies the bottom value of the rectangle.
     */
    bottom: number;
    /**
     * Returns true if height and width of the rectangle is zero.
     * @default 'false'
     */
    isEmpty: boolean;
}
/**
 * The `TileRenderingSettings` module is used to provide the tile rendering settings of the PDF viewer.
 */
export declare class TileRenderingSettings extends ChildProperty<TileRenderingSettings> {
    /**
     * Enable or disables tile rendering mode in the PDF Viewer.
     */
    enableTileRendering: boolean;
    /**
     * specifies the tileX count of the render Page.
     */
    x: number;
    /**
     * specifies the tileY count of the render Page.
     */
    y: number;
}
/**
 * The `ScrollSettings` module is used to provide the settings of the scroll of the PDF viewer.
 */
export declare class ScrollSettings extends ChildProperty<ScrollSettings> {
    /**
     * Increase or decrease the delay time.
     */
    delayPageRequestTimeOnScroll: number;
}
/**
 * The `FormField` is used to store the form fields of PDF document.
 */
export declare class FormField extends ChildProperty<FormField> {
    /**
     * Gets the name of the form field.
     */
    name: string;
    /**
     * Gets the id of the form field.
     */
    id: string;
    /**
     * Gets or sets the value of the form field.
     */
    value: string;
    /**
     * Gets the type of the form field.
     */
    type: FormFieldType;
    /**
     * If it is set as true, can't edit the form field in the PDF document. By default it is false.
     */
    isReadOnly: boolean;
    /**
     * specifies the type of the signature.
     */
    signatureType: SignatureType[];
    /**
     * specifies the fontName of the signature.
     */
    fontName: string;
}
/**
 * The `ContextMenuSettings` is used to show the context menu of PDF document.
 */
export declare class ContextMenuSettings extends ChildProperty<ContextMenuSettings> {
    /**
     * Defines the context menu action.
     * @default RightClick
     */
    contextMenuAction: ContextMenuAction;
    /**
     * Defines the context menu items should be visible in the PDF Viewer.
     *  @default []
     */
    contextMenuItems: ContextMenuItem[];
}
/**
 * Represents the PDF viewer component.
 * ```html
 * <div id="pdfViewer"></div>
 * <script>
 *  var pdfViewerObj = new PdfViewer();
 *  pdfViewerObj.appendTo("#pdfViewer");
 * </script>
 * ```
 */
export declare class PdfViewer extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines the service url of the PdfViewer control.
     */
    serviceUrl: string;
    /**
     * gets the page count of the document loaded in the PdfViewer control.
     * @default 0
     */
    pageCount: number;
    /**
     * Checks whether the PDF document is edited.
     * @asptype bool
     * @blazorType bool
     */
    isDocumentEdited: boolean;
    /**
     * Returns the current page number of the document displayed in the PdfViewer control.
     * @default 0
     */
    currentPageNumber: number;
    /**
     * Sets the PDF document path for initial loading.
     */
    documentPath: string;
    /**
     * Returns the current zoom percentage of the PdfViewer control.
     * @asptype int
     * @blazorType int
     */
    readonly zoomPercentage: number;
    /**
     * Get the Loaded document annotation Collections in the PdfViewer control.
     */
    annotationCollection: any[];
    /**
     * Get the Loaded document signature Collections in the PdfViewer control.
     */
    signatureCollection: any[];
    /**
     * Gets or sets the document name loaded in the PdfViewer control.
     */
    fileName: string;
    /**
     * Gets or sets the export annotations JSON file name in the PdfViewer control.
     */
    exportAnnotationFileName: string;
    /**
     * Gets or sets the download file name in the PdfViewer control.
     */
    downloadFileName: string;
    /**
     * Defines the scrollable height of the PdfViewer control.
     * @default 'auto'
     */
    height: string | number;
    /**
     * Defines the scrollable width of the PdfViewer control.
     * @default 'auto'
     */
    width: string | number;
    /**
     * Enable or disables the toolbar of PdfViewer.
     * @default true
     */
    enableToolbar: boolean;
    /**
     * Specifies the retry count for the failed requests.
     * @default 1
     */
    retryCount: number;
    /**
     * If it is set as false then error message box is not displayed in PDF viewer control.
     * @default true
     */
    showNotificationDialog: boolean;
    /**
     * Enable or disables the Navigation toolbar of PdfViewer.
     * @default true
     */
    enableNavigationToolbar: boolean;
    /**
     * Enable or disables the Comment Panel of PdfViewer.
     * @default true
     */
    enableCommentPanel: boolean;
    /**
     * If it set as true, then the command panel show at initial document loading in the PDF viewer
     * @default false
     */
    isCommandPanelOpen: boolean;
    /**
     * Enable or disable the text markup resizer to modify the bounds in UI.
     * @default false
     */
    enableTextMarkupResizer: boolean;
    /**
     * Enable or disable the multi line text markup annotations in overlapping collections.
     * @default false
     */
    enableMultiLineOverlap: boolean;
    /**
     * Checks if the freeText value is valid or not. FALSE by default
     * @default false
     */
    isValidFreeText: boolean;
    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     * @default false
     */
    isAnnotationToolbarOpen: boolean;
    /**
     * Enables or disables the multi-page text markup annotation selection in UI.
     * @default false
     */
    enableMultiPageAnnotation: boolean;
    /**
     * Enable or disables the download option of PdfViewer.
     * @default true
     */
    enableDownload: boolean;
    /**
     * Enable or disables the print option of PdfViewer.
     * @default true
     */
    enablePrint: boolean;
    /**
     * Enables or disables the thumbnail view in the PDF viewer
     * @default true
     */
    enableThumbnail: boolean;
    /**
     * If it set as true, then the thumbnail view show at initial document loading in the PDF viewer
     * @default false
     */
    isThumbnailViewOpen: boolean;
    /**
     * Enables or disable saving Hand Written signature as editable in the PDF.
     * @default false
     */
    isSignatureEditable: boolean;
    /**
     * Enables or disables the bookmark view in the PDF viewer
     * @default true
     */
    enableBookmark: boolean;
    /**
     * Enables or disables the bookmark styles in the PDF viewer
     * @default false
     */
    enableBookmarkStyles: boolean;
    /**
     * Enables or disables the hyperlinks in PDF document.
     * @default true
     */
    enableHyperlink: boolean;
    /**
     * Enables or disables the handwritten signature in PDF document.
     * @default true
     */
    enableHandwrittenSignature: boolean;
    /**
     * If it is set as false, then the ink annotation support in the PDF Viewer will be disabled. By default it is true.
     * @default true
     */
    enableInkAnnotation: boolean;
    /**
     * restrict zoom request.
     * @default false
     */
    restrictZoomRequest: boolean;
    /**
     * Specifies the open state of the hyperlink in the PDF document.
     * @default CurrentTab
     */
    hyperlinkOpenState: LinkTarget;
    /**
     * Specifies the state of the ContextMenu in the PDF document.
     * @default RightClick
     */
    contextMenuOption: ContextMenuAction;
    /**
     * enable or disable context menu Items
     * @default []
     */
    disableContextMenuItems: ContextMenuItem[];
    /**
     * Gets the form fields present in the loaded PDF document. It used to get the form fields id, name, type and it's values.
     */
    formFieldCollections: FormFieldModel[];
    /**
     * Enable or disables the Navigation module of PdfViewer.
     * @default true
     */
    enableNavigation: boolean;
    /**
     * Enable or disables the auto complete option in form documents.
     * @default true
     */
    enableAutoComplete: boolean;
    /**
     * Enable or disables the Magnification module of PdfViewer.
     * @default true
     */
    enableMagnification: boolean;
    /**
     * Enable or disables the Label for shapeAnnotations of PdfViewer.
     * @default false
     */
    enableShapeLabel: boolean;
    /**
     * Enable or disables the customization of measure values in PdfViewer.
     * @default true
     */
    enableImportAnnotationMeasurement: boolean;
    /**
     * Enable or disables the Pinch zoom of PdfViewer.
     * @default true
     */
    enablePinchZoom: boolean;
    /**
     * Enable or disables the text selection in the PdfViewer.
     * @default true
     */
    enableTextSelection: boolean;
    /**
     * Enable or disables the text search in the PdfViewer.
     * @default true
     */
    enableTextSearch: boolean;
    /**
     * Enable or disable the annotation in the Pdfviewer.
     * @default true
     */
    enableAnnotation: boolean;
    /**
     * Enable or disable the form fields in the Pdfviewer.
     * @default true
     */
    enableFormFields: boolean;
    /**
     * Enable or disable the form fields validation.
     * @default false
     */
    enableFormFieldsValidation: boolean;
    /**
     * Enable if the PDF document contains form fields.
     * @default false
     */
    isFormFieldDocument: boolean;
    /**
     * Gets or sets a boolean value to show or hide desktop toolbar in mobile devices. FALSE by default.
     * @default false
     */
    enableDesktopMode: boolean;
    /**
     * Gets or sets a boolean value to show or hide the save signature check box option in the signature dialog.
     * FALSE by default
     * @default false
     */
    hideSaveSignature: boolean;
    /**
     * Enable or disable the free text annotation in the Pdfviewer.
     * @default true
     */
    enableFreeText: boolean;
    /**
     * Enable or disables the text markup annotation in the PdfViewer.
     * @default true
     */
    enableTextMarkupAnnotation: boolean;
    /**
     * Enable or disables the shape annotation in the PdfViewer.
     * @default true
     */
    enableShapeAnnotation: boolean;
    /**
     * Enable or disables the calibrate annotation in the PdfViewer.
     * @default true
     */
    enableMeasureAnnotation: boolean;
    /**
     * Enables and disables the stamp annotations when the PDF viewer control is loaded initially.
     * @default true
     */
    enableStampAnnotations: boolean;
    /**
     * Enables and disables the stickyNotes annotations when the PDF viewer control is loaded initially.
     * @default true
     */
    enableStickyNotesAnnotation: boolean;
    /**
     * Opens the annotation toolbar when the PDF document is loaded in the PDF Viewer control initially.
     * @default true
     */
    enableAnnotationToolbar: boolean;
    /**
     * Gets or sets a boolean value to show or hide the bookmark panel while loading a document. FALSE by default.
     * @default false
     */
    isBookmarkPanelOpen: boolean;
    /**
     * Sets the interaction mode of the PdfViewer
     * @default TextSelection
     */
    interactionMode: InteractionMode;
    /**
     * Specifies the rendering mode in the PDF Viewer.
     * @default Default
     */
    zoomMode: ZoomMode;
    /**
     * Specifies the signature mode in the PDF Viewer.
     * @default Default
     */
    signatureFitMode: SignatureFitMode;
    /**
     * Specifies the print mode in the PDF Viewer.
     * @default Default
     */
    printMode: PrintMode;
    /**
     * Sets the initial loading zoom value from 10 to 400 in PdfViewer Control.
     * @default 0
     */
    zoomValue: number;
    /**
     *  Enable or disable the zoom optimization mode in PDF Viewer.
     * @default true
     */
    enableZoomOptimization: boolean;
    /**
     * Enable or disables the get the document text collections.
     * @default false
     */
    isExtractText: boolean;
    /**
     * Maintain the selection of text markup annotation.
     * @default false
     */
    isMaintainSelection: boolean;
    /**
     * Customize desired date and time format
     */
    dateTimeFormat: string;
    /**
     * Defines the settings of the PdfViewer toolbar.
     */
    toolbarSettings: ToolbarSettingsModel;
    /**
     * Defines the ajax Request settings of the PdfViewer.
     */
    ajaxRequestSettings: AjaxRequestSettingsModel;
    /**
     * Defines the stamp items of the PdfViewer.
     */
    customStamp: CustomStampModel[];
    /**
     * Defines the settings of the PdfViewer service.
     */
    serverActionSettings: ServerActionSettingsModel;
    /**
     * Defines the  properties of signature field
     */
    signatureFieldSettings: SignatureFieldSettingsModel;
    /**
     * Defines the settings of highlight annotation.
     */
    highlightSettings: HighlightSettingsModel;
    /**
     * Defines the settings of strikethrough annotation.
     */
    strikethroughSettings: StrikethroughSettingsModel;
    /**
     * Defines the settings of underline annotation.
     */
    underlineSettings: UnderlineSettingsModel;
    /**
     * Defines the settings of line annotation.
     */
    lineSettings: LineSettingsModel;
    /**
     * Defines the settings of arrow annotation.
     */
    arrowSettings: ArrowSettingsModel;
    /**
     * Defines the settings of rectangle annotation.
     */
    rectangleSettings: RectangleSettingsModel;
    /**
     * Defines the settings of shape label.
     */
    shapeLabelSettings: ShapeLabelSettingsModel;
    /**
     * Defines the settings of circle annotation.
     */
    circleSettings: CircleSettingsModel;
    /**
     * Defines the settings of polygon annotation.
     */
    polygonSettings: PolygonSettingsModel;
    /**
     * Defines the settings of stamp annotation.
     */
    stampSettings: StampSettingsModel;
    /**
     * Defines the settings of customStamp annotation.
     */
    customStampSettings: CustomStampSettingsModel;
    /**
     * Defines the settings of distance annotation.
     */
    distanceSettings: DistanceSettingsModel;
    /**
     * Defines the settings of perimeter annotation.
     */
    perimeterSettings: PerimeterSettingsModel;
    /**
     * Defines the settings of area annotation.
     */
    areaSettings: AreaSettingsModel;
    /**
     * Defines the settings of radius annotation.
     */
    radiusSettings: RadiusSettingsModel;
    /**
     * Defines the settings of volume annotation.
     */
    volumeSettings: VolumeSettingsModel;
    /**
     * Defines the settings of stickyNotes annotation.
     */
    stickyNotesSettings: StickyNotesSettingsModel;
    /**
     * Defines the settings of free text annotation.
     */
    freeTextSettings: FreeTextSettingsModel;
    /**
     * Defines the settings of measurement annotation.
     */
    measurementSettings: MeasurementSettingsModel;
    /**
     * Defines the settings of annotation selector.
     */
    annotationSelectorSettings: AnnotationSelectorSettingsModel;
    /**
     * Sets the settings for the color of the text search highlight.
     */
    textSearchColorSettings: TextSearchColorSettingsModel;
    /**
     * Defines the settings of handWrittenSignature.
     */
    handWrittenSignatureSettings: HandWrittenSignatureSettingsModel;
    /**
     * Defines the ink annotation settings for PDF Viewer.It used to customize the strokeColor, thickness, opacity of the ink annotation.
     */
    inkAnnotationSettings: InkAnnotationSettingsModel;
    /**
     * Defines the settings of the annotations.
     */
    annotationSettings: AnnotationSettingsModel;
    /**
     * Defines the tile rendering settings.
     */
    tileRenderingSettings: TileRenderingSettingsModel;
    /**
     * Defines the scroll settings.
     */
    scrollSettings: ScrollSettingsModel;
    /**
     * Defines the context menu settings.
     */
    contextMenuSettings: ContextMenuSettingsModel;
    /**
     * @private
     */
    viewerBase: PdfViewerBase;
    /**
     * @private
     */
    drawing: Drawing;
    /**
     * @private
     */
    /**
     * Defines the collection of selected items, size and position of the selector
     * @default {}
     */
    selectedItems: SelectorModel;
    /**
     * @private
     */
    adornerSvgLayer: SVGSVGElement;
    /**
     * @private
     */
    zIndex: number;
    /**
     * @private
     */
    nameTable: {};
    /**   @private  */
    clipboardData: ClipBoardObject;
    /**
     * @private
     */
    zIndexTable: ZOrderPageTable[];
    /**
     * @private
     */
    navigationModule: Navigation;
    /**
     * @private
     */
    toolbarModule: Toolbar;
    /**
     * @private
     */
    magnificationModule: Magnification;
    /**
     * @private
     */
    linkAnnotationModule: LinkAnnotation;
    /** @hidden */
    localeObj: L10n;
    /**
     * @private
     */
    thumbnailViewModule: ThumbnailView;
    /**
     * @private
     */
    bookmarkViewModule: BookmarkView;
    /**
     * @private
     */
    textSelectionModule: TextSelection;
    /**
     * @private
     */
    textSearchModule: TextSearch;
    /**
     * @private
     */
    printModule: Print;
    /**
     * @private
     */
    annotationModule: Annotation;
    /**
     * @private
     */
    formFieldsModule: FormFields;
    private isTextSelectionStarted;
    /**
     * @private
     */
    _dotnetInstance: any;
    /**
     * Gets the bookmark view object of the pdf viewer.
     * @asptype BookmarkView
     * @blazorType BookmarkView
     * @returns { BookmarkView }
     */
    readonly bookmark: BookmarkView;
    /**
     * Gets the print object of the pdf viewer.
     * @asptype Print
     * @blazorType Print
     * @returns { Print }
     */
    readonly print: Print;
    /**
     * Gets the magnification object of the pdf viewer.
     * @asptype Magnification
     * @blazorType Magnification
     * @returns { Magnification }
     */
    readonly magnification: Magnification;
    /**
     * Gets the navigation object of the pdf viewer.
     * @asptype Navigation
     * @blazorType Navigation
     * @returns { Navigation }
     */
    readonly navigation: Navigation;
    /**
     * Gets the text search object of the pdf viewer.
     * @asptype TextSearch
     * @blazorType TextSearch
     * @returns { TextSearch }
     */
    readonly textSearch: TextSearch;
    /**
     * Gets the toolbar object of the pdf viewer.
     * @asptype Toolbar
     * @blazorType Toolbar
     * @returns { Toolbar }
     */
    readonly toolbar: Toolbar;
    /**
     * Gets the thumbnail-view object of the pdf viewer.
     * @asptype ThumbnailView
     * @blazorType ThumbnailView
     * @returns { ThumbnailView }
     */
    readonly thumbnailView: ThumbnailView;
    /**
     * Gets the annotation object of the pdf viewer.
     * @asptype Annotation
     * @blazorType Annotation
     * @returns { Annotation }
     */
    readonly annotation: Annotation;
    /**
     * Gets the TextSelection object of the pdf viewer.
     * @asptype TextSelection
     * @blazorType TextSelection
     * @returns { TextSelection }
     */
    readonly textSelection: TextSelection;
    /**
     * Triggers while created the PdfViewer component.
     * @event
     * @blazorProperty 'Created'
     */
    created: EmitType<void>;
    /**
     * Triggers while loading document into PdfViewer.
     * @event
     * @blazorProperty 'DocumentLoaded'
     */
    documentLoad: EmitType<LoadEventArgs>;
    /**
     * Triggers while close the document
     * @event
     * @blazorProperty 'DocumentUnloaded'
     */
    documentUnload: EmitType<UnloadEventArgs>;
    /**
     * Triggers while loading document got failed in PdfViewer.
     * @event
     * @blazorProperty 'DocumentLoadFailed'
     */
    documentLoadFailed: EmitType<LoadFailedEventArgs>;
    /**
     * Triggers when the AJAX request is failed.
     * @event
     * @blazorProperty 'AjaxRequestFailed'
     */
    ajaxRequestFailed: EmitType<AjaxRequestFailureEventArgs>;
    /**
     * Triggers when validation is failed.
     * @event
     * @blazorProperty 'validateFormFields'
     */
    validateFormFields: EmitType<ValidateFormFieldsArgs>;
    /**
     * Triggers when the mouse click is performed over the page of the PDF document.
     * @event
     * @blazorProperty 'OnPageClick'
     */
    pageClick: EmitType<PageClickEventArgs>;
    /**
     * Triggers when there is change in current page number.
     * @event
     * @blazorProperty 'PageChanged'
     */
    pageChange: EmitType<PageChangeEventArgs>;
    /**
     * Triggers when hyperlink in the PDF Document is clicked
     * @event
     * @blazorProperty 'OnHyperlinkClick'
     */
    hyperlinkClick: EmitType<HyperlinkClickEventArgs>;
    /**
     * Triggers when hyperlink in the PDF Document is hovered
     * @event
     * @blazorProperty 'OnHyperlinkMouseOver'
     */
    hyperlinkMouseOver: EmitType<HyperlinkMouseOverArgs>;
    /**
     * Triggers when there is change in the magnification value.
     * @event
     * @blazorProperty 'ZoomChanged'
     */
    zoomChange: EmitType<ZoomChangeEventArgs>;
    /**
     * Triggers when an annotation is added over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationAdded'
     */
    annotationAdd: EmitType<AnnotationAddEventArgs>;
    /**
     * Triggers when an annotation is removed from the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationRemoved'
     */
    annotationRemove: EmitType<AnnotationRemoveEventArgs>;
    /**
     * Triggers when the property of the annotation is changed in the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationPropertiesChanged'
     */
    annotationPropertiesChange: EmitType<AnnotationPropertiesChangeEventArgs>;
    /**
     * Triggers when an annotation is resized over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationResized'
     */
    annotationResize: EmitType<AnnotationResizeEventArgs>;
    /**
     * Triggers when signature is added  over the page of the PDF document.
     * @event
     */
    addSignature: EmitType<AddSignatureEventArgs>;
    /**
     * Triggers when signature is removed over the page of the PDF document.
     * @event
     */
    removeSignature: EmitType<RemoveSignatureEventArgs>;
    /**
     * Triggers when an signature is moved over the page of the PDF document.
     * @event
     */
    moveSignature: EmitType<MoveSignatureEventArgs>;
    /**
     * Triggers when the property of the signature is changed in the page of the PDF document.
     * @event
     */
    signaturePropertiesChange: EmitType<SignaturePropertiesChangeEventArgs>;
    /**
     * Triggers when signature is resized over the page of the PDF document.
     * @event
     */
    resizeSignature: EmitType<ResizeSignatureEventArgs>;
    /**
     * Triggers when signature is selected over the page of the PDF document.
     * @event
     */
    signatureSelect: EmitType<SignatureSelectEventArgs>;
    /**
     * Triggers when an annotation is selected over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationSelected'
     */
    annotationSelect: EmitType<AnnotationSelectEventArgs>;
    /**
     * Triggers when an annotation is unselected over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationUnSelect'
     */
    annotationUnSelect: EmitType<AnnotationUnSelectEventArgs>;
    /**
     * Triggers an event when the annotation is double click.
     * @event
     * @blazorProperty 'OnAnnotationDoubleClick'
     */
    annotationDoubleClick: EmitType<AnnotationDoubleClickEventArgs>;
    /**
     * Triggers when an annotation is moved over the page of the PDF document.
     * @event
     * @blazorProperty 'AnnotationMoved'
     */
    annotationMove: EmitType<AnnotationMoveEventArgs>;
    /**
     * Triggers when mouse over the annotation object.
     * @event
     */
    annotationMouseover: EmitType<AnnotationMouseoverEventArgs>;
    /**
     * Triggers when mouse over the annotation object.
     * @event
     */
    annotationMouseLeave: EmitType<AnnotationMouseLeaveEventArgs>;
    /**
     * Triggers when mouse over the page.
     * @event
     */
    pageMouseover: EmitType<PageMouseoverEventArgs>;
    /**
     * Triggers when an imported annotations started in the PDF document.
     * @event
     * @blazorProperty 'ImportStarted'
     */
    importStart: EmitType<ImportStartEventArgs>;
    /**
     * Triggers when an exported annotations started in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportStarted'
     */
    exportStart: EmitType<ExportStartEventArgs>;
    /**
     * Triggers when an imports annotations succeed in the PDF document.
     * @event
     * @blazorProperty 'ImportSucceed'
     */
    importSuccess: EmitType<ImportSuccessEventArgs>;
    /**
     * Triggers when an export annotations succeed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportSucceed'
     */
    exportSuccess: EmitType<ExportSuccessEventArgs>;
    /**
     * Triggers when an imports annotations failed in the PDF document.
     * @event
     * @blazorProperty 'ImportFailed'
     */
    importFailed: EmitType<ImportFailureEventArgs>;
    /**
     * Triggers when an export annotations failed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExportFailed'
     */
    exportFailed: EmitType<ExportFailureEventArgs>;
    /**
     * Triggers when an text extraction is completed in the PDF Viewer.
     * @event
     * @blazorProperty 'ExtractTextCompleted'
     */
    extractTextCompleted: EmitType<ExtractTextCompletedEventArgs>;
    /**
     * Triggers an event when the thumbnail is clicked in the thumbnail panel of PDF Viewer.
     * @event
     * @blazorProperty 'OnThumbnailClick'
     */
    thumbnailClick: EmitType<ThumbnailClickEventArgs>;
    /**
     * Triggers an event when the bookmark is clicked in the bookmark panel of PDF Viewer.
     * @event
     * @blazorProperty 'BookmarkClick'
     */
    bookmarkClick: EmitType<BookmarkClickEventArgs>;
    /**
     * Triggers an event when the text selection is started.
     * @event
     * @blazorProperty 'OnTextSelectionStart'
     */
    textSelectionStart: EmitType<TextSelectionStartEventArgs>;
    /**
     * Triggers an event when the text selection is finished.
     * @event
     * @blazorProperty 'OnTextSelectionEnd'
     */
    textSelectionEnd: EmitType<TextSelectionEndEventArgs>;
    /**
     * Triggers an event when the download action is started.
     * @event
     * @blazorProperty 'DownloadStart'
     */
    downloadStart: EmitType<DownloadStartEventArgs>;
    /**
     * Triggers an event when the button is clicked.
     * @event
     * @blazorProperty 'ButtonFieldClick'
     */
    buttonFieldClick: EmitType<ButtonFieldClickEventArgs>;
    /**
     * Triggers an event when the download actions is finished.
     * @event
     * @blazorProperty 'DownloadEnd'
     */
    downloadEnd: EmitType<DownloadEndEventArgs>;
    /**
     * Triggers an event when the print action is started.
     * @event
     * @blazorProperty 'PrintStart'
     */
    printStart: EmitType<PrintStartEventArgs>;
    /**
     * Triggers an event when the print actions is finished.
     * @event
     * @blazorProperty 'PrintEnd'
     */
    printEnd: EmitType<PrintEndEventArgs>;
    /**
     * Triggers an event when the text search is started.
     * @event
     * @blazorProperty 'OnTextSearchStart'
     */
    textSearchStart: EmitType<TextSearchStartEventArgs>;
    /**
     * Triggers an event when the text search is completed.
     * @event
     * @blazorProperty 'OnTextSearchComplete'
     */
    textSearchComplete: EmitType<TextSearchCompleteEventArgs>;
    /**
     * Triggers an event when the text search text is highlighted.
     * @event
     * @blazorProperty 'OnTextSearchHighlight'
     */
    textSearchHighlight: EmitType<TextSearchHighlightEventArgs>;
    /**
     * Triggers before the data send in to the server.
     * @event
     * @deprecated
     */
    ajaxRequestInitiate: EmitType<AjaxRequestInitiateEventArgs>;
    /**
     * Triggers when the comment is added for the annotation in the comment panel.
     * @event
     * @blazorProperty 'commentAdd'
     */
    commentAdd: EmitType<CommentEventArgs>;
    /**
     * Triggers when the comment is edited for the annotation in the comment panel.
     * @event
     * @blazorProperty 'commentEdit'
     */
    commentEdit: EmitType<CommentEventArgs>;
    /**
     * Triggers when the comment is deleted for the annotation in the comment panel.
     * @event
     * @blazorProperty 'commentDelete'
     */
    commentDelete: EmitType<CommentEventArgs>;
    /**
     * Triggers when the comment is selected for the annotation in the comment panel.
     * @event
     * @blazorProperty 'commentSelect
     */
    commentSelect: EmitType<CommentEventArgs>;
    /**
     * Triggers when the comment for status is changed for the annotation in the comment panel.
     * @event
     * @blazorProperty 'commentStatusChanged'
     */
    commentStatusChanged: EmitType<CommentEventArgs>;
    /**
     * Triggers the event before adding a text in the freeText annotation.
     * @event
     * @blazorProperty 'beforeAddFreeText'
     */
    beforeAddFreeText: EmitType<BeforeAddFreeTextEventArgs>;
    /**
     * Triggers when focus out from the form fields.
     * @event
     * @blazorProperty 'formFieldFocusOut'
     */
    formFieldFocusOut: EmitType<FormFieldFocusOutEventArgs>;
    /**
     * PDF document annotation collection.
     * @private
     * @deprecated
     */
    annotations: PdfAnnotationBaseModel[];
    /**
     * @private
     * @deprecated
     */
    tool: string;
    /**
     * store the drawing objects.
     * @private
     * @deprecated
     */
    drawingObject: PdfAnnotationBaseModel;
    constructor(options?: PdfViewerModel, element?: string | HTMLElement);
    protected preRender(): void;
    protected render(): void;
    getModuleName(): string;
    /**
     * @private
     */
    getLocaleConstants(): Object;
    /**
     * To modify the Json Data in ajax request.
     * @returns void
     * @deprecated
     */
    setJsonData(jsonData: any): void;
    onPropertyChanged(newProp: PdfViewerModel, oldProp: PdfViewerModel): void;
    private renderCustomerStamp;
    getPersistData(): string;
    requiredModules(): ModuleDeclaration[];
    /** @hidden */
    defaultLocale: Object;
    /**
     * Loads the given PDF document in the PDF viewer control
     * @param  {string} document - Specifies the document name for load
     * @param  {string} password - Specifies the Given document password
     * @returns void
     */
    load(document: string, password: string): void;
    /**
     * Downloads the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    download(): void;
    /**
     * Saves the PDF document being loaded in the PDF Viewer control as blob.
     * @returns Promise<Blob>
     */
    saveAsBlob(): Promise<Blob>;
    /**
     * updates the PDF Viewer container width and height from externally.
     * @returns void
     */
    updateViewerContainer(): void;
    /**
     * Specifies the message to be displayed  in the popup.
     * @returns void
     */
    showNotificationPopup(errorString: string): void;
    /**
     * Update the form field values from externally.
     * @returns void
     */
    updateFormFieldsValue(fieldValue: any): void;
    /**
     * Perform undo action for the edited annotations
     * @returns void
     */
    undo(): void;
    /**
     * Perform redo action for the edited annotations
     * @returns void
     */
    redo(): void;
    /**
     * Unloads the PDF document being displayed in the PDF viewer.
     * @returns void
     */
    unload(): void;
    /**
     * Destroys all managed resources used by this object.
     */
    destroy(): void;
    /**
     * Perform imports annotations action in the PDF Viewer
     * @param  {any} importData - Specifies the data for annotation imports
     * @returns void
     */
    importAnnotation(importData: any, annotationDataFormat?: AnnotationDataFormat): void;
    /**
     * Perform export annotations action in the PDF Viewer
     * @returns void
     */
    exportAnnotation(annotationDataFormat?: AnnotationDataFormat): void;
    /**
     * Perform export annotations action in the PDF Viewer
     * @returns Promise<object>
     */
    exportAnnotationsAsObject(): Promise<object>;
    /**
     * Perform to add annotations in the PDF Viewer
     * @returns void
     */
    addAnnotation(annotation: any): void;
    /**
     * Perform  action in the PDF Viewer
     * @returns void
     */
    importFormFields(formFields: any): void;
    /**
     * Perform export action in the PDF Viewer
     * @returns void
     */
    exportFormFields(path?: string): void;
    /**
     * Perform export annotations action in the PDF Viewer
     * @returns Promise<object>
     */
    exportFormFieldsAsObject(): Promise<object>;
    /**
     * reset all form fields data
     * @returns void
     */
    resetFormFields(): void;
    /**
     * clear all form fields data
     * @returns void
     */
    clearFormFields(): void;
    /**
     * To delete the annotation Collections in the PDF Document.
     * @returns void
     */
    deleteAnnotations(): void;
    /**
     * To retrieve the form fields in the PDF Document.
     * @returns void
     */
    retrieveFormFields(): FormFieldModel[];
    /**
     * To update the form fields in the PDF Document.
     * @returns void
     */
    updateFormFields(formFields: any): void;
    /**
     * @private
     */
    fireAjaxRequestInitiate(JsonData: any): void;
    /**
     * @private
     */
    fireButtonFieldClickEvent(value: string, fieldName: string, id: string): void;
    /**
     * @private
     */
    fireDocumentLoad(pageData: any): void;
    /**
     * @private
     */
    fireDocumentUnload(fileName: string): void;
    /**
     * @private
     */
    fireDocumentLoadFailed(isPasswordRequired: boolean, password: string): void;
    /**
     * @private
     */
    fireAjaxRequestFailed(errorStatusCode: number, errorMessage: string, action: string, retryCount?: boolean): void;
    /**
     * @private
     */
    fireValidatedFailed(action: string): void;
    /**
     * @private
     */
    firePageClick(x: number, y: number, pageNumber: number): void;
    /**
     * @private
     */
    firePageChange(previousPageNumber: number): void;
    /**
     * @private
     */
    fireZoomChange(): void;
    /**
     * @private
     */
    fireHyperlinkClick(hyperlink: string, hyperlinkElement: HTMLAnchorElement): void;
    /**
     * @private
     */
    fireHyperlinkHover(hyperlinkElement: HTMLAnchorElement): void;
    /**
     * @private
     */
    fireFocusOutFormField(fieldName: string, value: string): void;
    /**
     * @private
     */
    fireAnnotationAdd(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any): void;
    /**
     * @private
     */
    fireAnnotationRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void;
    /**
     * @private
     */
    fireBeforeAddFreeTextAnnotation(value: string): void;
    /**
     * @private
     */
    fireCommentAdd(id: string, text: string, annotation: any): void;
    /**
     * @private
     */
    fireCommentEdit(id: string, text: string, annotation: any): void;
    /**
     * @private
     */
    fireCommentDelete(id: string, text: string, annotation: any): void;
    /**
     * @private
     */
    fireCommentSelect(id: string, text: string, annotation: any): void;
    /**
     * @private
     */
    fireCommentStatusChanged(id: string, text: string, annotation: any, statusChange: CommentStatus): void;
    /**
     * @private
     */
    fireAnnotationPropertiesChange(pageNumber: number, index: string, type: AnnotationType, isColorChanged: boolean, isOpacityChanged: boolean, isTextChanged: boolean, isCommentsChanged: boolean, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, multiPageCollection?: any): void;
    /**
     * @private
     */
    fireSignatureAdd(pageNumber: number, index: string, type: any, bounds: any, opacity: number, strokeColor?: string, thickness?: number): void;
    /**
     * @private
     */
    fireSignatureRemove(pageNumber: number, index: string, type: AnnotationType, bounds: any): void;
    /**
     * @private
     */
    fireSignatureMove(pageNumber: number, id: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, previousPosition: object, currentPosition: object): void;
    /**
     * @private
     */
    fireSignaturePropertiesChange(pageNumber: number, index: string, type: AnnotationType, isStrokeColorChanged: boolean, isOpacityChanged: boolean, isThicknessChanged: boolean, oldProp: any, newProp: any): void;
    /**
     * @private
     */
    fireSignatureResize(pageNumber: number, index: string, type: AnnotationType, opacity: number, strokeColor: string, thickness: number, currentPosition: any, previousPosition: any): void;
    /**
     * @private
     */
    fireSignatureSelect(id: string, pageNumber: number, signature: object): void;
    /**
     * @private
     */
    fireAnnotationSelect(id: string, pageNumber: number, annotation: any, annotationCollection?: any, multiPageCollection?: any, isSelected?: boolean, annotationAddMode?: string): void;
    /**
     *  @private
     */
    fireAnnotationUnSelect(id: string, pageNumber: number, annotation: any): void;
    /**
     * @private
     */
    fireAnnotationDoubleClick(id: string, pageNumber: number, annotation: any): void;
    /**
     * @private
     */
    fireTextSelectionStart(pageNumber: number): void;
    /**
     * @private
     */
    fireTextSelectionEnd(pageNumber: number, text: string, bound: any[]): void;
    /**
     * @private
     */
    renderDrawing(canvas?: HTMLCanvasElement, index?: number): void;
    /**
     * @private
     */
    fireAnnotationResize(pageNumber: number, index: string, type: AnnotationType, bounds: any, settings: any, textMarkupContent?: string, tmStartIndex?: number, tmEndIndex?: number, labelSettings?: ShapeLabelSettingsModel, multiPageCollection?: any): void;
    /**
     * @private
     */
    fireAnnotationMove(pageNumber: number, id: string, type: AnnotationType, annotationSettings: any, previousPosition: object, currentPosition: object): void;
    /**
     * @private
     */
    fireAnnotationMouseover(id: string, pageNumber: number, annotationType: AnnotationType, bounds: any, annotation: any, currentPosition: any, mousePosition: any): void;
    /**
     * @private
     */
    fireAnnotationMouseLeave(pageNumber: number): void;
    /**
     * @private
     */
    firePageMouseover(pageX: number, pageY: number): void;
    /**
     * @private
     */
    fireDownloadStart(fileName: string): void;
    /**
     * @private
     */
    fireDownloadEnd(fileName: string, downloadData: string): void;
    /**
     * @private
     */
    firePrintStart(): Promise<void>;
    /**
     * @private
     */
    triggerEvent(eventName: string, args: object): Promise<void | object>;
    /**
     * @private
     */
    firePrintEnd(fileName: string): void;
    /**
     * @private
     */
    fireThumbnailClick(pageNumber: number): void;
    /**
     *
     * @private
     */
    fireBookmarkClick(pageNumber: number, position: number, text: string, fileName: string): void;
    /**
     * @private
     */
    fireImportStart(importData: any): void;
    /**
     * @private
     */
    fireExportStart(exportData: any): void;
    /**
     * @private
     */
    fireImportSuccess(importData: any): void;
    /**
     * @private
     */
    fireExportSuccess(exportData: any, fileName: string): void;
    /**
     * @private
     */
    fireImportFailed(data: any, errorDetails: string): void;
    /**
     * @private
     */
    fireExportFailed(data: any, errorDetails: string): void;
    /**
     * @private
     */
    fireFormImportStarted(data: any): void;
    /**
     * @private
     */
    fireFormExportStarted(data: any): void;
    /**
     * @private
     */
    fireFormImportSuccess(data: any): void;
    /**
     * @private
     */
    fireFormExportSuccess(data: any, fileName: string): void;
    /**
     * @private
     */
    fireFormImportFailed(data: any, errorDetails: string): void;
    /**
     * @private
     */
    fireFormExportFailed(data: any, errorDetails: string): void;
    /**
     * @private
     */
    fireTextExtractionCompleted(documentCollection: DocumentTextCollectionSettingsModel[][]): void;
    /**
     * @private
     */
    fireTextSearchStart(searchText: string, isMatchcase: boolean): void;
    /**
     * @private
     */
    fireTextSearchComplete(searchText: string, isMatchcase: boolean): void;
    /**
     * @private
     */
    fireTextSearchHighlight(searchText: string, isMatchcase: boolean, bounds: RectangleBoundsModel, pageNumber: number): void;
    /**
     * @private
     */
    renderAdornerLayer(bounds: ClientRect, commonStyle: string, cavas: HTMLElement, index: number): void;
    /**
     * @private
     */
    renderSelector(index: number, currentSelector?: AnnotationSelectorSettingsModel): void;
    /**
     * @private
     */
    select(objArray: string[], currentSelector?: AnnotationSelectorSettingsModel, multipleSelection?: boolean, preventUpdate?: boolean): void;
    /**
     * @private
     */
    getPageTable(pageId: number): ZOrderPageTable;
    /**
     * @private
     */
    dragSelectedObjects(diffX: number, diffY: number, pageIndex: number, currentSelector?: AnnotationSelectorSettingsModel, helper?: PdfAnnotationBaseModel): boolean;
    /**
     * @private
     */
    scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean;
    /**
     * @private
     */
    dragConnectorEnds(endPoint: string, obj: IElement, point: PointModel, segment: PointModel, target?: IElement, targetPortId?: string, currentSelector?: AnnotationSelectorSettingsModel): boolean;
    /**
     * @private
     */
    clearSelection(pageId: number): void;
    /**
     * @private
     */
    add(obj: PdfAnnotationBase): PdfAnnotationBaseModel;
    /**
     * @private
     */
    remove(obj: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    copy(): Object;
    /**
     * @private
     */
    rotate(angle: number, currentSelector?: AnnotationSelectorSettingsModel): boolean;
    /**
     * @private
     */
    paste(obj?: PdfAnnotationBaseModel[]): void;
    /**
     * @private
     */
    refresh(): void;
    /**
     * @private
     */
    cut(): void;
    /**
     * @private
     */
    nodePropertyChange(actualObject: PdfAnnotationBaseModel, node: PdfAnnotationBaseModel): void;
    /**
     * @private
     */
    checkBoundaryConstraints(tx: number, ty: number, pageIndex: number, nodeBounds?: Rect, isStamp?: boolean): boolean;
}
