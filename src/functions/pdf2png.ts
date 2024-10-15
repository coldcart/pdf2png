import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { pdfToPng, PngPageOutput } from "pdf-to-png-converter";

export async function pdf2png(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  try {
    const pdfUrl = request.params.restOfPath;
    if (!pdfUrl || !pdfUrl.toLowerCase().endsWith('.pdf')) {
      throw new Error("No valid PDF URL found in the request");
    }
    context.log(`Attempting to convert PDF from URL: ${pdfUrl}`);

    const pdfFile = await fetch(pdfUrl);
    const pdfBuffer = await pdfFile.arrayBuffer();
    
    console.time("pdfConvert");
    const pngPages: PngPageOutput[] = await pdfToPng(Buffer.from(pdfBuffer), {
      viewportScale: parseFloat(process.env["VIEWPORT_SCALE"] ?? "5.0"), 
      pagesToProcess: [1], // PDF should only have one page
      verbosityLevel: 1,
      disableFontFace: false,
      useSystemFonts: false,
      enableXfa: true,
      strictPagesToProcess: true,
    });
    console.timeEnd("pdfConvert");
    if (pngPages.length > 0) {
      const pngPage = pngPages[0];
      
      return {
        body: pngPage.content,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `inline; filename="${pdfUrl.split('/').pop()?.replace('.pdf', '.png') || 'converted.png'}"`,
        },
      };
    } else {
      throw new Error("Failed to convert PDF to PNG");
    }
  } catch (e) {
    context.error("Error in pdfConvert:", e);
    return { 
      status: 400, 
      body: JSON.stringify({ error: e.message }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
}

app.http("pdf2png", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "pdf2png/{*restOfPath}",
  handler: pdf2png,
});
