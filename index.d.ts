import {EventEmitter} from "events";

export declare function createChartRenderer(options: ChartRendererOptions, callback: (err?: Error, result?: ChartRenderer) => void): void;

export interface ChartRenderer extends EventEmitter {

    renderBase64(config: ChartRenderConfiguration, callback: (err?: Error, result?: string) => void);
    renderBuffer(config: ChartRenderConfiguration, callback: (err?: Error, result?: Buffer) => void);
    close(callback?: (err?: Error) => void): void;
}

/**
 * Configuration for the chart to render.
 */
export interface ChartRenderConfiguration {

    /**
     * The width, in pixels, of the chart. Default is 720.
     */
    width?: number;

    /**
     * The height, in pixels, of the chart. If not specified the chart aspect ratio is used to determine the height.
     */
    height?: number;

    /**
     * The scale to apply to the rendered image. For example, a scale of 2 will double the size of the rendered image. Default is 1.
     */
    scale?: number;

    /**
     * The image format to use. Default is PNG.
     */
        type?: "PNG" | "JPEG" | "GIF";

    /**
     * The chart to render.
     */
    chart: ChartConfiguration;
}

export interface ChartRendererOptions {

    /**
     * The port to use for the PhantomJS server.
     */
    port?: number;

    /**
     * A logger that conforms to the [bunyan](https://www.npmjs.com/package/bunyan) logger export interface.
     */
    logger?: Logger;
}

/**
 * Logger options.
 */
export interface LoggerOptions {

    /**
     * Dictionary of custom serializers. The key is the name of the property that is serialized and the the value
     * is a function that takes an object and returns a JSON serializable value.
     */
    serializers?: {
        [key: string]: (input: any) => any;
    }
}

/**
 * A logger that conforms for the [bunyan](https://www.npmjs.com/package/bunyan) logger export interface.
 */
export interface Logger {
    /**
     * Creates a child logger with the given options.
     * @param options Logger options.
     */
    child(options: LoggerOptions): Logger;

    /**
     * Creates a log record with the TRACE log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    trace(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the TRACE log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    trace(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the TRACE log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    trace(msg: string, ...params: any[]): void;

    /**
     * Creates a log record with the DEBUG log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    debug(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the DEBUG log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    debug(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the DEBUG log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    debug(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the INFO log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    info(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the INFO log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    info(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the INFO log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    info(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the WARN log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    warn(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the WARN log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    warn(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the WARN log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    warn(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the ERROR log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    error(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the ERROR log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    error(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the ERROR log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    error(msg: string, ...args: any[]): void;

    /**
     * Creates a log record with the FATAL log level.
     * @param error The error to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    fatal(error: Error, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the FATAL log level.
     * @param fields Set of additional fields to log.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    fatal(fields: Object, msg?: string, ...args: any[]): void;
    /**
     * Creates a log record with the FATAL log level.
     * @param msg Log message. This can be followed by additional arguments for printf-like formatting.
     */
    fatal(msg: string, ...args: any[]): void;
}

/**
 * NodeJS Buffer.
 */
