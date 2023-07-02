import { Component, INotifyPropertyChanged, ModuleDeclaration, ChildProperty } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { DocumentChangeEventArgs, ViewChangeEventArgs, ZoomFactorChangeEventArgs, StyleType, BeforePaneSwitchEventArgs, LayoutType, FormFieldFillEventArgs, FormFieldData } from './index';
import { SelectionChangeEventArgs, RequestNavigateEventArgs, ContentChangeEventArgs, DocumentEditorKeyDownEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, CommentDeleteEventArgs, BeforeFileOpenArgs, CommentActionEventArgs } from './index';
import { LayoutViewer } from './index';
import { Print, SearchResultsChangeEventArgs } from './index';
import { WParagraphFormat, WCharacterFormat } from './index';
import { SfdtReader } from './index';
import { Selection } from './index';
import { TextPosition } from './index';
import { Editor, EditorHistory } from './index';
import { Search } from './index';
import { OptionsPane } from './index';
import { WordExport } from './index';
import { TextExport } from './index';
import { FormatType, PageFitType, DialogType, FormattingExceptions } from './index';
import { ContextMenu } from './index';
import { ImageResizer } from './index';
import { SfdtExport } from './index';
import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';
import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';
import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';
import { SpellChecker } from './implementation/spell-check/spell-checker';
import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';
import { DocumentEditorModel, ServerActionSettingsModel, DocumentEditorSettingsModel, FormFieldSettingsModel, CollaborativeEditingSettingsModel } from './document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties, DocumentHelper } from './index';
import { PasteOptions } from './index';
import { CommentReviewPane, CheckBoxFormFieldDialog, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, CollaborativeEditing, CollaborativeEditingEventArgs } from './implementation/index';
import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';
import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';
import { FormFillingMode, TrackChangeEventArgs, ServiceFailureArgs } from './base';
import { TrackChangesPane } from './implementation/track-changes/track-changes-pane';
import { RevisionCollection } from './implementation/track-changes/track-changes';
import { NotesDialog } from './implementation/dialogs/notes-dialog';
/**
 * The `DocumentEditorSettings` module is used to provide the customize property of Document Editor.
 */
export declare class DocumentEditorSettings extends ChildProperty<DocumentEditorSettings> {
    /**
     * Specifies the user preferred Search Highlight Color of Document Editor.
     * @default '#FFE97F'
     */
    searchHighlightColor: string;
    /**
     * Specifies the user preferred font family of Document Editor.
     * @default ['Algerian','Arial','Calibri','Cambria','CambriaMath','Candara','CourierNew','Georgia','Impact','SegoePrint','SegoeScript','SegoeUI','Symbol','TimesNewRoman','Verdana','Windings']
     */
    fontFamilies: string[];
    /**
     * Form field settings.
     */
    formFieldSettings: FormFieldSettingsModel;
    /**
     * Collaborative editing settings.
     */
    collaborativeEditingSettings: CollaborativeEditingSettingsModel;
}
/**
 * The Document editor component is used to draft, save or print rich text contents as page by page.
 */
