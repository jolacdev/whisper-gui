export declare class TranscriptionSegment {
    id: number;
    text: string;
    start: number;
    end: number;
    args?: any;
    kwargs?: any;
    constructor(args: any, kwargs: any);
}
export declare function createTranscriptionSegment(options?: Partial<TranscriptionSegment>): TranscriptionSegment;
export declare class dict {
    args?: any;
    kwargs?: any;
    constructor(args: any, kwargs: any);
}
export declare function createdict(options?: Partial<dict>): dict;
export declare class FileMetadata {
    name: string;
    size: number;
    type: string;
    absolutePath: string;
    args?: any;
    kwargs?: any;
    constructor(args: any, kwargs: any);
}
export declare function createFileMetadata(options?: Partial<FileMetadata>): FileMetadata;
export declare class PyWebViewApi {
    private _instanceId?;
    constructor(args?: Partial<PyWebViewApi>);
    open_file_dialog(): Promise<FileMetadata | null>;
    run_transcription(file_path: string, model_name: string): Promise<TranscriptionSegment[]>;
    static createInstance(args?: Partial<PyWebViewApi>): Promise<PyWebViewApi>;
}
export type PyWebViewApiType = PyWebViewApi;
