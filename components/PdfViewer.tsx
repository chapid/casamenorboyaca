"use client"

import { useState } from 'react';
//import { Document, Page, pdfjs } from 'react-pdf'

/*pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';*/
interface PDFViewerProps {
    url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>();
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    return (
        <div ref={setContainerRef}>
            <iframe
                src={`${url}#toolbar=0&navpanes=0$view=fitH&zoom=100`}
                title="Presentación"
                width="100%"
                height="800"
            />

        </div>
    )
}