export declare class DocumentEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    private enableHeaderFooterIn;
    /**
     * @private
     */
    enableHeaderAndFooter: boolean;
    /**
     * @private
     */
    viewer: LayoutViewer;
    /**
     * @private
     */
    documentHelper: DocumentHelper;
    /**
     * @private
     */
    isShiftingEnabled: boolean;
    /**
     * @private
     */
    isLayoutEnabled: boolean;
    /**
     * @private
     */
    isPastingContent: boolean;
    /**
     * @private
     */
    parser: SfdtReader;
    private isDocumentLoadedIn;
    private disableHistoryIn;
    /**
     * @private
     */
    findResultsList: string[];
    /**
     * @private
     */
    printModule: Print;
    /**
     * @private
     */
    sfdtExportModule: SfdtExport;
    /**
     * @private
     */
    selectionModule: Selection;
    /**
     * @private
     */
    editorModule: Editor;
    /**
     * @private
     */
    wordExportModule: WordExport;
    /**
     * @private
     */
    textExportModule: TextExport;
    /**
     * @private
     */
    editorHistoryModule: EditorHistory;
    /**
     * @private
     */
    tableOfContentsDialogModule: TableOfContentsDialog;
    /**
     * @private
     */
    tablePropertiesDialogModule: TablePropertiesDialog;
    /**
     * @private
     */
    bordersAndShadingDialogModule: BordersAndShadingDialog;
    /**
     * @private
     */
    listDialogModule: ListDialog;
    /**
     * @private
     */
    styleDialogModule: StyleDialog;
    /**
     * @private
     */
    cellOptionsDialogModule: CellOptionsDialog;
    /**
     * @private
     */
    tableOptionsDialogModule: TableOptionsDialog;
    /**
     * @private
     */
    tableDialogModule: TableDialog;
    /**
     * @private
     */
    spellCheckDialogModule: SpellCheckDialog;
    /**
     * @private
     */
    pageSetupDialogModule: PageSetupDialog;
    /**
     * @private
     */
    footNotesDialogModule: NotesDialog;
    /**
     * @private
     */
    paragraphDialogModule: ParagraphDialog;
    /**
     * @private
     */
    checkBoxFormFieldDialogModule: CheckBoxFormFieldDialog;
    /**
     * @private
     */
    textFormFieldDialogModule: TextFormFieldDialog;
    /**
     * @private
     */
    dropDownFormFieldDialogModule: DropDownFormFieldDialog;
    /**
     * @private
     */
    optionsPaneModule: OptionsPane;
    /**
     * @private
     */
    hyperlinkDialogModule: HyperlinkDialog;
    /**
     * @private
     */
    bookmarkDialogModule: BookmarkDialog;
    /**
     * @private
     */
    stylesDialogModule: StylesDialog;
    /**
     * @private
     */
    contextMenuModule: ContextMenu;
    /**
     * @private
     */
    imageResizerModule: ImageResizer;
    /**
     * @private
     */
    searchModule: Search;
    private createdTriggered;
    /**
     * Collaborative editing module
     */
    collaborativeEditingModule: CollaborativeEditing;
    /**
     * Default Paste Formatting Options
     * @default KeepSourceFormatting
     */
    defaultPasteOption: PasteOptions;
    /**
     * Layout Type
     * @default Pages
     */
    layoutType: LayoutType;
    /**
     * Current User
     * @default ''
     */
    currentUser: string;
    /**
     * User Selection Highlight Color
     * @default '#FFFF00'
     */
    userColor: string;
    /**
     * Gets or sets the page gap value in document editor
     * @default 20
     */
    pageGap: number;
    /**
     * Gets or sets the name of the document.
     * @default ''
     */
    documentName: string;
    /**
     * @private
     */
    spellCheckerModule: SpellChecker;
    /**
     * Defines the width of the DocumentEditor component
     * @default '100%'
     */
    width: string;
    /**
     * Defines the height of the DocumentEditor component
     * @default '200px'
     */
    height: string;
    /**
     * Sfdt Service URL
     * @default ''
     */
    serviceUrl: string;
    /**
     * Gets or sets the zoom factor in document editor.
     * @default 1
     */
    zoomFactor: number;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 2000
     * @aspType int
     */
    zIndex: number;
    /**
     * Gets or sets a value indicating whether the document editor is in read only state or not.
     * @default true
     */
    isReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether print needs to be enabled or not.
     * @default false
     */
    enablePrint: boolean;
    /**
     * Gets or sets a value indicating whether selection needs to be enabled or not.
     * @default false
     */
    enableSelection: boolean;
    /**
     * Gets or sets a value indicating whether editor needs to be enabled or not.
     * @default false
     */
    enableEditor: boolean;
    /**
     * Gets or sets a value indicating whether editor history needs to be enabled or not.
     * @default false
     */
    enableEditorHistory: boolean;
    /**
     * Gets or sets a value indicating whether Sfdt export needs to be enabled or not.
     * @default false
     */
    enableSfdtExport: boolean;
    /**
     * Gets or sets a value indicating whether word export needs to be enabled or not.
     * @default false
     */
    enableWordExport: boolean;
    /**
     * Gets or sets a value indicating whether text export needs to be enabled or not.
     * @default false
     */
    enableTextExport: boolean;
    /**
     * Gets or sets a value indicating whether options pane is enabled or not.
     * @default false
     */
    enableOptionsPane: boolean;
    /**
     * Gets or sets a value indicating whether context menu is enabled or not.
     * @default false
     */
    enableContextMenu: boolean;
    /**
     * Gets or sets a value indicating whether hyperlink dialog is enabled or not.
     * @default false
     */
    enableHyperlinkDialog: boolean;
    /**
     * Gets or sets a value indicating whether bookmark dialog is enabled or not.
     * @default false
     */
    enableBookmarkDialog: boolean;
    /**
     * Gets or sets a value indicating whether table of contents dialog is enabled or not.
     * @default false
     */
    enableTableOfContentsDialog: boolean;
    /**
     * Gets or sets a value indicating whether search module is enabled or not.
     * @default false
     */
    enableSearch: boolean;
    /**
     * Gets or sets a value indicating whether paragraph dialog is enabled or not.
     * @default false
     */
    enableParagraphDialog: boolean;
    /**
     * Gets or sets a value indicating whether list dialog is enabled or not.
     * @default false
     */
    enableListDialog: boolean;
    /**
     * Gets or sets a value indicating whether table properties dialog is enabled or not.
     * @default false
     */
    enableTablePropertiesDialog: boolean;
    /**
     * Gets or sets a value indicating whether borders and shading dialog is enabled or not.
     * @default false
     */
    enableBordersAndShadingDialog: boolean;
    /**
     * Gets or sets a value indicating whether notes dialog is enabled or not.
     * @default false
     */
    enableFootnoteAndEndnoteDialog: boolean;
    /**
     * Gets or sets a value indicating whether margin dialog is enabled or not.
     * @default false
     */
    enablePageSetupDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    enableStyleDialog: boolean;
    /**
     * Gets or sets a value indicating whether font dialog is enabled or not.
     * @default false
     */
    enableFontDialog: boolean;
    /**
     * @private
     */
    fontDialogModule: FontDialog;
    /**
     * Gets or sets a value indicating whether table options dialog is enabled or not.
     * @default false
     */
    enableTableOptionsDialog: boolean;
    /**
     * Gets or sets a value indicating whether table dialog is enabled or not.
     * @default false
     */
    enableTableDialog: boolean;
    /**
     * Gets or sets a value indicating whether image resizer is enabled or not.
     * @default false
     */
    enableImageResizer: boolean;
    /**
     * Gets or sets a value indicating whether editor need to be spell checked.
     * @default false
     */
    enableSpellCheck: boolean;
    /**
     * Gets or set a value indicating whether comment is enabled or not
     * @default false
     */
    enableComment: boolean;
    /**
     * Gets or set a value indicating whether track changes is enabled or not
     * @default false
     */
    enableTrackChanges: boolean;
    /**
     * Gets or set a value indicating whether form fields is enabled or not.
     * @default false
     */
    enableFormField: boolean;
    /**
     * Gets or Sets a value indicating whether tab key can be accepted as input or not.
     * @default false
     */
    acceptTab: boolean;
    /**
     * Gets or Sets a value indicating whether holding Ctrl key is required to follow hyperlink on click. The default value is true.
     * @default true
     */
    useCtrlClickToFollowHyperlink: boolean;
    /**
     * Gets or sets the page outline color.
     * @default '#000000'
     */
    pageOutline: string;
    /**
     * Gets or sets a value indicating whether to enable cursor in document editor on read only state or not. The default value is false.
     * @default false
     */
    enableCursorOnReadOnly: boolean;
    /**
     * Gets or sets a value indicating whether local paste needs to be enabled or not.
     * @default false
     */
    enableLocalPaste: boolean;
    /**
     * Enable partial lock and edit module.
     * @default false
     */
    enableLockAndEdit: boolean;
    /**
     * Defines the settings for DocumentEditor customization.
     * @default {}
     */
    documentEditorSettings: DocumentEditorSettingsModel;
    /**
     * Defines the settings of the DocumentEditor services
     */
    serverActionSettings: ServerActionSettingsModel;
    /**
     * Add custom headers to XMLHttpRequest.
     * @default []
     */
    headers: object[];
    /**
     * Show comment in the document.
     * @default false
     */
    showComments: boolean;
    /**
     * Shows revision changes in the document.
     * @default false
     */
    showRevisions: boolean;
    /**
     * Triggers whenever document changes in the document editor.
     * @event
     * @blazorproperty 'DocumentChanged'
     */
    documentChange: EmitType<DocumentChangeEventArgs>;
    /**
     * Triggers whenever container view changes in the document editor.
     * @event
     * @blazorproperty 'ViewChanged'
     */
    viewChange: EmitType<ViewChangeEventArgs>;
    /**
     * Triggers whenever zoom factor changes in the document editor.
     * @event
     * @blazorproperty 'ZoomFactorChanged'
     */
    zoomFactorChange: EmitType<ZoomFactorChangeEventArgs>;
    /**
     * Triggers whenever selection changes in the document editor.
     * @event
     * @blazorproperty 'SelectionChanged'
     */
    selectionChange: EmitType<SelectionChangeEventArgs>;
    /**
     * Triggers whenever hyperlink is clicked or tapped in the document editor.
     * @event
     * @blazorproperty 'OnRequestNavigate'
     */
    requestNavigate: EmitType<RequestNavigateEventArgs>;
    /**
     * Triggers whenever content changes in the document editor.
     * @event
     * @blazorproperty 'ContentChanged'
     */
    contentChange: EmitType<ContentChangeEventArgs>;
    /**
     * Triggers whenever key is pressed in the document editor.
     * @event
     * @blazorproperty 'OnKeyDown'
     */
    keyDown: EmitType<DocumentEditorKeyDownEventArgs>;
    /**
     * Triggers whenever search results changes in the document editor.
     * @event
     * @blazorproperty 'SearchResultsChanged'
     */
    searchResultsChange: EmitType<SearchResultsChangeEventArgs>;
    /**
     * Triggers when the component is created
     * @event
     * @blazorproperty 'Created'
     */
    created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    destroyed: EmitType<Object>;
    /**
     * Triggers while selecting the custom context-menu option.
     * @event
     * @blazorproperty 'ContextMenuItemSelected'
     */
    customContextMenuSelect: EmitType<CustomContentMenuEventArgs>;
    /**
     * Triggers before opening the custom context-menu option.
     * @event
     * @blazorproperty 'OnContextMenuOpen'
     */
    customContextMenuBeforeOpen: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;
    /**
     * Triggers before opening comment pane.
     * @event
     * @blazorproperty 'BeforePaneSwitch'
     */
    beforePaneSwitch: EmitType<BeforePaneSwitchEventArgs>;
    /**
     * Triggers after inserting comment.
     * @blazorproperty 'OnCommentBegin'
     * @event
     */
    commentBegin: EmitType<Object>;
    /**
     * Triggers after posting comment.
     * @event
     * @blazorproperty 'AfterCommentEnd'
     */
    commentEnd: EmitType<Object>;
    /**
     * Triggers before a file is opened.
     * @event
     * @blazorproperty 'onBeforeFileOpen'
     */
    beforeFileOpen: EmitType<BeforeFileOpenArgs>;
    /**
     * Triggers after inserting comment.
     * @blazorproperty 'OnCommentDelete'
     * @event
     */
    commentDelete: EmitType<CommentDeleteEventArgs>;
    /**
     * Triggers on comment actions(Post, edit, reply, resolve, reopen).
     * @event
     */
    beforeCommentAction: EmitType<CommentActionEventArgs>;
    /**
     * Triggers when TrackChanges enabled / disabled.
     * @blazorproperty 'OnTrackChange'
     * @event
     */
    trackChange: EmitType<TrackChangeEventArgs>;
    /**
     * Triggers before form field fill.
     * @event
     */
    beforeFormFieldFill: EmitType<FormFieldFillEventArgs>;
    /**
     * Triggers when the server side action fails.
     * @event
     */
    serviceFailure: EmitType<ServiceFailureArgs>;
    /**
     * Triggers after form field fill.
     * @event
     */
    afterFormFieldFill: EmitType<FormFieldFillEventArgs>;
    /**
     * Triggers when the document editor collaborative actions (such as LockContent, SaveContent, UnlockContent) gets completed.
     * @event
     */
    actionComplete: EmitType<CollaborativeEditingEventArgs>;
    /**
     * Triggers when user interaction prevented in content control.
     * @event
     */
    contentControl: EmitType<Object>;
    /**
     * @private
     */
    characterFormat: CharacterFormatProperties;
    /**
     * @private
     */
    paragraphFormat: ParagraphFormatProperties;
    /**
     * @private
     */
    sectionFormat: SectionFormatProperties;
    /**
     * @private
     */
    commentReviewPane: CommentReviewPane;
    /**
     * @private
     */
    trackChangesPane: TrackChangesPane;
    /**
     * @private
     */
    revisionsInternal: RevisionCollection;
    /**
     * Gets the total number of pages.
     * @blazorType int
     * @returns {number}
     */
    readonly pageCount: number;
    /**
     *  Gets the selection object of the document editor.
     * @aspType Selection
     * @blazorType Selection
     * @returns {Selection}
     * @default undefined
     */
    readonly selection: Selection;
    /**
     *  Gets the editor object of the document editor.
     * @aspType Editor
     * @blazorType Editor
     * @returns {Editor}
     * @default undefined
     */
    readonly editor: Editor;
    /**
     * Gets the editor history object of the document editor.
     * @aspType EditorHistory
     * @blazorType EditorHistory
     * @returns {EditorHistory}
     */
    readonly editorHistory: EditorHistory;
    /**
     * Gets the search object of the document editor.
     * @aspType Search
     * @blazorType Search
     * @returns { Search }
     */
    readonly search: Search;
    /**
     * Gets the context menu object of the document editor.
     * @aspType ContextMenu
     * @blazorType ContextMenu
     * @returns {ContextMenu}
     */
    readonly contextMenu: ContextMenu;
    /**
     * Gets the spell check dialog object of the document editor.
     * @returns SpellCheckDialog
     */
    readonly spellCheckDialog: SpellCheckDialog;
    /**
     * Gets the spell check object of the document editor.
     * @aspType SpellChecker
     * @blazorType SpellChecker
     * @returns SpellChecker
     */
    readonly spellChecker: SpellChecker;
    /**
     * @private
     */
    readonly containerId: string;
    /**
     * @private
     */
    isDocumentLoaded: boolean;
    /**
     * Gets the revision collection which contains information about changes made from original document
     */
    readonly revisions: RevisionCollection;
    /**
     * Determines whether history needs to be enabled or not.
     * @default - false
     * @private
     */
    readonly enableHistoryMode: boolean;
    /**
     * Gets the start text position in the document.
     * @default undefined
     * @private
     */
    readonly documentStart: TextPosition;
    /**
     * Gets the end text position in the document.
     * @default undefined
     * @private
     */
    readonly documentEnd: TextPosition;
    /**
     * @private
     */
    readonly isReadOnlyMode: boolean;
    /**
     * @private
     */
    readonly isSpellCheck: boolean;
    /**
     * Specifies to enable image resizer option
     * default - false
     * @private
     */
    readonly enableImageResizerMode: boolean;
    /**
     * Initialize the constructor of DocumentEditor
     */
    constructor(options?: DocumentEditorModel, element?: string | HTMLElement);
    protected preRender(): void;
    protected render(): void;
    /**
     * Get component name
     * @private
     */
    getModuleName(): string;
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(model: DocumentEditorModel, oldProp: DocumentEditorModel): void;
    private localizeDialogs;
    /**
     * Set the default character format for document editor
     * @param characterFormat
     */
    setDefaultCharacterFormat(characterFormat: CharacterFormatProperties): void;
    /**
     * Set the default paragraph format for document editor
     * @param paragraphFormat
     */
    setDefaultParagraphFormat(paragraphFormat: ParagraphFormatProperties): void;
    /**
     * Set the default section format for document editor
     * @param sectionFormat
     */
    setDefaultSectionFormat(sectionFormat: SectionFormatProperties): void;
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData(): string;
    private clearPreservedCollectionsInViewer;
    /**
     * @private
     */
    getDocumentEditorElement(): HTMLElement;
    /**
     * @private
     */
    fireContentChange(): void;
    /**
     * @private
     */
    fireDocumentChange(): void;
    /**
     * @private
     */
    fireSelectionChange(): void;
    /**
     * @private
     */
    fireZoomFactorChange(): void;
    /**
     * @private
     */
    fireBeformFieldFill(): void;
    /**
     * @private
     */
    fireAfterFormFieldFill(): void;
    /**
     * @private
     */
    fireServiceFailure(eventArgs: ServiceFailureArgs): void;
    /**
     * @private
     */
    fireViewChange(): void;
    /**
     * @private
     */
    fireCustomContextMenuSelect(item: string): void;
    /**
     * @private
     */
    fireCustomContextMenuBeforeOpen(item: string[]): void;
    /**
     * Shows the Paragraph dialog
     * @private
     */
    showParagraphDialog(paragraphFormat?: WParagraphFormat): void;
    /**
     * Shows the margin dialog
     * @private
     */
    showPageSetupDialog(): void;
    /**
     * Shows the Footnote dialog
     * @private
     */
    showFootNotesDialog(): void;
    /**
     * Shows the font dialog
     * @private
     */
    showFontDialog(characterFormat?: WCharacterFormat): void;
    /**
     * Shows the cell option dialog
     * @private
     */
    showCellOptionsDialog(): void;
    /**
     * Shows the table options dialog.
     * @private
     */
    showTableOptionsDialog(): void;
    /**
     * Shows insert table dialog
     * @private
     */
    showTableDialog(): void;
    /**
     * Shows the table of content dialog
     * @private
     */
    showTableOfContentsDialog(): void;
    /**
     * Shows the style dialog
     * @private
     */
    showStyleDialog(): void;
    /**
     * Shows the hyperlink dialog
     * @private
     */
    showHyperlinkDialog(): void;
    /**
     * Shows the bookmark dialog.
     * @private
     */
    showBookmarkDialog(): void;
    /**
     * Shows the styles dialog.
     * @private
     */
    showStylesDialog(): void;
    /**
     * Shows the List dialog
     * @private
     */
    showListDialog(): void;
    /**
     * Shows the table properties dialog
     * @private
     */
    showTablePropertiesDialog(): void;
    /**
     * Shows the borders and shading dialog
     * @private
     */
    showBordersAndShadingDialog(): void;
    protected requiredModules(): ModuleDeclaration[];
    /**
     * @private
     */
    defaultLocale: Object;
    /**
     * Opens the given Sfdt text.
     * @param {string} sfdtText.
     */
    open(sfdtText: string): void;
    /**
     * Scrolls view to start of the given page number if exists.
     * @param  {number} pageNumber.
     * @returns void
     */
    scrollToPage(pageNumber: number): boolean;
    /**
     * Enables all the modules.
     * @returns void
     */
    enableAllModules(): void;
    /**
     * Resizes the component and its sub elements based on given size or container size.
     * @param width
     * @param height
     */
    resize(width?: number, height?: number): void;
    /**
     * Get all form field names.
     */
    getFormFieldNames(): string[];
    /**
     * Get form field by name
     * @param name - Form field name.
     */
    getFormFieldInfo(name: string): TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo;
    /**
     * Set form field.
     * @param name - Form field name.
     * @param formFieldInfo - Form Field info
     */
    setFormFieldInfo(name: string, formFieldInfo: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void;
    /**
     * Reset form field value to default.
     * @param name - specify form field name
     */
    resetFormFields(name?: string): void;
    /**
     * Import form field values.
     * @param - formDate  - { FormFieldData[] }
     */
    importFormData(formData: FormFieldData[]): void;
    /**
     * Export form field values.
     * @returns - { FormFieldData[] }
     */
    exportFormData(): FormFieldData[];
    /**
     * Updated fields in document.
     * Currently cross reference field only supported.
     */
    updateFields(): void;
    /**
     * Shifts the focus to the document.
     */
    focusIn(): void;
    /**
     * Fits the page based on given fit type.
     * @param  {PageFitType} pageFitType? - Default value of ‘pageFitType’ parameter is 'None'
     * @returns void
     */
    fitPage(pageFitType?: PageFitType): void;
    /**
     * Prints the document.
     * @param  {Window} printWindow? - Default value of 'printWindow' parameter is undefined.
     */
    print(printWindow?: Window): void;
    /**
     * Serialize the data to JSON string.
     */
    serialize(): string;
    /**
     * Saves the document.
     * @param {string} fileName
     * @param {FormatType} formatType
     */
    save(fileName: string, formatType?: FormatType): void;
    /**
     * Saves the document as blob.
     * @param {FormatType} formatType
     */
    saveAsBlob(formatType?: FormatType): Promise<Blob>;
    /**
     * Opens a blank document.
     */
    openBlank(): void;
    /**
     * Gets the style names based on given style type.
     * @param styleType
     */
    getStyleNames(styleType?: StyleType): string[];
    /**
     * Gets the style objects on given style type.
     * @param styleType
     */
    getStyles(styleType?: StyleType): Object[];
    /**
     * Gets the bookmarks.
     */
    getBookmarks(): string[];
    /**
     * Shows the dialog.
     * @param {DialogType} dialogType
     * @returns void
     */
    showDialog(dialogType: DialogType): void;
    /**
     * Shows the options pane.
     */
    showOptionsPane(): void;
    /**
     * Shows the restrict editing pane.
     */
    showRestrictEditingPane(): void;
    /**
     * Shows the spell check dialog.
     * @private
     */
    showSpellCheckDialog(): void;
    /**
     * Destroys all managed resources used by this object.
     */
    destroy(): void;
    private destroyDependentModules;
}
/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor.
 */