export interface Buffer {
    [index: number]: number;
    write(string: string, offset?: number, length?: number, encoding?: string): number;
    toString(encoding?: string, start?: number, end?: number): string;
    toJSON(): any;
    length: number;
    equals(otherBuffer: Buffer): boolean;
    compare(otherBuffer: Buffer): number;
    copy(targetBuffer: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
    slice(start?: number, end?: number): Buffer;
    writeUIntLE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeUIntBE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeIntLE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeIntBE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    readUIntLE(offset: number, byteLength: number, noAssert?: boolean): number;
    readUIntBE(offset: number, byteLength: number, noAssert?: boolean): number;
    readIntLE(offset: number, byteLength: number, noAssert?: boolean): number;
    readIntBE(offset: number, byteLength: number, noAssert?: boolean): number;
    readUInt8(offset: number, noAsset?: boolean): number;
    readUInt16LE(offset: number, noAssert?: boolean): number;
    readUInt16BE(offset: number, noAssert?: boolean): number;
    readUInt32LE(offset: number, noAssert?: boolean): number;
    readUInt32BE(offset: number, noAssert?: boolean): number;
    readInt8(offset: number, noAssert?: boolean): number;
    readInt16LE(offset: number, noAssert?: boolean): number;
    readInt16BE(offset: number, noAssert?: boolean): number;
    readInt32LE(offset: number, noAssert?: boolean): number;
    readInt32BE(offset: number, noAssert?: boolean): number;
    readFloatLE(offset: number, noAssert?: boolean): number;
    readFloatBE(offset: number, noAssert?: boolean): number;
    readDoubleLE(offset: number, noAssert?: boolean): number;
    readDoubleBE(offset: number, noAssert?: boolean): number;
    writeUInt8(value: number, offset: number, noAssert?: boolean): number;
    writeUInt16LE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt16BE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt32LE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt32BE(value: number, offset: number, noAssert?: boolean): number;
    writeInt8(value: number, offset: number, noAssert?: boolean): number;
    writeInt16LE(value: number, offset: number, noAssert?: boolean): number;
    writeInt16BE(value: number, offset: number, noAssert?: boolean): number;
    writeInt32LE(value: number, offset: number, noAssert?: boolean): number;
    writeInt32BE(value: number, offset: number, noAssert?: boolean): number;
    writeFloatLE(value: number, offset: number, noAssert?: boolean): number;
    writeFloatBE(value: number, offset: number, noAssert?: boolean): number;
    writeDoubleLE(value: number, offset: number, noAssert?: boolean): number;
    writeDoubleBE(value: number, offset: number, noAssert?: boolean): number;
    fill(value: any, offset?: number, end?: number): Buffer;
}

export interface ChartDefaults {

    global: GlobalSettings;
    bar: BarChartSettings;
    horizontalBar: BarChartSettings;
    line: LineChartSettings;
    radar: RadarChartSettings;
    polarArea: PolarAreaChartSettings;
    pie: PieChartSettings;
    doughnut: PieChartSettings;
    bubble: BubbleChartSettings;
}

type Color = string | CanvasPattern;

export interface GlobalSettings extends CommonChartSettings {

    defaultColor?: Color;
    defaultFontColor?: Color;
    defaultFontFamily?: string;
    defaultFontSize?: number;
    defaultFontStyle?: string;
}

export interface CommonChartSettings {

    responsive?: boolean;
    responsiveAnimationDuration?: number;
    maintainAspectRatio?: boolean;
    aspectRatio?: number;
    events?: string[];
    onClick?: Function;
    legendCallback?: Function;
    onResize?: Function;
    colors?: string[];
    title?: TitleConfiguration;
    legend?: LegendConfiguration;
    tooltips?: TooltipConfiguration;
    hover?: HoverConfiguration;
    animation?: AnimationConfiguration;
    elements?: ElementConfiguration;
}

type Position = "top" | "left" | "bottom" | "right";

export interface ScalesConfiguration<XScale, YScale> {

    xAxes?: XScale[];
    yAxes?: YScale[];
}

export interface TitleConfiguration {

    display?: boolean;
    position?: Position;
    fullWidth?: boolean;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: Color;
    fontStyle?: string;
    padding?: number;
    text?: string;
}

export interface LegendConfiguration {
    display?: boolean;
    position?: Position;
    fullWidth?: boolean;
    onClick?: Function;
    onHover?: Function;
    labels?: LegendLabelsConfiguration;
}

export interface LegendLabelsConfiguration {
    boxWidth?: number;
    fontSize?: number;
    fontStyle?: string;
    fontColor?: Color;
    fontFamily?: string;
    padding?: number;
    generateLabels?: Function;
    usePointStyle?: boolean;
    reverse?: boolean;
}

export interface TooltipConfiguration {

