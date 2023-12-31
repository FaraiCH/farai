/**
 * Defines types of Filter Hierarchy
 * * Parent - Specifies the filter type as Parent.
 * * Child - Specifies the filter type as excel.
 * * Both - Specifies the filter type as filter bar
 * * None - Specifies the filter type as check box.
 */
export declare type FilterHierarchyMode = 
/** Shows filtered records with its Parent records */
'Parent' | 
/** Shows filtered records with its Child records */
'Child' | 
/** Shows filtered records with its Parent and Child records */
'Both' | 
/** Shows only filetred records */
'None';
/**
 * Defines Predefined toolbar items.
 * @hidden
 */
export declare type ToolbarItems = 
/** Add new record */
'Add' | 
/** Delete selected record */
'Delete' | 
/** Update edited record */
'Update' | 
/** Cancel the edited state */
'Cancel' | 
/** Edit the selected record */
'Edit' | 
/** Searches the TreeGrid records by given key */
'Search' | 
/** Expands all the rows in TreeGrid */
'ExpandAll' | 
/** Collapses all the rows in TreeGrid */
'CollapseAll' | 
/** Export the TreeGrid to Excel */
'ExcelExport' | 
/** Export the TreeGrid to Pdf */
'PdfExport' | 
/** Export the TreeGrid to Csv */
'CsvExport' | 
/** Print the TreeGrid */
'Print';
/**
 * Defines Predefined toolbar items.
 * @hidden
 */
export declare enum ToolbarItem {
    Add = 0,
    Edit = 1,
    Update = 2,
    Delete = 3,
    Cancel = 4,
    Search = 5,
    ExpandAll = 6,
    CollapseAll = 7,
    ExcelExport = 8,
    PdfExport = 9,
    CsvExport = 10,
    Print = 11,
    RowIndent = 12,
    RowOutdent = 13
}
/**
 * Defines different PageSizeMode
 * * All - Specifies the PageSizeMode as All
 * * Root - Specifies the PageSizeMode as Root
 */
export declare type PageSizeMode = 
/**  Defines the pageSizeMode as All */
'All' | 
/**  Defines the pageSizeMode as Root */
'Root';
/**
 * Defines predefined contextmenu items.
 * @hidden
 */
export declare type ContextMenuItem = 
/** `AutoFitAll` - Auto fit the size of all columns. */
'AutoFitAll' | 
/**  `AutoFit` - Auto fit the current column. */
'AutoFit' | 
/**  `SortAscending` - Sort the current column in ascending order. */
'SortAscending' | 
/** `SortDescending` - Sort the current column in descending order. */
'SortDescending' | 
/**  `Edit` - Edit the current record. */
'Edit' | 
/** `Delete` - Delete the current record. */
'Delete' | 
/** `Save` - Save the edited record. */
'Save' | 
/** `Cancel` - Cancel the edited state. */
'Cancel' | 
/** `PdfExport` - Export the TreeGrid as Pdf format. */
'PdfExport' | 
/** `ExcelExport` - Export the TreeGrid as Excel format. */
'ExcelExport' | 
/** `CsvExport` - Export the TreeGrid as CSV format. */
'CsvExport' | 
/** `FirstPage` - Go to the first page. */
'FirstPage' | 
/** `PrevPage` - Go to the previous page. */
'PrevPage' | 
/** `LastPage` - Go to the last page. */
'LastPage' | 
/** `NextPage` - Go to the next page. */
'NextPage' | 
/** AddRow to the TreeGrid */
'AddRow';
/**
 * Defines predefined contextmenu items.
 * @hidden
 */
export declare enum ContextMenuItems {
    AutoFit = 0,
    AutoFitAll = 1,
    SortAscending = 2,
    SortDescending = 3,
    Edit = 4,
    Delete = 5,
    Save = 6,
    Cancel = 7,
    PdfExport = 8,
    ExcelExport = 9,
    CsvExport = 10,
    FirstPage = 11,
    PrevPage = 12,
    LastPage = 13,
    NextPage = 14,
    AddRow = 15
}
/**
 * Defines modes of editing.
 */
export declare type EditMode = 
/**  Defines EditMode as Cell */
'Cell' | 
/**  Defines EditMode as Row */
'Row' | 
/**  Defines EditMode as Dialog */
'Dialog' | 
/**  Defines EditMode as Batch */
'Batch';
/**
 * Defines the position where the new row has to be added.
 */
export declare type RowPosition = 
/**  Defines new row position as top of all rows */
'Top' | 
/**  Defines new row position as bottom of all rows */
'Bottom' | 
/**  Defines new row position as above the selected row */
'Above' | 
/**  Defines new row position as below the selected row */
'Below' | 
/**  Defines new row position as child to the selected row */
'Child';
/**
 * Defines types of Filter
 * * Menu - Specifies the filter type as menu.
 * * Excel - Specifies the filter type as excel.
 * * FilterBar - Specifies the filter type as filter bar.
 */
export declare type FilterType = 
/**  Defines FilterType as filterbar */
'FilterBar' | 
/**  Defines FilterType as excel */
'Excel' | 
/**  Defines FilterType as menu */
'Menu';
/**
 * Defines the wrap mode.
 * * Both -  Wraps both header and content.
 * * Header - Wraps header alone.
 * * Content - Wraps content alone.
 */
export declare type WrapMode = 
/** Wraps both header and content */
'Both' | 
/** Wraps  header alone */
'Header' | 
/** Wraps  content alone */
'Content';
/**
 * Defines types of CopyHierarchyMode. They are
 * * Parent
 * * Child
 * * Both
 * * None
 */
export declare type CopyHierarchyType = 
/**  Defines CopyHiearchyMode as Parent */
'Parent' | 
/**  Defines CopyHiearchyMode as Child */
'Child' | 
/**  Defines CopyHiearchyMode as Both */
'Both' | 
/**  Defines CopyHiearchyMode as None */
'None';