export declare class ServerActionSettings extends ChildProperty<ServerActionSettings> {
    /**
     * Specifies the system clipboard action of Document Editor.
     * @default 'SystemClipboard'
     */
    systemClipboard: string;
    /**
     * Specifies the spell check action of Document Editor.
     * @default 'SpellCheck'
     */
    spellCheck: string;
    /**
     * Specifies the restrict editing encryption/decryption action of Document Editor.
     * @default 'RestrictEditing'
     */
    restrictEditing: string;
    /**
     * Specifies the server action name to lock selected region.
     * @default 'CanLock'
     */
    canLock: string;
    /**
     * Specified the server action name to pull pending actions.
     * @default 'GetPendingActions'
     */
    getPendingActions: string;
}
/**
 * Form field settings.
 */
export declare class FormFieldSettings extends ChildProperty<FormFieldSettings> {
    /**
     * Get or Set form fields shading color.
     * You can customize shading color in application level, but cannot be exported in file level
     * @default '#cfcfcf'
     */
    shadingColor: string;
    /**
     * Get or Set whether apply shadings for field or not.
     * @default true
     */
    applyShading: boolean;
    /**
     * Get or Set field selection color.
     * @default '#cccccc'
     */
    selectionColor: string;
    /**
     * Get or Set form filling mode type.
     * @default 'Popup'
     */
    formFillingMode: FormFillingMode;
    /**
     * Get or Set formatting exception.
     * @default []
     */
    formattingExceptions: FormattingExceptions[];
}
/**
 * Collaborative editing settings.
 */
export declare class CollaborativeEditingSettings extends ChildProperty<CollaborativeEditingSettings> {
    /**
     * Get or set collaborative editing room name.
     * @default ''
     */
    roomName: string;
    /**
     * Get or set editable region color.
     */
    editableRegionColor: string;
    /**
     * Get or set locked region color.
     */
    lockedRegionColor: string;
    /**
     * Get or set timeout for syncing content in milliseconds.
     */
    saveTimeout: number;
}
/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor Container.
 */
export declare class ContainerServerActionSettings extends ServerActionSettings {
    /**
     * Specifies the load action of Document Editor.
     * @default 'Import'
     */
    import: string;
}