    enabled?: boolean;
    custom?: Function;
    mode?: "single" | "label" | "x-axis";
    itemSort?: Function;
    backgroundColor?: Color;
    titleFontFamily?: string;
    titleFontSize?: number;
    titleFontStyle?: string;
    titleFontColor?: Color;
    titleSpacing?: number;
    titleMarginBottom?: string;
    bodyFontFamily?: string;
    bodyFontSize?: number;
    bodyFontStyle?: string;
    bodyFontColor?: Color;
    bodySpacing?: number;
    footerFontFamily?: string;
    footerFontSize?: number;
    footerFontStyle?: string;
    footerFontColor?: Color;
    footerSpacing?: number;
    footerMarginTop?: number;
    xPadding?: number;
    yPadding?: number;
    caretSize?: number;
    cornerRadius?: number;
    multiKeyBackground?: string;
    callbacks?: TooltipCallbacks;
}

export interface TooltipCallbacks {

    beforeTitle?: Function;
    title?: Function;
    afterTitle?: Function;
    beforeBody?: Function;
    beforeLabel?: Function;
    label?: Function;
    labelColor?: Function;
    afterLabel?: Function;
    afterBody?: Function;
    beforeFooter?: Function;
    footer?: Function;
    afterFooter?: Function;
}

export interface HoverConfiguration {

    mode?: "single" | "label" | "x-axis" | "dataset";
    animationDuration?: number;
    onHover?: Function;
}

export interface AnimationConfiguration {

    duration?: number;
    easing?: string;
    onProgress?: Function;
    onComplete?: Function;
}

export interface ElementConfiguration {

    arc?: ArcConfiguration;
    line?: LineConfiguration;
    point?: PointConfiguration;
    rectangle?: RectangleConfiguration;
}

export interface ArcConfiguration {

    backgroundColor?: Color;
    borderColor?: Color;
    borderWidth?: number;
}

export interface LineConfiguration {

    tension?: number;
    backgroundColor?: Color;
    borderWidth?: number;
    borderColor?: Color;
    borderCapStyle?: string;
    borderDash?: number[];
    borderDashOffset?: number;
    borderJoinStyle?: string;
    capBezierPoints?: boolean;
    fill?: boolean;
    stepped?: boolean;
}

export interface PointConfiguration {

    radius?: number;
    pointStyle?: string;
    backgroundColor?: Color;
    borderWidth?: number;
    borderColor?: Color;
    hitRadius?: number;
    hoverRadius?: number;
    hoverBorderWidth?: number;
}

export interface RectangleConfiguration {

    backgroundColor?: Color;
    borderWidth?: number;
    borderColor?: Color;
    borderSkipped?: string;
}

export interface CommonScaleConfiguration {

    type?: string;
    display?: boolean;
    position?: Position;
    id?: string;
    stacked?: boolean;
    barThickness?: number;
    beforeUpdate?: Function;
    beforeSetDimensions?: Function;
    afterSetDimensions?: Function;
    beforeDataLimits?: Function;
    afterDataLimits?: Function;
    beforeBuildTicks?: Function;
    afterBuildTicks?: Function;
    beforeTickToLabelConversion?: Function;
    afterTickToLabelConversion?: Function;
    beforeCalculateTickRotation?: Function;
    afterCalculateTickRotation?: Function;
    beforeFit?: Function;
    afterFit?: Function;
    afterUpdate?: Function;
    gridLines?: GridLineConfiguration;
    scaleLabel?: ScaleTitleConfiguration;
    ticks?: TickConfiguration;
}

export interface GridLineConfiguration {

    display?: boolean;
    color?: Color | Color[];
    borderDash?: number[];
    borderDashOffset?: number;
    lineWidth?: number | number[];
    drawBorder?: boolean;
    drawOnChartArea?: boolean;
    drawTicks?: boolean;
    tickMarkLength?: number;
    zeroLineWidth?: number;
    zeroLineColor?: Color;
    offsetGridLines?: boolean;
}

export interface ScaleTitleConfiguration {

    display?: boolean;
    labelString?: string;
    fontColor?: Color;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
}

export interface TickConfiguration {

    autoSkip?: boolean;
    beginAtZero?: boolean;
    callback?: Function;
    display?: boolean;
    fontColor?: Color;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    labelOffset?: number;
    maxRotation?: number;
    minRotation?: number;
    mirror?: boolean;
    padding?: string;
    reverse?: number;
}

type ScaleConfiguration = CategoryScaleConfiguration | LinearScaleConfiguration | LogarithmicScaleConfiguration
    | TimeScaleConfiguration | RadialLinearScaleConfiguration;

export interface CategoryScaleConfiguration extends CommonScaleConfiguration {

