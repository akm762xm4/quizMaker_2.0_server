declare module "pdf-parse/node" {
  export class PDFParse {
    constructor(options: { data: Buffer });
    getText(): Promise<{ text: string }>;
    destroy(): Promise<void>;
  }
}
