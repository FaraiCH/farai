/**
 * Enum for comment status of the annotation
 */
export var CommentStatus;
(function (CommentStatus) {
    CommentStatus[CommentStatus["None"] = 1] = "None";
    CommentStatus[CommentStatus["Accepted"] = 2] = "Accepted";
    CommentStatus[CommentStatus["Canceled"] = 3] = "Canceled";
    CommentStatus[CommentStatus["Completed"] = 4] = "Completed";
    CommentStatus[CommentStatus["Rejected"] = 5] = "Rejected";
})(CommentStatus || (CommentStatus = {}));
/**
 * Enum for font styles
 */
export var FontStyle;
(function (FontStyle) {
    FontStyle[FontStyle["None"] = 0] = "None";
    FontStyle[FontStyle["Bold"] = 1] = "Bold";
    FontStyle[FontStyle["Italic"] = 2] = "Italic";
    FontStyle[FontStyle["Underline"] = 4] = "Underline";
    FontStyle[FontStyle["Strikethrough"] = 8] = "Strikethrough";
})(FontStyle || (FontStyle = {}));
/**
 * enum for context menu items
 */
export var ContextMenuItem;
(function (ContextMenuItem) {
    ContextMenuItem[ContextMenuItem["Copy"] = 0] = "Copy";
    ContextMenuItem[ContextMenuItem["Highlight"] = 1] = "Highlight";
    ContextMenuItem[ContextMenuItem["Cut"] = 2] = "Cut";
    ContextMenuItem[ContextMenuItem["Underline"] = 4] = "Underline";
    ContextMenuItem[ContextMenuItem["Paste"] = 8] = "Paste";
    ContextMenuItem[ContextMenuItem["Delete"] = 16] = "Delete";
    ContextMenuItem[ContextMenuItem["ScaleRatio"] = 32] = "ScaleRatio";
    ContextMenuItem[ContextMenuItem["Strikethrough"] = 64] = "Strikethrough";
    ContextMenuItem[ContextMenuItem["Properties"] = 128] = "Properties";
    ContextMenuItem[ContextMenuItem["Comment"] = 256] = "Comment";
})(ContextMenuItem || (ContextMenuItem = {}));
/**
 * Enum for signature type
 */
export var SignatureType;
(function (SignatureType) {
    SignatureType["Draw"] = "Draw";
    SignatureType["Type"] = "Type";
    SignatureType["Image"] = "Image";
})(SignatureType || (SignatureType = {}));
/**
 * Enum for annotation resizer location
 */
export var AnnotationResizerLocation;
(function (AnnotationResizerLocation) {
    AnnotationResizerLocation[AnnotationResizerLocation["Corners"] = 1] = "Corners";
    AnnotationResizerLocation[AnnotationResizerLocation["Edges"] = 2] = "Edges";
})(AnnotationResizerLocation || (AnnotationResizerLocation = {}));
/**
 * Enum for cursor type
 */
export var CursorType;
(function (CursorType) {
    CursorType["auto"] = "auto";
    CursorType["crossHair"] = "crosshair";
    CursorType["e_resize"] = "e-resize";
    CursorType["ew_resize"] = "ew-resize";
    CursorType["grab"] = "grab";
    CursorType["grabbing"] = "grabbing";
    CursorType["move"] = "move";
    CursorType["n_resize"] = "n-resize";
    CursorType["ne_resize"] = "ne-resize";
    CursorType["ns_resize"] = "ns-resize";
    CursorType["nw_resize"] = "nw-resize";
    CursorType["pointer"] = "pointer";
    CursorType["s_resize"] = "s-resize";
    CursorType["se_resize"] = "se-resize";
    CursorType["sw_resize"] = "sw-resize";
    CursorType["text"] = "text";
    CursorType["w_resize"] = "w-resize";
})(CursorType || (CursorType = {}));
/**
 * Enum type for Dynamic Stamp Items
 */
export var DynamicStampItem;
(function (DynamicStampItem) {
    DynamicStampItem[DynamicStampItem["Revised"] = 1] = "Revised";
    DynamicStampItem[DynamicStampItem["Reviewed"] = 2] = "Reviewed";
    DynamicStampItem[DynamicStampItem["Received"] = 4] = "Received";
    DynamicStampItem[DynamicStampItem["Approved"] = 8] = "Approved";
    DynamicStampItem[DynamicStampItem["Confidential"] = 16] = "Confidential";
    DynamicStampItem[DynamicStampItem["NotApproved"] = 32] = "NotApproved";
})(DynamicStampItem || (DynamicStampItem = {}));
/**
 * Enum type for Sign Stamp Items
 */
export var SignStampItem;
(function (SignStampItem) {
    SignStampItem[SignStampItem["Witness"] = 1] = "Witness";
    SignStampItem[SignStampItem["InitialHere"] = 2] = "InitialHere";
    SignStampItem[SignStampItem["SignHere"] = 4] = "SignHere";
    SignStampItem[SignStampItem["Accepted"] = 8] = "Accepted";
    SignStampItem[SignStampItem["Rejected"] = 16] = "Rejected";
})(SignStampItem || (SignStampItem = {}));
/**
 * Enum type for Standard Business Stamp Items
 */
export var StandardBusinessStampItem;
(function (StandardBusinessStampItem) {
    StandardBusinessStampItem[StandardBusinessStampItem["Approved"] = 1] = "Approved";
    StandardBusinessStampItem[StandardBusinessStampItem["NotApproved"] = 2] = "NotApproved";
    StandardBusinessStampItem[StandardBusinessStampItem["Draft"] = 4] = "Draft";
    StandardBusinessStampItem[StandardBusinessStampItem["Final"] = 8] = "Final";
    StandardBusinessStampItem[StandardBusinessStampItem["Completed"] = 16] = "Completed";
    StandardBusinessStampItem[StandardBusinessStampItem["Confidential"] = 32] = "Confidential";
    StandardBusinessStampItem[StandardBusinessStampItem["ForPublicRelease"] = 64] = "ForPublicRelease";
    StandardBusinessStampItem[StandardBusinessStampItem["NotForPublicRelease"] = 128] = "NotForPublicRelease";
    StandardBusinessStampItem[StandardBusinessStampItem["ForComment"] = 256] = "ForComment";
    StandardBusinessStampItem[StandardBusinessStampItem["Void"] = 512] = "Void";
    StandardBusinessStampItem[StandardBusinessStampItem["PreliminaryResults"] = 1024] = "PreliminaryResults";
    StandardBusinessStampItem[StandardBusinessStampItem["InformationOnly"] = 2048] = "InformationOnly";
})(StandardBusinessStampItem || (StandardBusinessStampItem = {}));
/**
 * Enum type for allowed interactions for locked annotations
 */
export var AllowedInteraction;
(function (AllowedInteraction) {
    AllowedInteraction["Select"] = "Select";
    AllowedInteraction["Move"] = "Move";
    AllowedInteraction["Resize"] = "Resize";
    AllowedInteraction["Delete"] = "Delete";
    AllowedInteraction["None"] = "None";
    AllowedInteraction["PropertyChange"] = "PropertyChange";
})(AllowedInteraction || (AllowedInteraction = {}));
/**
 * Enum type for export annotation file types
 */
export var AnnotationDataFormat;
(function (AnnotationDataFormat) {
    AnnotationDataFormat["Json"] = "Json";
    AnnotationDataFormat["Xfdf"] = "Xfdf";
})(AnnotationDataFormat || (AnnotationDataFormat = {}));