    type?: "category"
    ticks?: CategoryTickConfiguration;
    categoryPercentage?: number;
    barPercentage?: number;
}

export interface CategoryTickConfiguration extends TickConfiguration {

    min?: number;
    max?: number;
}

export interface LinearScaleConfiguration extends CommonScaleConfiguration {

    type?: "linear"
    ticks?: LinearTickConfiguration;
}

export interface LinearTickConfiguration extends TickConfiguration {

    beginAtZero?: boolean;
    min?: number;
    max?: number;
    maxTicksLimit?: number;
    fixedStepSize?: number;
    stepSize?: number;
    suggestedMax?: number;
    suggestedMin?: number;
}

export interface LogarithmicScaleConfiguration extends CommonScaleConfiguration {

    type?: "logarithmic";
    ticks?: LogarithmicTickConfiguration;
}

export interface LogarithmicTickConfiguration extends TickConfiguration {

    min?: number;
    max?: number;
}

export interface TimeScaleConfiguration extends CommonScaleConfiguration {

    type?: "time",
    time?: TimeScaleOptions;
}

type TimeUnit = "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "quater" | "year";

export interface TimeScaleOptions {

    displayFormats?: TimeDisplayFormats;
    isoWeekday?: boolean;
    max?: number;
    min?: number;
    parser?: string | Function;
    round?: TimeUnit;
    tooltipFormat?: string;
    unit?: TimeUnit;
    unitStepSize?: number;
    minUnit?: TimeUnit;
}

export interface TimeDisplayFormats {

    millisecond?: string;
    second?: string;
    minute?: string;
    hour?: string;
    day?: string;
    week?: string;
    month?: string;
    quarter?: string;
    year?: string;
}

export interface RadialLinearScaleConfiguration extends CommonScaleConfiguration {

    type?: "radialLinear";
    lineArc?: boolean;
    angleLines?: AngleLineOptions;
    pointLabels?: PointLabelOptions;
    ticks?: RadialLinearTickConfiguration;
}

export interface AngleLineOptions {

    display?: boolean;
    color?: Color;
    lineWidth?: number;
}

export interface PointLabelOptions {

    callback?: Function;
    fontColor?: Color;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
}

export interface RadialLinearTickConfiguration extends TickConfiguration {

    backdropColor?: Color;
    backdropPaddingX?: number;
    backdropPaddingY?: number;
    beginAtZero?: boolean;
    min?: number;
    max?: number;
    maxTicksLimit?: number;
    showLabelBackdrop?: boolean;
    fixedStepSize?: number;
    stepSize?: number;
    suggestedMax?: number;
    suggestedMin?: number;
}

export interface ChartData<DataSetT> {

    datasets: DataSetT[];
    labels?: string[];
    xLabels?: string[];
    yLabels?: string[];
}

type ChartConfiguration  = LineChartConfiguration | BarChartConfiguration | RadarChartConfiguration | PolarAreaChartConfiguration
    | PieChartConfiguration | BubbleChartConfiguration;

export interface LineChartConfiguration {

    type: "line";
    data: ChartData<LineChartDataSet>;
    options?: LineChartSettings;
}

export interface LineChartDataSet {

    data: number[] | { x: number, y: number }[];
    label?: string;
    xAxisID?: string;
    yAxisID?: string;
    fill?: boolean;
    cubicInterpolationMode?: string;
    lineTension?: number;
    backgroundColor?: Color;
    borderWidth?: number;
    borderColor?: Color;
    borderCapStyle?: string;
    borderDash?: number[];
    borderDashOffset?: number;
    borderJoinStyle?: string;
    pointBorderColor?: Color | Color[];
    pointBackgroundColor?: Color | Color[];
    pointBorderWidth?: number | number[];
    pointRadius?: number | number[];
    pointHoverRadius?: number | number[];
    pointHitRadius?: number | number[];
    pointHoverBackgroundColor?: Color | Color[];
    pointHoverBorderColor?: Color | Color[];
    pointHoverBorderWidth?: number | number[];
    pointStyle?: string | string[];
    showLine?: boolean;
    spanGaps?: boolean;
    steppedLine?: boolean;
}

export interface LineChartSettings extends CommonChartSettings {

