import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { XmlWriter } from '@syncfusion/ej2-file-utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HelperMethods } from '../index';
import { Dictionary } from '../../index';
/**
 * Exports the document to Word format.
 */
var WordExport = /** @class */ (function () {
    function WordExport() {
        //Part path
        this.customXMLItemsPath = 'customXml/item';
        this.customXMLItemsPropspath = 'customXml/itemProps';
        this.itemPropsPath = 'itemProps';
        this.documentPath = 'word/document.xml';
        this.stylePath = 'word/styles.xml';
        this.chartPath = 'word/charts';
        this.numberingPath = 'word/numbering.xml';
        this.settingsPath = 'word/settings.xml';
        this.headerPath = 'word/header';
        this.footerPath = 'word/footer';
        //private commentsPath: string = 'word/comments.xml';
        this.imagePath = 'word/media/image';
        this.footnotesPath = 'word/footnotes.xml';
        this.endnotesPath = 'word/endnotes.xml';
        this.appPath = 'docProps/app.xml';
        this.corePath = 'docProps/core.xml';
        // private CustomPath: string = 'docProps/custom.xml';
        // private FontTablePath: string = 'word/fontTable.xml';
        this.contentTypesPath = '[Content_Types].xml';
        // private ChartsPath: string = 'word/charts/';
        this.defaultEmbeddingPath = 'word/embeddings/';
        this.commentsPath = 'word/comments.xml';
        this.commentsExtendedPath = 'word/commentsExtended.xml';
        // private EmbeddingPath:string = 'word\embeddings\';
        // private DrawingPath:string = 'word\drawings\';
        // private ThemePath: string = 'word/theme/theme1.xml';
        // private FontsPath:string = 'word\fonts\';
        // private DiagramPath:string = "word/diagrams/';
        // private ControlPath:string = "word/activeX/';
        // private VbaProject: string = 'vbaProject.bin';
        // private VbaData: string = 'vbaData.xml';
        // private VbaProjectPath: string = 'word/vbaProject.bin';
        // private VbaDataPath: string = 'word/vbaData.xml';
        // private CustomXMLPath:string = 'customXml\';
        //Relationship path
        this.generalRelationPath = '_rels/.rels';
        this.wordRelationPath = 'word/_rels/document.xml.rels';
        this.customXMLRelPath = 'customXml/_rels/item';
        this.excelRelationPath = 'xl/_rels/workbook.xml.rels';
        // private FontRelationPath: string = 'word/_rels/fontTable.xml.rels';
        // private CommentsRelationPath: string = 'word/_rels/comments.xml.rels';
        this.footnotesRelationPath = 'word/_rels/footnotes.xml.rels';
        this.endnotesRelationPath = 'word/_rels/endnotes.xml.rels';
        // private NumberingRelationPath: string = 'word/_rels/numbering.xml.rels';
        this.headerRelationPath = 'word/_rels/header';
        this.footerRelationPath = 'word/_rels/footer';
        // private SettingsRelationpath: string = 'word/_rels/settings.xml.rels';
        // private VbaProjectRelsPath: string = 'word/_rels/vbaProject.bin.rels';
        //Content type of the parts
        this.xmlContentType = 'application/xml';
        this.fontContentType = 'application/vnd.openxmlformats-officedocument.obfuscatedFont';
        this.documentContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';
        // private TemplateContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml';
        // private CommentsContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml';
        this.settingsContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml';
        this.commentsContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml';
        this.commentsExContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml';
        this.endnoteContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml';
        // private FontTableContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml';
        this.footerContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml';
        this.footnoteContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml';
        // private GlossaryDocumentContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml';
        this.headerContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml';
        this.numberingContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml';
        this.stylesContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml';
        this.webSettingsContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml';
        this.appContentType = 'application/vnd.openxmlformats-officedocument.extended-properties+xml';
        this.coreContentType = 'application/vnd.openxmlformats-package.core-properties+xml';
        this.customContentType = 'application/vnd.openxmlformats-officedocument.custom-properties+xml';
        this.customXmlContentType = 'application/vnd.openxmlformats-officedocument.customXmlProperties+xml';
        this.relationContentType = 'application/vnd.openxmlformats-package.relationships+xml';
        // private DiagramColor: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml';
        // private DiagramData: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml';
        // private DiagramLayout: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml';
        // private DiagramStyle: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml';
        this.chartsContentType = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml';
        // private ThemeContentType: string = 'application/vnd.openxmlformats-officedocument.theme+xml';
        // private ChartDrawingContentType: string = 'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml';
        // private ActiveXContentType: string = 'application/vnd.ms-office.activeX+xml';
        // private ActiveXBinContentType: string = 'application/vnd.ms-office.activeX';
        this.tableStyleContentType = 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml';
        // private ChartStyleContentType: string = 'application/vnd.ms-office.chartstyle+xml';
        this.chartColorStyleContentType = 'application/vnd.ms-office.chartcolorstyle+xml';
        // private VbaProjectContentType: string = 'application/vnd.ms-office.vbaProject';
        // private VbaDataContentType: string = 'application/vnd.ms-word.vbaData+xml';
        // private MacroDocumentContentType: string = 'application/vnd.ms-word.document.macroEnabled.main+xml';
        // private MacroTemplateContentType: string = 'application/vnd.ms-word.template.macroEnabledTemplate.main+xml';
        // private OleObjectContentType: string = 'application/vnd.openxmlformats-officedocument.oleObject';
        // Relationship types of document parts
        // private AltChunkRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk';
        this.commentsRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments';
        this.commentsExRelType = 'http://schemas.microsoft.com/office/2011/relationships/commentsExtended';
        this.settingsRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings';
        this.endnoteRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes';
        // private FontTableRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable';
        this.footerRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer';
        this.footnoteRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes';
        this.headerRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header';
        this.documentRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
        this.numberingRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering';
        this.stylesRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';
        // private OleObjectRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject';
        this.chartRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart';
        // private ThemeRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme';
        this.fontRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/font';
        this.tableStyleRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles';
        this.coreRelType = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties';
        this.appRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties';
        this.customRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties';
        this.imageRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
        this.hyperlinkRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';
        this.controlRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/control';
        this.packageRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';
        // private VbaProjectRelType: string = 'http://schemas.microsoft.com/office/2006/relationships/vbaProject';
        // private VbaDataRelType: string = 'http://schemas.microsoft.com/office/2006/relationships/wordVbaData';
        this.customXmlRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml';
        this.customUIRelType = 'http://schemas.microsoft.com/office/2006/relationships/ui/extensibility';
        this.attachedTemplateRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/attachedTemplate';
        this.chartColorStyleRelType = 'http://schemas.microsoft.com/office/2011/relationships/chartColorStyle';
        // private ChartStyleRelType: string = 'http://schemas.microsoft.com/office/2011/relationships/chartStyle';
        // private ChartUserShapesRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartUserShapes';
        // private ChartContentType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';
        // Namespaces
        // private PKG_namespace: string = 'http://schemas.microsoft.com/office/2006/xmlPackage';
        this.wNamespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        this.wpNamespace = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';
        this.pictureNamespace = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
        this.aNamespace = 'http://schemas.openxmlformats.org/drawingml/2006/main';
        this.a14Namespace = 'http://schemas.microsoft.com/office/drawing/2010/main';
        // private SVG_namespace: string = 'http://schemas.microsoft.com/office/drawing/2016/SVG/main';
        this.rNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
        this.rpNamespace = 'http://schemas.openxmlformats.org/package/2006/relationships';
        this.vNamespace = 'urn:schemas-microsoft-com:vml';
        this.oNamespace = 'urn:schemas-microsoft-com:office:office';
        this.xmlNamespace = 'http://www.w3.org/XML/1998/namespace';
        this.w10Namespace = 'urn:schemas-microsoft-com:office:word';
        this.cpNamespace = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties';
        this.dcNamespace = 'http://purl.org/dc/elements/1.1/';
        // private DCTERMS_namespace: string = 'http://purl.org/dc/terms/';
        // private XSI_namespace: string = 'http://www.w3.org/2001/XMLSchema-instance';
        this.docPropsNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
        this.veNamespace = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
        this.mNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/math';
        this.wneNamespace = 'http://schemas.microsoft.com/office/word/2006/wordml';
        // private DCMI_namespace: string = 'http://purl.org/dc/dcmitype/';
        this.customPropsNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties';
        this.vtNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';
        this.chartNamespace = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
        this.slNamespace = 'http://schemas.openxmlformats.org/schemaLibrary/2006/main';
        //2003WML namespace
        // private amlNamespace: string = 'http://schemas.microsoft.com/aml/2001/core';
        this.dtNamespace = 'uuid:C2F41010-65B3-11d1-A29F-00AA00C14882';
        this.wmlNamespace = 'http://schemas.microsoft.com/office/word/2003/wordml';
        //2010 namespaces
        this.w14Namespace = 'http://schemas.microsoft.com/office/word/2010/wordml';
        this.wpCanvasNamespace = 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas';
        this.wpDrawingNamespace = 'http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing';
        this.wpGroupNamespace = 'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup';
        this.wpInkNamespace = 'http://schemas.microsoft.com/office/word/2010/wordprocessingInk';
        this.wpShapeNamespace = 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape';
        //2013 namespaces
        this.w15Namespace = 'http://schemas.microsoft.com/office/word/2012/wordml';
        this.diagramNamespace = 'http://schemas.openxmlformats.org/drawingml/2006/diagram';
        //Encryption namespaces
        this.eNamespace = 'http://schemas.microsoft.com/office/2006/encryption';
        this.pNamespace = 'http://schemas.microsoft.com/office/2006/keyEncryptor/password';
        this.certNamespace = 'http://schemas.microsoft.com/office/2006/keyEncryptor/certificate';
        this.cxNamespace = 'http://schemas.microsoft.com/office/drawing/2014/chartex';
        // chart
        this.c15Namespace = 'http://schemas.microsoft.com/office/drawing/2015/06/chart';
        this.c7Namespace = 'http://schemas.microsoft.com/office/drawing/2007/8/2/chart';
        this.csNamespace = 'http://schemas.microsoft.com/office/drawing/2012/chartStyle';
        // worksheet
        this.spreadSheetNamespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
        this.spreadSheet9 = 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main';
        // Dls xml tags
        this.cRelationshipsTag = 'Relationships';
        this.cRelationshipTag = 'Relationship';
        this.cIdTag = 'Id';
        this.cTypeTag = 'Type';
        this.cTargetTag = 'Target';
        this.cUserShapesTag = 'userShapes';
        this.cExternalData = 'externalData';
        this.twipsInOnePoint = 20;
        this.twentiethOfPoint = 20;
        this.borderMultiplier = 8;
        this.percentageFactor = 50;
        this.emusPerPoint = 12700;
        // private const TOC_SYMBOL:string = (char)0x01;
        // private const FOOTNOTE_SYMBOL:string = (char)0x02;
        // private const PAGENUMBER_SYMBOL:string = (char)0xB;
        // private DEF_FIT_TEXT_TO_SHAPE: string = 'mso-fit-shape-to-text:t';
        // Document tags
        this.cConditionalTableStyleTag = 'tblStylePr';
        this.cTableFormatTag = 'tblPr';
        this.cTowFormatTag = 'trPr';
        this.cCellFormatTag = 'tcPr';
        this.cParagraphFormatTag = 'pPr';
        this.cCharacterFormatTag = 'rPr';
        this.packageType = 'http://schemas.microsoft.com/office/2006/xmlPackage';
        this.relsPartPath = '/_rels/.rels';
        this.documentRelsPartPath = '/word/_rels/document.xml.rels';
        this.webSettingsPath = '/word/webSettings.xml';
        this.wordMLDocumentPath = '/word/document.xml';
        this.wordMLStylePath = '/word/styles.xml';
        this.wordMLNumberingPath = '/word/numbering.xml';
        this.wordMLSettingsPath = '/word/settings.xml';
        this.wordMLHeaderPath = '/word/header';
        this.wordMLFooterPath = '/word/footer';
        this.wordMLCommentsPath = '/word/comments.xml';
        this.wordMLImagePath = '/word/media/image';
        this.wordMLFootnotesPath = '/word/footnotes.xml';
        this.wordMLEndnotesPath = '/word/endnotes.xml';
        this.wordMLAppPath = '/docProps/app.xml';
        this.wordMLCorePath = '/docProps/core.xml';
        this.wordMLCustomPath = '/docProps/custom.xml';
        this.wordMLFontTablePath = '/word/fontTable.xml';
        this.wordMLChartsPath = '/word/charts/';
        this.wordMLDefaultEmbeddingPath = '/word/embeddings/';
        this.wordMLEmbeddingPath = '/word/embeddings/';
        this.wordMLDrawingPath = '/word/drawings/';
        this.wordMLThemePath = '/word/theme/theme1.xml';
        this.wordMLFontsPath = '/word/fonts/';
        this.wordMLDiagramPath = '/word/diagrams/';
        this.wordMLControlPath = '/word/activeX/';
        this.wordMLVbaProject = '/vbaProject.bin';
        this.wordMLVbaData = '/vbaData.xml';
        this.wordMLVbaProjectPath = '/word/vbaProject.bin';
        this.wordMLVbaDataPath = '/word/vbaData.xml';
        // private WordMLCustomXMLPath: string = '/customXml/';
        this.wordMLWebSettingsPath = '/word/webSettings.xml';
        this.wordMLCustomItemProp1Path = '/customXml/itemProps1.xml';
        // private WordMLCustomXMLRelPath: string = '/customXml/_rels/item1.xml.rels';
        this.wordMLFootnoteRelPath = '/word/_rels/footnotes.xml.rels';
        this.wordMLEndnoteRelPath = '/word/_rels/endnotes.xml.rels';
        this.wordMLSettingsRelPath = '/word/_rels/settings.xml.rels';
        this.wordMLNumberingRelPath = '/word/_rels/numbering.xml.rels';
        this.wordMLFontTableRelPath = '/word/_rels/fontTable.xml.rels';
        this.wordMLCustomXmlPropsRelType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps';
        this.wordMLControlRelType = 'http://schemas.microsoft.com/office/2006/relationships/activeXControlBinary';
        this.wordMLDiagramContentType = 'application/vnd.ms-office.drawingml.diagramDrawing+xml';
        this.dsNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/customXml';
        this.excelFiles = undefined;
        this.lastSection = false;
        this.mRelationShipID = 0;
        this.cRelationShipId = 0;
        this.eRelationShipId = 0;
        this.efRelationShipId = 0;
        this.mDocPrID = 0;
        this.chartCount = 0;
        this.seriesCount = 0;
        this.chartStringCount = 0;
        this.mDifferentFirstPage = false;
        this.mBookmarks = undefined;
        this.mComments = [];
        this.revisions = [];
        this.customXMLProps = [];
        this.paraID = 0;
        this.commentParaID = 0;
        this.commentParaIDInfo = {};
        this.isInsideComment = false;
        this.commentId = {};
        this.currentCommentId = 0;
        this.trackChangesId = 0;
        this.prevRevisionIds = [];
        this.isRevisionContinuous = false;
        /* tslint:enable:no-any */
    }
    WordExport.prototype.getModuleName = function () {
        return 'WordExport';
    };
    Object.defineProperty(WordExport.prototype, "bookmarks", {
        // Gets the bookmark name
        get: function () {
            if (isNullOrUndefined(this.mBookmarks)) {
                this.mBookmarks = [];
            }
            return this.mBookmarks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordExport.prototype, "documentImages", {
        // Gets the collection of images present in the document body
        get: function () {
            if (this.mDocumentImages === undefined) {
                this.mDocumentImages = new Dictionary();
            }
            return this.mDocumentImages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordExport.prototype, "externalImages", {
        // Gets the collection of images present in the document body
        get: function () {
            if (this.mExternalLinkImages === undefined) {
                this.mExternalLinkImages = new Dictionary();
            }
            return this.mExternalLinkImages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordExport.prototype, "headerFooterImages", {
        // Gets the collections of images present in the HeaderFooters
        get: function () {
            if (this.mHeaderFooterImages === undefined) {
                this.mHeaderFooterImages = new Dictionary();
            }
            return this.mHeaderFooterImages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordExport.prototype, "documentCharts", {
        // Gets the collection of charts present in the document body
        get: function () {
            if (this.mDocumentCharts === undefined) {
                this.mDocumentCharts = new Dictionary();
            }
            return this.mDocumentCharts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordExport.prototype, "headersFooters", {
        /// Gets the HeaderFooter Collection
        get: function () {
            if (this.mHeaderFooterColl === undefined) {
                this.mHeaderFooterColl = new Dictionary();
            }
            return this.mHeaderFooterColl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WordExport.prototype, "EndnotesFootnotes", {
        /// Gets the Endnote and Footnote Collection
        get: function () {
            if (this.mFootEndnotesColl === undefined) {
                this.mFootEndnotesColl = new Dictionary();
            }
            return this.mFootEndnotesColl;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    WordExport.prototype.save = function (documentHelper, fileName) {
        var _this = this;
        this.fileName = fileName;
        this.serialize(documentHelper);
        var excelFiles = this.serializeExcelFiles();
        if (excelFiles && excelFiles.length > 0) {
            Promise.all(excelFiles).then(function () {
                _this.saveInternal(fileName);
            });
        }
        else {
            this.saveInternal(fileName);
        }
        this.close();
    };
    WordExport.prototype.saveInternal = function (fileName) {
        this.mArchive.save(fileName + '.docx').then(function (mArchive) {
            mArchive.destroy();
        });
    };
    /**
     * @private
     */
    WordExport.prototype.saveAsBlob = function (documentHelper) {
        var _this = this;
        this.serialize(documentHelper);
        var excelFiles = this.serializeExcelFiles();
        return new Promise(function (resolve, reject) {
            if (excelFiles.length > 0) {
                Promise.all(excelFiles).then(function () {
                    _this.mArchive.saveAsBlob().then(function (blob) {
                        _this.mArchive.destroy();
                        blob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                        resolve(blob);
                    });
                });
            }
            else {
                _this.mArchive.saveAsBlob().then(function (blob) {
                    _this.mArchive.destroy();
                    blob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                    resolve(blob);
                });
            }
        });
    };
    WordExport.prototype.serializeExcelFiles = function () {
        var _this = this;
        var excelFiles = this.excelFiles;
        var files = [];
        if (excelFiles && excelFiles.length > 0) {
            var _loop_1 = function (i) {
                var fileName = excelFiles.keys[i];
                var excelFile = excelFiles.get(fileName);
                var excelPromise = excelFile.saveAsBlob();
                files.push(excelPromise);
                excelPromise.then(function (blob) {
                    var zipArchiveItem = new ZipArchiveItem(blob, fileName);
                    _this.mArchive.addItem(zipArchiveItem);
                });
            };
            for (var i = 0; i < excelFiles.length; i++) {
                _loop_1(i);
            }
            this.excelFiles.clear();
        }
        return files;
    };
    /**
     * @private
     */
    WordExport.prototype.saveExcel = function () {
        var xlsxPath = this.defaultEmbeddingPath + 'Microsoft_Excel_Worksheet' + this.chartCount + '.xlsx';
        this.excelFiles.add(xlsxPath, this.mArchiveExcel);
        this.mArchiveExcel = undefined;
    };
    /**
     * @private
     */
    WordExport.prototype.destroy = function () {
        this.clearDocument();
        this.mRelationShipID = undefined;
        this.mDocPrID = undefined;
        this.mDifferentFirstPage = undefined;
        this.fileName = undefined;
        if (this.mArchive) {
            this.mArchive.destroy();
            this.mArchive = undefined;
        }
        if (this.mArchiveExcel) {
            this.mArchiveExcel.destroy();
            this.mArchiveExcel = undefined;
        }
    };
    // Saves the word document in the stream
    WordExport.prototype.serialize = function (documentHelper) {
        /* tslint:disable:no-any */
        var document = documentHelper.owner.sfdtExportModule.write();
        this.setDocument(document);
        this.mComments = documentHelper.comments;
        this.mCustomXML = documentHelper.customXmlData;
        this.revisions = documentHelper.owner.revisions.changes;
        this.mArchive = new ZipArchive();
        this.mArchive.compressionLevel = 'Normal';
        this.commentParaIDInfo = {};
        this.commentParaID = 0;
        this.currentCommentId = 0;
        this.commentId = {};
        this.mVerticalMerge = new Dictionary();
        this.mGridSpans = new Dictionary();
        var contenttype;
        //document.xml
        this.serializeDocument();
        //Styles.xml
        this.serializeStyles();
        //numbering.xml
        this.serializeNumberings();
        //comments.xml
        this.serializeComments();
        //commentsExtended.xml
        this.serializeCommentsExtended();
        //theme.xml
        // if (m_document.DocHasThemes && !isNullOrUndefined(m_document.Themes))
        //     SerializeThemes();
        // else
        // this.serializeDefaultThemes();
        //settings.xml
        this.serializeSettings();
        //core.xml
        this.serializeCoreProperties();
        //app.xml
        this.serializeAppProperties();
        //fontTable.xml
        this.serializeFontTable(contenttype);
        //custom.xml
        // if (!isNullOrUndefined(this.wordDocument.CustomDocumentProperties) && m_document.CustomDocumentProperties.length > 0) {
        //     SerializeCustomProperties();
        // }
        //Settings Relations
        this.serializeSettingsRelation();
        //Numbering relation if the document has picture bullet
        // if (PictureBullets.length > 0) {
        //     SerializeNumberingsRelation();
        // }
        this.serializeHeaderFooters();
        this.serializeFootnotes();
        this.serializeEndnotes();
        //document relations
        this.serializeDocumentRelations();
        // Add controls to archieve.
        // if (ControlsPathNames.length > 0) {
        //     AddControlsToZip(m_document.DocxPackage);
        // }
        // if (!isNullOrUndefined(m_document.CustomUIPartContainer))
        //     AddPartContainerToArchive(m_document.CustomUIPartContainer);
        // if (!isNullOrUndefined(m_document.CustomXMLContainer))
        //     AddPartContainerToArchive(m_document.CustomXMLContainer);
        //general relations
        this.serializeGeneralRelations();
        //[ContentTypes].xml
        this.serializeContentTypes(contenttype);
        // Clears the internal fields maintained for serializing.
        this.clearDocument();
    };
    // Sets the document
    WordExport.prototype.setDocument = function (document) {
        this.document = document;
        this.mSections = document.sections;
        this.mLists = document.lists;
        this.mAbstractLists = document.abstractLists;
        this.defCharacterFormat = document.characterFormat;
        this.defParagraphFormat = document.paragraphFormat;
        this.defaultTabWidthValue = document.defaultTabWidth;
        this.dontUseHtmlParagraphAutoSpacing = document.dontUseHTMLParagraphAutoSpacing;
        this.mStyles = document.styles;
        this.formatting = document.formatting;
        this.enforcement = document.enforcement;
        this.hashValue = document.hashValue;
        this.saltValue = document.saltValue;
        this.protectionType = document.protectionType;
        this.formFieldShading = document.formFieldShading;
    };
    // Clears the document
    WordExport.prototype.clearDocument = function () {
        // Owner Nodes
        this.section = undefined;
        this.lastSection = undefined;
        this.blockOwner = undefined;
        this.paragraph = undefined;
        this.table = undefined;
        this.row = undefined;
        this.headerFooter = undefined;
        this.commentParaIDInfo = {};
        this.commentParaID = 0;
        this.currentCommentId = 0;
        this.commentId = {};
        this.document = undefined;
        this.mSections = undefined;
        this.mLists = undefined;
        this.mAbstractLists = undefined;
        this.defCharacterFormat = undefined;
        this.defParagraphFormat = undefined;
        this.defaultTabWidthValue = undefined;
        this.customXMLProps = [];
        this.mRelationShipID = 0;
        this.eRelationShipId = 0;
        this.cRelationShipId = 0;
        this.efRelationShipId = 0;
        this.mDocPrID = 0;
        this.chartCount = 0;
        this.mDifferentFirstPage = false;
        if (this.mHeaderFooterColl) {
            this.mHeaderFooterColl.destroy();
            this.mHeaderFooterColl = undefined;
        }
        if (this.mVerticalMerge) {
            this.mVerticalMerge.destroy();
            this.mVerticalMerge = undefined;
        }
        if (this.mGridSpans) {
            this.mGridSpans.destroy();
            this.mGridSpans = undefined;
        }
        if (this.mDocumentImages) {
            this.mDocumentImages.destroy();
            this.mDocumentImages = undefined;
        }
        if (this.mExternalLinkImages) {
            this.mExternalLinkImages.destroy();
            this.mExternalLinkImages = undefined;
        }
        if (this.mHeaderFooterImages) {
            this.mHeaderFooterImages.destroy();
            this.mHeaderFooterImages = undefined;
        }
        if (this.mDocumentCharts) {
            this.mDocumentCharts.destroy();
            this.mDocumentCharts = undefined;
        }
        if (this.mFootEndnotesColl) {
            this.mFootEndnotesColl.destroy();
            this.mFootEndnotesColl = undefined;
        }
    };
    // Serializes the document elements (document.xml)
    WordExport.prototype.serializeDocument = function () {
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'document', this.wNamespace);
        this.writeCommonAttributeStrings(writer);
        this.serializeDocumentBody(writer);
        writer.writeEndElement(); //end of document tag
        var archiveItem = new ZipArchiveItem(writer.buffer, this.documentPath);
        this.mArchive.addItem(archiveItem);
    };
    WordExport.prototype.writeCommonAttributeStrings = function (writer) {
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        this.writeCustom(writer);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        this.writeDup(writer);
        writer.writeAttributeString('xmlns', 'wne', undefined, this.wneNamespace);
        writer.writeAttributeString('xmlns', 'wps', undefined, this.wpShapeNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15 wp14');
    };
    WordExport.prototype.writeDup = function (writer) {
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('xmlns', 'wpg', undefined, this.wpGroupNamespace);
        writer.writeAttributeString('xmlns', 'wpi', undefined, this.wpInkNamespace);
    };
    WordExport.prototype.writeCustom = function (writer) {
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
    };
    // Serializes the document body
    WordExport.prototype.serializeDocumentBody = function (writer) {
        writer.writeStartElement(undefined, 'body', this.wNamespace);
        var count = this.document.sections.length;
        for (var i = 0; i < count; i++) {
            this.section = this.document.sections[i];
            this.lastSection = i === count - 1;
            this.serializeSection(writer, this.section, i === count - 1);
            this.section = undefined;
        }
        writer.writeEndElement();
    };
    // Serializes the Section.
    WordExport.prototype.serializeSection = function (writer, section, last) {
        this.blockOwner = section;
        this.serializeBodyItems(writer, section.blocks, last);
        if (last) {
            this.serializeSectionProperties(writer, section);
        }
        this.blockOwner = undefined;
    };
    // Serialize the comments (comments.xml)
    WordExport.prototype.serializeComments = function () {
        if (this.mComments.length === 0 || (this.mComments.length === 1 && this.mComments[0].text === '')) {
            return;
        }
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'comments', this.wNamespace);
        this.serializeCommentCommonAttribute(writer);
        this.serializeCommentInternal(writer, this.mComments, false);
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.commentsPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeCommentCommonAttribute = function (writer) {
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        writer.writeAttributeString('xmlns', 'cx', undefined, this.cxNamespace);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
    };
    WordExport.prototype.serializeCommentInternal = function (writer, comments, isreplay) {
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            writer.writeStartElement('w', 'comment', this.wNamespace);
            writer.writeAttributeString('w', 'id', this.wNamespace, this.commentId[comment.commentId].toString());
            if (comment.author && comment.author !== ' ') {
                writer.writeAttributeString('w', 'author', this.wNamespace, comment.author);
            }
            if (comment.date) {
                writer.writeAttributeString('w', 'date', this.wNamespace, comment.date);
            }
            if (comment.initial && comment.initial !== '') {
                writer.writeAttributeString('w', 'initials', this.wNamespace, comment.initial);
            }
            var blocks = this.retrieveCommentText(comment.text);
            for (var k = 0; k < blocks.length; k++) {
                this.isInsideComment = true;
                this.commentParaID++;
                this.serializeBodyItem(writer, blocks[k], true);
                this.isInsideComment = false;
            }
            if (blocks.length === 0) {
                this.isInsideComment = true;
                this.commentParaID++;
            }
            this.commentParaIDInfo[comment.commentId] = this.commentParaID;
            //}
            this.isInsideComment = false;
            //}
            writer.writeEndElement();
            if (comment.replyComments.length > 0) {
                this.serializeCommentInternal(writer, comment.replyComments, true);
            }
        }
    };
    WordExport.prototype.retrieveCommentText = function (text) {
        var blocks = [];
        var multiText = text.split('\n');
        multiText = multiText.filter(function (x) { return x !== ''; });
        var block = {};
        if (multiText.length === 0) {
            block.inlines = [{ text: '' }];
            blocks.push(block);
        }
        else {
            while (multiText.length > 0) {
                block.inlines = [{ text: multiText[0] }];
                blocks.push(block);
                multiText.splice(0, 1);
            }
        }
        return blocks;
    };
    // Serialize the comments (commentsExtended.xml)
    WordExport.prototype.serializeCommentsExtended = function () {
        if (this.mComments.length === 0 || (this.mComments.length === 1 && this.mComments[0].text === '')) {
            return;
        }
        var writer = new XmlWriter();
        writer.writeStartElement('w15', 'commentsEx', this.wNamespace);
        this.serializeCommentCommonAttribute(writer);
        this.serializeCommentsExInternal(writer, this.mComments, false);
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.commentsExtendedPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeCommentsExInternal = function (writer, comments, isReply) {
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            writer.writeStartElement('w15', 'commentEx', this.wNamespace);
            //if (comment.blocks.length > 0) {
            var syncParaID = this.commentParaIDInfo[comment.commentId];
            if (isReply) {
                var paraID = this.commentParaIDInfo[comment.ownerComment.commentId];
                writer.writeAttributeString('w15', 'paraIdParent', this.wNamespace, paraID.toString());
            }
            writer.writeAttributeString('w15', 'paraId', this.wNamespace, syncParaID.toString());
            //}
            var val = comment.done ? 1 : 0;
            writer.writeAttributeString('w15', 'done', this.wNamespace, val.toString());
            writer.writeEndElement();
            if (comment.replyComments.length > 0) {
                this.serializeCommentsExInternal(writer, comment.replyComments, true);
            }
        }
    };
    // Serialize the section properties.
    WordExport.prototype.serializeSectionProperties = function (writer, section) {
        writer.writeStartElement('w', 'sectPr', this.wNamespace);
        if (section.headersFooters) {
            this.serializeHFReference(writer, section.headersFooters);
        }
        // if (IsNeedToSerializeSectionFootNoteProperties(section))
        //     SerializeFootnoteProperties(section);
        // if (IsNeedToSerializeSectionEndNoteProperties(section))
        //     SerializeEndnoteProperties(section);      
        this.serializeSectionType(writer, 'nextPage');
        this.serializePageSetup(writer, section.sectionFormat);
        this.serializeColumns(writer, section);
        this.serializeFootNotesPr(writer, section.sectionFormat);
        this.serializeEndNotesPr(writer, section.sectionFormat);
        // this.serializeSectionProtection(section);
        // if (section.PageSetup.VerticalAlignment !== PageAlignment.Top) {
        //     writer.writeStartElement('vAlign', this.wNamespace);
        //     switch (section.PageSetup.VerticalAlignment) {
        //         case PageAlignment.Top:
        //             writer.WriteAttributeString('val', this.wNamespace, 'top');
        //             break;
        //         case PageAlignment.Middle:
        //             writer.WriteAttributeString('val', this.wNamespace, 'center');
        //             break;
        //         case PageAlignment.Justified:
        //             writer.WriteAttributeString('val', this.wNamespace, 'both');
        //             break;
        //         case PageAlignment.Bottom:
        //             writer.WriteAttributeString('val', this.wNamespace, 'bottom');
        //             break;
        //     }
        //     writer.WriteEndElement();
        // }
        if (section.sectionFormat !== undefined && section.sectionFormat.differentFirstPage) {
            writer.writeStartElement(undefined, 'titlePg', this.wNamespace);
            writer.writeEndElement();
        }
        // SerializeTextDirection(section);
        if (!isNullOrUndefined(section.sectionFormat) && section.sectionFormat.bidi) {
            writer.writeStartElement(undefined, 'bidi', this.wNamespace);
            writer.writeEndElement();
        }
        //rtlGutter
        // SerializeDocGrid(section);
        //printerSettings
        writer.writeEndElement(); //end of sectPr tag
    };
    WordExport.prototype.serializeFootNotesPr = function (writer, section) {
        if (section.footNoteNumberFormat || section.restartIndexForFootnotes) {
            writer.writeStartElement(undefined, 'footnotePr', this.wNamespace);
            writer.writeStartElement(undefined, 'pos', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, 'pageBottom');
            writer.writeEndElement();
            if (section.footNoteNumberFormat !== undefined) {
                writer.writeStartElement(undefined, 'numFmt', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberFormat(section.footNoteNumberFormat));
                writer.writeEndElement();
            }
            if (section.restartIndexForFootnotes !== undefined) {
                writer.writeStartElement(undefined, 'numRestart', this.wNamespace);
                // tslint:disable-next-line:max-line-length
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberRestart(section.restartIndexForFootnotes));
                writer.writeEndElement();
            }
            if (section.initialFootNoteNumber !== undefined) {
                writer.writeStartElement(undefined, 'numStart', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, (section.initialFootNoteNumber).toString());
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    };
    WordExport.prototype.getFootNoteNumberFormat = function (numberFormat) {
        var patternType;
        switch (numberFormat) {
            case 'UpperCaseRoman':
                patternType = 'upperRoman';
                break;
            case 'LowerCaseRoman':
                patternType = 'lowerRoman';
                break;
            case 'UpperCaseLetter':
                patternType = 'upperLetter';
                break;
            case 'LowerCaseLetter':
                patternType = 'lowerLetter';
                break;
            default:
                patternType = 'decimal';
                break;
        }
        return patternType;
    };
    WordExport.prototype.getFootNoteNumberRestart = function (numberRestart) {
        switch (numberRestart) {
            case 'RestartForEachSection ':
                return 'eachSect';
            case 'RestartForEachPage':
                return 'eachPage';
            default:
                return 'continuous';
        }
    };
    // Serialize the Footnote Properties
    WordExport.prototype.serializeEndNotesPr = function (writer, section) {
        if (section.endnoteNumberFormat || section.restartIndexForEndnotes) {
            writer.writeStartElement(undefined, 'endnotePr', this.wNamespace);
            writer.writeStartElement(undefined, 'pos', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, 'docEnd');
            writer.writeEndElement();
            if (section.endnoteNumberFormat !== undefined) {
                writer.writeStartElement(undefined, 'numFmt', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberFormat(section.endnoteNumberFormat));
                writer.writeEndElement();
            }
            if (section.restartIndexForEndnotes !== undefined) {
                writer.writeStartElement(undefined, 'numRestart', this.wNamespace);
                // tslint:disable-next-line:max-line-length
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberRestart(section.restartIndexForEndnotes));
                writer.writeEndElement();
            }
            if (section.initialEndNoteNumber !== undefined) {
                writer.writeStartElement(undefined, 'numStart', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, (section.initialEndNoteNumber).toString());
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    };
    // Serialize the column properties of section.
    WordExport.prototype.serializeColumns = function (writer, section) {
        writer.writeStartElement(undefined, 'cols', this.wNamespace);
        writer.writeAttributeString(undefined, 'equalWidth', this.wNamespace, '1');
        writer.writeAttributeString(undefined, 'space', this.wNamespace, '0');
        writer.writeEndElement();
        // ColumnCollection columns = section.Columns;
        // writer.WriteStartElement('cols', this.wNamespace);
        // if (columns.length > 0)
        // {
        //     writer.WriteAttributeString('num', this.wNamespace, columns.length.ToString());
        // }
        // if (section.PageSetup.DrawLinesBetweenCols)
        //     writer.WriteAttributeString('sep', this.wNamespace, '1');
        // if (columns.OwnerSection.PageSetup.EqualColumnWidth)
        // {
        //     writer.WriteAttributeString('equalWidth', this.wNamespace, '1');
        //     //When the column count is negative, MS word just reset the column's count to zero
        //     //To avoid index out of exception, checked the columns count
        // tslint:disable-next-line:max-line-length
        //     writer.WriteAttributeString('space', this.wNamespace, ToString(columns.length > 0 ? columns[0].Space * this.TwentiethOfPoint : 0));
        // }
        // else if (columns.length > 0)
        // {
        //     writer.WriteAttributeString('equalWidth', this.wNamespace, '0');
        //     foreach (Column column in columns)
        //     {
        //         writer.WriteStartElement('col', this.wNamespace);
        //         writer.WriteAttributeString('w', this.wNamespace, ToString(column.Width * this.TwentiethOfPoint));
        // tslint:disable-next-line:max-line-length
        //         writer.WriteAttributeString('space', this.wNamespace, ToString(column.Space * this.TwentiethOfPoint));
        //         writer.WriteEndElement();
        //     }
        // }
        // writer.WriteEndElement();
    };
    // Serialize the page setup properties.
    WordExport.prototype.serializePageSetup = function (writer, pageSetup) {
        if (pageSetup !== undefined) {
            this.serializePageSize(writer, pageSetup);
            this.serializePageMargins(writer, pageSetup);
        }
        // // StartElement paperSrc (if any)
        // if (pageSetup.FirstPageTray > 0 || pageSetup.OtherPagesTray > 0) {
        //     writer.WriteStartElement('paperSrc', this.wNamespace);
        //     if (pageSetup.FirstPageTray > 0) {
        //         writer.WriteAttributeString('first', this.wNamespace, pageSetup.FirstPageTray.ToString());
        //     }
        //     if (pageSetup.OtherPagesTray > 0) {
        //         writer.WriteAttributeString('other', this.wNamespace, pageSetup.OtherPagesTray.ToString());
        //     }
        //     writer.WriteEndElement();
        // }
        writer.writeStartElement(undefined, 'pgBorders', this.wNamespace);
        // //zOrder
        // if (pageSetup.PageBordersApplyType === PageBordersApplyType.FirstPage)
        //     writer.WriteAttributeString('display', this.wNamespace, 'firstPage');
        // else if (pageSetup.PageBordersApplyType === PageBordersApplyType.AllExceptFirstPage)
        //     writer.WriteAttributeString('display', this.wNamespace, 'notFirstPage');
        // if (pageSetup.PageBorderOffsetFrom === PageBorderOffsetFrom.PageEdge) {
        //     writer.WriteAttributeString('offsetFrom', this.wNamespace, 'page');
        // }
        // //Serializing zOrder of the front page border
        // if (!pageSetup.IsFrontPageBorder) {
        //     writer.WriteAttributeString('zOrder', this.wNamespace, 'back');
        // }
        // SerializePageBorders(pageSetup.Borders);
        writer.writeEndElement();
        // this.serializeLineNumberType(writer, pageSetup);
        //this.serializePageNumberType(writer, pageSetup);
    };
    // serialize the page size
    WordExport.prototype.serializePageSize = function (writer, pageSetup) {
        writer.writeStartElement(undefined, 'pgSz', this.wNamespace);
        // tslint:disable-next-line:max-line-length
        writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(pageSetup.pageWidth * this.twentiethOfPoint).toString());
        // tslint:disable-next-line:max-line-length
        writer.writeAttributeString(undefined, 'h', this.wNamespace, this.roundToTwoDecimal(pageSetup.pageHeight * this.twentiethOfPoint).toString());
        // if (pageSetup.Orientation === PageOrientation.Landscape)
        // {
        //     writer.WriteAttributeString('orient', this.wNamespace, 'landscape');
        // }
        writer.writeEndElement();
    };
    // Serialize the border.
    WordExport.prototype.serializePageMargins = function (writer, pageSetup) {
        writer.writeStartElement(undefined, 'pgMar', this.wNamespace);
        var marginValue = Math.round(pageSetup.topMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'top', this.wNamespace, marginValue.toString());
        marginValue = Math.round(pageSetup.rightMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'right', this.wNamespace, marginValue.toString());
        marginValue = Math.round(pageSetup.bottomMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'bottom', this.wNamespace, marginValue.toString());
        marginValue = Math.round(pageSetup.leftMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'left', this.wNamespace, marginValue.toString());
        // tslint:disable-next-line:max-line-length
        writer.writeAttributeString(undefined, 'header', this.wNamespace, this.roundToTwoDecimal(pageSetup.headerDistance * this.twentiethOfPoint).toString());
        // tslint:disable-next-line:max-line-length
        writer.writeAttributeString(undefined, 'footer', this.wNamespace, this.roundToTwoDecimal(pageSetup.footerDistance * this.twentiethOfPoint).toString());
        writer.writeAttributeString(undefined, 'gutter', this.wNamespace, '0');
        writer.writeEndElement();
    };
    // Serialize the section type.
    WordExport.prototype.serializeSectionType = function (writer, sectionBreakCode) {
        writer.writeStartElement('w', 'type', this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, sectionBreakCode); //GetSectionBreakCode(sectionBreakCode));
        writer.writeEndElement();
    };
    // Serialize the heeader/footer reference.
    WordExport.prototype.serializeHFReference = function (writer, headersFooters) {
        var hfId = '';
        if (headersFooters !== undefined) {
            this.mDifferentFirstPage = this.section.sectionFormat.differentOddAndEvenPages;
            var hf = headersFooters.firstPageHeader;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'headerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'first');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'FirstPageHeader', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.firstPageFooter;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'footerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'first');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'FirstPageFooter', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.evenHeader;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'headerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'even');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'EvenHeader', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.evenFooter;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'footerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'even');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'EvenFooter', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.header;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'headerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'default');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'OddHeader', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.footer;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'footerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'default');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'OddFooter', hfId);
                writer.writeEndElement();
            }
        }
    };
    // Adds the header footer details to the collection.
    WordExport.prototype.addHeaderFooter = function (hf, hfType, id) {
        var hfColl = new Dictionary();
        this.headersFooters.add(hfType, hfColl);
        this.headersFooters.get(hfType).add(id, hf);
    };
    // Serializes the bodyItems
    WordExport.prototype.serializeBodyItems = function (writer, blockCollection, isLastSection) {
        for (var i = 0; i < blockCollection.length; i++) {
            this.serializeBodyItem(writer, blockCollection[i], isLastSection);
        }
    };
    // serialize the content Control
    // tslint:disable-next-line:max-line-length
    WordExport.prototype.serializeContentControl = function (writer, contentControlItem, item, isLastSection, inlines) {
        if (isNullOrUndefined(contentControlItem)) {
            throw new Error('contentCOntrol should not be undefined');
        }
        writer.writeStartElement('w', 'sdt', this.wNamespace);
        writer.writeStartElement(undefined, 'sdtPr', this.wNamespace);
        if (!isNullOrUndefined(contentControlItem)) {
            this.serializeContentProperties(writer, contentControlItem, item, isLastSection, inlines);
        }
    };
    // serialize Content Control Properties
    // tslint:disable-next-line:max-line-length
    // tslint:disable:max-func-body-length
    WordExport.prototype.serializeContentProperties = function (writer, contentProperties, items, isLastSection, inlines) {
        var repeatSdt = undefined;
        if (!isNullOrUndefined(contentProperties.title)) {
            writer.writeStartElement(undefined, 'alias', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, contentProperties.title);
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'tag', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, contentProperties.tag);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.characterFormat)) {
            this.serializeCharacterFormat(writer, items.contentControlProperties.characterFormat);
        }
        // if (items.hasOwnProperty('blocks') && contentProperties.type !== 'CheckBox') {
        //     this.serializeContentParagraph(writer, items);
        // }
        if (contentProperties.lockContents || contentProperties.lockContentControl) {
            writer.writeStartElement(undefined, 'lock', this.wNamespace);
            if (contentProperties.lockContentControl && contentProperties.lockContents) {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'sdtContentLocked');
            }
            else if (contentProperties.lockContentControl) {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'sdtLocked');
            }
            else if (contentProperties.lockContents) {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'contentLocked');
            }
            writer.writeEndElement();
        }
        if (contentProperties.hasPlaceHolderText && isNullOrUndefined(repeatSdt)) {
            writer.writeStartElement('w', 'placeholder', undefined);
            writer.writeAttributeString('w', 'docPart', this.wNamespace, undefined);
            writer.writeEndElement();
            writer.writeStartElement('w', 'showingPlcHdr', undefined);
            writer.writeEndElement();
        }
        if (contentProperties.isTemporary) {
            writer.writeStartElement('w', 'temporary', undefined);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.appearance)) {
            writer.writeStartElement('w15', 'appearance', undefined);
            writer.writeAttributeString('w15', 'val', undefined, contentProperties.appearance.toLowerCase());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.color)) {
            writer.writeStartElement('w15', 'color', undefined);
            writer.writeAttributeString('w', 'val', undefined, this.getColor(contentProperties.color));
            writer.writeEndElement();
        }
        if (contentProperties.multiline) {
            writer.writeStartElement(undefined, 'text', this.wNamespace);
            writer.writeAttributeString('w', 'multiLine', this.wNamespace, '1');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.xmlMapping)) {
            if (contentProperties.xmlMapping.isMapped) {
                writer.writeStartElement('w', 'dataBinding', this.wNamespace);
                writer.writeAttributeString('w', 'xpath', undefined, contentProperties.xmlMapping.xPath);
                writer.writeAttributeString('w', 'storeItemID', undefined, contentProperties.xmlMapping.storeItemId);
                writer.writeEndElement();
            }
        }
        if (contentProperties.picture) {
            writer.writeStartElement('w', 'picture', this.wNamespace);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.uncheckedState || contentProperties.checkedState)) {
            writer.writeStartElement('w14', 'checkbox', undefined);
            if (contentProperties.isChecked) {
                writer.writeStartElement('w14', 'checked', undefined);
                writer.writeAttributeString('w14', 'val', undefined, '1');
                writer.writeEndElement();
            }
            else {
                writer.writeStartElement('w14', 'checked', undefined);
                writer.writeAttributeString('w14', 'val', undefined, '0');
                writer.writeEndElement();
            }
            writer.writeStartElement('w14', 'uncheckedState', undefined);
            writer.writeAttributeString('w14', 'val', undefined, this.toUnicode(contentProperties.uncheckedState.value));
            writer.writeAttributeString('w14', 'font', undefined, (contentProperties.uncheckedState.font));
            writer.writeEndElement();
            writer.writeStartElement('w14', 'checkedState', undefined);
            writer.writeAttributeString('w14', 'val', undefined, this.toUnicode(contentProperties.checkedState.value));
            writer.writeAttributeString('w14', 'font', undefined, contentProperties.checkedState.font);
            writer.writeEndElement();
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.contentControlListItems) && contentProperties.type === 'DropDownList') {
            // tslint:disable:no-duplicate-variable
            var dropDownLists = contentProperties.contentControlListItems;
            writer.writeStartElement(undefined, 'dropDownList', this.wNamespace);
            this.serializeContentControlList(writer, dropDownLists);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.contentControlListItems) && contentProperties.type === 'ComboBox') {
            var comboList = contentProperties.contentControlListItems;
            writer.writeStartElement(undefined, 'comboBox', this.wNamespace);
            this.serializeContentControlList(writer, comboList);
            writer.writeEndElement();
        }
        this.serializeContentControlDate(writer, contentProperties);
        if (!isNullOrUndefined(contentProperties.type)) {
            if (contentProperties.type === 'Picture') {
                writer.writeStartElement(undefined, 'picture', this.wNamespace);
                writer.writeEndElement();
            }
        }
        writer.writeEndElement();
        writer.writeStartElement('w', 'sdtContent', this.wNamespace);
        if (inlines) {
            return;
        }
        if (items.hasOwnProperty('blocks') && (isNullOrUndefined(items.cellFormat))) {
            for (var i = 0; i < items.blocks.length; i++) {
                var block = items.blocks[i];
                if (block.hasOwnProperty('inlines')) {
                    this.paragraph = block;
                    this.serializeParagraph(writer, block, isLastSection);
                    this.paragraph = undefined;
                }
                else if (block.hasOwnProperty('rowFormat')) {
                    this.serializeRow(writer, block);
                }
                else if (block.hasOwnProperty('contentControlProperties')) {
                    this.serializeContentControl(writer, block.contentControlProperties, block, isLastSection);
                }
                else {
                    var table = block;
                    this.serializeTable(writer, table);
                }
            }
        }
        else if (items.hasOwnProperty('rowFormat')) {
            if (items.cells.length > 0) {
                this.serializeRow(writer, items);
            }
        }
        else if (items.hasOwnProperty('cellFormat')) {
            this.serializeCell(writer, items);
        }
        writer.writeEndElement();
        writer.writeEndElement();
    };
    WordExport.prototype.toUnicode = function (code) {
        var charCode = code.charCodeAt(0);
        return charCode.toString(16);
    };
    //serialize dropdown and list property 
    WordExport.prototype.serializeContentControlList = function (writer, lists) {
        for (var i = 0; i < lists.length; i++) {
            writer.writeStartElement(undefined, 'listItem', this.wNamespace);
            if (!isNullOrUndefined(lists[i].displayText)) {
                writer.writeAttributeString('w', 'displayText', this.wNamespace, lists[i].displayText);
            }
            writer.writeAttributeString('w', 'value', this.wNamespace, lists[i].value);
            writer.writeEndElement();
        }
    };
    //Serialize character formatfor content control
    WordExport.prototype.serializeContentParagraph = function (writer, items) {
        for (var i = 0; i < items.blocks.length; i++) {
            var blocks = items.blocks[i];
            if (blocks.hasOwnProperty('inlines')) {
                for (var j = 0; j < blocks.inlines.length; j++) {
                    var inlines = blocks.inlines[j];
                    if (!isNullOrUndefined(inlines.characterFormat)) {
                        this.serializeCharacterFormat(writer, inlines.characterFormat);
                    }
                }
            }
        }
    };
    // serialize content control date property
    WordExport.prototype.serializeContentControlDate = function (writer, contentProperties) {
        if (contentProperties.type === 'Date') {
            writer.writeStartElement('w', 'date', this.wNamespace);
            if (!isNullOrUndefined(contentProperties.dateDisplayFormat)) {
                writer.writeStartElement('w', 'calender', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateCalendarType);
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(contentProperties.dateDisplayLocale)) {
                writer.writeStartElement('w', 'lid', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateDisplayLocale);
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(contentProperties.dateStorageFormat)) {
                writer.writeStartElement('w', 'storeMappedDataAs', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateStorageFormat);
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(contentProperties.dateCalendarType)) {
                writer.writeStartElement('w', 'dateFormat', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateDisplayFormat);
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    };
    // Serialize the TextBody item
    WordExport.prototype.serializeBodyItem = function (writer, item, isLastSection) {
        if (isNullOrUndefined(item)) {
            throw new Error('BodyItem should not be undefined');
        }
        if (item.hasOwnProperty('contentControlProperties')) {
            this.serializeContentControl(writer, item.contentControlProperties, item, isLastSection);
        }
        else if (item.hasOwnProperty('inlines')) {
            this.paragraph = item;
            this.serializeParagraph(writer, item, isLastSection);
            this.paragraph = undefined;
        }
        else {
            var table = item;
            for (var i = 0; i < table.rows.length; i++) {
                if (table.rows[i].cells.length > 0) {
                    this.serializeTable(writer, table);
                    break;
                }
            }
        }
        var sec = this.blockOwner;
        //Need to write the Section Properties if the Paragraph is last item in the section
        if (!isLastSection && sec.hasOwnProperty('sectionFormat')
            && sec.blocks.indexOf(item) === sec.blocks.length - 1) {
            writer.writeStartElement('w', 'p', this.wNamespace);
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);
            this.serializeSectionProperties(writer, sec);
            writer.writeEndElement();
            writer.writeEndElement();
        }
    };
    // Serialize the paragraph
    WordExport.prototype.serializeParagraph = function (writer, paragraph, isLastSection) {
        if (isNullOrUndefined(paragraph)) {
            throw new Error('Paragraph should not be undefined');
        }
        // if (paragraph.ParagraphFormat.PageBreakAfter && !IsPageBreakNeedToBeSkipped(paragraph as Entity))
        //     paragraph.InsertBreak(BreakType.PageBreak);
        // if (paragraph.ParagraphFormat.ColumnBreakAfter && !IsPageBreakNeedToBeSkipped(paragraph as Entity))
        //     paragraph.InsertBreak(BreakType.ColumnBreak);
        //Splits the paragraph based on the newline character
        // paragraph.SplitTextRange();
        writer.writeStartElement('w', 'p', this.wNamespace);
        if (this.isInsideComment) {
            writer.writeAttributeString('w14', 'paraId', undefined, this.commentParaID.toString());
        }
        writer.writeStartElement(undefined, 'pPr', this.wNamespace);
        if (!isNullOrUndefined(paragraph.paragraphFormat)) {
            this.serializeParagraphFormat(writer, paragraph.paragraphFormat, paragraph);
        }
        if (!isNullOrUndefined(paragraph.characterFormat)) {
            this.serializeCharacterFormat(writer, paragraph.characterFormat);
        }
        writer.writeEndElement(); //end of pPr
        // Serialize watermark if paragraph is the first item of Header document.
        // EnsureWatermark(paragraph);
        this.prevRevisionIds = [];
        this.serializeParagraphItems(writer, paragraph.inlines);
        writer.writeEndElement(); //end of paragraph tag.
    };
    //Serialize Revision start
    WordExport.prototype.serializeRevisionStart = function (writer, item, previousNode) {
        if (item.hasOwnProperty('revisionIds')) {
            if (!isNullOrUndefined(previousNode) && previousNode.hasOwnProperty('fieldType') && previousNode.fieldType === 0) {
                return;
            }
            if (item.hasOwnProperty('fieldType') && item.fieldType === 1) {
                return;
            }
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(previousNode) && previousNode.hasOwnProperty('bookmarkType') && (previousNode.bookmarkType === 0 && !(previousNode.name.indexOf('_Toc') >= 0))) {
                return;
            }
            var ids = item.revisionIds;
            for (var i = 0; i < ids.length; i++) {
                var revision = this.retrieveRevision(ids[i]);
                if (revision.revisionType === 'Insertion') {
                    this.serializeTrackChanges(writer, 'ins', revision.author, revision.date);
                }
                if (revision.revisionType === 'Deletion') {
                    this.serializeTrackChanges(writer, 'del', revision.author, revision.date);
                }
            }
        }
    };
    //Serialize track changes
    WordExport.prototype.serializeTrackChanges = function (writer, type, author, date) {
        writer.writeStartElement('w', type, this.wNamespace);
        writer.writeAttributeString('w', 'id', this.wNamespace, (this.trackChangesId++).toString());
        writer.writeAttributeString('w', 'author', this.wNamespace, author);
        writer.writeAttributeString('w', 'date', this.wNamespace, date);
    };
    /**
     * Method to return matched revisions
     */
    WordExport.prototype.retrieveRevision = function (id) {
        var matchedRevisions = [];
        for (var i = 0; i < this.revisions.length; i++) {
            if (this.revisions[i].revisionID === id) {
                return this.revisions[i];
            }
        }
        return undefined;
    };
    // Serialize the paragraph items
    WordExport.prototype.serializeParagraphItems = function (writer, paraItems) {
        var inlines;
        var previousNode = undefined;
        var isContinueOverride = false;
        for (var i = 0; i < paraItems.length; i++) {
            var item = paraItems[i];
            if (item.hasOwnProperty('contentControlProperties')) {
                inlines = true;
                this.serializeContentControl(writer, item.contentControlProperties, item, undefined, inlines);
                this.serializeParagraphItems(writer, item.inlines);
            }
            if (item.hasOwnProperty('inlines')) {
                this.serializeParagraphItems(writer, item);
            }
            this.serializeRevisionStart(writer, item, previousNode);
            var isBdo = false;
            if (item.characterFormat) {
                isBdo = !isNullOrUndefined(item.characterFormat.bdo) && item.characterFormat.bdo !== 'None';
                if (isBdo && !isContinueOverride) {
                    this.serializeBiDirectionalOverride(writer, item.characterFormat);
                    isContinueOverride = true;
                }
            }
            if (isContinueOverride && !isBdo) {
                writer.writeEndElement();
                isContinueOverride = false;
            }
            if (item.hasOwnProperty('fieldType')) {
                this.serializeFieldCharacter(writer, item);
            }
            else if (item.hasOwnProperty('imageString')) {
                this.serializePicture(writer, item);
            }
            else if (item.hasOwnProperty('shapeId')) {
                var currentParargaph = this.paragraph;
                this.serializeShape(writer, item);
                this.paragraph = currentParargaph;
            }
            else if (item.hasOwnProperty('bookmarkType')) {
                this.serializeBookMark(writer, item);
            }
            else if (item.hasOwnProperty('editRangeId')) {
                this.serializeEditRange(writer, item);
            }
            else if (item.hasOwnProperty('chartType')) {
                this.chart = item;
                this.serializeChart(writer, item);
                // chart.xml
                this.serializeChartStructure();
            }
            else if (item.hasOwnProperty('commentCharacterType')) {
                this.serializeComment(writer, item);
            }
            else if (item.hasOwnProperty('footnoteType')) {
                this.serializeEFReference(writer, item);
            }
            else {
                this.serializeTextRange(writer, item, previousNode);
            }
            //Serialize revision end
            this.serializeRevisionEnd(writer, item, previousNode);
            previousNode = item;
            if (inlines) {
                writer.writeEndElement();
                writer.writeEndElement();
                inlines = false;
            }
        }
        if (isContinueOverride) {
            writer.writeEndElement();
        }
    };
    WordExport.prototype.serializeEFReference = function (writer, item) {
        var efId = '';
        var ef = item.blocks;
        if (item.footnoteType === 'Footnote') {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, item.characterFormat);
            writer.writeStartElement(undefined, 'footnoteReference', this.wNamespace);
            efId = this.getEFNextRelationShipID();
            writer.writeAttributeString(undefined, 'id', this.wNamespace, efId);
            this.addFootnotesEndnotes(ef, 'footnote', efId);
            writer.writeEndElement();
            writer.writeEndElement();
        }
        else {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, item.characterFormat);
            writer.writeStartElement(undefined, 'endnoteReference', this.wNamespace);
            efId = this.getEFNextRelationShipID();
            writer.writeAttributeString(undefined, 'id', this.wNamespace, efId);
            this.addFootnotesEndnotes(ef, 'endnote', efId);
            writer.writeEndElement();
            writer.writeEndElement();
        }
    };
    WordExport.prototype.addFootnotesEndnotes = function (ef, efType, id) {
        var efColl = new Dictionary();
        this.EndnotesFootnotes.add(efType, efColl);
        this.EndnotesFootnotes.get(efType).add(id, ef);
    };
    WordExport.prototype.serializeEndnotesFootnote = function (writer, efType) {
        if (this.EndnotesFootnotes.length === 0) {
            return;
        }
        var endnoteFootnotePath;
        var endnoteFootnoteRelsPath;
        if (!this.EndnotesFootnotes.containsKey(efType)) {
            return;
        }
        var efColl = this.EndnotesFootnotes.get(efType);
        var ef = undefined;
        for (var i = 0; i < efColl.keys.length; i++) {
            var id = efColl.keys[i];
            ef = efColl.get(id);
            if (efType === 'endnote') {
                endnoteFootnotePath = this.endnotesPath;
                endnoteFootnoteRelsPath = this.endnotesRelationPath;
                this.serializeInlineEndnotes(writer, ef, id);
            }
            else {
                endnoteFootnotePath = this.footnotesPath;
                endnoteFootnoteRelsPath = this.footnotesRelationPath;
                this.serializeInlineFootnotes(writer, ef, id);
            }
        }
    };
    WordExport.prototype.serializeInlineEndnotes = function (writer, endNote, id) {
        this.endNoteFootnote = endNote;
        var owner = this.blockOwner;
        this.blockOwner = endNote;
        writer.writeStartElement('w', 'endnote', this.wNamespace);
        writer.writeAttributeString(undefined, 'id', this.wNamespace, id);
        this.serializeBodyItems(writer, endNote, true);
        writer.writeEndElement();
        this.blockOwner = owner;
        this.endNoteFootnote = undefined;
    };
    WordExport.prototype.serializeInlineFootnotes = function (writer, footNote, id) {
        this.endNoteFootnote = footNote;
        var owner = this.blockOwner;
        this.blockOwner = footNote;
        writer.writeStartElement('w', 'footnote', this.wNamespace);
        writer.writeAttributeString(undefined, 'id', this.wNamespace, id);
        this.serializeBodyItems(writer, footNote, true);
        writer.writeEndElement();
        this.blockOwner = owner;
        this.endNoteFootnote = undefined;
    };
    // private footnoteXMLItem(fileIndex: number): any {
    //     let writer = new XmlWriter;
    //     writer.writeStartElement(undefined, 'Sources', this.wNamespace)
    //     writer.writeAttributeString('xmlns', 'b', undefined, 'http://schemas.openxmlformats.org/officeDocument/2006/bibliography')
    //     writer.writeAttributeString(undefined,'xmlns',  undefined, 'http://schemas.openxmlformats.org/officeDocument/2006/bibliography')
    //     writer.writeAttributeString(undefined,'SelectedStyle', undefined,"\APASixthEditionOfficeOnline.xsl")
    //     writer.writeAttributeString(undefined,'StyleName',  undefined,"APA")
    //     writer.writeAttributeString(undefined,'Version',  undefined,"6")
    //     writer.writeEndElement();
    //     let itemPath: string = this.customXMLItemsPath + fileIndex + '.xml';
    //     let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, itemPath);
    //     this.mArchive.addItem(zipArchiveItem);
    //     return itemPath;
    // } 
    // private footnoteXMLItemProps(itemID: string, fileIndex: number): any {
    //     let writer: XmlWriter = new XmlWriter();
    //     let customitemPropsPath: string = this.customXMLItemsPropspath + fileIndex + '.xml';
    //     let itemPropsPath: string = this.itemPropsPath + fileIndex + '.xml';
    //     writer.writeStartElement('ds', 'datastoreItem', this.wNamespace);
    //     writer.writeAttributeString('ds', 'itemID', undefined, itemID);
    //     writer.writeAttributeString('xmlns', 'ds', undefined, this.dsNamespace);
    //     writer.writeStartElement('ds','schemaRefs', this.wNamespace);
    //     writer.writeStartElement('ds', 'schemaRef', this.wNamespace);
    //     writer.writeAttributeString('ds','uri', undefined,'http://schemas.openxmlformats.org/officeDocument/2006/bibliography' )
    //     writer.writeEndElement();
    //     writer.writeEndElement();
    //     writer.writeEndElement();
    //     this.customXMLProps.push(customitemPropsPath);
    //     let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, customitemPropsPath);
    //     this.mArchive.addItem(zipArchiveItem);
    //     return itemPropsPath;
    // }
    //Serialize the Footnote Endnotes Common Atributes 
    WordExport.prototype.writeEFCommonAttributes = function (writer) {
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        writer.writeAttributeString('xmlns', 'cx', undefined, this.cxNamespace);
        writer.writeAttributeString('xmlns', 'aink', undefined, 'http://schemas.microsoft.com/office/drawing/2016/ink');
        writer.writeAttributeString('xmlns', 'am3d', undefined, 'http://schemas.microsoft.com/office/drawing/2017/,odel3d');
        this.writeCustom(writer);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        this.writeDup(writer);
        writer.writeAttributeString('xmlns', 'wne', undefined, this.wneNamespace);
        writer.writeAttributeString('xmlns', 'wps', undefined, this.wpShapeNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
    };
    WordExport.prototype.serializeFootnotes = function () {
        if (isNullOrUndefined(this.document.footnotes)) {
            return;
        }
        else {
            var writer = new XmlWriter();
            writer.writeStartElement('w', 'footnotes', this.wNamespace);
            this.writeEFCommonAttributes(writer);
            writer.writeStartElement('w', 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'separator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            this.serializeBodyItems(writer, this.document.footnotes.separator, true);
            writer.writeEndElement();
            writer.writeStartElement('w', 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationSeparator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            this.serializeBodyItems(writer, this.document.footnotes.continuationSeparator, true);
            writer.writeEndElement();
            if (this.document.footnotes.continuationNotice) {
                writer.writeStartElement('w', 'endnote', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationNotice');
                writer.writeAttributeString(undefined, 'id', this.wNamespace, '1');
                this.serializeBodyItems(writer, this.document.footnotes.continuationNotice, true);
                writer.writeEndElement();
            }
            this.serializeEndnotesFootnote(writer, 'footnote');
            writer.writeEndElement();
            var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.footnotesPath);
            this.mArchive.addItem(zipArchiveItem);
        }
    };
    WordExport.prototype.serializeEndnotes = function () {
        if (isNullOrUndefined(this.document.footnotes)) {
            return;
        }
        else {
            var writer = new XmlWriter();
            writer.writeStartElement('w', 'endnotes', this.wNamespace);
            this.writeEFCommonAttributes(writer);
            writer.writeStartElement('w', 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'separator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            this.serializeBodyItems(writer, this.document.endnotes.separator, true);
            writer.writeEndElement();
            writer.writeStartElement('w', 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationSeparator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            this.serializeBodyItems(writer, this.document.endnotes.continuationSeparator, true);
            writer.writeEndElement();
            if (this.document.endnotes.continuationNotice) {
                writer.writeStartElement('w', 'endnote', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationNotice');
                writer.writeAttributeString(undefined, 'id', this.wNamespace, '1');
                this.serializeBodyItems(writer, this.document.endnotes.continuationNotice, true);
                writer.writeEndElement();
            }
            this.serializeEndnotesFootnote(writer, 'endnote');
            writer.writeEndElement();
            var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.endnotesPath);
            this.mArchive.addItem(zipArchiveItem);
        }
    };
    //Serialize Revision end
    WordExport.prototype.serializeRevisionEnd = function (writer, item, previousNode) {
        if (item.hasOwnProperty('revisionIds')) {
            //skip revision end for field begin as we combine to end with field code text
            if (item.hasOwnProperty('fieldType') && item.fieldType === 0) {
                return;
            }
            //skip revision end for field result text as we need to only on field end.
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(previousNode) && previousNode.hasOwnProperty('fieldType') && (previousNode.fieldType === 2 || (previousNode.fieldType === 0 && item.text.indexOf('TOC') >= 0))) {
                return;
            }
            for (var i = 0; i < item.revisionIds.length; i++) {
                var revision = this.retrieveRevision(item.revisionIds[i]);
                // tslint:disable-next-line:max-line-length
                if (revision.revisionType === 'Insertion' || revision.revisionType === 'Deletion') {
                    writer.writeEndElement();
                }
            }
        }
    };
    // Serialize the comment
    WordExport.prototype.serializeComment = function (writer, comment) {
        if (!(this.mComments.length === 1 && this.mComments[0].text === '')) {
            if (comment.commentCharacterType === 0) {
                writer.writeStartElement('w', 'commentRangeStart', this.wNamespace);
            }
            else if (comment.commentCharacterType === 1) {
                writer.writeStartElement('w', 'commentRangeEnd', this.wNamespace);
            }
            var commentId = this.commentId[comment.commentId];
            if (isNullOrUndefined(commentId)) {
                commentId = this.commentId[comment.commentId] = this.currentCommentId++;
            }
            writer.writeAttributeString('w', 'id', this.wNamespace, commentId.toString());
            writer.writeEndElement();
            if (comment.commentCharacterType === 1) {
                this.serializeCommentItems(writer, commentId);
            }
        }
    };
    WordExport.prototype.serializeCommentItems = function (writer, commentId) {
        writer.writeStartElement('w', 'r', this.wNamespace);
        writer.writeStartElement('w', 'commentReference', this.wNamespace);
        writer.writeAttributeString('w', 'id', this.wNamespace, commentId.toString());
        writer.writeEndElement();
        writer.writeEndElement();
    };
    WordExport.prototype.serializeBiDirectionalOverride = function (writer, characterFormat) {
        writer.writeStartElement(undefined, 'bdo', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, characterFormat.bdo.toLowerCase());
    };
    // Serialize Document Protection
    //<w:permStart w:id="627587516" w:edGrp="everyone" />
    WordExport.prototype.serializeEditRange = function (writer, editElement) {
        if (editElement.hasOwnProperty('editableRangeStart')) {
            writer.writeStartElement('w', 'permEnd', this.wNamespace);
        }
        else {
            writer.writeStartElement('w', 'permStart', this.wNamespace);
            if (editElement.user && editElement.user !== '') {
                writer.writeAttributeString('w', 'ed', this.wNamespace, editElement.user);
            }
            if (editElement.group && editElement.group !== '') {
                writer.writeAttributeString('w', 'edGrp', this.wNamespace, editElement.group.toLowerCase());
            }
            if (editElement.columnFirst && editElement.columnFirst !== -1) {
                writer.writeAttributeString('w', 'colFirst', this.wNamespace, editElement.columnFirst.toString());
            }
            if (editElement.columnLast && editElement.columnLast !== -1) {
                writer.writeAttributeString('w', 'colLast', this.wNamespace, editElement.columnLast.toString());
            }
        }
        writer.writeAttributeString('w', 'id', this.wNamespace, editElement.editRangeId);
        writer.writeEndElement();
    };
    // Serialize the book mark
    WordExport.prototype.serializeBookMark = function (writer, bookmark) {
        var bookmarkId = this.getBookmarkId(bookmark.name);
        var bookmarkName = bookmark.name;
        if (bookmark.bookmarkType === 0) {
            writer.writeStartElement('w', 'bookmarkStart', this.wNamespace);
            writer.writeAttributeString('w', 'name', this.wNamespace, bookmarkName);
        }
        else if (bookmark.bookmarkType === 1) {
            writer.writeStartElement('w', 'bookmarkEnd', this.wNamespace);
        }
        writer.writeAttributeString('w', 'id', this.wNamespace, bookmarkId.toString());
        writer.writeEndElement();
    };
    WordExport.prototype.getBookmarkId = function (name) {
        var index = this.bookmarks.indexOf(name);
        if (index < 0) {
            index = this.bookmarks.length;
            this.bookmarks.push(name);
        }
        return index;
    };
    // Serialize the picture.
    WordExport.prototype.serializePicture = function (writer, image) {
        if (image.width >= 0 && image.height >= 0) {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, image.characterFormat);
            this.serializeDrawing(writer, image);
            writer.writeEndElement(); //end of run element
        }
    };
    WordExport.prototype.serializeShape = function (writer, item) {
        if (item.width >= 0 && item.height >= 0) {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, item.characterFormat);
            this.serializeDrawing(writer, item);
            writer.writeEndElement(); //end of run element
        }
    };
    // Serialize the drawing element.
    WordExport.prototype.serializeDrawing = function (writer, draw) {
        writer.writeStartElement(undefined, 'drawing', this.wNamespace);
        if (draw.hasOwnProperty('chartType')) {
            this.serializeInlineCharts(writer, draw);
        }
        else {
            this.serializeInlinePictureAndShape(writer, draw);
        }
        writer.writeEndElement();
    };
    // Serialize the inline picture.
    WordExport.prototype.serializeInlinePictureAndShape = function (writer, draw) {
        if (!isNullOrUndefined(draw.imageString)) {
            writer.writeStartElement(undefined, 'inline', this.wpNamespace);
        }
        else {
            writer.writeStartElement('wp', 'anchor', this.wpNamespace);
            writer.writeAttributeString(undefined, 'distT', undefined, '0');
            writer.writeAttributeString(undefined, 'distB', undefined, '0');
            writer.writeAttributeString(undefined, 'distL', undefined, '114300');
            writer.writeAttributeString(undefined, 'distR', undefined, '114300');
            writer.writeAttributeString(undefined, 'simplePos', undefined, '0');
            writer.writeAttributeString(undefined, 'relativeHeight', undefined, draw.zOrderPosition.toString());
            //TextWrappingStyle.InFrontOfText
            writer.writeAttributeString(undefined, 'behindDoc', undefined, '0');
            var lockAnchor = (draw.LockAnchor) ? '1' : '0';
            writer.writeAttributeString(undefined, 'locked', undefined, lockAnchor);
            var layoutcell = (draw.layoutInCell) ? '1' : '0';
            writer.writeAttributeString(undefined, 'layoutInCell', undefined, layoutcell);
            var allowOverlap = (draw.allowOverlap) ? '1' : '0';
            writer.writeAttributeString(undefined, 'allowOverlap', undefined, allowOverlap);
            writer.writeStartElement('wp', 'simplePos', this.wpNamespace);
            writer.writeAttributeString(undefined, 'x', undefined, '0');
            writer.writeAttributeString(undefined, 'y', undefined, '0');
            writer.writeEndElement();
            writer.writeStartElement('wp', 'positionH', this.wpNamespace);
            writer.writeAttributeString(undefined, 'relativeFrom', undefined, draw.horizontalOrigin.toString().toLowerCase());
            if (draw.horizontalAlignment === 'None') {
                writer.writeStartElement('wp', 'posOffset', this.wpNamespace);
                var horPos = Math.round(draw.horizontalPosition * this.emusPerPoint);
                writer.writeString(horPos.toString());
                writer.writeEndElement(); //end of posOffset
            }
            else {
                writer.writeStartElement('wp', 'align', this.wpNamespace);
                var horAlig = draw.horizontalAlignment.toString().toLowerCase();
                writer.writeString(horAlig);
                writer.writeEndElement(); //end of align
            }
            writer.writeEndElement(); //end of postionH
            writer.writeStartElement('wp', 'positionV', this.wpNamespace);
            writer.writeAttributeString(undefined, 'relativeFrom', undefined, draw.verticalOrigin.toString().toLowerCase());
            if (draw.verticalAlignment === 'None') {
                writer.writeStartElement('wp', 'posOffset', this.wpNamespace);
                var vertPos = Math.round(draw.verticalPosition * this.emusPerPoint);
                writer.writeString(vertPos.toString());
                writer.writeEndElement(); // end of posOffset
            }
            else {
                writer.writeStartElement('wp', 'align', this.wpNamespace);
                var verAlig = draw.verticalAlignment.toString().toLowerCase();
                writer.writeString(verAlig);
                writer.writeEndElement(); //end of align
            }
            writer.writeEndElement(); //end of postionV
        }
        writer.writeStartElement(undefined, 'extent', this.wpNamespace);
        var cx = Math.round(draw.width * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        var cy = Math.round(draw.height * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();
        // double borderWidth = (double)picture.PictureShape.PictureDescriptor.BorderLeft.LineWidth / DLSConstants.BorderLineFactor;
        // if (borderWidth > 0 && picture.DocxProps.length === 0) {
        //     long leftTop = 0, rightBottom = 0;
        //     picture.PictureShape.GetEffectExtent(borderWidth, ref leftTop, ref rightBottom);
        //     m_writer.WriteStartElement('effectExtent', WP_namespace);
        //     m_writer.WriteAttributeString('l', leftTop.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteAttributeString('t', leftTop.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteAttributeString('r', rightBottom.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteAttributeString('b', rightBottom.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteEndElement();
        // }
        //this.serializePicProperties(writer, image);
        if (draw.imageString) {
            this.serializeDrawingGraphics(writer, draw);
        }
        else {
            this.serializeShapeDrawingGraphics(writer, draw);
        }
        writer.writeEndElement();
    };
    // serialize inline chart
    WordExport.prototype.serializeInlineCharts = function (writer, item) {
        writer.writeStartElement(undefined, 'inline', this.wpNamespace);
        writer.writeAttributeString(undefined, 'distT', undefined, '0');
        writer.writeAttributeString(undefined, 'distB', undefined, '0');
        writer.writeAttributeString(undefined, 'distL', undefined, '0');
        writer.writeAttributeString(undefined, 'distR', undefined, '0');
        writer.writeStartElement(undefined, 'extent', this.wpNamespace);
        var cx = Math.round(item.width * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        var cy = Math.round(item.height * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement(); // end of wp:extend
        writer.writeStartElement(undefined, 'effectExtent', this.wpNamespace);
        writer.writeAttributeString(undefined, 'l', undefined, '0');
        writer.writeAttributeString(undefined, 't', undefined, '0');
        writer.writeAttributeString(undefined, 'r', undefined, '0');
        writer.writeAttributeString(undefined, 'b', undefined, '0');
        writer.writeEndElement(); // end of wp: effectExtent
        this.serializeDrawingGraphicsChart(writer, item);
        writer.writeEndElement(); // end of inline
    };
    // Serialize the graphics element for chart.
    WordExport.prototype.serializeDrawingGraphicsChart = function (writer, chart) {
        var id = '';
        id = this.updatechartId(chart);
        // Processing chart
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, (this.mDocPrID++).toString());
        writer.writeAttributeString(undefined, 'name', undefined, this.getNextChartName());
        writer.writeEndElement(); // end of wp docPr
        writer.writeStartElement('wp', 'cNvGraphicFramePr', this.wpNamespace);
        writer.writeEndElement(); // end of cNvGraphicFramePr
        writer.writeStartElement('a', 'graphic', this.aNamespace);
        writer.writeStartElement('a', 'graphicData', this.aNamespace);
        writer.writeAttributeString(undefined, 'uri', undefined, this.chartNamespace);
        writer.writeStartElement('c', 'chart', this.chartNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('r', 'id', undefined, id);
        writer.writeEndElement(); // end of chart
        writer.writeEndElement(); // end of graphic data
        writer.writeEndElement(); // end of graphic
    };
    WordExport.prototype.getNextChartName = function () {
        return 'Chart' + (++this.chartCount);
    };
    // serialize chart
    WordExport.prototype.serializeChart = function (writer, chart) {
        writer.writeStartElement('w', 'r', this.wNamespace);
        this.serializeCharacterFormat(writer, chart.characterFormat);
        this.serializeDrawing(writer, chart);
        writer.writeEndElement();
    };
    WordExport.prototype.serializeChartStructure = function () {
        this.serializeChartXML();
        this.serializeChartColors();
        this.serializeChartExcelData();
        this.serializeChartRelations();
        this.chart = undefined;
        this.saveExcel();
    };
    // serialize Chart.xml
    WordExport.prototype.serializeChartXML = function () {
        var chartPath = '';
        var writer = new XmlWriter();
        writer.writeStartElement('c', 'chartSpace', this.chartNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'c16r2', undefined, this.c15Namespace);
        this.serializeChartData(writer, this.chart);
        writer.writeStartElement('c', 'externalData', this.chartNamespace);
        writer.writeAttributeString('r', 'id', undefined, 'rId1');
        writer.writeStartElement('c', 'autoUpdate', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of autoUpdate
        writer.writeEndElement(); // end of externalData
        writer.writeEndElement(); // end of chartSpace
        chartPath = this.chartPath + '/chart' + this.chartCount + '.xml';
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, chartPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    // serialize chart colors.xml
    WordExport.prototype.serializeChartColors = function () {
        var writer = new XmlWriter();
        var colorPath = '';
        writer.writeStartElement('cs', 'colorStyle', this.csNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeAttributeString(undefined, 'meth', undefined, 'cycle');
        writer.writeAttributeString(undefined, 'id', undefined, '10');
        this.serializeChartColor(writer, this.chart);
        colorPath = this.chartPath + '/colors' + this.chartCount + '.xml';
        writer.writeEndElement(); // end of cs:colorStyle chart color
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, colorPath);
        this.mArchive.addItem(zipArchiveItem);
        colorPath = '';
    };
    WordExport.prototype.serializeChartColor = function (writer, chart) {
        for (var i = 1; i <= 6; i++) {
            writer.writeStartElement('a', 'schemeClr', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'accent' + i);
            writer.writeEndElement(); // end of a:schemeClr
        }
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '60000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '80000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '20000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '80000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '60000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '40000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '50000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '70000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '30000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '70000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '50000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '50000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
    };
    // serialize chart Excel Data
    WordExport.prototype.serializeChartExcelData = function () {
        if (isNullOrUndefined(this.excelFiles)) {
            this.excelFiles = new Dictionary();
        }
        this.mArchiveExcel = new ZipArchive();
        this.mArchiveExcel.compressionLevel = 'Normal';
        var type = this.chart.chartType;
        var isScatterType = (type === 'Scatter_Markers' || type === 'Bubble');
        this.serializeWorkBook();
        this.serializeSharedString(isScatterType);
        this.serializeExcelContentTypes();
        this.serializeExcelData(isScatterType);
        this.serializeExcelStyles();
        this.serializeExcelRelation();
        this.serializeExcelGeneralRelations();
        this.chartStringCount = 0;
    };
    WordExport.prototype.serializeWorkBook = function () {
        var writer = new XmlWriter();
        var workbookPath = 'xl/workbook.xml';
        this.resetExcelRelationShipId();
        writer.writeStartElement(undefined, 'workbook', undefined);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        writer.writeStartElement(undefined, 'sheets', undefined);
        writer.writeStartElement(undefined, 'sheet', undefined);
        writer.writeAttributeString(undefined, 'name', undefined, 'Sheet1');
        writer.writeAttributeString(undefined, 'sheetId', undefined, '1');
        writer.writeAttributeString('r', 'id', undefined, this.getNextExcelRelationShipID());
        writer.writeEndElement(); // end of sheet
        writer.writeEndElement(); // end of sheets
        writer.writeEndElement(); // end of workbook
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, workbookPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeExcelStyles = function () {
        var writer = new XmlWriter();
        var stylePath = 'xl/styles.xml';
        writer.writeStartElement(undefined, 'styleSheet', undefined);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'x14ac');
        writer.writeAttributeString('xmlns', 'x14ac', undefined, 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac');
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        writer.writeEndElement(); // end of styleSheet
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, stylePath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeExcelData = function (isScatterType) {
        // excel data
        var sheetPath = '';
        var writer = new XmlWriter();
        writer.writeStartElement(undefined, 'worksheet', undefined);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'x14', undefined, this.spreadSheet9);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        this.serializeExcelSheet(writer, isScatterType);
        writer.writeEndElement(); // end of worksheet
        sheetPath = 'xl/worksheets' + '/sheet1.xml';
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, sheetPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeSharedString = function (isScatterType) {
        var chart = this.chart;
        var writer = new XmlWriter();
        var sharedStringPath = '';
        var chartSharedString = [];
        var type = this.chart.chartType;
        var seriesLength = chart.chartSeries.length;
        for (var column = 0; column < seriesLength; column++) {
            var series = chart.chartSeries[column];
            var seriesName = series.seriesName;
            var isString = seriesName.match(/[a-z]/i);
            if (isScatterType && column === 0) {
                chartSharedString.push('X-Values');
            }
            if (isString) {
                chartSharedString.push(series.seriesName);
                this.chartStringCount++;
            }
        }
        if (type === 'Bubble') {
            chartSharedString.push('Size');
        }
        for (var row = 0; row < chart.chartCategory.length; row++) {
            var category = chart.chartCategory[row];
            var format = chart.chartPrimaryCategoryAxis.numberFormat;
            var categoryName = category.categoryXName;
            var isString = categoryName.match(/[a-z]/i);
            if (isString || format === 'm/d/yyyy') {
                chartSharedString.push(category.categoryXName);
                this.chartStringCount++;
            }
        }
        var uniqueCount = this.chartStringCount + 1;
        writer.writeStartElement(undefined, 'sst', undefined);
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        writer.writeAttributeString(undefined, 'count', undefined, uniqueCount.toString());
        writer.writeAttributeString(undefined, 'uniqueCount', undefined, uniqueCount.toString());
        for (var i = 0; i <= chartSharedString.length; i++) {
            writer.writeStartElement(undefined, 'si', undefined);
            writer.writeStartElement(undefined, 't', undefined);
            if (i !== chartSharedString.length) {
                writer.writeString(chartSharedString[i]);
            }
            else if (!isScatterType) {
                writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
                writer.writeString(' ');
            }
            writer.writeEndElement(); // end of t
            writer.writeEndElement(); // end of si
        }
        writer.writeEndElement(); // end of sst
        sharedStringPath = 'xl/sharedStrings' + '.xml';
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, sharedStringPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    // excel sheet data
    WordExport.prototype.serializeExcelSheet = function (writer, isScatterType) {
        var chart = this.chart;
        var type = 's';
        var isBubbleType = (chart.chartType === 'Bubble');
        var bubbleLength;
        var categoryLength = chart.chartCategory.length + 1;
        var format = chart.chartPrimaryCategoryAxis.numberFormat;
        var seriesLength = chart.chartSeries.length + 1;
        if (isBubbleType) {
            bubbleLength = seriesLength;
            seriesLength = seriesLength + 1;
        }
        var category = undefined;
        var series = undefined;
        var count = 0;
        writer.writeStartElement(undefined, 'sheetData', undefined);
        for (var row = 0; row < categoryLength; row++) {
            writer.writeStartElement(undefined, 'row', undefined);
            writer.writeAttributeString(undefined, 'r', undefined, (row + 1).toString());
            for (var column = 0; column < seriesLength; column++) {
                var alphaNumeric = String.fromCharCode('A'.charCodeAt(0) + column) + (row + 1).toString();
                writer.writeStartElement(undefined, 'c', undefined);
                writer.writeAttributeString(undefined, 'r', undefined, alphaNumeric);
                if (row !== 0 && column === 0) {
                    category = chart.chartCategory[row - 1];
                    var categoryName = category.categoryXName;
                    var isString = categoryName.match(/[a-z]/i);
                    if (isNullOrUndefined(isString) && format === 'm/d/yyyy') {
                        type = 's';
                    }
                    else if ((!isString && !isNullOrUndefined(isString)) || isScatterType) {
                        type = 'n';
                    }
                    else {
                        type = 's';
                    }
                }
                else if (row === 0 && column !== 0 && column !== (bubbleLength)) {
                    series = chart.chartSeries[column - 1];
                    var seriesName = series.seriesName;
                    var isString = seriesName.match(/[a-z]/i);
                    if (!isString) {
                        type = 'n';
                    }
                    else {
                        type = 's';
                    }
                }
                else if (row === 0 && isBubbleType && column === (bubbleLength)) {
                    type = 's';
                }
                else if (row === 0 && column === 0) {
                    type = 's';
                }
                else {
                    type = 'n';
                }
                writer.writeAttributeString(undefined, 't', undefined, type);
                writer.writeStartElement(undefined, 'v', undefined);
                if (row === 0 && column === 0 && !isScatterType) {
                    writer.writeString(this.chartStringCount.toString());
                }
                else if (type === 's') {
                    writer.writeString(count.toString());
                    count++;
                }
                else if (row !== 0 && type !== 's' && column === 0 && column !== (bubbleLength)) {
                    writer.writeString(category.categoryXName);
                }
                else if (column !== 0 && type !== 's' && row === 0 && column !== (bubbleLength)) {
                    writer.writeString(series.seriesName);
                }
                else if (column !== 0 && column !== (bubbleLength)) {
                    var data = category.chartData[column - 1];
                    var yValue = data.yValue;
                    writer.writeString(yValue.toString());
                }
                else if (isBubbleType && column === (bubbleLength)) {
                    var data = category.chartData[column - 2];
                    var size = data.size;
                    writer.writeString(size.toString());
                }
                writer.writeEndElement(); // end of v[value]
                writer.writeEndElement(); // end of c[column]
                type = '';
            }
            writer.writeEndElement(); // end of row
        }
        writer.writeEndElement(); // end of sheetData
    };
    // excel content types
    WordExport.prototype.serializeExcelContentTypes = function () {
        var writer = new XmlWriter();
        writer.writeStartElement(undefined, 'Types', 'http://schemas.openxmlformats.org/package/2006/content-types');
        this.serializeDefaultContentType(writer, 'xml', this.xmlContentType);
        this.serializeDefaultContentType(writer, 'rels', this.relationContentType);
        // tslint:disable-next-line:max-line-length
        this.serializeOverrideContentType(writer, 'xl/styles.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml');
        this.serializeOverrideContentType(writer, 'xl/workbook.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
        // tslint:disable-next-line:max-line-length
        // this.serializeOverrideContentType(writer, '/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml');
        // this.serializeOverrideContentType(writer, '/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml');
        // tslint:disable-next-line:max-line-length
        this.serializeOverrideContentType(writer, 'xl/sharedStrings.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml');
        this.serializeOverrideContentType(writer, 'xl/worksheets/sheet1.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml');
        writer.writeEndElement(); // end of types tag
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.contentTypesPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeExcelRelation = function () {
        var writer = new XmlWriter();
        this.resetExcelRelationShipId();
        var worksheetType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';
        var sharedStringType = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings';
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), worksheetType, 'worksheets/sheet1.xml');
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), this.stylesRelType, 'styles.xml');
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), sharedStringType, 'sharedStrings.xml');
        writer.writeEndElement(); // end of relationships
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.excelRelationPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeExcelGeneralRelations = function () {
        var writer = new XmlWriter();
        this.resetExcelRelationShipId();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), this.documentRelType, 'xl/workbook.xml');
        writer.writeEndElement(); // end of relationships
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.generalRelationPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    };
    // get the next Excel relationship ID
    WordExport.prototype.getNextExcelRelationShipID = function () {
        return 'rId' + (++this.eRelationShipId);
    };
    // get the next Chart relationship ID
    WordExport.prototype.getNextChartRelationShipID = function () {
        return 'rId' + (++this.cRelationShipId);
    };
    //  chart data
    WordExport.prototype.serializeChartData = function (writer, chart) {
        writer.writeStartElement('c', 'date1904', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('c', 'lang', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'en-US');
        writer.writeEndElement();
        writer.writeStartElement('c', 'roundedCorners', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('mc', 'AlternateContent', this.veNamespace);
        writer.writeStartElement('mc', 'Choice', this.veNamespace);
        writer.writeAttributeString('xmlns', 'c14', undefined, this.c7Namespace);
        writer.writeAttributeString(undefined, 'Requires', undefined, 'c14');
        writer.writeStartElement('c14', 'style', undefined);
        writer.writeAttributeString(undefined, 'val', undefined, '102');
        writer.writeEndElement(); // c14 style end
        writer.writeEndElement(); // mc:choice ened
        writer.writeStartElement('mc', 'Fallback', this.veNamespace);
        writer.writeStartElement('c', 'style', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '2');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement(); // end tag of mc alternate content
        writer.writeStartElement('c', 'chart', this.chartNamespace);
        if (!isNullOrUndefined(this.chart.chartTitle)) {
            writer.writeStartElement('c', 'title', this.chartNamespace);
            this.serializeTextProperties(writer, this.chart.chartTitleArea, this.chart.chartTitle);
            writer.writeEndElement(); // end tag of title
        }
        // serialize plot area
        this.serializeChartPlotArea(writer, chart);
        writer.writeEndElement(); // end tag of chart
        this.serializeShapeProperties(writer, 'D9D9D9', true);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeAttributeString('xmlns', 'c', undefined, this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeEndElement(); // end tag of bodyPr
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeEndElement(); // end of a:lstStyle
        writer.writeStartElement('a', 'p', this.aNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeStartElement('a', 'pPr', this.aNamespace);
        writer.writeStartElement('a', 'defRPr', this.aNamespace);
        writer.writeEndElement(); // end tag of defRPr
        writer.writeEndElement(); // end tag of pPr
        writer.writeStartElement('a', 'endParaRPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'lang', undefined, 'en-US');
        writer.writeEndElement(); // end of a:endParaRPr
        writer.writeEndElement(); // end tag of p
        writer.writeEndElement(); // end tag of txPr
    };
    //  chart plot area
    // tslint:disable:max-func-body-length
    WordExport.prototype.serializeChartPlotArea = function (writer, chart) {
        writer.writeStartElement('c', 'autoTitleDeleted', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of autoTitleDeleted
        writer.writeStartElement('c', 'plotArea', this.chartNamespace);
        writer.writeStartElement('c', 'layout', this.chartNamespace);
        writer.writeEndElement();
        // chart Type
        var serializationChartType = this.chartType(chart);
        var isPieTypeSerialization = (serializationChartType === 'pieChart' || serializationChartType === 'doughnutChart');
        var isScatterType = (serializationChartType === 'scatterChart' || serializationChartType === 'bubbleChart');
        writer.writeStartElement('c', serializationChartType, this.chartNamespace);
        if (serializationChartType === 'barChart') {
            var barDiv = '';
            if (chart.chartType === 'Column_Clustered' || chart.chartType === 'Column_Stacked'
                || chart.chartType === 'Column_Stacked_100') {
                barDiv = 'col';
            }
            else {
                barDiv = 'bar';
            }
            writer.writeStartElement('c', 'barDir', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, barDiv);
            writer.writeEndElement(); // end of barDir
        }
        if (!isPieTypeSerialization && !isScatterType) {
            var grouping = this.chartGrouping(chart.chartType);
            writer.writeStartElement('c', 'grouping', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, grouping);
            writer.writeEndElement(); // end of grouping
        }
        if (serializationChartType === 'scatterChart') {
            writer.writeStartElement('c', 'scatterStyle', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'marker');
            writer.writeEndElement(); // end of scatterStyle
        }
        writer.writeStartElement('c', 'varyColors', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c:varyColors
        var valueSheet = '';
        for (var i = 0; i < chart.chartSeries.length; i++) {
            var series = chart.chartSeries[i];
            this.seriesCount = i;
            writer.writeStartElement('c', 'ser', this.chartNamespace);
            writer.writeStartElement('c', 'idx', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, i.toString());
            writer.writeEndElement(); // end of c:idx
            writer.writeStartElement('c', 'order', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, i.toString());
            writer.writeEndElement(); // end of c:order
            writer.writeStartElement('c', 'tx', this.chartNamespace);
            writer.writeStartElement('c', 'strRef', this.chartNamespace);
            writer.writeStartElement('c', 'f', this.chartNamespace);
            var alphaNumeric = String.fromCharCode('B'.charCodeAt(0) + i);
            valueSheet = 'Sheet1!$' + alphaNumeric;
            writer.writeString(valueSheet + '$1');
            valueSheet = valueSheet + '$2:$' + alphaNumeric + '$';
            writer.writeEndElement(); // end of c:f
            writer.writeStartElement('c', 'strCache', this.chartNamespace);
            writer.writeStartElement('c', 'ptCount', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '1');
            writer.writeEndElement(); // end of ptCount
            writer.writeStartElement('c', 'pt', this.chartNamespace);
            writer.writeAttributeString(undefined, 'idx', undefined, '0');
            writer.writeStartElement('c', 'v', this.chartNamespace);
            writer.writeString(series.seriesName);
            writer.writeEndElement(); // end of c:v
            writer.writeEndElement(); // end of pt
            writer.writeEndElement(); // end of strCache
            writer.writeEndElement(); // end of strRef
            writer.writeEndElement(); // end of tx
            if (chart.chartType === 'Pie' || chart.chartType === 'Doughnut') {
                this.parseChartDataPoint(writer, series);
                writer.writeStartElement('c', 'explosion', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, '0');
                writer.writeEndElement(); // end of explosion
            }
            else if (!isScatterType) {
                this.parseChartSeriesColor(writer, series.dataPoints, serializationChartType);
            }
            if (serializationChartType === 'scatterChart') {
                var fillColor = series.dataPoints[0].fill.foreColor;
                writer.writeStartElement('c', 'marker', this.chartNamespace);
                writer.writeStartElement('c', 'symbol', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, 'circle');
                writer.writeEndElement(); // end of a: symbol
                writer.writeStartElement('c', 'size', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, '5');
                writer.writeEndElement(); // end of a: size
                this.serializeShapeProperties(writer, fillColor, false);
                writer.writeEndElement(); // end of a: marker
            }
            if (series.dataLabel) {
                this.parseChartDataLabels(writer, series.dataLabel);
            }
            if (series.trendLines) {
                this.parseChartTrendLines(writer, series);
            }
            if (series.errorBar) {
                this.serializeChartErrorBar(writer, series);
            }
            if (serializationChartType === 'scatterChart') {
                this.serializeDefaultShapeProperties(writer);
            }
            else if (serializationChartType === 'bubbleChart') {
                this.serializeShapeProperties(writer, series.dataPoints[i].fill.foreColor, false);
            }
            var categoryType = 'cat';
            var categoryRef = 'strRef';
            var cacheType = 'strCache';
            if (isScatterType) {
                categoryType = 'xVal';
                categoryRef = 'numRef';
                cacheType = 'numCache';
            }
            writer.writeStartElement('c', categoryType, this.chartNamespace);
            writer.writeStartElement('c', categoryRef, this.chartNamespace);
            this.serializeChartCategory(writer, chart, cacheType); // serialize chart yvalue
            writer.writeEndElement(); // end of categoryRef
            writer.writeEndElement(); // end of cat
            this.serializeChartValue(writer, valueSheet, serializationChartType);
            writer.writeEndElement(); // end of c:ser
        }
        writer.writeStartElement('c', 'dLbls', this.chartNamespace);
        if (isPieTypeSerialization) {
            writer.writeStartElement('c', 'dLblPos', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'bestFit');
            writer.writeEndElement(); // end of dLblPos
        }
        writer.writeStartElement('c', 'showLegendKey', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showLegendKey
        writer.writeStartElement('c', 'showVal', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showVal
        writer.writeStartElement('c', 'showCatName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showCatName
        writer.writeStartElement('c', 'showSerName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showSerName
        writer.writeStartElement('c', 'showPercent', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showPercent
        writer.writeStartElement('c', 'showBubbleSize', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showBubbleSize
        writer.writeStartElement('c', 'showLeaderLines', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '1');
        writer.writeEndElement(); // end of c: showLeaderLines
        writer.writeEndElement(); // end of c: dLbls
        if (isPieTypeSerialization) {
            var series = this.chart.chartSeries[0];
            var sliceAngle = 0;
            var holeSize = 0;
            if (series.hasOwnProperty('firstSliceAngle')) {
                sliceAngle = series.firstSliceAngle;
            }
            writer.writeStartElement('c', 'firstSliceAng', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, sliceAngle.toString());
            writer.writeEndElement(); // end of c: firstSliceAng
            if (chart.chartType === 'Doughnut') {
                holeSize = series.holeSize;
                writer.writeStartElement('c', 'holeSize', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, holeSize.toString());
                writer.writeEndElement(); // end of c: holeSize
            }
        }
        if (serializationChartType !== 'lineChart' && !isScatterType) {
            writer.writeStartElement('c', 'gapWidth', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.chart.gapWidth.toString());
            writer.writeEndElement(); // end of gapWidth
            writer.writeStartElement('c', 'overlap', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.chart.overlap.toString());
            writer.writeEndElement(); // end of overlap
        }
        else if (serializationChartType !== 'bubbleChart') {
            writer.writeStartElement('c', 'smooth', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of smooth
        }
        if (serializationChartType === 'bubbleChart') {
            writer.writeStartElement('c', 'sizeRepresents', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'area');
            writer.writeEndElement(); // end of smooth
        }
        var type = this.chart.chartType;
        if (!isPieTypeSerialization) {
            writer.writeStartElement('c', 'axId', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '335265000');
            writer.writeEndElement(); // end of axId
            writer.writeStartElement('c', 'axId', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '335263360');
            writer.writeEndElement(); // end of axId
        }
        writer.writeEndElement(); // end of chart type
        var isStackedPercentage = (type === 'Column_Stacked_100' || type === 'Area_Stacked_100' ||
            type === 'Bar_Stacked_100' || type === 'Line_Stacked_100' || type === 'Line_Markers_Stacked_100');
        var format = this.chart.chartPrimaryCategoryAxis.categoryType;
        if (!isPieTypeSerialization) {
            this.serializeCategoryAxis(writer, format, isStackedPercentage);
            this.serializeValueAxis(writer, format, isStackedPercentage);
        }
        if (this.chart.hasOwnProperty('chartDataTable')) {
            var dataTable = this.chart.chartDataTable;
            var showHorzBorder = 0;
            var showVertBorder = 0;
            var showOutline = 0;
            var showKeys = 0;
            if (dataTable.showSeriesKeys) {
                showKeys = 1;
            }
            if (dataTable.hasHorzBorder) {
                showHorzBorder = 1;
            }
            if (dataTable.hasVertBorder) {
                showVertBorder = 1;
            }
            if (dataTable.hasBorders) {
                showOutline = 1;
            }
            writer.writeStartElement('c', 'dTable', this.chartNamespace);
            writer.writeStartElement('c', 'showHorzBorder', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showHorzBorder.toString());
            writer.writeEndElement(); // end of showHorzBorder
            writer.writeStartElement('c', 'showVertBorder', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showVertBorder.toString());
            writer.writeEndElement(); // end of showVertBorder
            writer.writeStartElement('c', 'showOutline', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showOutline.toString());
            writer.writeEndElement(); // end of showOutline
            writer.writeStartElement('c', 'showKeys', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showKeys.toString());
            writer.writeEndElement(); // end of showKeys
            writer.writeEndElement(); // end of dTable
        }
        this.serializeDefaultShapeProperties(writer);
        writer.writeEndElement(); // end of plot area
        // legend
        if (!isNullOrUndefined(this.chart.chartLegend.position)) {
            this.serializeChartLegend(writer);
        }
        writer.writeStartElement('c', 'plotVisOnly', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '1');
        writer.writeEndElement(); // end of c: plotVisOnly
        writer.writeStartElement('c', 'dispBlanksAs', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'gap');
        writer.writeEndElement(); // end of c: dispBlanksAs
    };
    WordExport.prototype.serializeChartLegend = function (writer) {
        var legendPosition = this.chartLegendPosition(this.chart.chartLegend);
        var title = this.chart.chartLegend.chartTitleArea;
        var fill = title.dataFormat.fill.foreColor;
        writer.writeStartElement('c', 'legend', this.chartNamespace);
        writer.writeStartElement('c', 'legendPos', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, legendPosition);
        writer.writeEndElement();
        writer.writeStartElement('c', 'overlay', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement();
        this.serializeDefaultShapeProperties(writer);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement();
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement();
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, title.fontSize, fill, title.fontName);
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
    };
    WordExport.prototype.serializeChartErrorBar = function (writer, series) {
        var errorBar = series.errorBar;
        var errorBarValueType = this.errorBarValueType(errorBar.type);
        var endStyle = 0;
        if (errorBar.endStyle !== 'Cap') {
            endStyle = 1;
        }
        writer.writeStartElement('c', 'errBars', this.chartNamespace);
        writer.writeStartElement('c', 'errBarType', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, errorBar.direction.toLowerCase());
        writer.writeEndElement(); // end of c: errBarType
        writer.writeStartElement('c', 'errValType', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, errorBarValueType);
        writer.writeEndElement(); // end of c: errValType
        writer.writeStartElement('c', 'noEndCap', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, endStyle.toString());
        writer.writeEndElement(); // end of c: noEndCap
        writer.writeStartElement('c', 'val', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, errorBar.numberValue.toString());
        writer.writeEndElement(); // end of c: val
        this.serializeShapeProperties(writer, '595959', true);
        writer.writeEndElement(); // end of c: errBars
    };
    WordExport.prototype.errorBarValueType = function (type) {
        var valueType = '';
        switch (type) {
            case 'StandardError':
                valueType = 'stdErr';
                break;
            case 'StandardDeviation':
                valueType = 'stdDev';
                break;
            case 'Percentage':
                valueType = 'percentage';
                break;
            case 'Fixed':
                valueType = 'fixedVal';
                break;
            default:
                valueType = 'stdErr';
                break;
        }
        return valueType;
    };
    WordExport.prototype.serializeCategoryAxis = function (writer, format, isStackedPercentage) {
        // serialize category axis
        var axisType = 'catAx';
        var formatCode = this.chart.chartPrimaryCategoryAxis.numberFormat;
        var type = this.chart.chartType;
        var isScatterType = (type === 'Scatter_Markers' || type === 'Bubble');
        if (format === 'Time') {
            axisType = 'dateAx';
        }
        if (isScatterType) {
            axisType = 'valAx';
        }
        writer.writeStartElement('c', axisType, this.chartNamespace);
        writer.writeStartElement('c', 'axId', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '335265000');
        writer.writeEndElement(); // end of axId
        this.serializeAxis(writer, '335263360', this.chart.chartPrimaryCategoryAxis, formatCode, isStackedPercentage);
        if (!isScatterType) {
            writer.writeStartElement('c', 'auto', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '1');
            writer.writeEndElement(); // end of auto
            writer.writeStartElement('c', 'lblAlgn', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'ctr');
            writer.writeEndElement(); // end of lblAlgn
            writer.writeStartElement('c', 'lblOffset', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '100');
            writer.writeEndElement(); // end of lblOffset
        }
        if (format === 'Time') {
            writer.writeStartElement('c', 'baseTimeUnit', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'days');
            writer.writeEndElement(); // end of baseTimeUnit
        }
        else if (this.chart.chartType !== 'Bubble') {
            writer.writeStartElement('c', 'noMultiLvlLbl', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of noMultiLvlLbl
        }
        writer.writeEndElement(); // end of catAx
    };
    WordExport.prototype.serializeValueAxis = function (writer, format, isStackedPercentage) {
        // serialize category axis
        var valueAxis = this.chart.chartPrimaryValueAxis;
        var crossBetween = 'between';
        if (format === 'Time') {
            crossBetween = 'midCat';
        }
        writer.writeStartElement('c', 'valAx', this.chartNamespace);
        writer.writeStartElement('c', 'axId', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '335263360');
        writer.writeEndElement(); // end of axId
        this.serializeAxis(writer, '335265000', valueAxis, 'General', isStackedPercentage);
        writer.writeStartElement('c', 'crossBetween', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, crossBetween);
        writer.writeEndElement(); // end of crossBetween
        if (valueAxis.majorUnit !== 0 && !isStackedPercentage) {
            writer.writeStartElement('c', 'majorUnit', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, valueAxis.majorUnit.toString());
            writer.writeEndElement(); // end of majorUnit
        }
        writer.writeEndElement(); // end of valAx
    };
    WordExport.prototype.serializeAxis = function (writer, axisID, axis, formatCode, isStackedPercentage) {
        var majorTickMark = 'none';
        var minorTickMark = 'none';
        var tickLabelPosition = 'nextTo';
        writer.writeStartElement('c', 'scaling', this.chartNamespace);
        writer.writeStartElement('c', 'orientation', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'minMax');
        writer.writeEndElement(); // end of orientation
        if (axis.maximumValue !== 0 && !isStackedPercentage) {
            writer.writeStartElement('c', 'max', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, axis.maximumValue.toString());
            writer.writeEndElement(); // end of max
            writer.writeStartElement('c', 'min', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, axis.minimumValue.toString());
            writer.writeEndElement(); // end of min
        }
        writer.writeEndElement(); // end of scaling
        writer.writeStartElement('c', 'delete', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of delete
        writer.writeStartElement('c', 'axPos', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'l');
        writer.writeEndElement(); // end of axPos
        if (axis.hasMajorGridLines) {
            writer.writeStartElement('c', 'majorGridlines', this.chartNamespace);
            this.serializeShapeProperties(writer, 'D9D9D9', true);
            writer.writeEndElement(); // end of majorGridlines
        }
        if (axis.hasMinorGridLines) {
            writer.writeStartElement('c', 'minorGridlines', this.chartNamespace);
            this.serializeShapeProperties(writer, 'F2F2F2', true);
            writer.writeEndElement(); // end of minorGridlines
        }
        if (axis.chartTitle) {
            writer.writeStartElement('c', 'title', this.chartNamespace);
            this.serializeTextProperties(writer, axis.chartTitleArea, axis.chartTitle);
            writer.writeEndElement(); // end tag of title
        }
        writer.writeStartElement('c', 'numFmt', this.chartNamespace);
        writer.writeAttributeString(undefined, 'formatCode', undefined, formatCode);
        writer.writeAttributeString(undefined, 'sourceLinked', undefined, '1');
        writer.writeEndElement(); // end of numFmt
        writer.writeStartElement('c', 'majorTickMark', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, majorTickMark);
        writer.writeEndElement(); // end of majorTickMark
        writer.writeStartElement('c', 'minorTickMark', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, minorTickMark);
        writer.writeEndElement(); // end of minorTickMark
        writer.writeStartElement('c', 'tickLblPos', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, tickLabelPosition);
        writer.writeEndElement(); // end of tickLblPos
        if (this.chart.chartType === 'Bubble') {
            this.serializeShapeProperties(writer, 'BFBFBF', true);
        }
        else {
            this.serializeDefaultShapeProperties(writer);
        }
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement(); // end of bodyPr
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, axis.fontSize, '595959', axis.fontName);
        writer.writeEndElement(); // end of a: p
        writer.writeEndElement(); // end of c: txPr
        writer.writeStartElement('c', 'crossAx', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, axisID);
        writer.writeEndElement(); // end of crossAx
        writer.writeStartElement('c', 'crosses', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'autoZero');
        writer.writeEndElement(); // end of crosses
    };
    WordExport.prototype.parseChartTrendLines = function (writer, series) {
        for (var i = 0; i < series.trendLines.length; i++) {
            var data = series.trendLines[i];
            var type = this.chartTrendLineType(data.type);
            var dispRSqr = 0;
            var dispEq = 0;
            if (data.isDisplayEquation) {
                dispEq = 1;
            }
            else if (data.isDisplayRSquared) {
                dispRSqr = 1;
            }
            var solidFill = series.dataPoints[i];
            writer.writeStartElement('c', 'trendline', this.chartNamespace);
            writer.writeStartElement('c', 'spPr', this.chartNamespace);
            writer.writeStartElement('a', 'ln', this.aNamespace);
            writer.writeAttributeString(undefined, 'w', undefined, '19050');
            this.serializeChartSolidFill(writer, solidFill.fill.foreColor, false);
            writer.writeStartElement('a', 'prstDash', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'sysDot');
            writer.writeEndElement(); // end of a: prstDash
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement(); // end of a: round
            writer.writeEndElement(); // end of a: ln
            writer.writeEndElement(); // end of c: spPr
            writer.writeStartElement('c', 'trendlineType', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, type);
            writer.writeEndElement(); // end of c: trendlineType
            writer.writeStartElement('c', 'forward', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, data.forward.toString());
            writer.writeEndElement(); // end of c: forward
            writer.writeStartElement('c', 'backward', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, data.backward.toString());
            writer.writeEndElement(); // end of c: backward
            if (data.intercept !== 'NaN') {
                writer.writeStartElement('c', 'intercept', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, data.intercept.toString());
                writer.writeEndElement(); // end of c: intercept
            }
            writer.writeStartElement('c', 'dispRSqr', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, dispRSqr.toString());
            writer.writeEndElement(); // end of c: dispRSqr
            writer.writeStartElement('c', 'dispEq', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, dispEq.toString());
            writer.writeEndElement(); // end of c: dispEq
            writer.writeEndElement(); // end of c: trendline
        }
    };
    WordExport.prototype.chartTrendLineType = function (type) {
        var trendlineType = '';
        switch (type) {
            case 'Linear':
                trendlineType = 'linear';
                break;
            case 'Exponential':
                trendlineType = 'exp';
                break;
        }
        return trendlineType;
    };
    WordExport.prototype.parseChartDataLabels = function (writer, dataLabels) {
        var position = '';
        var dataLabelPosition = dataLabels.position;
        var isLegendKey = 0;
        var isBubbleSize = 0;
        var isCategoryName = 0;
        var isSeriesName = 0;
        var isValue = 0;
        var isPercentage = 0;
        var isLeaderLines = 0;
        switch (dataLabelPosition) {
            case 'Center':
                position = 'ctr';
                break;
            case 'Left':
                position = 'l';
                break;
            case 'Right':
                position = 'r';
                break;
            case 'Outside':
                position = 'outEnd';
                break;
            case 'BestFit':
                position = 'bestFit';
                break;
            case 'Bottom':
            case 'OutsideBase':
                position = 'inBase';
                break;
            case 'Inside':
                position = 'inEnd';
                break;
            case 'Above':
                position = 't';
                break;
            case 'Below':
                position = 'b';
                break;
            default:
                position = 'Automatic';
                break;
        }
        writer.writeStartElement('c', 'dLbls', this.chartNamespace);
        this.serializeDefaultShapeProperties(writer);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement(); //end of a:bodyPr.
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement(); //end of a:lstStyle.
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, dataLabels.fontSize, dataLabels.fontColor, dataLabels.fontName);
        writer.writeEndElement(); //end of a:p.
        writer.writeEndElement(); //end of c:txPr.
        if (dataLabels.isLegendKey) {
            isLegendKey = 1;
        }
        else if (dataLabels.isBubbleSize) {
            isBubbleSize = 1;
        }
        else if (dataLabels.isCategoryName) {
            isCategoryName = 1;
        }
        else if (dataLabels.isSeriesName) {
            isSeriesName = 1;
        }
        else if (dataLabels.isValue) {
            isValue = 1;
        }
        else if (dataLabels.isPercentage) {
            isPercentage = 1;
        }
        else if (dataLabels.isLeaderLines) {
            isLeaderLines = 1;
        }
        if (position !== 'Automatic') {
            writer.writeStartElement('c', 'dLblPos', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, position);
            writer.writeEndElement(); // end of dLblPos
        }
        writer.writeStartElement('c', 'showLegendKey', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isLegendKey.toString());
        writer.writeEndElement(); // end of showLegendKey
        writer.writeStartElement('c', 'showVal', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isValue.toString());
        writer.writeEndElement(); // end of showVal
        writer.writeStartElement('c', 'showCatName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isCategoryName.toString());
        writer.writeEndElement(); // end of showCatName
        writer.writeStartElement('c', 'showSerName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isSeriesName.toString());
        writer.writeEndElement(); // end of showSerName
        writer.writeStartElement('c', 'showPercent', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isPercentage.toString());
        writer.writeEndElement(); // end of showPercent
        writer.writeStartElement('c', 'showBubbleSize', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isBubbleSize.toString());
        writer.writeEndElement(); // end of showBubbleSize
        writer.writeStartElement('c', 'showLeaderLines', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isLeaderLines.toString());
        writer.writeEndElement(); // end of showBubbleSize
        writer.writeEndElement(); // end of dLbls
    };
    WordExport.prototype.serializeShapeProperties = function (writer, color, isLine) {
        var chartType = this.chart.chartType;
        var isScatterType = (chartType === 'Scatter_Markers' || chartType === 'Bubble');
        // serialize shape
        writer.writeStartElement('c', 'spPr', this.chartNamespace);
        if (!isScatterType || isLine) {
            writer.writeStartElement('a', 'ln', this.aNamespace);
            writer.writeAttributeString(undefined, 'w', undefined, '9525');
            this.serializeChartSolidFill(writer, color, false);
            writer.writeStartElement('a', 'prstDash', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'solid');
            writer.writeEndElement(); // end of prstDash
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement(); // end tag of round
            writer.writeEndElement(); // end tag of ln
        }
        else if (chartType === 'Scatter_Markers') {
            this.serializeChartSolidFill(writer, color, false);
            this.serializeDefaultLineProperties(writer);
        }
        else if (chartType === 'Bubble') {
            this.serializeChartSolidFill(writer, color, true);
            this.serializeDefaultLineProperties(writer);
        }
        writer.writeStartElement('a', 'effectLst', this.aNamespace);
        writer.writeEndElement(); // end of a: effectLst
        writer.writeEndElement(); // end tag of spPr
    };
    WordExport.prototype.serializeDefaultShapeProperties = function (writer) {
        writer.writeStartElement('c', 'spPr', this.chartNamespace);
        writer.writeStartElement('a', 'noFill', this.aNamespace);
        writer.writeEndElement(); // end of a: noFill
        this.serializeDefaultLineProperties(writer);
        writer.writeStartElement('a', 'effectLst', this.aNamespace);
        writer.writeEndElement(); // end of a: effectLst
        writer.writeEndElement(); // end of c: spPr
    };
    WordExport.prototype.serializeDefaultLineProperties = function (writer) {
        writer.writeStartElement('a', 'ln', this.aNamespace);
        writer.writeStartElement('a', 'noFill', this.aNamespace);
        writer.writeEndElement(); // end of a: noFill
        writer.writeStartElement('a', 'round', this.aNamespace);
        writer.writeEndElement(); // end of a: round
        writer.writeEndElement(); // end of a: ln
    };
    WordExport.prototype.serializeTextProperties = function (writer, title, chartTitleName) {
        var fill = title.dataFormat.fill.foreColor;
        var fontSize = title.fontSize * 100;
        writer.writeStartElement('c', 'tx', this.chartNamespace);
        writer.writeStartElement('c', 'rich', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'rot', undefined, '0');
        writer.writeAttributeString(undefined, 'vert', undefined, 'horz');
        writer.writeEndElement(); // end of a: bodyPr
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement(); // end of a:lstStyle
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, title.fontSize, fill, title.fontName);
        writer.writeStartElement('a', 'r', this.aNamespace);
        writer.writeStartElement('a', 'rPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'lang', undefined, 'en-US');
        writer.writeAttributeString(undefined, 'b', undefined, '0');
        writer.writeAttributeString(undefined, 'sz', undefined, fontSize.toString());
        writer.writeAttributeString(undefined, 'baseline', undefined, '0');
        this.serializeChartSolidFill(writer, fill, false);
        this.serializeFont(writer, title.fontName);
        writer.writeEndElement(); // end of a: rPr
        writer.writeStartElement('a', 't', this.aNamespace);
        writer.writeString(chartTitleName);
        writer.writeEndElement(); // end of a:t
        writer.writeEndElement(); // end of a: r
        writer.writeEndElement(); // end of a: p
        writer.writeEndElement(); // end of c: rich
        writer.writeEndElement(); // end of c: tx
        writer.writeStartElement('c', 'layout', this.chartNamespace);
        // writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: layout
        writer.writeStartElement('c', 'overlay', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: overlay
        this.serializeDefaultShapeProperties(writer);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement(); // end of a: bodyPr
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement(); // end of a: lstStyle
        writer.writeStartElement('a', 'p', this.aNamespace);
        writer.writeEndElement(); // end of a: p
        this.serializeChartTitleFont(writer, title.fontSize, fill, title.fontName);
        writer.writeEndElement(); // end of c: txPr
    };
    WordExport.prototype.serializeChartTitleFont = function (writer, fontSize, fill, fontName) {
        var fontSizeCalc = fontSize * 100;
        writer.writeStartElement('a', 'pPr', this.aNamespace);
        writer.writeStartElement('a', 'defRPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'lang', undefined, 'en-US');
        writer.writeAttributeString(undefined, 'b', undefined, '0');
        writer.writeAttributeString(undefined, 'sz', undefined, fontSizeCalc.toString());
        writer.writeAttributeString(undefined, 'baseline', undefined, '0');
        this.serializeChartSolidFill(writer, fill, false);
        this.serializeFont(writer, fontName);
        writer.writeEndElement(); // end of defRPr
        writer.writeEndElement(); // end of a: pPr
    };
    WordExport.prototype.serializeChartSolidFill = function (writer, fill, isSeriesFill) {
        writer.writeStartElement('a', 'solidFill', this.aNamespace);
        writer.writeStartElement('a', 'srgbClr', this.aNamespace);
        if (fill !== '000000') {
            writer.writeAttributeString(undefined, 'val', undefined, fill);
        }
        else {
            writer.writeAttributeString(undefined, 'val', undefined, '595959');
        }
        if (this.chart.chartType === 'Bubble' && isSeriesFill) {
            writer.writeStartElement('a', 'alpha', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '75000');
            writer.writeEndElement(); // end of alpha
        }
        writer.writeEndElement(); // end of srgbClr
        writer.writeEndElement(); // end of solidFill
    };
    WordExport.prototype.serializeFont = function (writer, fontName) {
        writer.writeStartElement('a', 'latin', this.aNamespace);
        writer.writeAttributeString(undefined, 'typeface', undefined, fontName);
        writer.writeEndElement(); // end of a:latin
        writer.writeStartElement('a', 'ea', this.aNamespace);
        writer.writeAttributeString(undefined, 'typeface', undefined, fontName);
        writer.writeEndElement(); // end of a:ea
        writer.writeStartElement('a', 'cs', this.aNamespace);
        writer.writeAttributeString(undefined, 'typeface', undefined, fontName);
        writer.writeEndElement(); // end of a:cs
    };
    WordExport.prototype.parseChartSeriesColor = function (writer, dataPoints, chartType) {
        for (var i = 0; i < dataPoints.length; i++) {
            var data = dataPoints[i];
            writer.writeStartElement('c', 'spPr', this.chartNamespace);
            if (chartType === 'lineChart') {
                writer.writeStartElement('a', 'ln', this.aNamespace);
                writer.writeAttributeString(undefined, 'w', undefined, '28575');
                writer.writeAttributeString(undefined, 'cap', undefined, 'rnd');
            }
            if (chartType !== 'lineChart') {
                this.serializeChartSolidFill(writer, data.fill.foreColor, true);
            }
            else {
                this.serializeChartSolidFill(writer, data.line.color, true);
            }
            if (chartType !== 'lineChart') {
                writer.writeStartElement('a', 'ln', this.aNamespace);
                writer.writeStartElement('a', 'noFill', this.aNamespace);
                writer.writeEndElement(); // end of a: noFill
            }
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement(); // end of a: round
            writer.writeEndElement(); // end of a: ln
            writer.writeStartElement('a', 'effectLst', this.aNamespace);
            writer.writeEndElement(); // end of a: effectLst
            writer.writeEndElement(); // end of c: spPr
            if (chartType === 'lineChart') {
                var symbolType = 'none';
                var size = 0;
                if (this.chart.chartSeries[i].hasOwnProperty('seriesFormat')) {
                    symbolType = this.chart.chartSeries[i].seriesFormat.markerStyle;
                    size = this.chart.chartSeries[i].seriesFormat.markerSize;
                }
                writer.writeStartElement('c', 'marker', this.chartNamespace);
                writer.writeStartElement('c', 'symbol', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, symbolType.toLowerCase());
                writer.writeEndElement(); // end of a: symbol
                if (this.chart.chartSeries[i].hasOwnProperty('seriesFormat')) {
                    writer.writeStartElement('c', 'size', this.chartNamespace);
                    writer.writeAttributeString(undefined, 'val', undefined, size.toString());
                    writer.writeEndElement(); // end of a: size
                }
                writer.writeEndElement(); // end of a: marker
            }
        }
    };
    WordExport.prototype.parseChartDataPoint = function (writer, series) {
        // data point
        var dataPoints = series.dataPoints;
        var points = [];
        for (var j = 0; j < dataPoints.length; j++) {
            points.push(dataPoints[j]);
            writer.writeStartElement('c', 'dPt', this.chartNamespace);
            writer.writeStartElement('c', 'idx', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, j.toString());
            writer.writeEndElement(); // end of c:idx
            writer.writeStartElement('c', 'bubble3D', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of c:bubble3D
            this.parseChartSeriesColor(writer, points, this.chart.chartType);
            writer.writeEndElement(); // end of c:dPt
            points = [];
        }
    };
    // chart data value
    WordExport.prototype.serializeChartCategory = function (writer, chart, cacheType) {
        var chartCategory = chart.chartCategory;
        var chartCategoryCount = chartCategory.length;
        writer.writeStartElement('c', 'f', this.chartNamespace);
        writer.writeString('Sheet1!$A$2:$A$' + (chartCategoryCount + 1).toString());
        writer.writeEndElement(); // end of f
        writer.writeStartElement('c', cacheType, this.chartNamespace);
        if (cacheType === 'numCache') {
            writer.writeStartElement('c', 'formatCode', this.chartNamespace);
            writer.writeString('General');
            writer.writeEndElement(); // end of formatCode
        }
        writer.writeStartElement('c', 'ptCount', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, chartCategoryCount.toString());
        writer.writeEndElement(); // end of ptCount
        for (var i = 0; i < chartCategory.length; i++) {
            var category = chartCategory[i];
            writer.writeStartElement('c', 'pt', this.chartNamespace);
            writer.writeAttributeString(undefined, 'idx', undefined, i.toString());
            writer.writeStartElement('c', 'v', this.chartNamespace);
            if (category.categoryXName !== '') {
                writer.writeString(category.categoryXName);
            }
            writer.writeEndElement(); // end of v
            writer.writeEndElement(); // end of pt
        }
        writer.writeEndElement(); // end of cacheType
    };
    // chart value
    WordExport.prototype.serializeChartValue = function (writer, valueSheet, chartType) {
        var isScatterType = (chartType === 'scatterChart' || chartType === 'bubbleChart');
        var valueType = 'val';
        if (isScatterType) {
            valueType = 'yVal';
        }
        this.serializeChartYValue(writer, valueType, valueSheet);
        if (chartType === 'bubbleChart') {
            valueType = 'bubbleSize';
            valueSheet = 'Sheet1!$C$2:$C$';
            this.serializeChartYValue(writer, valueType, valueSheet);
        }
        if (chartType === 'lineChart' || chartType === 'scatterChart') {
            writer.writeStartElement('c', 'smooth', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of smooth
        }
    };
    WordExport.prototype.serializeChartYValue = function (writer, valueType, valueSheet) {
        var chart = this.chart;
        var chartCategory = chart.chartCategory;
        var chartCategoryCount = chartCategory.length;
        writer.writeStartElement('c', valueType, this.chartNamespace);
        writer.writeStartElement('c', 'numRef', this.chartNamespace);
        writer.writeStartElement('c', 'f', this.chartNamespace);
        writer.writeString(valueSheet + (chartCategoryCount + 1).toString());
        writer.writeEndElement(); // end of f
        writer.writeStartElement('c', 'numCache', this.chartNamespace);
        writer.writeStartElement('c', 'formatCode', this.chartNamespace);
        writer.writeString('General');
        writer.writeEndElement(); // end of formatCode
        writer.writeStartElement('c', 'ptCount', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, chartCategoryCount.toString());
        writer.writeEndElement(); // end of ptCount
        for (var j = 0; j < chartCategoryCount; j++) {
            var category = chartCategory[j];
            for (var k = 0; k < category.chartData.length; k++) {
                if (k === this.seriesCount) {
                    var chartData = category.chartData[this.seriesCount];
                    writer.writeStartElement('c', 'pt', this.chartNamespace);
                    writer.writeAttributeString(undefined, 'idx', undefined, j.toString());
                    writer.writeStartElement('c', 'v', this.chartNamespace);
                    if (valueType !== 'bubbleSize') {
                        writer.writeString(chartData.yValue.toString());
                    }
                    else {
                        writer.writeString(chartData.size.toString());
                    }
                    writer.writeEndElement(); // end of v
                    writer.writeEndElement(); // end of pt
                }
            }
        }
        writer.writeEndElement(); // end of numCache
        writer.writeEndElement(); // end of numRef
        writer.writeEndElement(); // end of val
    };
    // chart type
    WordExport.prototype.chartType = function (chart) {
        var chartType = chart.chartType;
        switch (chartType) {
            case 'Pie':
                chartType = 'pieChart';
                break;
            case 'Doughnut':
                chartType = 'doughnutChart';
                break;
            case 'Scatter_Markers':
                chartType = 'scatterChart';
                break;
            case 'Bubble':
                chartType = 'bubbleChart';
                break;
        }
        if (chartType === 'Area' || chartType === 'Area_Stacked' || chartType === 'Area_Stacked_100') {
            chartType = 'areaChart';
        }
        if (chartType === 'Bar_Stacked_100' || chartType === 'Bar_Stacked' || chartType === 'Bar_Clustered' ||
            chartType === 'Column_Clustered' || chartType === 'Column_Stacked' || chartType === 'Column_Stacked_100') {
            chartType = 'barChart';
        }
        if (chartType === 'Line' || chartType === 'Line_Markers' || chartType === 'Line_Markers_Stacked' || chartType === 'Line_Stacked'
            || chartType === 'Line_Markers_Stacked_100' || chartType === 'Line_Stacked_100') {
            chartType = 'lineChart';
        }
        return chartType;
    };
    // chart group
    WordExport.prototype.chartGrouping = function (type) {
        var grouping = 'standard';
        if (type === 'Bar_Stacked' || type === 'Column_Stacked' || type === 'Area_Stacked'
            || type === 'Line_Stacked' || type === 'Line_Markers_Stacked') {
            grouping = 'stacked';
        }
        else if (type === 'Bar_Stacked_100' || type === 'Column_Stacked_100' ||
            type === 'Area_Stacked_100' || type === 'Line_Stacked_100' ||
            type === 'Line_Markers_Stacked_100') {
            grouping = 'percentStacked';
        }
        else if (type === 'Bar_Clustered' || type === 'Column_Clustered') {
            grouping = 'clustered';
        }
        return grouping;
    };
    // chart legend position
    WordExport.prototype.chartLegendPosition = function (chart) {
        var legendPosition = chart.position;
        switch (legendPosition) {
            case 'Top':
                legendPosition = 't';
                break;
            case 'Bottom':
                legendPosition = 'b';
                break;
            case 'Left':
                legendPosition = 'l';
                break;
            case 'Right':
                legendPosition = 'r';
                break;
            case 'Corner':
                legendPosition = 'tr';
                break;
            default:
                legendPosition = 'b';
                break;
        }
        return legendPosition;
    };
    // update the chard id
    WordExport.prototype.updatechartId = function (chart) {
        var id = '';
        if (id === '') {
            id = this.addChartRelation(this.documentCharts, chart);
        }
        return id;
    };
    // adds the chart relation.
    WordExport.prototype.addChartRelation = function (chartCollection, chart) {
        var relationId = '';
        relationId = this.getNextRelationShipID();
        chartCollection.add(relationId, chart);
        return relationId;
    };
    WordExport.prototype.startsWith = function (sourceString, startString) {
        return startString.length > 0 && sourceString.substring(0, startString.length) === startString;
    };
    WordExport.prototype.serializeShapeDrawingGraphics = function (writer, shape) {
        var val = shape.autoShapeType;
        var id = shape.shapeId;
        writer.writeStartElement('wp', 'wrapNone', this.wpNamespace);
        writer.writeEndElement();
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, id.toString());
        writer.writeAttributeString(undefined, 'name', undefined, shape.name);
        writer.writeAttributeString(undefined, 'title', undefined, shape.title);
        writer.writeEndElement();
        writer.writeStartElement('a', 'graphic', this.aNamespace);
        writer.writeStartElement('a', 'graphicData', this.aNamespace);
        writer.writeAttributeString(undefined, 'uri', undefined, this.wpShapeNamespace);
        writer.writeStartElement('wps', 'wsp', this.wpShapeNamespace);
        writer.writeStartElement('wps', 'cNvCnPr', this.wpShapeNamespace);
        writer.writeStartElement('a', 'cxnSpLocks', this.aNamespace);
        writer.writeAttributeString(undefined, 'noChangeShapeType', undefined, '1');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('wps', 'spPr', this.wpShapeNamespace);
        writer.writeAttributeString(undefined, 'bwMode', undefined, 'auto');
        writer.writeStartElement('a', 'xfrm', this.aNamespace);
        writer.writeStartElement('a', 'off', this.aNamespace);
        writer.writeAttributeString(undefined, 'x', undefined, '0');
        writer.writeAttributeString(undefined, 'y', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('a', 'ext', this.aNamespace);
        var cx = Math.round((shape.width * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        var cy = Math.round((shape.height * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('a', 'prstGeom', this.aNamespace);
        if (val === 'StraightConnector') {
            writer.writeAttributeString(undefined, 'prst', undefined, 'straightConnector1');
        }
        else if (val === 'RoundedRectangle') {
            writer.writeAttributeString(undefined, 'prst', undefined, 'roundRect');
        }
        else {
            writer.writeAttributeString(undefined, 'prst', undefined, 'rect');
        }
        writer.writeStartElement('a', 'avLst', this.aNamespace);
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('a', 'noFill', this.aNamespace);
        writer.writeEndElement();
        writer.writeStartElement('a', 'ln', this.aNamespace);
        writer.writeAttributeString(undefined, 'w', undefined, '12700');
        if (shape.lineFormat.lineFormatType !== 'None') {
            writer.writeStartElement('a', 'solidFill', this.aNamespace);
            writer.writeStartElement('a', 'srgbClr', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.getColor(shape.lineFormat.color));
            writer.writeEndElement();
            writer.writeEndElement();
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement();
            writer.writeStartElement('a', 'headEnd', this.aNamespace);
            writer.writeEndElement();
            writer.writeStartElement('a', 'tailEnd', this.aNamespace);
            writer.writeEndElement();
        }
        else {
            writer.writeStartElement('a', 'noFill', this.aNamespace);
            writer.writeEndElement();
        }
        writer.writeEndElement();
        writer.writeEndElement();
        if (val === 'Rectangle' || val === 'RoundedRectangle') {
            writer.writeStartElement('wps', 'txbx', this.wpShapeNamespace);
            writer.writeStartElement(undefined, 'txbxContent', this.wNamespace);
            this.serializeBodyItems(writer, shape.textFrame.blocks, true);
            writer.writeEndElement();
            writer.writeEndElement();
        }
        writer.writeStartElement('wps', 'bodyPr', this.wpShapeNamespace);
        if (!isNullOrUndefined(shape.textFrame)) {
            if (shape.textFrame.leftMargin >= 0) {
                writer.writeAttributeString(undefined, 'lIns', undefined, (Math.round(shape.textFrame.leftMargin).toString()));
            }
            if (shape.textFrame.topMargin >= 0) {
                writer.writeAttributeString(undefined, 'tIns', undefined, (Math.round(shape.textFrame.topMargin).toString()));
            }
            if (shape.textFrame.rightMargin >= 0) {
                writer.writeAttributeString(undefined, 'rIns', undefined, (Math.round(shape.textFrame.rightMargin).toString()));
            }
            if (shape.textFrame.bottomMargin >= 0) {
                writer.writeAttributeString(undefined, 'bIns', undefined, (Math.round(shape.textFrame.bottomMargin).toString()));
            }
            writer.writeAttributeString(undefined, 'anchor', undefined, 't');
            writer.writeAttributeString(undefined, 'anchorCtr', undefined, '0');
        }
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
    };
    // Serialize the graphics element for pictures.
    WordExport.prototype.serializeDrawingGraphics = function (writer, picture) {
        var id = '';
        id = this.updateShapeId(picture);
        // picture.ShapeId = this.getNextDocPrID();
        // Processing picture
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, (this.mDocPrID++).toString());
        // if (!isNullOrUndefined(picture.AlternativeText))
        //     m_writer.WriteAttributeString('descr', picture.AlternativeText);
        writer.writeAttributeString(undefined, 'name', undefined, '1'.toString());
        // if (!string.IsNullOrEmpty(picture.Title))
        //     m_writer.WriteAttributeString('title', picture.Title);
        // else
        writer.writeAttributeString(undefined, 'title', undefined, '');
        // if (!picture.Visible)
        //     m_writer.WriteAttributeString('hidden', '1');
        // SerializePictureHyperlink(picture);
        writer.writeEndElement();
        writer.writeStartElement('a', 'graphic', this.aNamespace);
        writer.writeStartElement('a', 'graphicData', this.aNamespace);
        writer.writeAttributeString(undefined, 'uri', undefined, this.pictureNamespace);
        writer.writeStartElement('pic', 'pic', this.pictureNamespace);
        writer.writeStartElement('pic', 'nvPicPr', this.pictureNamespace);
        writer.writeStartElement('pic', 'cNvPr', this.pictureNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, '0');
        writer.writeAttributeString(undefined, 'name', undefined, '');
        writer.writeAttributeString(undefined, 'descr', undefined, '');
        writer.writeEndElement();
        writer.writeStartElement('pic', 'cNvPicPr', this.pictureNamespace);
        writer.writeStartElement('a', 'picLocks', this.aNamespace);
        writer.writeAttributeString(undefined, 'noChangeAspect', undefined, '1');
        writer.writeAttributeString(undefined, 'noChangeArrowheads', undefined, '1');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('pic', 'blipFill', this.pictureNamespace);
        writer.writeStartElement('a', 'blip', this.aNamespace);
        if (this.startsWith(picture.imageString, 'data:image')) {
            writer.writeAttributeString('r', 'embed', this.rNamespace, id);
        }
        else {
            if (this.documentImages.containsKey(id)) {
                //Remove the image document images collection for this particular key
                //If the picture image data has href means MS Word contains the image in media folder as well as 
                //it is having external relationship id
                // if (!this.startsWith(picture.imageString, 'data:image')) {
                this.documentImages.remove(id);
                this.externalImages.add(id, picture.imageString);
                writer.writeAttributeString(undefined, 'link', this.rNamespace, id);
            }
        }
        //End Element Blip
        writer.writeEndElement();
        if (picture.iscrop) {
            writer.writeStartElement('a', 'srcRect', this.aNamespace);
            var l = Math.round(picture.left * 1000);
            writer.writeAttributeString(undefined, 'l', undefined, l.toString());
            var t = Math.round(picture.top * 1000);
            writer.writeAttributeString(undefined, 't', undefined, t.toString());
            var r = Math.round(picture.right * 1000);
            writer.writeAttributeString(undefined, 'r', undefined, r.toString());
            var b = Math.round(picture.bottom * 1000);
            writer.writeAttributeString(undefined, 'b', undefined, b.toString());
            writer.writeEndElement();
        }
        writer.writeStartElement('a', 'stretch', this.aNamespace);
        writer.writeStartElement('a', 'fillRect', this.aNamespace);
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('pic', 'spPr', this.pictureNamespace);
        writer.writeAttributeString(undefined, 'bwMode', undefined, 'auto');
        writer.writeStartElement('a', 'xfrm', this.aNamespace);
        // if (picture.Rotation !== 0)
        //     m_writer.WriteAttributeString('rot', picture.Rotation.ToString());
        writer.writeStartElement('a', 'off', this.aNamespace);
        writer.writeAttributeString(undefined, 'x', undefined, '0');
        writer.writeAttributeString(undefined, 'y', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('a', 'ext', this.aNamespace);
        var cx = Math.round((picture.width * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        var cy = Math.round((picture.height * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('a', 'prstGeom', this.aNamespace);
        writer.writeAttributeString(undefined, 'prst', undefined, 'rect');
        writer.writeStartElement('a', 'avLst', this.aNamespace);
        writer.writeEndElement();
        writer.writeEndElement();
        //When the picture border has been added next to effect list
        //if not, Picture border has not been preserved
        // if (picture.HasBorder)
        // {
        //     if (picture.TextWrappingStyle === TextWrappingStyle.Inline && picture.IsShape)
        //         SerializeInlineShapeLine(picture.PictureShape);
        //     else
        //         SerializeShapeLine(picture.PictureShape);
        // }
        // if (picture.DocxProps.length > 0)
        //     SerializeDocxProps(picture.DocxProps, 'effectLst');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
    };
    /// Update the shape id.
    WordExport.prototype.updateShapeId = function (picture) {
        var id = '';
        var tOwner = this.paragraph;
        // Adding picture byte data to the corresponding picture collection 
        // depending on its owner subdocument
        if (this.headerFooter) {
            id = this.updateHFImageRels(this.headerFooter, picture);
        }
        else {
            if (id === '') {
                if (tOwner.hasOwnProperty('sectionFormat') || tOwner.hasOwnProperty('inlines')) {
                    id = this.addImageRelation(this.documentImages, picture);
                    // if (owner is WFootnote)
                    // {
                    //     if ((owner as WFootnote).FootnoteType === FootnoteType.Footnote)
                    //         id = AddImageRelation(FootnoteImages, picture.ImageRecord);
                    //     else
                    //         id = AddImageRelation(EndnoteImages, picture.ImageRecord);
                    // }
                    // if (owner is WComment)
                    //     id = AddImageRelation(CommentImages, picture.ImageRecord);
                }
            }
        }
        return id;
    };
    // Adds the image relation.
    WordExport.prototype.addImageRelation = function (imageCollection, image) {
        var relationId = '';
        // if (imageCollection.ContainsValue(imageRecord)) {
        //     foreach(string key in imageCollection.keys)
        //     {
        //         if (imageRecord === imageCollection[key]) {
        //             relationId = key;
        //             break;
        //         }
        //     }
        // }
        // else {
        relationId = this.getNextRelationShipID();
        imageCollection.add(relationId, image);
        // }
        return relationId;
    };
    // Update the HeaderFooter image relations.
    WordExport.prototype.updateHFImageRels = function (hf, image) {
        var id = '';
        // UpdateImages(image);
        var headerId = '';
        var types = this.headersFooters.keys;
        for (var i = 0; i < types.length; i++) {
            var hfColl = this.headersFooters.get(types[i]);
            var hfKeys = hfColl.keys;
            for (var j = 0; j < hfKeys.length; j++) {
                if (hfColl.get(hfKeys[j]) === hf) {
                    headerId = hfKeys[j];
                    var headerImages = void 0;
                    if (this.headerFooterImages.containsKey(headerId)) {
                        headerImages = this.headerFooterImages.get(headerId);
                        id = this.addImageRelation(headerImages, image);
                    }
                    else {
                        headerImages = new Dictionary();
                        id = this.addImageRelation(headerImages, image);
                        this.headerFooterImages.add(headerId, headerImages);
                    }
                }
            }
        }
        return id;
    };
    // Serialize the table
    WordExport.prototype.serializeTable = function (writer, table) {
        if (table.rows.length <= 0) {
            return;
        }
        var owner = this.table;
        this.table = table;
        writer.writeStartElement(undefined, 'tbl', this.wNamespace);
        var tableFormat = table.rows[0].rowFormat;
        this.serializeTableFormat(writer, tableFormat, table);
        this.serializeTableGrid(writer, table);
        this.serializeTableRows(writer, table.rows);
        writer.writeEndElement();
        this.table = owner;
    };
    // Serialize the table grid
    WordExport.prototype.serializeTableGrid = function (writer, table) {
        writer.writeStartElement(undefined, 'tblGrid', this.wNamespace);
        if (table.grid.length !== 0) {
            this.serializeGridColumns(writer, table.grid);
        }
        writer.writeEndElement();
    };
    // Serialize the table rows
    WordExport.prototype.serializeTableRows = function (writer, rows) {
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.cells.length > 0) {
                    if (row.hasOwnProperty('contentControlProperties')) {
                        this.serializeContentControl(writer, row.contentControlProperties, row);
                        continue;
                    }
                    this.serializeRow(writer, row);
                }
            }
        }
    };
    // Serialize the table row
    WordExport.prototype.serializeRow = function (writer, row) {
        var owner = this.row;
        this.row = row;
        writer.writeStartElement(undefined, 'tr', this.wNamespace);
        this.serializeRowFormat(writer, row);
        this.serializeCells(writer, row.cells);
        writer.writeEndElement(); //end od table row 'tr'
        this.row = owner;
    };
    // Serialize the row format
    WordExport.prototype.serializeRowFormat = function (writer, row) {
        this.serializeRowMargins(writer, row.rowFormat);
        writer.writeStartElement(undefined, 'trPr', this.wNamespace);
        //Serialize Row Height
        if (row.rowFormat.height > 0) {
            writer.writeStartElement(undefined, 'trHeight', this.wNamespace);
            if (row.rowFormat.heightType === 'Exactly') {
                writer.writeAttributeString('w', 'hRule', this.wNamespace, 'exact');
            }
            else if (row.rowFormat.heightType === 'AtLeast') {
                writer.writeAttributeString('w', 'hRule', this.wNamespace, 'atLeast');
            }
            var height = this.roundToTwoDecimal(row.rowFormat.height * this.twentiethOfPoint).toString();
            writer.writeAttributeString('w', 'val', this.wNamespace, height);
            writer.writeEndElement();
        }
        var rowFormat = row.rowFormat;
        // //Serialize 'gridBefore' element
        var gridBefore = rowFormat.gridBefore;
        if (gridBefore > 0) {
            writer.writeStartElement(undefined, 'gridBefore', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, gridBefore.toString());
            writer.writeEndElement();
        }
        // //Serialize 'gridAfter' element
        var gridAfter = rowFormat.gridAfter;
        if (gridAfter > 0) {
            writer.writeStartElement(undefined, 'gridAfter', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, gridAfter.toString());
            writer.writeEndElement();
        }
        // //Serialize 'wBefore' element 
        if (gridBefore > 0) {
            writer.writeStartElement(undefined, 'wBefore', this.wNamespace);
            switch (rowFormat.gridBeforeWidthType) {
                case 'Percent':
                    var width = this.roundToTwoDecimal(rowFormat.gridBeforeWidth * this.percentageFactor).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, width);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'pct');
                    break;
                case 'Point':
                    var pointWidth = this.roundToTwoDecimal(rowFormat.gridBeforeWidth * this.twipsInOnePoint).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, pointWidth);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'dxa');
                    break;
            }
            writer.writeEndElement();
        }
        //Serialize 'wAfter' element
        if (gridAfter > 0) {
            writer.writeStartElement(undefined, 'wAfter', this.wNamespace);
            switch (rowFormat.gridAfterWidthType) {
                case 'Percent':
                    var width = this.roundToTwoDecimal(rowFormat.gridAfterWidth * this.percentageFactor).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, width);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'pct');
                    break;
                case 'Point':
                    var pointWidth = this.roundToTwoDecimal(rowFormat.gridAfterWidth * this.twipsInOnePoint).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, pointWidth);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'dxa');
                    break;
            }
            writer.writeEndElement();
        }
        //Serialize 'cantSplit' element 
        if (!rowFormat.allowBreakAcrossPages) {
            writer.writeStartElement(undefined, 'cantSplit', this.wNamespace);
            writer.writeEndElement();
        }
        // //Serialize 'tblHeader' element 
        if (rowFormat.isHeader) {
            writer.writeStartElement(undefined, 'tblHeader', this.wNamespace);
            writer.writeEndElement();
        }
        //serialize revision
        if (!isNullOrUndefined(rowFormat.revisionIds) && rowFormat.revisionIds.length > 0) {
            this.serializeRevisionStart(writer, rowFormat, undefined);
            this.serializeRevisionEnd(writer, rowFormat, undefined);
        }
        writer.writeEndElement();
    };
    // serialize the table cells
    WordExport.prototype.serializeCells = function (writer, cells) {
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].hasOwnProperty('contentControlProperties')) {
                this.serializeContentControl(writer, cells[i].contentControlProperties, cells[i]);
                continue;
            }
            this.serializeCell(writer, cells[i]);
        }
    };
    // Serialize the table cell
    WordExport.prototype.serializeCell = function (writer, cell) {
        var owner = this.blockOwner;
        this.blockOwner = cell;
        writer.writeStartElement(undefined, 'tc', this.wNamespace);
        this.serializeCellFormat(writer, cell.cellFormat, true, true);
        if (cell.blocks.length > 0) {
            var itemIndex = 0;
            var item = undefined;
            while (itemIndex < cell.blocks.length) {
                item = cell.blocks[itemIndex];
                this.serializeBodyItem(writer, item, false);
                itemIndex += 1;
            }
        }
        else {
            writer.writeStartElement(undefined, 'p', this.wNamespace);
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);
            writer.writeStartElement(undefined, 'pStyle', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'Normal');
            writer.writeEndElement(); //end of pStyle
            writer.writeEndElement(); //end of pPr
            writer.writeEndElement(); //end of P
        }
        writer.writeEndElement(); //end of table cell 'tc' 
        var increment = 1;
        while (this.mVerticalMerge.containsKey((cell.columnIndex + cell.cellFormat.columnSpan - 1) + increment)
            && (((this.row.cells.indexOf(cell) === this.row.cells.length - 1) || this.row.cells.indexOf(cell) === cell.columnIndex))
            && cell.nextNode === undefined) {
            var collKey = (cell.columnIndex + cell.cellFormat.columnSpan - 1) + increment;
            writer.writeStartElement(undefined, 'tc', this.wNamespace);
            var endProperties = true;
            if (!isNullOrUndefined(this.spanCellFormat)) {
                endProperties = false;
                this.serializeCellFormat(writer, this.spanCellFormat, false, endProperties);
            }
            else {
                writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
                endProperties = false;
            }
            this.serializeColumnSpan(collKey, writer);
            writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'continue');
            writer.writeEndElement();
            if (!endProperties) {
                writer.writeEndElement();
            }
            this.checkMergeCell(collKey);
            writer.writeStartElement('w', 'p', this.wNamespace);
            writer.writeEndElement(); //end of P
            writer.writeEndElement(); //end of table cell 'tc'  
            increment++;
        }
        this.blockOwner = owner;
    };
    // Serialize the cell formatting
    WordExport.prototype.serializeCellFormat = function (writer, cellFormat, ensureMerge, endProperties) {
        var cell = this.blockOwner;
        //Get the table fomat
        var tf = this.table.tableFormat;
        //Get the row format
        var rf = this.row.rowFormat;
        writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
        //w:cnfStyle -   Table Cell Conditional Formatting
        // SerializeCnfStyleElement(cell);
        //w:tcW -    Preferred Table Cell Width
        this.serializeCellWidth(writer, cell);
        // serialize cell margins
        this.serializeCellMargins(writer, cellFormat);
        if (ensureMerge) {
            //w:hMerge -    Horizontally Merged Cell and w:vMerge -    Vertically Merged Cell
            this.serializeCellMerge(writer, cellFormat);
            //w:gridSpan -   Grid Columns Spanned by Current Table Cell
            this.serializeGridSpan(writer, cell);
        }
        //w:tcBorders -    Table Cell Borders
        writer.writeStartElement(undefined, 'tcBorders', this.wNamespace);
        this.serializeBorders(writer, cellFormat.borders, 8);
        writer.writeEndElement();
        //w:shd -  Table Cell Shading
        this.serializeShading(writer, cell.cellFormat.shading);
        // //w:noWrap -   Don't Wrap Cell Content
        // if (cellFormat.HasValue(CellFormat.TextWrapKey)) {
        //     m_writer.WriteStartElement('noWrap', W_namespace);
        //     if (cellFormat.TextWrap)
        //         m_writer.WriteAttributeString('w', 'val', W_namespace, 'false');
        //     m_writer.WriteEndElement();
        // }
        // //w:tcMar -  Single Table Cell Margins
        // if (!cellFormat.SamePaddingsAsTable) {
        //     m_writer.WriteStartElement('tcMar', W_namespace);
        //     SerializePaddings(cellFormat.Paddings);
        //     m_writer.WriteEndElement();
        // }
        //w:textDirection -   Table Cell Text Flow Direction
        this.serializeTableCellDirection(writer, cellFormat);
        // //w:tcFitText -  Fit Text Within Cell
        // if (cellFormat.FitText) {
        //     m_writer.WriteStartElement('tcFitText', W_namespace);
        //     m_writer.WriteEndElement();
        // }
        // //w:hideMark 
        // if (cellFormat.HideMark) {
        //     m_writer.WriteStartElement('hideMark', W_namespace);
        //     m_writer.WriteEndElement();
        // }
        //w:vAlign -  Table Cell Vertical Alignment
        // if (cellFormat.HasValue(CellFormat.VrAlignmentKey))
        this.serializeCellVerticalAlign(writer, cellFormat.verticalAlignment);
        // //w:hideMark -   Ignore End Of Cell Marker In Row Height Calculation
        // SerializeDocxProps(tempDocxProps, 'hideMark');
        // //w:cellIns -    Table Cell Insertion
        // SerializeDocxProps(tempDocxProps, 'cellIns');
        // //w:cellDel -    Table Cell Deletion
        // SerializeDocxProps(tempDocxProps, 'cellDel');
        // //w:cellMerge -   Vertically Merged/Split Table Cells
        // SerializeDocxProps(tempDocxProps, 'cellMerge');
        // if (cellFormat.OldPropertiesHash.length > 0 && !m_isAlternativeCellFormat) {
        //     m_isAlternativeCellFormat = true;
        //     SerializeTrackChangeProps('tcPrChange', cellFormat.FormatChangeAuthorName, cellFormat.FormatChangeDateTime);
        //     Dictionary < int, object > oldPropertyHash = new Dictionary<int, object>(cellFormat.OldPropertiesHash);
        //     Dictionary < int, object > propertyHash = new Dictionary<int, object>(cellFormat.PropertiesHash);
        //     cellFormat.PropertiesHash.Clear();
        //     cellFormat.OldPropertiesHash.Clear();
        //     foreach(KeyValuePair < int, object > keyValue in oldPropertyHash)
        //     cellFormat.PropertiesHash[keyValue.Key] = keyValue.Value;
        //     SerializeCellFormat(cellFormat);
        //     cellFormat.PropertiesHash.Clear();
        //     foreach(KeyValuePair < int, object > keyValue in propertyHash)
        //     cellFormat.PropertiesHash[keyValue.Key] = keyValue.Value;
        //     foreach(KeyValuePair < int, object > keyValue in oldPropertyHash)
        //     cellFormat.OldPropertiesHash[keyValue.Key] = keyValue.Value;
        //     m_writer.WriteEndElement();
        //     m_isAlternativeCellFormat = false;
        // }
        if (endProperties) {
            writer.writeEndElement();
        }
    };
    // Serialize the cell width
    WordExport.prototype.serializeCellWidth = function (writer, cell) {
        var cf = cell.cellFormat;
        writer.writeStartElement(undefined, 'tcW', this.wNamespace);
        if (cf.preferredWidthType === 'Percent') {
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'pct');
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(cf.preferredWidth * this.percentageFactor).toString());
        }
        else if (cf.preferredWidthType === 'Auto') {
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'auto');
            writer.writeAttributeString(undefined, 'w', this.wNamespace, '0');
        }
        else {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(cf.preferredWidth * this.twipsInOnePoint).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
        }
        writer.writeEndElement();
    };
    // Serialize cell merge
    WordExport.prototype.serializeCellMerge = function (writer, cellFormat) {
        var cell = this.blockOwner;
        var isserialized = false;
        var collKey;
        var currentIndex = cell.columnIndex;
        var cellIndex = this.row.cells.indexOf(cell);
        var prevIndex = cellIndex > 0 ? this.row.cells[cellIndex - 1].columnIndex : cell.columnIndex;
        if (cell.columnIndex === cellIndex) {
            collKey = cell.columnIndex;
            isserialized = true;
        }
        else {
            isserialized = false;
        }
        if (!isserialized) {
            if (cellIndex === 0) {
                currentIndex = cell.columnIndex;
                prevIndex = -1;
            }
            for (var i = prevIndex; i < currentIndex; i++) {
                collKey = prevIndex + 1;
                prevIndex += 1;
                if (this.mVerticalMerge.containsKey(collKey)) {
                    this.createMerge(writer, collKey, cell);
                }
            }
        }
        if (cellFormat.rowSpan > 1) {
            writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
            this.spanCellFormat = cellFormat;
            this.mVerticalMerge.add(collKey, cellFormat.rowSpan - 1);
            if (cellFormat.columnSpan > 1) {
                this.mGridSpans.add(collKey, cellFormat.columnSpan);
            }
            writer.writeAttributeString('w', 'val', this.wNamespace, 'restart');
            writer.writeEndElement();
        }
        else if (this.mVerticalMerge.containsKey(collKey) && isserialized) {
            this.createMerge(writer, collKey, cell);
        }
    };
    WordExport.prototype.createMerge = function (writer, collKey, cell) {
        this.serializeColumnSpan(collKey, writer);
        writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, 'continue');
        writer.writeEndElement();
        writer.writeEndElement(); //end tcPr
        writer.writeStartElement('w', 'p', this.wNamespace);
        writer.writeEndElement();
        writer.writeEndElement(); //end tc
        writer.writeStartElement(undefined, 'tc', this.wNamespace);
        writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
        this.serializeCellWidth(writer, cell);
        this.checkMergeCell(collKey);
    };
    WordExport.prototype.serializeColumnSpan = function (collKey, writer) {
        if (this.mGridSpans.keys.length > 0 && this.mGridSpans.containsKey(collKey)) {
            writer.writeStartElement(undefined, 'gridSpan', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.mGridSpans.get(collKey).toString());
            writer.writeEndElement();
        }
    };
    WordExport.prototype.checkMergeCell = function (collKey) {
        if ((this.mVerticalMerge.get(collKey) - 1) === 0) {
            this.mVerticalMerge.remove(collKey);
            this.spanCellFormat = undefined;
            if (this.mGridSpans.keys.length > 0 && this.mGridSpans.containsKey(collKey)) {
                this.mGridSpans.remove(collKey);
            }
        }
        else {
            this.mVerticalMerge.set(collKey, this.mVerticalMerge.get(collKey) - 1);
        }
    };
    // Serialize the grid span element of cell.
    WordExport.prototype.serializeGridSpan = function (writer, cell) {
        // int gridSpan = cell.cellFormat.GridSpan;
        if (cell.cellFormat.columnSpan > 1) {
            var num = cell.cellFormat.columnSpan;
            writer.writeStartElement(undefined, 'gridSpan', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, num.toString());
            writer.writeEndElement();
        }
    };
    // Serialize the table cell direction
    WordExport.prototype.serializeTableCellDirection = function (writer, cellFormat) {
        // if (cellFormat..textDirection !== TextDirection.Horizontal)
        // {
        //     m_writer.WriteStartElement('textDirection', W_namespace);
        //     switch (cellFormat.TextDirection)
        //     {
        //         case TextDirection.Horizontal:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'lrTb');
        //             break;
        //         case TextDirection.VerticalBottomToTop:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'btLr');
        //             break;
        //         case TextDirection.VerticalTopToBottom:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'tbRl');
        //             break;
        //         case TextDirection.HorizontalFarEast:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'lrTbV');
        //             break;
        //         case TextDirection.Vertical:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'tbLrV');
        //             break;
        //         case TextDirection.VerticalFarEast:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'tbRlV');
        //             break;
        //     }
        //     m_writer.WriteEndElement();
        // }
    };
    // Serialize the cell vertical alignment
    WordExport.prototype.serializeCellVerticalAlign = function (writer, alignment) {
        writer.writeStartElement(undefined, 'vAlign', this.wNamespace);
        switch (alignment) {
            case 'Center':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'center');
                break;
            case 'Bottom':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'bottom');
                break;
            default:
                writer.writeAttributeString('w', 'val', this.wNamespace, 'top');
                break;
        }
        writer.writeEndElement();
    };
    // Serialize the table grid columns.
    WordExport.prototype.serializeGridColumns = function (writer, grid) {
        for (var i = 0, count = grid.length; i < count; i++) {
            var gridValue = Math.round(grid[i] * 20);
            writer.writeStartElement(undefined, 'gridCol', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, gridValue.toString());
            writer.writeEndElement();
        }
    };
    // Serialize the row formattings.
    // Table parameter is passed for serializing table format and undefined for serializing row format.
    WordExport.prototype.serializeTableFormat = function (writer, format, table) {
        // if (!isNullOrUndefined(table))
        // {
        //     List<Stream> tempDocxProps = new List<Stream>();
        //     for (int i = 0, cnt = table.DocxTableFormat.NodeArray.length; i < cnt; i++)
        //         tempDocxProps.Add(table.DocxTableFormat.NodeArray[i]);
        writer.writeStartElement(undefined, 'tblPr', this.wNamespace);
        //     SerializeTableStlye(format);
        //     if (format.WrapTextAround &&!((table.OwnerTextBody.Owner is WTextBox) || 
        //(table.OwnerTextBody.Owner is WComment) || (table.OwnerTextBody.Owner is WFootnote)))
        //     {
        //         SerializeTablePositioning(format.Positioning);
        //         if (!format.Positioning.AllowOverlap)
        //         {
        //             m_writer.WriteStartElement('tblOverlap', W_namespace);
        //             m_writer.WriteAttributeString('val', W_namespace, 'never');
        //             m_writer.WriteEndElement();
        //         }
        //     }
        //     SerializeDocxProps(tempDocxProps, 'tblStyleRowBandSize');
        //     SerializeDocxProps(tempDocxProps, 'tblStyleColBandSize');       
        this.serializeTableWidth(writer, table);
        this.serializeTableAlignment(writer, table.tableFormat);
        this.serializeCellSpacing(writer, table.tableFormat);
        this.serializeTableIndentation(writer, table.tableFormat);
        this.serializeTableMargins(writer, table.tableFormat);
        this.serializeTableBorders(writer, table.tableFormat);
        this.serializeShading(writer, table.tableFormat.shading);
        if (table.tableFormat.bidi) {
            writer.writeStartElement(undefined, 'bidiVisual', this.wNamespace);
            writer.writeEndElement();
        }
        this.serializeTblLayout(writer, table.tableFormat);
        // this.serializeTableCellMargin(writer, table.tableFormat);
        //     SerializeTableLook(table);
        //         if (!isNullOrUndefined(table.Title))
        //             SerializeTableTitle(table);
        //         if (!isNullOrUndefined(table.Description))
        //             SerializeTableDescription(table);
        // }
        // else
        // {
        //     SerializeCellSpacing(format);
        //     SerializeTableIndentation(format);
        //     SerializeTableBorders(format);
        //     SerializeTableShading(format);
        //     SerializeTblLayout(format);
        //     SerializeTableCellMargin(format);
        // }
        // if (!isNullOrUndefined(format.OwnerBase) && format.OwnerBase is WTable
        //   && format.OldPropertiesHash.length > 0 && !m_isAlternativeTableFormat)
        // {
        //     m_isAlternativeTableFormat = true;
        //     SerializeTrackChangeProps('tblPrChange', format.FormatChangeAuthorName, format.FormatChangeDateTime);
        //     SerializeTableTrackChanges(format, format.OwnerBase as WTable);
        //     m_writer.WriteEndElement();
        //     m_isAlternativeTableFormat = false;
        // }
        // if (!isNullOrUndefined(format.OwnerRow) && format.OldPropertiesHash.length > 0)
        // {
        //     SerializeTrackChangeProps('tblPrExChange', format.FormatChangeAuthorName, format.FormatChangeDateTime);
        //     SerializeTableTrackChanges(format, undefined);
        //     m_writer.WriteEndElement();
        // }
        // SerializeTblTrackChanges(format);
        if (!isNullOrUndefined(table)) {
            writer.writeEndElement(); //end of tblPr
        }
    };
    // serialize the table margin
    WordExport.prototype.serializeTableMargins = function (writer, format) {
        this.serializeMargins(writer, format, 'tblCellMar');
    };
    // serialize the row margin
    WordExport.prototype.serializeRowMargins = function (writer, format) {
        writer.writeStartElement(undefined, 'tblPrEx', this.wNamespace);
        this.serializeMargins(writer, format, 'tblCellMar');
        writer.writeEndElement();
    };
    // serialize the cell margins
    WordExport.prototype.serializeCellMargins = function (writer, format) {
        this.serializeMargins(writer, format, 'tcMar');
    };
    // serialize the table margins, row margins, cell margins
    WordExport.prototype.serializeMargins = function (writer, format, tag) {
        writer.writeStartElement(undefined, tag, this.wNamespace);
        if (!isNullOrUndefined(format.topMargin)) {
            var topMargin = Math.round(format.topMargin * 20);
            writer.writeStartElement(undefined, 'top', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, topMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(format.leftMargin)) {
            var leftMargin = Math.round(format.leftMargin * 20);
            writer.writeStartElement(undefined, 'left', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, leftMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(format.bottomMargin)) {
            var bottomMargin = Math.round(format.bottomMargin * 20);
            writer.writeStartElement(undefined, 'bottom', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, bottomMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(format.rightMargin)) {
            var rightMargin = Math.round(format.rightMargin * 20);
            writer.writeStartElement(undefined, 'right', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, rightMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        writer.writeEndElement();
    };
    // Serialize the table borders
    WordExport.prototype.serializeShading = function (writer, format) {
        // if (format.textureStyle !== 'TextureNone') {
        writer.writeStartElement(undefined, 'shd', this.wNamespace);
        if (format.backgroundColor) {
            writer.writeAttributeString(undefined, 'fill', this.wNamespace, this.getColor(format.backgroundColor));
        }
        if (format.foregroundColor === 'empty' || isNullOrUndefined(format.foregroundColor)) {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, 'auto');
        }
        else {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, this.getColor(format.foregroundColor));
        }
        if (!isNullOrUndefined(format.textureStyle)) {
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getTextureStyle(format.textureStyle));
        }
        writer.writeEndElement();
        // }
    };
    WordExport.prototype.getTextureStyle = function (textureStyle) {
        switch (textureStyle) {
            case 'Texture5Percent':
            case 'Texture2Pt5Percent':
            case 'Texture7Pt5Percent':
                return 'pct5';
            case 'Texture10Percent':
                return 'pct10';
            case 'Texture12Pt5Percent':
                return 'pct12';
            case 'Texture15Percent':
            case 'Texture17Pt5Percent':
                return 'pct15';
            case 'Texture20Percent':
            case 'Texture22Pt5Percent':
                return 'pct20';
            case 'Texture25Percent':
            case 'Texture27Pt5Percent':
                return 'pct25';
            case 'Texture30Percent':
            case 'Texture32Pt5Percent':
                return 'pct30';
            case 'Texture35Percent':
                return 'pct35';
            case 'Texture37Pt5Percent':
                return 'pct37';
            case 'Texture40Percent':
            case 'Texture42Pt5Percent':
                return 'pct40';
            case 'Texture45Percent':
            case 'Texture47Pt5Percent':
                return 'pct45';
            case 'Texture50Percent':
            case 'Texture52Pt5Percent':
                return 'pct50';
            case 'Texture55Percent':
            case 'Texture57Pt5Percent':
                return 'pct55';
            case 'Texture60Percent':
                return 'pct60';
            case 'Texture62Pt5Percent':
                return 'pct62';
            case 'Texture65Percent':
            case 'Texture67Pt5Percent':
                return 'pct65';
            case 'Texture70Percent':
            case 'Texture72Pt5Percent':
                return 'pct70';
            case 'Texture75Percent':
            case 'Texture77Pt5Percent':
                return 'pct75';
            case 'Texture80Percent':
            case 'Texture82Pt5Percent':
                return 'pct80';
            case 'Texture85Percent':
                return 'pct85';
            case 'Texture87Pt5Percent':
                return 'pct87';
            case 'Texture90Percent':
            case 'Texture92Pt5Percent':
                return 'pct90';
            case 'Texture95Percent':
            case 'Texture97Pt5Percent':
                return 'pct95';
            case 'TextureCross':
                return 'thinHorzCross';
            case 'TextureDarkCross':
                return 'horzCross';
            case 'TextureDarkDiagonalCross':
                return 'diagCross';
            case 'TextureDarkDiagonalDown':
                return 'reverseDiagStripe';
            case 'TextureDarkDiagonalUp':
                return 'diagStripe';
            case 'TextureDarkHorizontal':
                return 'horzStripe';
            case 'TextureDarkVertical':
                return 'vertStripe';
            case 'TextureDiagonalCross':
                return 'thinDiagCross';
            case 'TextureDiagonalDown':
                return 'thinReverseDiagStripe';
            case 'TextureDiagonalUp':
                return 'thinDiagStripe';
            case 'TextureHorizontal':
                return 'thinHorzStripe';
            case 'TextureSolid':
                return 'solid';
            case 'TextureVertical':
                return 'thinVertStripe';
            default:
                return 'clear';
        }
    };
    // Serialize the table borders
    WordExport.prototype.serializeTableBorders = function (writer, format) {
        var borders = format.borders;
        // if (IsNoneBorder(borders))
        //     return;
        writer.writeStartElement(undefined, 'tblBorders', this.wNamespace);
        this.serializeBorders(writer, format.borders, 8);
        writer.writeEndElement();
    };
    // Serialize the borders.
    WordExport.prototype.serializeBorders = function (writer, borders, multipler) {
        this.serializeBorder(writer, borders.top, 'top', multipler);
        this.serializeBorder(writer, borders.left, 'left', multipler);
        this.serializeBorder(writer, borders.bottom, 'bottom', multipler);
        this.serializeBorder(writer, borders.right, 'right', multipler);
        this.serializeBorder(writer, borders.horizontal, 'insideH', multipler);
        this.serializeBorder(writer, borders.vertical, 'insideV', multipler);
        this.serializeBorder(writer, borders.diagonalDown, 'tl2br', multipler);
        this.serializeBorder(writer, borders.diagonalUp, 'tr2bl', multipler);
    };
    // Serialize the table layout element
    WordExport.prototype.serializeTblLayout = function (writer, format) {
        if (!format.allowAutoFit) {
            writer.writeStartElement(undefined, 'tblLayout', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'fixed');
            writer.writeEndElement();
        }
    };
    // Serializes the Border
    WordExport.prototype.serializeBorder = function (writer, border, tagName, multiplier) {
        var borderStyle = border.lineStyle;
        var sz = ((border.lineWidth ? border.lineWidth : 0) * multiplier);
        var space = border.space ? border.space : 0;
        if (borderStyle === 'Cleared') {
            writer.writeStartElement(undefined, tagName, this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'nil');
            writer.writeEndElement();
            return;
        }
        else if (((borderStyle === 'None' || isNullOrUndefined(borderStyle)) && !border.hasNoneStyle) || sz <= 0) {
            return;
        }
        writer.writeStartElement(undefined, tagName, this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, this.getBorderStyle(borderStyle));
        // if (border.color === '#000000')
        // {
        //     writer.writeAttributeString(undefined, 'color', this.wNamespace, 'auto');
        // }
        // else
        // {
        if (border.color) {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, this.getColor(border.color));
        }
        // }
        writer.writeAttributeString(undefined, 'sz', this.wNamespace, this.roundToTwoDecimal(sz).toString());
        writer.writeAttributeString(undefined, 'space', this.wNamespace, space.toString());
        if (border.shadow) {
            writer.writeAttributeString(undefined, 'shadow', this.wNamespace, 'on');
        }
        writer.writeEndElement();
    };
    // Get the border style as string
    WordExport.prototype.getBorderStyle = function (borderStyle) {
        switch (borderStyle) {
            case 'Cleared':
                return 'cleared';
            case 'DashSmallGap':
                return 'dashSmallGap';
            case 'Triple':
                return 'triple';
            case 'Dot':
                return 'dotted';
            case 'DashDot':
                return 'dotDash';
            case 'DashLargeGap':
                return 'dashed';
            case 'DashDotDot':
                return 'dotDotDash';
            case 'Double':
                return 'double';
            case 'ThinThickSmallGap':
                return 'thinThickSmallGap';
            case 'ThickThinSmallGap':
                return 'thickThinSmallGap';
            case 'ThinThickThinSmallGap':
                return 'thinThickThinSmallGap';
            case 'ThickThinMediumGap':
                return 'thickThinMediumGap';
            case 'ThinThickMediumGap':
                return 'thinThickMediumGap';
            case 'ThinThickThinMediumGap':
                return 'thinThickThinMediumGap';
            case 'ThickThinLargeGap':
                return 'thickThinLargeGap';
            case 'ThinThickLargeGap':
                return 'thinThickLargeGap';
            case 'ThinThickThinLargeGap':
                return 'thinThickThinLargeGap';
            case 'Thick':
                return 'thick';
            case 'SingleWavy':
                return 'wave';
            case 'DoubleWavy':
                return 'doubleWave';
            case 'DashDotStroked':
                return 'dashDotStroked';
            case 'Engrave3D':
                return 'threeDEngrave';
            case 'Emboss3D':
                return 'threeDEmboss';
            case 'Outset':
                return 'outset';
            case 'Inset':
                return 'inset';
            // case 'None':
            //     return 'none';
            default:
                return 'single';
        }
    };
    // Serialize the table indentation.
    WordExport.prototype.serializeTableIndentation = function (writer, format) {
        if (!isNullOrUndefined(format.leftIndent)) {
            writer.writeStartElement(undefined, 'tblInd', this.wNamespace);
            var tableIndent = Math.round(format.leftIndent * this.twipsInOnePoint);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, tableIndent.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
    };
    // Serialize the cell spacing.
    WordExport.prototype.serializeCellSpacing = function (writer, format) {
        if (!isNullOrUndefined(format.cellSpacing) && format.cellSpacing > 0) {
            writer.writeStartElement(undefined, 'tblCellSpacing', this.wNamespace);
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal((format.cellSpacing / 2) * this.twentiethOfPoint).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
    };
    // Serialize the table width
    WordExport.prototype.serializeTableWidth = function (writer, table) {
        writer.writeStartElement(undefined, 'tblW', this.wNamespace);
        if (table.tableFormat.preferredWidthType === 'Percent') {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, (table.tableFormat.preferredWidth * this.percentageFactor).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'pct');
        }
        else if (table.tableFormat.preferredWidthType === 'Point') {
            var tableWidth = Math.round(table.tableFormat.preferredWidth * this.twipsInOnePoint);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, tableWidth.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
        }
        else {
            writer.writeAttributeString(undefined, 'w', this.wNamespace, '0');
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'auto');
        }
        writer.writeEndElement();
    };
    // Serialize the table alignment
    WordExport.prototype.serializeTableAlignment = function (writer, format) {
        writer.writeStartElement(undefined, 'jc', this.wNamespace);
        switch (format.tableAlignment) {
            case 'Right':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'right');
                break;
            case 'Center':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'center');
                break;
            default:
                writer.writeAttributeString('w', 'val', this.wNamespace, 'left');
                break;
        }
        writer.writeEndElement();
    };
    // Serialize the field
    WordExport.prototype.serializeFieldCharacter = function (writer, field) {
        writer.writeStartElement(undefined, 'r', this.wNamespace);
        this.serializeCharacterFormat(writer, field.characterFormat);
        writer.writeStartElement(undefined, 'fldChar', this.wNamespace);
        var type = field.fieldType === 0 ? 'begin'
            : field.fieldType === 1 ? 'end' : 'separate';
        writer.writeAttributeString(undefined, 'fldCharType', this.wNamespace, type);
        if (type === 'begin' && !isNullOrUndefined(field.formFieldData)) {
            var formFieldData = field.formFieldData;
            writer.writeStartElement(undefined, 'ffData', this.wNamespace);
            writer.writeStartElement(undefined, 'name', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.name);
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'enabled', this.wNamespace);
            writer.writeEndElement();
            if (formFieldData.hasOwnProperty('textInput')) {
                writer.writeStartElement(undefined, 'textInput', this.wNamespace);
                var type_1 = formFieldData.textInput.type;
                if (type_1 === 'Number' || 'Date') {
                    writer.writeStartElement(undefined, 'type', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.textInput.type.toString().toLowerCase());
                    writer.writeEndElement();
                }
                writer.writeStartElement(undefined, 'defalut', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.textInput.defaultValue);
                writer.writeEndElement();
                writer.writeStartElement(undefined, 'format', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.textInput.format);
                writer.writeEndElement();
                writer.writeEndElement();
            }
            else if (formFieldData.hasOwnProperty('checkBox')) {
                writer.writeStartElement(undefined, 'checkBox', this.wNamespace);
                if (formFieldData.checkBox.sizeType === 'Auto') {
                    writer.writeStartElement(undefined, 'sizeAuto', this.wNamespace);
                    writer.writeEndElement();
                }
                else {
                    writer.writeStartElement(undefined, 'size', this.wNamespace);
                    // tslint:disable-next-line:max-line-length
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, this.roundToTwoDecimal(formFieldData.checkBox.size * 2).toString());
                    writer.writeEndElement();
                }
                writer.writeStartElement(undefined, 'defalut', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.checkBox.defaultValue ? '1' : '0');
                writer.writeEndElement();
                if (formFieldData.checkBox.checked) {
                    writer.writeStartElement(undefined, 'checked', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.checkBox.checked ? '1' : '0');
                    writer.writeEndElement();
                }
                writer.writeEndElement();
            }
            else {
                writer.writeStartElement(undefined, 'ddList', this.wNamespace);
                if (formFieldData.dropDownList.selectedIndex !== 0) {
                    writer.writeStartElement(undefined, 'result', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.dropDownList.selectedIndex.toString());
                    writer.writeEndElement();
                }
                for (var i = 0; i < formFieldData.dropDownList.dropDownItems.length; i++) {
                    writer.writeStartElement(undefined, 'listEntry', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.dropDownList.dropDownItems[i].toString());
                    writer.writeEndElement();
                }
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
        writer.writeEndElement();
        writer.writeEndElement();
        if (field.fieldType === 0 && field.fieldCodeType === 'FieldFormTextInput') {
            writer.writeStartElement('w', 'r', this.wNamespace);
            writer.writeStartElement(undefined, 'instrText', this.wNamespace);
            writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
            writer.writeString('FORMTEXT');
            writer.writeEndElement();
            writer.writeEndElement();
        }
    };
    // Serialize the text range.
    WordExport.prototype.serializeTextRange = function (writer, span, previousNode, efType) {
        writer.writeStartElement('w', 'r', this.wNamespace);
        if (!isNullOrUndefined(span.characterFormat)) {
            this.serializeCharacterFormat(writer, span.characterFormat);
        }
        if (span.text === '\t') {
            writer.writeElementString(undefined, 'tab', this.wNamespace, undefined);
        }
        else if (span.text === '\v') {
            writer.writeElementString(undefined, 'br', this.wNamespace, undefined);
        }
        else if (span.text === '\f') {
            writer.writeStartElement(undefined, 'br', this.wNamespace);
            writer.writeAttributeString('w', 'type', this.wNamespace, 'page');
            writer.writeEndElement();
        }
        else if (encodeURI(span.text) === '%02') {
            writer.writeStartElement(undefined, 'footnoteRef', this.wNamespace);
            writer.writeEndElement();
        }
        else if (encodeURI(span.text) === '%02' && efType === 'endnote') {
            writer.writeStartElement(undefined, 'endnoteRef', this.wNamespace);
            writer.writeEndElement();
        }
        else if (encodeURI(span.text) === '%03') {
            writer.writeStartElement(undefined, 'separator', this.wNamespace);
            writer.writeEndElement();
        }
        else if (encodeURI(span.text) === '%04') {
            writer.writeStartElement(undefined, 'continuationSeparator', this.wNamespace);
            writer.writeEndElement();
        }
        else {
            var isDeleteText = this.retrieveDeleteRevision(span);
            var isField = !isNullOrUndefined(previousNode)
                && previousNode.hasOwnProperty('fieldType') && previousNode.fieldType !== 2;
            var localName = isField ? isDeleteText ? 'delInstrText' : 'instrText' : isDeleteText ? 'delText' : 't';
            writer.writeStartElement(undefined, localName, this.wNamespace);
            writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
            writer.writeString(span.text);
            writer.writeEndElement();
        }
        writer.writeEndElement();
    };
    WordExport.prototype.retrieveDeleteRevision = function (span) {
        if (span.hasOwnProperty('revisionIds')) {
            if (span.revisionIds.length > 0) {
                for (var i = 0; i < span.revisionIds.length; i++) {
                    if (this.retrieveRevision(span.revisionIds[i]).revisionType === 'Deletion') {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    // Serializes the paragraph format
    WordExport.prototype.serializeParagraphFormat = function (writer, paragraphFormat, paragraph) {
        if (isNullOrUndefined(paragraphFormat)) {
            return;
        }
        if (!isNullOrUndefined(paragraphFormat.styleName)) {
            writer.writeStartElement(undefined, 'pStyle', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, paragraphFormat.styleName);
            writer.writeEndElement(); //end of pStyle
        }
        if (!isNullOrUndefined(paragraph)) {
            this.serializeListFormat(writer, paragraph.paragraphFormat.listFormat);
        }
        else {
            this.serializeListFormat(writer, paragraphFormat.listFormat);
        }
        if (paragraphFormat.bidi) {
            writer.writeStartElement(undefined, 'bidi', this.wNamespace);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(paragraphFormat.outlineLevel)) {
            writer.writeStartElement(undefined, 'outlineLvl', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getOutlineLevelValue(paragraphFormat.outlineLevel).toString());
            writer.writeEndElement();
        }
        this.serializeParagraphSpacing(writer, paragraphFormat);
        if (!isNullOrUndefined(paragraphFormat.contextualSpacing)) {
            writer.writeStartElement('w', 'contextualSpacing', this.wNamespace);
            if (!paragraphFormat.contextualSpacing) {
                writer.writeAttributeString('w', 'val', this.wNamespace, '0');
            }
            writer.writeEndElement();
        }
        this.serializeIndentation(writer, paragraphFormat);
        this.serializeParagraphAlignment(writer, paragraphFormat.textAlignment, paragraphFormat.bidi);
        if (!isNullOrUndefined(paragraphFormat.tabs) && paragraphFormat.tabs.length > 0) {
            this.serializeTabs(writer, paragraphFormat.tabs);
        }
    };
    WordExport.prototype.getOutlineLevelValue = function (outlineLvl) {
        if (outlineLvl.indexOf('Level') !== -1) {
            var lvlNumber = parseInt(outlineLvl.substring(5), 10);
            if (lvlNumber > 0) {
                return lvlNumber - 1;
            }
        }
        return 9;
    };
    // Serialize Tabs
    WordExport.prototype.serializeTabs = function (writer, tabStops) {
        writer.writeStartElement('w', 'tabs', this.wNamespace);
        for (var i = 0; i < tabStops.length; i++) {
            this.serializeTab(writer, tabStops[i]);
        }
        writer.writeEndElement();
    };
    WordExport.prototype.serializeTab = function (writer, tabStop) {
        var position = 0;
        writer.writeStartElement('w', 'tab', this.wNamespace);
        if (tabStop.position === 0 && tabStop.deletePosition !== 0) {
            position = tabStop.deletePosition * this.twentiethOfPoint;
            writer.writeAttributeString('w', 'val', this.wNamespace, 'clear');
        }
        else {
            position = tabStop.position * this.twentiethOfPoint;
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getTabJustification(tabStop.tabJustification));
        }
        if (!isNullOrUndefined(tabStop.tabLeader) && (tabStop.tabLeader !== 'None')) {
            writer.writeAttributeString('w', 'leader', this.wNamespace, this.getTabLeader(tabStop.tabLeader));
        }
        writer.writeAttributeString('w', 'pos', this.wNamespace, position.toString() + '');
        writer.writeEndElement();
    };
    WordExport.prototype.getTabLeader = function (tabLeader) {
        switch (tabLeader) {
            case 'Dot':
                return 'dot';
            case 'Hyphen':
                return 'hyphen';
            case 'Underscore':
                return 'underscore';
            default:
                return 'none';
        }
    };
    WordExport.prototype.getTabJustification = function (tabJustification) {
        switch (tabJustification) {
            case 'Bar':
                return 'bar';
            case 'Center':
                return 'center';
            case 'Decimal':
                return 'decimal';
            case 'Left':
                return 'left';
            case 'List':
                return 'num';
            case 'Right':
                return 'right';
            default:
                return 'clear';
        }
    };
    // // Seraializes the pargraph list format
    // private serializeListParagraph(writer: XmlWriter, paragraph: any): void {
    //     if (!isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
    //         this.serializeListFormat(writer, paragraph.paragraphFormat.listFormat);
    //     }
    // }
    // Serialize the list format
    WordExport.prototype.serializeListFormat = function (writer, lf) {
        // let pStyleName = undefined;
        // if (lf.CurrentListStyle.IsBuiltInStyle && !isNullOrUndefined(lf.OwnerParagraph))
        // {
        //     pStyleName = lf.OwnerParagraph.StyleName;
        // }
        // int listId = GetListId(lf);
        // if (!isNullOrUndefined(pStyleName) && string.IsNullOrEmpty(lf.LFOStyleName)) 
        // {
        //     WordDocument doc = lf.OwnerParagraph.Document;
        //     WParagraphStyle style = doc.Styles.FindByName(pStyleName, StyleType.ParagraphStyle) as WParagraphStyle;
        //     if (style.ListIndex === -1)
        //     {
        //         ListStyle lstStyle = lf.OwnerParagraph.Document.ListStyles.FindByName(lf.CustomStyleName);
        //         style.ListIndex = listId;
        //         if (lstStyle.Levels.length > 1)
        //         {
        //             style.ListLevel = lf.ListLevelNumber;
        //         }
        //         pStyleName = pStyleName.Replace(' ', '');
        //         lstStyle.Levels[lf.ListLevelNumber].ParaStyleName = pStyleName;
        //     }
        // }
        // else
        // {
        // if (!isNullOrUndefined(lf.listId) && !isNullOrUndefined(lf.listLevelNumber)) {
        //     this.serializeNumPr(writer, lf.listId, lf.listLevelNumber);
        // }
        // }
        if (!isNullOrUndefined(lf.listId) || !isNullOrUndefined(lf.listLevelNumber)) {
            writer.writeStartElement(undefined, 'numPr', this.wNamespace);
            if (!isNullOrUndefined(lf.listLevelNumber) && lf.listLevelNumber !== -1) {
                writer.writeStartElement(undefined, 'ilvl', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, lf.listLevelNumber.toString());
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(lf.listId)) {
                writer.writeStartElement(undefined, 'numId', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, (lf.listId + 1).toString());
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    };
    // // Serializes the numbering properties to the paragraph
    // private serializeNumPr(writer: XmlWriter, listId: number, listLevel: number): void {
    //     writer.writeStartElement(undefined, 'numPr', this.wNamespace);
    //     if (listLevel !== -1) {
    //         writer.writeStartElement(undefined, 'ilvl', this.wNamespace);
    //         writer.writeAttributeString('w', 'val', this.wNamespace, listLevel.toString());
    //         writer.writeEndElement();
    //     }
    //     if (listId !== -1) {
    //         writer.writeStartElement(undefined, 'numId', this.wNamespace);
    //         writer.writeAttributeString('w', 'val', this.wNamespace, listId.toString());
    //         writer.writeEndElement();
    //     }
    //     writer.writeEndElement();
    // }
    WordExport.prototype.serializeParagraphAlignment = function (writer, txtAlignment, isBidi) {
        if (isBidi) {
            if (txtAlignment === 'Right') {
                txtAlignment = 'Left';
            }
            else if (txtAlignment === 'Left') {
                txtAlignment = 'Right';
            }
        }
        if (!isNullOrUndefined(txtAlignment)) {
            writer.writeStartElement(undefined, 'jc', this.wNamespace);
            var alignment = void 0;
            switch (txtAlignment) {
                case 'Center':
                    alignment = 'center';
                    break;
                case 'Right':
                    alignment = 'right';
                    break;
                case 'Justify':
                    alignment = 'both';
                    break;
                default:
                    alignment = 'left';
                    break;
            }
            writer.writeAttributeString('w', 'val', this.wNamespace, alignment);
            writer.writeEndElement();
        }
    };
    // Serializes the paragraph spacings
    WordExport.prototype.serializeParagraphSpacing = function (writer, paragraphFormat) {
        writer.writeStartElement(undefined, 'spacing', this.wNamespace);
        // if (paragraphFormat.HasValue(WParagraphFormat.BeforeLinesKey))
        // {
        //     short beforeLines = (short)Math.Round(paragraphFormat.BeforeLines * DLSConstants.HundredthsUnit);
        //     writer.WriteAttributeString('beforeLines', this.wNamespace, ToString((float)beforeLines));               
        // }
        // if (paragraphFormat.HasValue(WParagraphFormat.AfterLinesKey))
        // {
        //     short afterLines = (short)Math.Round(paragraphFormat.AfterLines * DLSConstants.HundredthsUnit);
        //     writer.WriteAttributeString('afterLines', this.wNamespace, ToString((float)afterLines));                 
        // }
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(paragraphFormat.beforeSpacing)) {
            writer.writeAttributeString(undefined, 'before', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.beforeSpacing * this.twentiethOfPoint).toString());
        }
        //TODO:ISSUEFIX(paragraphFormat.beforeSpacing * this.twentiethOfPoint).toString());
        // if (paragraphFormat.HasValue(WParagraphFormat.SpacingBeforeAutoKey))
        // {
        //     if (paragraphFormat.SpaceBeforeAuto)
        //     {
        //         writer.WriteAttributeString('beforeAutospacing', this.wNamespace, '1');
        //     }
        //     else
        //     {
        //         writer.WriteAttributeString('beforeAutospacing', this.wNamespace, '0');
        //     }
        // }
        if (!isNullOrUndefined(paragraphFormat.afterSpacing)) {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'after', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.afterSpacing * this.twentiethOfPoint).toString());
        }
        //TODO:ISSUEFIX(paragraphFormat.afterSpacing * this.twentiethOfPoint).toString());
        // if (paragraphFormat.HasValue(WParagraphFormat.SpacingAfterAutoKey))
        // {
        //     if (paragraphFormat.SpaceAfterAuto)
        //     {
        //         writer.WriteAttributeString('afterAutospacing', this.wNamespace, '1');
        //     }
        //     else
        //     {
        //         writer.WriteAttributeString('afterAutospacing', this.wNamespace, '0');
        //     }
        // }
        //TODO:ISSUEFIX((paragraphFormat.lineSpacing) * this.twentiethOfPoint).toString());
        if (!isNullOrUndefined(paragraphFormat.lineSpacing)) {
            // tslint:disable-next-line:max-line-length
            var lineSpacingValue = (paragraphFormat.lineSpacingType === 'AtLeast' || paragraphFormat.lineSpacingType === 'Exactly') ? this.roundToTwoDecimal(paragraphFormat.lineSpacing * this.twentiethOfPoint) : this.roundToTwoDecimal(paragraphFormat.lineSpacing * 240);
            writer.writeAttributeString(undefined, 'line', this.wNamespace, lineSpacingValue.toString());
        }
        if (!isNullOrUndefined(paragraphFormat.lineSpacingType)) {
            var lineSpacingType = 'auto';
            if (paragraphFormat.lineSpacingType === 'AtLeast') {
                lineSpacingType = 'atLeast';
            }
            else if (paragraphFormat.lineSpacingType === 'Exactly') {
                lineSpacingType = 'exact';
            }
            writer.writeAttributeString(undefined, 'lineRule', this.wNamespace, lineSpacingType);
        }
        writer.writeEndElement();
    };
    // Serializes the paragraph indentation
    WordExport.prototype.serializeIndentation = function (writer, paragraphFormat) {
        writer.writeStartElement(undefined, 'ind', this.wNamespace);
        if (!isNullOrUndefined(paragraphFormat.leftIndent)) {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'left', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.leftIndent * this.twipsInOnePoint).toString());
        }
        if (!isNullOrUndefined(paragraphFormat.rightIndent)) {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'right', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.rightIndent * this.twipsInOnePoint).toString());
        }
        if (!isNullOrUndefined(paragraphFormat.firstLineIndent)) {
            if (paragraphFormat.firstLineIndent < 0) {
                // tslint:disable-next-line:max-line-length
                writer.writeAttributeString(undefined, 'hanging', this.wNamespace, this.roundToTwoDecimal(-1 * paragraphFormat.firstLineIndent * this.twipsInOnePoint).toString());
            }
            else {
                // tslint:disable-next-line:max-line-length
                writer.writeAttributeString(undefined, 'firstLine', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.firstLineIndent * this.twipsInOnePoint).toString());
            }
        }
        writer.writeEndElement();
    };
    //creates custom xml mapping
    WordExport.prototype.serializeCustomXMLMapping = function (customXML, writer) {
        if (customXML.length > 0) {
            var keys = customXML.keys;
            for (var i = 0; i < keys.length; i++) {
                var customXmlWriter = new XmlWriter();
                customXmlWriter.writeStartElement(undefined, 'Relationships', this.rpNamespace);
                var xmlData = this.mCustomXML.get(keys[i]);
                var itemID = keys[i];
                var id = this.getNextRelationShipID();
                var fileIndex = i + 1;
                var itemPath = this.createXMLItem(xmlData, id, fileIndex);
                var itemPropsPath = this.createXMLItemProps(itemID, fileIndex);
                this.serializeRelationShip(writer, id, this.customXmlRelType, '../' + itemPath);
                this.customXMLRelation(customXmlWriter, fileIndex, itemPropsPath);
                customXmlWriter.writeEndElement();
                // tslint:disable-next-line:max-line-length
                var zipArchiveItem = new ZipArchiveItem(customXmlWriter.buffer, this.customXMLRelPath + fileIndex + '.xml.rels');
                this.mArchive.addItem(zipArchiveItem);
            }
        }
    };
    WordExport.prototype.customXMLRelation = function (writer, fileIndex, itemPropsPath) {
        this.serializeRelationShip(writer, 'rId1', this.wordMLCustomXmlPropsRelType, itemPropsPath);
    };
    WordExport.prototype.createXMLItem = function (xmlData, id, fileIndex) {
        var xmlBlob = new Blob([xmlData], { type: 'text/plain' });
        var itemPath = this.customXMLItemsPath + fileIndex + '.xml';
        var zipArchiveItem = new ZipArchiveItem(xmlBlob, itemPath);
        this.mArchive.addItem(zipArchiveItem);
        return itemPath;
    };
    WordExport.prototype.createXMLItemProps = function (itemID, fileIndex) {
        var writer = new XmlWriter();
        var customitemPropsPath = this.customXMLItemsPropspath + fileIndex + '.xml';
        var itemPropsPath = this.itemPropsPath + fileIndex + '.xml';
        writer.writeStartElement('ds', 'datastoreItem', this.wNamespace);
        writer.writeAttributeString('ds', 'itemID', undefined, itemID);
        writer.writeAttributeString('xmlns', 'ds', undefined, this.dsNamespace);
        writer.writeEndElement();
        this.customXMLProps.push(customitemPropsPath);
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, customitemPropsPath);
        this.mArchive.addItem(zipArchiveItem);
        return itemPropsPath;
    };
    // Serialize the styles (styles.xml)
    WordExport.prototype.serializeStyles = function () {
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'styles', this.wNamespace);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
        //writes the document defaults, latent styles and default styles.
        this.serializeDefaultStyles(writer);
        //writes the document styles
        this.serializeDocumentStyles(writer);
        writer.writeEndElement(); //end of styles tag
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.stylePath);
        this.mArchive.addItem(zipArchiveItem); //this.stylePath, styleStream, false, FileAttributes.Archive);
    };
    // Serializes the default styles (document default paragraph and character format)
    WordExport.prototype.serializeDefaultStyles = function (writer) {
        writer.writeStartElement(undefined, 'docDefaults', this.wNamespace);
        //if (HasDefaultCharFormat())
        //{
        writer.writeStartElement(undefined, 'rPrDefault', this.wNamespace);
        // if (!isNullOrUndefined(this.mDocument.characterFormat)) {
        this.serializeCharacterFormat(writer, this.defCharacterFormat);
        writer.writeEndElement(); // end of rPrDefault
        // }
        // else {
        //     writer.writeStartElement(undefined, 'rPr', this.wNamespace);
        //     writer.writeStartElement(undefined, 'rFonts', this.wNamespace);
        //     if (!string.IsNullOrEmpty(m_document.StandardAsciiFont))
        //         writer.WriteAttributeString('ascii', this.wNamespace, m_document.StandardAsciiFont);
        //     if (!string.IsNullOrEmpty(m_document.StandardFarEastFont))
        //         writer.WriteAttributeString('eastAsia', this.wNamespace, m_document.StandardFarEastFont);
        //     if (!string.IsNullOrEmpty(m_document.StandardNonFarEastFont))
        //         writer.WriteAttributeString('hAnsi', this.wNamespace, m_document.StandardNonFarEastFont);
        //     if (!string.IsNullOrEmpty(m_document.StandardBidiFont))
        //         writer.WriteAttributeString('cs', this.wNamespace, m_document.StandardBidiFont);
        //     writer.WriteEndElement();
        //     float fontSize = GetDefFontSize(m_document, WCharacterFormat.FontSizeKey);
        //     if (fontSize !== 0f)
        //     {
        //         writer.WriteStartElement('sz', this.wNamespace);
        //         writer.WriteAttributeString('val', this.wNamespace, (fontSize * 2).ToString(CultureInfo.InvariantCulture));
        //         writer.WriteEndElement();
        //     }
        //     fontSize = GetDefFontSize(m_document, WCharacterFormat.FontSizeBidiKey);
        //     if (fontSize !== 0f)
        //     {
        //         writer.WriteStartElement('szCs', this.wNamespace);
        //         writer.WriteAttributeString('val', this.wNamespace, (fontSize * 2).ToString(CultureInfo.InvariantCulture));
        //         writer.WriteEndElement();
        //     }
        //     writer.WriteEndElement();
        // }
        // writer.WriteEndElement();
        // //}
        writer.writeStartElement(undefined, 'pPrDefault', this.wNamespace);
        if (!isNullOrUndefined(this.defParagraphFormat)) {
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);
            this.serializeParagraphFormat(writer, this.defParagraphFormat, undefined);
            writer.writeEndElement(); //end of pPr
        }
        writer.writeEndElement(); //end of pPrDefault
        // writer.WriteEndElement();
        // SerializeLatentStyles();
        // //Default styles
        // if (m_document.Styles.length === 0 || isNullOrUndefined(m_document.Styles.FindByName('Normal')))
        // {
        //     SerializeDefaultParagraphStyle();
        // }
        // if (!IsDocumentContainsDefaultTableStyle())
        // {
        //     SerializeTableNormalStyle();
        // }
        // if (isNullOrUndefined(m_document.Styles.FindByName('No List')) && isNullOrUndefined(m_document.Styles.FindByName('NoList')))
        //     SerializeNoListStyle();
        // tslint:disable-next-line:max-line-length
        // if (isNullOrUndefined(m_document.Styles.FindByName('Table Grid')) && isNullOrUndefined(m_document.Styles.FindByName('TableGrid')))
        // {
        //     SerializeTableGridStyle();
        // }
        // }        
        writer.writeEndElement();
    };
    WordExport.prototype.serializeDocumentStyles = function (writer) {
        for (var i = 0; i < this.mStyles.length; i++) {
            var style = this.mStyles[i];
            writer.writeStartElement(undefined, 'style', this.wNamespace);
            var type = style.type === 'Paragraph' ? 'paragraph' : 'character';
            writer.writeAttributeString('w', 'type', this.wNamespace, type);
            writer.writeAttributeString('w', 'styleId', this.wNamespace, style.name);
            //name
            writer.writeStartElement(undefined, 'name', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, style.name);
            writer.writeEndElement();
            //basedOn
            if (!isNullOrUndefined(style.basedOn)) {
                writer.writeStartElement(undefined, 'basedOn', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, style.basedOn);
                writer.writeEndElement();
            }
            //next
            if (!isNullOrUndefined(style.next)) {
                writer.writeStartElement(undefined, 'next', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, style.next);
                writer.writeEndElement();
            }
            //link
            if (!isNullOrUndefined(style.link)) {
                writer.writeStartElement(undefined, 'link', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, style.link);
                writer.writeEndElement();
            }
            if (style.type === 'Paragraph') {
                writer.writeStartElement(undefined, 'pPr', this.wNamespace);
                this.serializeParagraphFormat(writer, style.paragraphFormat, undefined);
                writer.writeEndElement();
            }
            // let value = (style.characterFormat as WCharacterFormat).newgetCharacterFormat();
            this.serializeCharacterFormat(writer, style.characterFormat);
            writer.writeEndElement(); //end of Style
        }
    };
    // Serializes the Character format
    WordExport.prototype.serializeCharacterFormat = function (writer, characterFormat) {
        writer.writeStartElement(undefined, 'rPr', this.wNamespace);
        if (!isNullOrUndefined(characterFormat.styleName)) {
            writer.writeStartElement(undefined, 'rStyle', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, characterFormat.styleName);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontFamily)) {
            writer.writeStartElement(undefined, 'rFonts', this.wNamespace);
            writer.writeAttributeString(undefined, 'ascii', this.wNamespace, characterFormat.fontFamily);
            writer.writeAttributeString(undefined, 'hAnsi', this.wNamespace, characterFormat.fontFamily);
            writer.writeAttributeString(undefined, 'eastAsia', this.wNamespace, characterFormat.fontFamily);
            writer.writeAttributeString(undefined, 'cs', this.wNamespace, characterFormat.fontFamilyBidi);
            writer.writeEndElement(); //end         
        }
        if (!isNullOrUndefined(characterFormat.bold)) {
            this.serializeBoolProperty(writer, 'b', characterFormat.bold);
        }
        if (characterFormat.boldBidi) {
            this.serializeBoolProperty(writer, 'bCs', characterFormat.boldBidi);
        }
        if (!isNullOrUndefined(characterFormat.italic)) {
            this.serializeBoolProperty(writer, 'i', characterFormat.italic);
        }
        if (!isNullOrUndefined(characterFormat.italicBidi)) {
            this.serializeBoolProperty(writer, 'iCs', characterFormat.italicBidi);
        }
        if (characterFormat.bidi) {
            writer.writeStartElement(undefined, 'rtl', this.wNamespace);
            writer.writeEndElement();
        }
        if (characterFormat.allCaps) {
            this.serializeBoolProperty(writer, 'caps', characterFormat.allCaps);
        }
        if (!isNullOrUndefined(characterFormat.strikethrough)) {
            switch (characterFormat.strikethrough) {
                case 'SingleStrike':
                    this.serializeBoolProperty(writer, 'strike', true);
                    break;
                case 'DoubleStrike':
                    this.serializeBoolProperty(writer, 'dstrike', true);
                    break;
                default:
                    this.serializeBoolProperty(writer, 'strike', false);
                    this.serializeBoolProperty(writer, 'dstrike', false);
                    break;
            }
        }
        if (!isNullOrUndefined(characterFormat.fontColor)) {
            writer.writeStartElement(undefined, 'color', this.wNamespace);
            if (characterFormat.fontColor === 'empty') {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'auto');
            }
            else {
                writer.writeAttributeString('w', 'val', this.wNamespace, this.getColor(characterFormat.fontColor));
            }
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontSize)) {
            writer.writeStartElement(undefined, 'sz', this.wNamespace);
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString('w', 'val', this.wNamespace, this.roundToTwoDecimal(characterFormat.fontSize * 2).toString());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontSizeBidi)) {
            writer.writeStartElement(undefined, 'szCs', this.wNamespace);
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString('w', 'val', this.wNamespace, this.roundToTwoDecimal(characterFormat.fontSizeBidi * 2).toString());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.highlightColor) && characterFormat.highlightColor !== 'NoColor') {
            writer.writeStartElement(undefined, 'highlight', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getHighlightColor(characterFormat.highlightColor));
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.revisionIds) && characterFormat.revisionIds.length > 0) {
            this.serializeRevisionStart(writer, characterFormat, undefined);
            this.serializeRevisionEnd(writer, characterFormat, undefined);
        }
        if (!isNullOrUndefined(characterFormat.underline) && characterFormat.underline !== 'None') {
            writer.writeStartElement(undefined, 'u', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getUnderlineStyle(characterFormat.underline));
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.baselineAlignment)) {
            writer.writeStartElement(undefined, 'vertAlign', this.wNamespace);
            switch (characterFormat.baselineAlignment) {
                case 'Subscript':
                    writer.writeAttributeString('w', 'val', this.wNamespace, 'subscript');
                    break;
                case 'Superscript':
                    writer.writeAttributeString('w', 'val', this.wNamespace, 'superscript');
                    break;
                default:
                    writer.writeAttributeString('w', 'val', this.wNamespace, 'baseline');
                    break;
            }
            writer.writeEndElement();
        }
        writer.writeEndElement(); //end of rPrChange
    };
    WordExport.prototype.getColor = function (color) {
        if (color.length > 0) {
            if (color[0] === '#') {
                color = color.substr(1);
            }
            if (color.length > 6) {
                color = color.substr(0, 6);
            }
        }
        return color;
    };
    // Get the underline style as string
    WordExport.prototype.getUnderlineStyle = function (underlineStyle) {
        switch (underlineStyle) {
            case 'DotDotDashHeavy':
                return 'dashDotDotHeavy';
            case 'DotDashHeavy':
                return 'dashDotHeavy';
            case 'DashHeavy':
                return 'dashedHeavy';
            case 'DashLong':
                return 'dashLong';
            case 'DashLongHeavy':
                return 'dashLongHeavy';
            case 'DotDash':
                return 'dotDash';
            case 'DotDotDash':
                return 'dotDotDash';
            case 'Dotted':
                return 'dotted';
            case 'DottedHeavy':
                return 'dottedHeavy';
            case 'Double':
                return 'double';
            case 'Single':
                return 'single';
            case 'Thick':
                return 'thick';
            case 'Wavy':
                return 'wave';
            case 'WavyDouble':
                return 'wavyDouble';
            case 'WavyHeavy':
                return 'wavyHeavy';
            case 'Words':
                return 'words';
            default:
                return 'dash';
        }
    };
    WordExport.prototype.getHighlightColor = function (highlight) {
        switch (highlight) {
            // Highlights the content with bright green (#ff00ff00) color.
            case 'BrightGreen':
                return 'green';
            // Highlights the content with turquoise (#ff00ffff) color.
            case 'Turquoise':
                return 'cyan';
            // Highlights the content with pink (#ffff00ff) color.
            case 'Pink':
                return 'magenta';
            // Highlights the content with blue (#ff0000ff) color.
            case 'Blue':
                return 'blue';
            // Highlights the content with red (#ffff0000) color.
            case 'Red':
                return 'red';
            // Highlights the content with dark blue (#ff000080) color.
            case 'DarkBlue':
                return 'darkBlue';
            // Highlights the content with teal (#ff008080) color.
            case 'Teal':
                return 'darkCyan';
            // Highlights the content with green (#ff008000) color.
            case 'Green':
                return 'darkGreen';
            // Highlights the content with violet (#ff800080) color.
            case 'Violet':
                return 'darkMagenta';
            // Highlights the content with dark red (#ff800000) color.
            case 'DarkRed':
                return 'darkRed';
            // Highlights the content with dark yellow (#ff808000)  color.
            case 'DarkYellow':
                return 'darkYellow';
            // Highlights the content with gray 50 (#ff808080) color.
            case 'Gray50':
                return 'darkGray';
            // Highlights the content with gray 25 (#ffc0c0c0) color.
            case 'Gray25':
                return 'lightGray';
            // Highlights the content with black (#ff000000) color.
            case 'Black':
                return 'black';
            // Highlights the content with yellow (#ffffff00) color.
            default:
                return 'yellow';
        }
    };
    /*private toggleFirstCahar(text: string) {
        return text.charAt(0).toLowerCase() + text.slice(1);
    }*/
    // Serializes the bool character format property
    WordExport.prototype.serializeBoolProperty = function (writer, tag, value) {
        writer.writeStartElement(undefined, tag, this.wNamespace);
        if (!value) {
            writer.writeAttributeString(undefined, 'val', this.wNamespace, '0');
        }
        writer.writeEndElement();
    };
    // Serialize the list styles and numberings (numberings.xml)
    WordExport.prototype.serializeNumberings = function () {
        if (this.document.lists.length === 0) {
            return;
        }
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'numbering', this.wNamespace);
        this.writeCommonAttributeStrings(writer);
        // this.serializePictureBullets(writer, this.mDocument.lists);
        this.serializeAbstractListStyles(writer, this.document.abstractLists);
        this.serializeListInstances(writer, this.document.lists);
        // SerializeListOverrides(writer, this.mDocument.ridesm_document.ListOverrides);
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.numberingPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    // Serializes the abstract list styles
    WordExport.prototype.serializeAbstractListStyles = function (writer, listStyles) {
        for (var i = 0; i < listStyles.length; i++) {
            var abstractList = listStyles[i];
            writer.writeStartElement(undefined, 'abstractNum', this.wNamespace);
            writer.writeAttributeString(undefined, 'abstractNumId', this.wNamespace, abstractList.abstractListId.toString());
            writer.writeStartElement(undefined, 'nsid', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, this.generateHex());
            writer.writeEndElement();
            for (var ilvl = 0, cnt = abstractList.levels.length; ilvl < cnt; ilvl++) {
                this.serializeListLevel(writer, abstractList.levels[ilvl], ilvl);
            }
            writer.writeEndElement(); //end of abstractNum
        }
    };
    // Serializes the list styles
    WordExport.prototype.serializeListInstances = function (writer, listStyles) {
        for (var i = 0; i < listStyles.length; i++) {
            var list = listStyles[i];
            writer.writeStartElement(undefined, 'num', this.wNamespace);
            writer.writeAttributeString(undefined, 'numId', this.wNamespace, (list.listId + 1).toString());
            writer.writeStartElement(undefined, 'abstractNumId', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, list.abstractListId.toString());
            writer.writeEndElement();
            writer.writeEndElement();
        }
    };
    WordExport.prototype.generateHex = function () {
        return (Math.floor(Math.random() * (4000000000 - 270000000)) + 270000000).toString(16).toUpperCase();
    };
    WordExport.prototype.roundToTwoDecimal = function (num) {
        return Math.round(num); // * 100) / 100;
    };
    // Serialize the list level
    WordExport.prototype.serializeListLevel = function (writer, listLevel, levelIndex) {
        writer.writeStartElement(undefined, 'lvl', this.wNamespace);
        writer.writeAttributeString(undefined, 'ilvl', this.wNamespace, levelIndex.toString());
        writer.writeStartElement(undefined, 'start', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, listLevel.startAt.toString());
        writer.writeEndElement();
        writer.writeStartElement(undefined, 'numFmt', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getLevelPattern(listLevel.listLevelPattern));
        writer.writeEndElement();
        // if (listLevel.restartLevel > 0) {
        //     writer.writeStartElement(undefined, 'lvlRestart', this.wNamespace);
        //     writer.writeAttributeString(undefined, 'val', this.wNamespace, '0');
        //     writer.writeEndElement();
        // }
        // if (!isNullOrUndefined(listLevel.paragraphFormat)) {
        //     string name = listLevel.ParaStyleName.Substring(0, 1).ToUpper() + listLevel.ParaStyleName.Remove(0, 1);
        //     writer.WriteStartElement('pStyle', this.wNamespace);
        //     writer.WriteAttributeString('val', this.wNamespace, name);
        //     writer.WriteEndElement();
        // }
        // if (listLevel.IsLegalStyleNumbering) {
        //     writer.WriteStartElement('isLgl', this.wNamespace);
        //     writer.WriteEndElement();
        // }
        this.serializeLevelFollow(writer, listLevel);
        this.serializeLevelText(writer, listLevel, levelIndex + 1);
        // SerializeLegacyProperties(listLevel);
        // if (listLevel.PicBulletId > 0) {
        //     writer.WriteStartElement('lvlPicBulletId', this.wNamespace);
        //     writer.WriteAttributeString('val', this.wNamespace, listLevel.PicBulletId.ToString());
        //     writer.WriteEndElement();
        // }
        // //lvlJc
        // if (listLevel.NumberAlignment !== ListNumberAlignment.Left) {
        //     writer.WriteStartElement('lvlJc', this.wNamespace);
        //     string alignment = string.Empty;
        //     if (listLevel.NumberAlignment === ListNumberAlignment.Right) {
        //         alignment = 'right';
        //     }
        //     else {
        //         alignment = 'center';
        //     }
        //     writer.WriteAttributeString('val', this.wNamespace, alignment);
        //     writer.WriteEndElement();
        // }
        writer.writeStartElement(undefined, 'pPr', this.wNamespace);
        this.serializeParagraphFormat(writer, listLevel.paragraphFormat, undefined);
        writer.writeEndElement(); //end of pPr
        this.serializeCharacterFormat(writer, listLevel.characterFormat);
        writer.writeEndElement();
    };
    WordExport.prototype.getLevelPattern = function (levelPattern) {
        var patternType;
        switch (levelPattern) {
            case 'Arabic':
                patternType = 'decimal';
                break;
            case 'UpRoman':
                patternType = 'upperRoman';
                break;
            case 'LowRoman':
                patternType = 'lowerRoman';
                break;
            case 'UpLetter':
                patternType = 'upperLetter';
                break;
            case 'LowLetter':
                patternType = 'lowerLetter';
                break;
            // case 'Ordinal':
            //     patternType = 'ordinal';
            //     break;
            // case 'Number':
            //     patternType = 'cardinalText';
            //     break;
            // case 'OrdinalText':
            //     patternType = 'ordinalText';
            //     break;
            // case 'LeadingZero':
            //     patternType = 'decimalZero';
            //     break;
            // case 'Bullet':
            default:
                patternType = 'bullet';
                break;
            // case 'FarEast':
            //     patternType = 'aiueoFullWidth';
            //     break;
            // case 'Special':
            //     patternType = 'russianLower';
            //     break;
            // case 'None':
            //     patternType = 'none';
            //     break;
        }
        return patternType;
    };
    // Serializes the level text
    WordExport.prototype.serializeLevelText = function (writer, listLevel, lvlIndex) {
        writer.writeStartElement(undefined, 'lvlText', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, (listLevel.numberFormat));
        writer.writeEndElement();
    };
    // Serialize the level follow character
    WordExport.prototype.serializeLevelFollow = function (writer, listLevel) {
        var fc;
        //TODO:Type issue returns number instead of string
        if (listLevel.followCharacter === 'Tab') {
            fc = 'tab';
        }
        else if (listLevel.followCharacter === 'Space') {
            fc = 'space';
        }
        else {
            fc = 'nothing';
        }
        writer.writeStartElement(undefined, 'suff', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, fc);
        writer.writeEndElement();
    };
    WordExport.prototype.serializeDocumentProtectionSettings = function (writer) {
        writer.writeStartElement('w', 'documentProtection', this.wNamespace);
        if (this.formatting) {
            writer.writeAttributeString('w', 'formatting', this.wNamespace, '1');
        }
        if (this.protectionType && this.protectionType !== 'NoProtection') {
            var editMode = this.protectionType === 'ReadOnly' ? 'readOnly' : 'forms';
            writer.writeAttributeString('w', 'edit', this.wNamespace, editMode);
        }
        writer.writeAttributeString('w', 'cryptProviderType', this.wNamespace, 'rsaAES');
        writer.writeAttributeString('w', 'cryptAlgorithmClass', this.wNamespace, 'hash');
        writer.writeAttributeString('w', 'cryptAlgorithmType', this.wNamespace, 'typeAny');
        writer.writeAttributeString('w', 'cryptAlgorithmSid', this.wNamespace, '14');
        writer.writeAttributeString('w', 'cryptSpinCount', this.wNamespace, '100000');
        if (this.enforcement) {
            writer.writeAttributeString('w', 'enforcement', this.wNamespace, '1');
        }
        if (this.hashValue) {
            writer.writeAttributeString('w', 'hash', this.wNamespace, this.hashValue);
        }
        if (this.saltValue) {
            writer.writeAttributeString('w', 'salt', this.wNamespace, this.saltValue);
        }
        writer.writeEndElement();
    };
    WordExport.prototype.serializeSettings = function () {
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'settings', this.wNamespace);
        this.writeCustom(writer);
        // writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        // writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        // writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        // writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        // writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('xmlns', 'sl', undefined, this.slNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
        // //w:writeProtection - Write Protection
        this.serializeDocumentProtectionSettings(writer);
        //w:view - Document View Setting
        // if (this.mDocument.ViewSetup.DocumentViewType !== DocumentViewType.PrintLayout &&
        //   m_document.ViewSetup.DocumentViewType !== DocumentViewType.NormalLayout)
        // {
        //     writer.writeStartElement('view', this.wNamespace);
        //     string viewTypeStr = string.Empty;
        //     if (m_document.ViewSetup.DocumentViewType === DocumentViewType.OutlineLayout)
        //     {
        //         viewTypeStr = 'outline';
        //     }
        //     else if (m_document.ViewSetup.DocumentViewType === DocumentViewType.WebLayout)
        //     {
        //         viewTypeStr = 'web';
        //     }
        //     writer.writeAttributeString('val', this.wNamespace, viewTypeStr);
        //     writer.writeEndElement();
        // }
        //w:zoom - Magnification Setting
        writer.writeStartElement('w', 'zoom', this.wNamespace);
        // switch (m_document.ViewSetup.ZoomType)
        // {
        //     case ZoomType.FullPage:
        //         writer.writeAttributeString('w', 'val', this.wNamespace, 'fullPage');
        //         break;
        //     case ZoomType.PageWidth:
        //         writer.writeAttributeString('w', 'val', this.wNamespace, 'bestFit');
        //         break;
        //     case ZoomType.TextFit:
        //         writer.writeAttributeString('w', 'val', this.wNamespace, 'textFit');
        //         break;
        // default:
        writer.writeAttributeString('w', 'val', this.wNamespace, 'none');
        // break;
        // }
        writer.writeAttributeString('w', 'percent', this.wNamespace, '100');
        writer.writeEndElement();
        //w:displayBackgroundShape - Display Background Objects When Displaying Document
        // if (m_document.Background.Type !== BackgroundType.NoBackground)
        // {
        writer.writeStartElement(undefined, 'displayBackgroundShape', this.wNamespace);
        writer.writeEndElement();
        // }
        //w:defaultTabStop - Distance Between Automatic Tab Stops
        writer.writeStartElement(undefined, 'defaultTabStop', this.wNamespace);
        var tabWidth = Math.round(this.defaultTabWidthValue * this.twipsInOnePoint);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, tabWidth.toString());
        writer.writeEndElement();
        //w:evenAndOddHeaders - Different Even/Odd Page Headers and Footers        
        if (this.mDifferentFirstPage) {
            writer.writeStartElement(undefined, 'evenAndOddHeaders', this.wNamespace);
            writer.writeEndElement();
        }
        //w:footnotePr - Document-Wide Footnote Properties and w:endnotePr - Document-Wide Endnote Properties
        // SerializeFootnoteSettings();
        //w:compat - Compatibility Settings
        if (!this.formFieldShading) {
            writer.writeStartElement(undefined, 'doNotShadeFormData', this.wNamespace);
            writer.writeEndElement();
        }
        writer.writeStartElement(undefined, 'compat', this.wNamespace);
        if (this.dontUseHtmlParagraphAutoSpacing) {
            this.serializeBoolProperty(writer, 'doNotUseHTMLParagraphAutoSpacing', this.dontUseHtmlParagraphAutoSpacing);
        }
        writer.writeStartElement(undefined, 'compatSetting', this.wNamespace);
        writer.writeAttributeString(undefined, 'name', this.wNamespace, 'compatibilityMode');
        writer.writeAttributeString(undefined, 'uri', this.wNamespace, 'http://schemas.microsoft.com/office/word');
        writer.writeAttributeString(undefined, 'val', this.wNamespace, '15');
        writer.writeEndElement();
        writer.writeEndElement();
        if (this.document.footnotes) {
            //this.serializeFootNotesPr(writer, this.document.section.sectionFormat);
            writer.writeStartElement(undefined, 'footnotePr', this.wNamespace);
            writer.writeStartElement(undefined, 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            writer.writeEndElement();
            writer.writeEndElement();
        }
        if (this.document.endnotes) {
            // this.serializeEndNotesPr(writer, this.document.section.sectionFormat);
            writer.writeStartElement(undefined, 'endnotePr', this.wNamespace);
            writer.writeStartElement(undefined, 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            writer.writeEndElement();
            writer.writeEndElement();
        }
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.settingsPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeCoreProperties = function () {
        //implementation
    };
    WordExport.prototype.serializeAppProperties = function () {
        //implementation
    };
    WordExport.prototype.serializeFontTable = function (contentType) {
        //implementation
    };
    WordExport.prototype.serializeSettingsRelation = function () {
        //implementation
    };
    WordExport.prototype.serializeHeaderFooters = function () {
        this.serializeHeaderFooter('EvenFooter');
        this.serializeHeaderFooter('EvenHeader');
        this.serializeHeaderFooter('FirstPageFooter');
        this.serializeHeaderFooter('FirstPageHeader');
        this.serializeHeaderFooter('OddFooter');
        this.serializeHeaderFooter('OddHeader');
    };
    // Serializes the Header/Footer
    WordExport.prototype.serializeHeaderFooter = function (hfType) {
        if (this.headersFooters.length === 0) {
            return;
        }
        var headerFooterPath;
        var headerFooterRelsPath;
        if (!this.headersFooters.containsKey(hfType)) {
            return;
        }
        var hfColl = this.headersFooters.get(hfType);
        var hf = undefined;
        for (var i = 0; i < hfColl.keys.length; i++) {
            var id = hfColl.keys[i];
            hf = hfColl.get(id);
            if (hfType === 'EvenHeader' || hfType === 'FirstPageHeader' ||
                hfType === 'OddHeader') {
                headerFooterPath = this.headerPath + id.replace('rId', '') + '.xml';
                headerFooterRelsPath = this.headerRelationPath + id.replace('rId', '') + '.xml.rels';
                this.serializeHeader(hf, id, headerFooterPath, headerFooterRelsPath);
            }
            else {
                headerFooterPath = this.footerPath + id.replace('rId', '') + '.xml';
                headerFooterRelsPath = this.footerRelationPath + id.replace('rId', '') + '.xml.rels';
                this.serializeFooter(hf, id, headerFooterPath, headerFooterRelsPath);
            }
        }
    };
    // Serialize the header part
    WordExport.prototype.serializeHeader = function (header, id, headerFooterPath, headerFooterRelsPath) {
        this.headerFooter = header;
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'hdr', this.wNamespace);
        this.writeHFCommonAttributes(writer);
        var owner = this.blockOwner;
        this.blockOwner = header;
        this.serializeBodyItems(writer, header.blocks, true);
        this.blockOwner = owner;
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, headerFooterPath);
        this.mArchive.addItem(zipArchiveItem);
        this.serializeHFRelations(id, headerFooterRelsPath);
        this.headerFooter = undefined;
    };
    // Serializes the HeaderFooter relations
    WordExport.prototype.serializeHFRelations = function (hfId, headerFooterRelsPath) {
        var hasHFImage = this.headerFooterImages.containsKey(hfId);
        // let hasHFHyperlinks = HeaderFooterHyperlinks.ContainsKey(hfId);
        // let hasHFInclPics = HeaderFooterInclPicUrls.ContainsKey(hfId);
        // let hasHFAlternateChunks = HeaderFooterAlternateChunks.ContainsKey(hfId);
        if (hasHFImage) { // || hasHFHyperlinks ||hasHFAlternateChunks
            var writer = new XmlWriter();
            writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
            this.serializeImagesRelations(this.headerFooterImages.get(hfId), writer);
            // if (hasHFHyperlinks)
            //     SerializeHyperlinkRelations(stream, HeaderFooterHyperlinks[hfId]);
            // if (hasHFAlternateChunks)
            //     SerializeAltChunkRelations(stream, HeaderFooterAlternateChunks[hfId]);
            // if (hasHFInclPics)
            //     SerializeIncludePictureUrlRelations(stream, HeaderFooterInclPicUrls[hfId]);
            // if (HFOleContainers.ContainsKey(hfId))
            // {
            //     AddOLEToZip(HFOleContainers[hfId]);
            // }
            // if (HFRelations.ContainsKey(hfId))
            //     SerializeHFCommonRelations(stream, HFRelations[hfId]);
            writer.writeEndElement();
            var zipArchiveItem = new ZipArchiveItem(writer.buffer, headerFooterRelsPath);
            this.mArchive.addItem(zipArchiveItem);
        }
        else {
            return;
        }
    };
    WordExport.prototype.writeHFCommonAttributes = function (writer) {
        writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        writer.writeAttributeString('xmlns', 've', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        writer.writeAttributeString('xmlns', 'wne', undefined, this.wneNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeAttributeString('xmlns', 'pic', undefined, this.pictureNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        this.writeDup(writer);
        writer.writeAttributeString('xmlns', 'wps', undefined, this.wpShapeNamespace);
        writer.writeAttributeString('ve', 'Ignorable', undefined, 'w14 w15 wp14');
    };
    // Serailize the footer and its relations
    WordExport.prototype.serializeFooter = function (footer, id, headerFooterPath, headerFooterRelsPath) {
        this.headerFooter = footer;
        var writer = new XmlWriter();
        writer.writeStartElement('w', 'ftr', this.wNamespace);
        this.writeHFCommonAttributes(writer);
        this.serializeBodyItems(writer, footer.blocks, true);
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, headerFooterPath);
        this.mArchive.addItem(zipArchiveItem);
        this.serializeHFRelations(id, headerFooterRelsPath);
    };
    WordExport.prototype.serializeDocumentRelations = function () {
        var writer = new XmlWriter();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextRelationShipID(), this.stylesRelType, 'styles.xml');
        this.serializeRelationShip(writer, this.getNextRelationShipID(), this.settingsRelType, 'settings.xml');
        if (this.document.endnotes) {
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.footnoteRelType, 'footnotes.xml');
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.endnoteRelType, 'endnotes.xml');
        }
        if (this.mComments.length > 0) {
            if (!(this.mComments.length === 1 && this.mComments[0].text === '')) {
                this.serializeRelationShip(writer, this.getNextRelationShipID(), this.commentsRelType, 'comments.xml');
                this.serializeRelationShip(writer, this.getNextRelationShipID(), this.commentsExRelType, 'commentsExtended.xml');
            }
        }
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.ThemeRelType, 'theme/theme1.xml');
        if (this.document.lists.length > 0) {
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.numberingRelType, 'numbering.xml');
        }
        //this.serializeFootnoteEndnoteRelations(writer);
        this.serializeHeaderFooterRelations(writer);
        //this.serializeFootnoteXMLMapping(writer);
        // if (HasFontTable) {
        //     SerializeRelationShip(docRelstream, GetNextRelationShipID(), this.FontTableRelType, 'fontTable.xml');
        // }
        // SerializeIncludePictureUrlRelations(docRelstream, InclPicFieldUrl);
        // //// Creating relationships for every hyperlink and image containing in the document
        this.serializeImagesRelations(this.documentImages, writer);
        // serialize custom xml
        this.serializeCustomXMLMapping(this.mCustomXML, writer);
        // serialize chart relations
        this.serializeChartDocumentRelations(this.documentCharts, writer);
        // SerializeSvgImageRelation();
        //this.serializeExternalLinkImages(writer);
        // if (HasHyperlink && HyperlinkTargets.length > 0) {
        //     SerializeHyperlinkRelations(docRelstream, HyperlinkTargets);
        // }
        // if (m_document.HasMacros
        //     && IsMacroEnabled)
        //     SerializeRelationShip(docRelstream, GetNextRelationShipID(), this.VbaProjectRelType, this.VbaProject);
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.wordRelationPath);
        this.mArchive.addItem(zipArchiveItem);
        this.headerFooter = undefined;
    };
    // serialize chart relations
    WordExport.prototype.serializeChartDocumentRelations = function (charts, writer) {
        if (charts.length > 0) {
            var keys = charts.keys;
            for (var i = 1; i <= keys.length; i++) {
                this.serializeRelationShip(writer, keys[i - 1], this.chartRelType, 'charts/chart' + i + '.xml');
            }
        }
    };
    WordExport.prototype.serializeChartRelations = function () {
        var writer = new XmlWriter();
        this.resetChartRelationShipId();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        var chartColorPath = 'colors' + this.chartCount + '.xml';
        var chartRelationPath = this.chartPath + '/_rels/chart' + this.chartCount + '.xml.rels';
        var chartExcelPath = '../embeddings/Microsoft_Excel_Worksheet' + this.chartCount + '.xlsx';
        // tslint:disable-next-line:max-line-length
        this.serializeRelationShip(writer, this.getNextChartRelationShipID(), this.packageRelType, chartExcelPath);
        this.serializeRelationShip(writer, this.getNextChartRelationShipID(), this.chartColorStyleRelType, chartColorPath);
        writer.writeEndElement(); // end of relationships
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, chartRelationPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    // Serializes the image relations
    WordExport.prototype.serializeImagesRelations = function (images, writer) {
        if (images.length > 0) {
            var imagePath = '';
            var base64ImageString = void 0;
            var keys = images.keys;
            for (var i = 0; i < keys.length; i++) {
                var mImage = images.get(keys[i]);
                base64ImageString = mImage.imageString;
                if (isNullOrUndefined(base64ImageString)) {
                    imagePath = this.imagePath + '/0.jpeg';
                    this.serializeRelationShip(writer, keys[i], this.imageRelType, imagePath.replace('word/', ''));
                }
                else {
                    var imageInfo = HelperMethods.formatClippedString(base64ImageString);
                    var extension = imageInfo.extension;
                    var formatClippedString = imageInfo.formatClippedString;
                    imagePath = this.imagePath + keys[i] + extension;
                    this.serializeRelationShip(writer, keys[i], this.imageRelType, imagePath.replace('word/', ''));
                    //if (m_archive.Find(imagePath.Replace('\\', '/')) === -1)
                    // {
                    var imageBlob = new Blob([this.encodedString(formatClippedString)]);
                    var zipArchiveItem = new ZipArchiveItem(imageBlob, imagePath);
                    // let TestArchive = new ZipArchive();
                    this.mArchive.addItem(zipArchiveItem);
                    // TestArchive.save('image.zip').then(function (): void {
                    //     TestArchive.destroy();
                    // });
                    // }
                }
            }
        }
    };
    /**
     * @private
     */
    WordExport.prototype.encodedString = function (input) {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var chr1;
        var chr2;
        var chr3;
        var encode1;
        var encode2;
        var encode3;
        var encode4;
        var count = 0;
        var resultIndex = 0;
        /*let dataUrlPrefix: string = 'data:';*/
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        var totalLength = input.length * 3 / 4;
        if (input.charAt(input.length - 1) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (input.charAt(input.length - 2) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (totalLength % 1 !== 0) {
            // totalLength is not an integer, the length does not match a valid
            // base64 content. That can happen if:
            // - the input is not a base64 content
            // - the input is *almost* a base64 content, with a extra chars at the
            // beginning or at the end
            // - the input uses a base64 variant (base64url for example)
            throw new Error('Invalid base64 input, bad content length.');
        }
        var output = new Uint8Array(totalLength | 0);
        while (count < input.length) {
            encode1 = keyStr.indexOf(input.charAt(count++));
            encode2 = keyStr.indexOf(input.charAt(count++));
            encode3 = keyStr.indexOf(input.charAt(count++));
            encode4 = keyStr.indexOf(input.charAt(count++));
            chr1 = (encode1 << 2) | (encode2 >> 4);
            chr2 = ((encode2 & 15) << 4) | (encode3 >> 2);
            chr3 = ((encode3 & 3) << 6) | encode4;
            output[resultIndex++] = chr1;
            if (encode3 !== 64) {
                output[resultIndex++] = chr2;
            }
            if (encode4 !== 64) {
                output[resultIndex++] = chr3;
            }
        }
        return output;
    };
    WordExport.prototype.serializeExternalLinkImages = function (writer) {
        var imagePath = '';
        var keys = this.externalImages.keys;
        for (var i = 0; i < this.externalImages.keys.length; i++) {
            this.serializeRelationShip(writer, keys[i], this.imageRelType, this.externalImages.get(keys[i]));
        }
    };
    // Serializes the HeaderFooters relations to the document relations stream
    WordExport.prototype.serializeHeaderFooterRelations = function (writer) {
        this.serializeHFRelation(writer, 'EvenFooter');
        this.serializeHFRelation(writer, 'EvenHeader');
        this.serializeHFRelation(writer, 'FirstPageFooter');
        this.serializeHFRelation(writer, 'FirstPageHeader');
        this.serializeHFRelation(writer, 'OddFooter');
        this.serializeHFRelation(writer, 'OddHeader');
    };
    // Serializes the headers footers relations.
    WordExport.prototype.serializeHFRelation = function (writer, hfType) {
        var headerFooterPath = '';
        var relType;
        if (!this.headersFooters.containsKey(hfType)) {
            return;
        }
        var hfColl = this.headersFooters.get(hfType);
        for (var i = 0; i < hfColl.keys.length; i++) {
            var id = hfColl.keys[i];
            if (hfType === 'EvenHeader' || hfType === 'FirstPageHeader' ||
                hfType === 'OddHeader') {
                headerFooterPath = 'header' + id.replace('rId', '') + '.xml';
                relType = this.headerRelType;
            }
            else {
                headerFooterPath = 'footer' + id.replace('rId', '') + '.xml';
                relType = this.footerRelType;
            }
            this.serializeRelationShip(writer, id, relType, headerFooterPath);
        }
    };
    // Serializes the relationship
    WordExport.prototype.serializeRelationShip = function (writer, relationshipID, relationshipType, targetPath) {
        writer.writeStartElement(undefined, 'Relationship', undefined);
        writer.writeAttributeString(undefined, 'Id', undefined, relationshipID);
        writer.writeAttributeString(undefined, 'Type', undefined, relationshipType);
        writer.writeAttributeString(undefined, 'Target', undefined, targetPath.replace('\\', '/').replace('\v', ''));
        // tslint:disable-next-line:max-line-length
        if (relationshipType === this.hyperlinkRelType || this.startsWith(targetPath, 'http://') || this.startsWith(targetPath, 'https://') || this.startsWith(targetPath, 'file:///')) {
            // Uri targetUri;
            // if ((!targetPath.StartsWith('file:///')) && Uri.TryCreate(targetPath, UriKind.Absolute, out targetUri))
            // {
            //     //Handled using Try catch to avoid exception if the Host name type is None because in 
            //Silverlight 'HostNameType' property is not available.
            //     try
            //     {
            //         m_writer.WriteAttributeString('Target', targetUri.AbsoluteUri);
            //     }
            //     catch
            //     {
            //         m_writer.WriteAttributeString('Target', targetPath.Replace('\\', '/').Replace(ControlChar.LineBreak, string.Empty));
            //     }
            // }
            // else
            // {
            //     m_writer.WriteAttributeString('Target', targetPath.Replace('\\', '/').Replace(ControlChar.LineBreak, string.Empty));
            // }
            writer.writeAttributeString(undefined, 'TargetMode', undefined, 'External');
        }
        writer.writeEndElement();
    };
    // Get the next relationship ID
    WordExport.prototype.getNextRelationShipID = function () {
        return 'rId' + (++this.mRelationShipID);
    };
    WordExport.prototype.getEFNextRelationShipID = function () {
        return (++this.efRelationShipId).toString();
    };
    WordExport.prototype.serializeGeneralRelations = function () {
        var writer = new XmlWriter();
        this.resetRelationShipID();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextRelationShipID(), this.documentRelType, this.documentPath);
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.AppRelType, this.appPath);
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.CoreRelType, this.corePath);
        //End of Relationships tag
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.generalRelationPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    WordExport.prototype.serializeContentTypes = function (contentType) {
        var writer = new XmlWriter();
        writer.writeStartElement(undefined, 'Types', 'http://schemas.openxmlformats.org/package/2006/content-types');
        //if (m_hasOleObject)
        //{
        //    //<Default Extension='bin' ContentType='application/vnd.openxmlformats-officedocument.oleObject'/>
        //    SerializeDefaultContentType(contentStream, 'bin', 'application/vnd.openxmlformats-officedocument.oleObject');
        //}
        this.serializeDefaultContentType(writer, 'rels', this.relationContentType);
        this.serializeDefaultContentType(writer, 'xml', this.xmlContentType);
        // if (m_hasEmbedFonts && !string.IsNullOrEmpty(type))
        // {
        //     SerializeDefaultContentType(contentStream,type, this.fontContentType);
        // }
        if (this.documentImages.length > 0 || this.externalImages.length > 0 || this.headerFooterImages.length > 0) {
            this.serializeDefaultContentType(writer, 'png', 'image/png');
            this.serializeDefaultContentType(writer, 'bmp', 'image/bmp');
            this.serializeDefaultContentType(writer, 'emf', 'image/x-emf');
            this.serializeDefaultContentType(writer, 'wmf', 'image/x-wmf');
            this.serializeDefaultContentType(writer, 'gif', 'image/gif');
            this.serializeDefaultContentType(writer, 'ico', 'image/x-icon');
            this.serializeDefaultContentType(writer, 'tif', 'image/tiff');
            this.serializeDefaultContentType(writer, 'tiff', 'image/tiff');
            this.serializeDefaultContentType(writer, 'jpeg', 'image/jpeg');
            this.serializeDefaultContentType(writer, 'jpg', 'image/jpeg');
            this.serializeDefaultContentType(writer, 'svg', 'image/svg+xml');
        }
        // if (m_document.HasMacros
        //     && IsMacroEnabled && !m_isSkipBinExtension)
        // {
        //     SerializeDefaultContentType(contentStream, 'bin', this.VbaProjectContentType);
        //     m_isSkipBinExtension = true;
        // }
        // if (m_hasOleObject)
        // {
        //     SerializeOleContentType(contentStream);
        // }
        //document.xml
        this.serializeOverrideContentType(writer, this.documentPath, this.documentContentType);
        // tslint:disable-next-line:max-line-length
        //<Override PartName='/word/numbering.xml' ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml'/>
        // if (HasNumbering) {
        this.serializeOverrideContentType(writer, this.numberingPath, this.numberingContentType);
        // }
        //Add the header/footer Alternate chunks
        // if (HeaderFooterAlternateChunks.length > 0) {
        //     foreach(Dictionary < string, string > item in m_headerFooterAlternateChunks.Values)
        //     AddAlternateChunkItem(item);
        // }
        //styles.xml
        this.serializeOverrideContentType(writer, this.stylePath, this.stylesContentType);
        //settings.xml
        this.serializeOverrideContentType(writer, this.settingsPath, this.settingsContentType);
        this.serializeOverrideContentType(writer, this.commentsPath, this.commentsContentType);
        //comments.xml
        this.serializeOverrideContentType(writer, this.commentsExtendedPath, this.commentsExContentType);
        //charts.xml
        if (this.chartCount > 0) {
            var count = 1;
            this.serializeDefaultContentType(writer, 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            while (count <= this.chartCount) {
                this.serializeOverrideContentType(writer, 'word/charts/chart' + count + '.xml', this.chartsContentType);
                this.serializeOverrideContentType(writer, 'word/charts/colors' + count + '.xml', this.chartColorStyleContentType);
                count++;
            }
        }
        // Custom XML mapping
        if (this.customXMLProps.length > 0) {
            for (var i = 0; i < this.customXMLProps.length; i++) {
                this.serializeOverrideContentType(writer, this.customXMLProps[i], this.customXmlContentType);
            }
        }
        //             //core.xml
        //             SerializeOverrideContentType(contentStream, this.corePath, this.CoreContentType);
        //             //app.xml
        //             SerializeOverrideContentType(contentStream, this.appPath, this.AppContentType);
        //             //custom.xml
        //             if (!isNullOrUndefined(m_document.CustomDocumentProperties) && m_document.CustomDocumentProperties.length > 0)
        //                 SerializeOverrideContentType(contentStream, this.CustomPath, this.CustomContentType);
        // #if Chart
        //             if (m_hasChart)
        //                 SerializeChartContentType(contentStream);
        // #endif
        this.serializeHFContentTypes(writer);
        this.SerializeEFContentTypes(writer);
        // WriteXmlItemsContentTypes(contentStream);
        //End of Types tag
        writer.writeEndElement();
        var zipArchiveItem = new ZipArchiveItem(writer.buffer, this.contentTypesPath);
        this.mArchive.addItem(zipArchiveItem);
    };
    // Serializes the HeaderFooter content types
    WordExport.prototype.serializeHFContentTypes = function (writer) {
        this.serializeHeaderFootersContentType(writer, 'EvenFooter');
        this.serializeHeaderFootersContentType(writer, 'EvenHeader');
        this.serializeHeaderFootersContentType(writer, 'FirstPageFooter');
        this.serializeHeaderFootersContentType(writer, 'FirstPageHeader');
        this.serializeHeaderFootersContentType(writer, 'OddFooter');
        this.serializeHeaderFootersContentType(writer, 'OddHeader');
    };
    // Serializes the HeaderFooter content types.
    WordExport.prototype.serializeHeaderFootersContentType = function (writer, headerFooterType) {
        var contentType;
        var partName;
        if (!this.headersFooters.containsKey(headerFooterType)) {
            return;
        }
        var hfColl = this.headersFooters.get(headerFooterType);
        for (var i = 0; i < hfColl.keys.length; i++) {
            var id = hfColl.keys[i];
            if (headerFooterType === 'EvenHeader' || headerFooterType === 'FirstPageHeader' ||
                headerFooterType === 'OddHeader') {
                partName = this.headerPath + id.replace('rId', '') + '.xml';
                contentType = this.headerContentType;
            }
            else {
                partName = this.footerPath + id.replace('rId', '') + '.xml';
                contentType = this.footerContentType;
            }
            this.serializeOverrideContentType(writer, partName, contentType);
        }
    };
    WordExport.prototype.SerializeEFContentTypes = function (writer) {
        this.serializeEFContentType(writer);
    };
    // Serializes the HeaderFooter content types.
    WordExport.prototype.serializeEFContentType = function (writer) {
        var contentType;
        var partName;
        partName = this.endnotesPath;
        contentType = this.endnoteContentType;
        this.serializeOverrideContentType(writer, partName, contentType);
        partName = this.footnotesPath;
        contentType = this.footnoteContentType;
        this.serializeOverrideContentType(writer, partName, contentType);
    };
    // Serializes the Override content type.
    WordExport.prototype.serializeOverrideContentType = function (writer, partName, contentType) {
        writer.writeStartElement(undefined, 'Override', undefined);
        writer.writeAttributeString(undefined, 'PartName', undefined, '/' + partName.replace('\\', '/'));
        writer.writeAttributeString(undefined, 'ContentType', undefined, contentType);
        writer.writeEndElement();
    };
    // Serializes the default content type
    WordExport.prototype.serializeDefaultContentType = function (writer, extension, contentType) {
        writer.writeStartElement(undefined, 'Default', undefined);
        writer.writeAttributeString(undefined, 'Extension', undefined, extension);
        writer.writeAttributeString(undefined, 'ContentType', undefined, contentType);
        writer.writeEndElement();
    };
    // Reset the relationship id counter
    WordExport.prototype.resetRelationShipID = function () {
        this.mRelationShipID = 0;
    };
    WordExport.prototype.resetExcelRelationShipId = function () {
        this.eRelationShipId = 0;
    };
    WordExport.prototype.resetChartRelationShipId = function () {
        this.cRelationShipId = 0;
    };
    WordExport.prototype.close = function () {
        //Implement
    };
    return WordExport;
}());
export { WordExport };
