/**
 * Defines Theme of the smithchart. They are
 * * Material - Render a smithchart with Material theme.
 * * Fabric - Render a smithchart with Fabric theme
 */
export declare type SmithchartTheme = 
/**  Render a smithchart with Material theme. */
'Material' | 
/**  Render a smithchart with Fabric theme. */
'Fabric' | 
/**  Render a smithchart with Bootstrap theme. */
'Bootstrap' | 
/**  Render a smithchart with Highcontrast Light theme. */
'HighContrastLight' | 
/**  Render a smithchart with Material Dark theme. */
'MaterialDark' | 
/**  Render a smithchart with Fabric Dark theme. */
'FabricDark' | 
/**  Render a smithchart with Highcontrast Dark theme. */
'HighContrast' | 
/**  Render a smithchart with Bootstrap Dark theme. */
'BootstrapDark' | 
/** Render a smithchart with Bootstrap4 theme. */
'Bootstrap4';
/**
 * Defines render type of smithchart. They are
 * * Impedance - Render a smithchart with Impedance type.
 * * Admittance - Render a smithchart with Admittance type.
 */
export declare type RenderType = 
/**  Render a smithchart with Impedance type. */
'Impedance' | 
/**  Render a smithchart with Admittance type. */
'Admittance';
export declare type AxisLabelPosition = 
/**  Render a axis label with label position as outside. */
'Outside' | 
/**  Render a axis label with label position as outside. */
'Inside';
export declare type SmithchartLabelIntersectAction = 
/**  Hide the overlapped axis label. */
'Hide' | 
/**  Render the overlapped axis label */
'None';
/**
 * Defines the Alignment. They are
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 * *
 */
export declare type SmithchartAlignment = 
/** Define the left alignment. */
'Near' | 
/** Define the center alignment. */
'Center' | 
/** Define the right alignment. */
'Far';
export declare type SmithchartExportType = 
/** Used to export a image as png format */
'PNG' | 
/** Used to export a image as jpeg format */
'JPEG' | 
/** Used to export a file as svg format */
'SVG' | 
/** Used to export a file as pdf format */
'PDF';
/**
 * Specifies TreeMap beforePrint event name.
 * @private
 */
export declare const smithchartBeforePrint: string;