    showLines?: boolean;
    spanGaps?: boolean;
    scales?: ScalesConfiguration<ScaleConfiguration, ScaleConfiguration>;
}

export interface BarChartConfiguration {

    type: "bar" | "horizontalBar";
    data: ChartData<BarChartDataSet>;
    options?: BarChartSettings;
}

export interface BarChartDataSet {

    data: number[];
    label?: string;
    xAxisID?: string;
    yAxisID?: string;
    backgroundColor?: Color | Color[];
    borderColor?: Color | Color[];
    borderWidth?: number | number[];
    borderSkipped?: Position | Position[];
    hoverBackgroundColor?: Color | Color[];
    hoverBorderColor?: Color | Color[];
    hoverBorderWidth?: number | number[];
}

export interface BarChartSettings extends CommonChartSettings {

    scales?: ScalesConfiguration<CategoryScaleConfiguration, ScaleConfiguration>;
}

export interface RadarChartConfiguration {

    type: "radar";
    data: ChartData<RadarChartDataSet>;
    options?: RadarChartSettings;
}

export interface RadarChartDataSet {

    data: number[];
    label?: string;
    fill?: boolean;
    lineTension?: number;
    backgroundColor?: Color;
    borderWidth?: number;
    borderColor?: Color;
    borderCapStyle?: string;
    borderDash?: number[];
    borderDashOffset?: number;
    borderJoinStyle?: string;
    pointBorderColor?: Color | Color[];
    pointBackgroundColor?: Color | Color[];
    pointBorderWidth?: number | number[];
    pointRadius?: number | number[];
    pointHoverRadius: number | number[];
    hitRadius: number | number[];
    pointHoverBackgroundColor?: Color | Color[];
    pointHoverBorderColor?: Color | Color[];
    pointHoverBorderWidth?: number | number[];
    pointStyle?: string | string[];
}

export interface RadarChartSettings extends CommonChartSettings {

    scale: RadialLinearScaleConfiguration;
    startAngle?: number;
}

export interface PolarAreaChartConfiguration {

    type: "polarArea";
    data: ChartData<PolarAreaChartDataSet>;
    options?: PolarAreaChartSettings;
}

export interface PolarAreaChartDataSet {

    data: number[];
    label?: string;
    backgroundColor?: Color[];
    borderColor?: Color[];
    borderWidth?: number[];
    hoverBackgroundColor?: Color[];
    hoverBorderColor?: Color[];
    hoverBorderWidth?: number[];
}

export interface PolarAreaChartSettings extends CommonChartSettings {

    startAngle?: number;
    scale?: RadialLinearScaleConfiguration;
}

export interface PieChartConfiguration {

    type: "pie" | "doughnut";
    data: ChartData<PieChartDataSet>;
    options?: PieChartSettings;
}

export interface PieChartDataSet {

    data: number[];
    label?: string;
    backgroundColor?: Color[];
    borderColor?: Color[];
    borderWidth?: number[];
    hoverBackgroundColor?: Color[];
    hoverBorderColor?: Color[];
    hoverBorderWidth?: number[];
}

export interface PieChartSettings extends CommonChartSettings {

    cutoutPercentage?: number;
    rotation?: number;
    circumference?: number;
}

export interface BubbleChartConfiguration {

    type: "bubble";
    data: ChartData<BubbleChartDataSet>;
    options?: BubbleChartSettings;
}

export interface BubbleChartDataSet {

    data: { x: number, y: number, r: number}[];
    label?: string;
    backgroundColor?: Color | Color[];
    borderColor?: Color | Color[];
    borderWidth?: number | number[];
    hoverBackgroundColor?: Color | Color[];
    hoverBorderColor?: Color | Color[];
    hoverBorderWidth?: number | number[];
    hoverRadius?: number | number[];
}

export interface BubbleChartSettings extends CommonChartSettings {

    scales?: ScalesConfiguration<ScaleConfiguration, ScaleConfiguration>;
}
