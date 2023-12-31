import { IRichTextEditor } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Uploader } from '@syncfusion/ej2-inputs';
import { Dialog } from '@syncfusion/ej2-popups';
/**
 * `Image` module is used to handle image actions.
 */
export declare class Image {
    element: HTMLElement;
    private rteID;
    private parent;
    dialogObj: Dialog;
    private popupObj;
    uploadObj: Uploader;
    private i10n;
    private inputUrl;
    private captionEle;
    private checkBoxObj;
    private uploadUrl;
    private contentModule;
    private rendererFactory;
    private quickToolObj;
    private imgResizeDiv;
    private imgDupPos;
    private resizeBtnStat;
    private imgEle;
    private isImgUploaded;
    private pageX;
    private pageY;
    private dialogRenderObj;
    private deletedImg;
    constructor(parent?: IRichTextEditor, serviceLocator?: ServiceLocator);
    protected addEventListener(): void;
    protected removeEventListener(): void;
    private onIframeMouseDown;
    private afterRender;
    private undoStack;
    private resizeEnd;
    private resizeStart;
    private imageClick;
    private onCutHandler;
    private imageResize;
    private getPointX;
    private getPointY;
    private imgResizePos;
    private calcPos;
    private setAspectRatio;
    private pixToPerc;
    private imgDupMouseMove;
    private resizing;
    private cancelResizeAction;
    private resizeImgDupPos;
    private resizeBtnInit;
    private onToolbarAction;
    private openImgLink;
    private editImgLink;
    private removeImgLink;
    private onKeyDown;
    private onKeyUp;
    private checkImageBack;
    private checkImageDel;
    private alignmentSelect;
    private imageWithLinkQTBarItemUpdate;
    private showImageQuickToolbar;
    private hideImageQuickToolbar;
    private editAreaClickHandler;
    private insertImgLink;
    private insertAltText;
    private insertAlt;
    private insertlink;
    private isUrl;
    private deleteImg;
    private imageRemovePost;
    private caption;
    private imageSize;
    private break;
    private inline;
    private alignImage;
    private imagDialog;
    private cancelDialog;
    private onDocumentClick;
    private removeResizeEle;
    private imageUrlPopup;
    private insertImageUrl;
    private imgsizeInput;
    private insertSize;
    private insertImage;
    private imgUpload;
    private checkExtension;
    private fileSelect;
    private dragStart;
    private dragEnter;
    private dragOver;
    /**
     * USed to set range When drop an image
     */
    private dragDrop;
    /**
     * Used to calculate range on internet explorer
     */
    private getDropRange;
    private insertDragImage;
    private onSelect;
    /**
     * Rendering uploader and popup for drag and drop
     */
    private uploadMethod;
    private refreshPopup;
    /**
     * Called when drop image upload was failed
     */
    private uploadFailure;
    /**
     * Called when drop image upload was successful
     */
    private uploadSuccess;
    private imagePaste;
    private showPopupToolBar;
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden
     * @deprecated
     */
    destroy(): void;
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName;
}
