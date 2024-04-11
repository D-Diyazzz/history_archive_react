import React, { useState, useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

import "../style/partials/buttons.css"

GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function PDFViewer({ pdfUrl }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const fetchPdf = async (pageNum) => {
      const loadingTask = getDocument("http://localhost:8000/archive/files/" + pdfUrl);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      const page = await pdf.getPage(pageNum);

      const viewportOriginal = page.getViewport({ scale: 1.0 });
      const scale = 900 / viewportOriginal.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      canvas.width = 900;
      canvas.height = viewport.height; 

      const context = canvas.getContext('2d');

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      renderTaskRef.current = page.render({ canvasContext: context, viewport: viewport });

      try {
        await renderTaskRef.current.promise;
      } catch (error) {
        console.error("Page rendering error:", error);
      }
    };

    fetchPdf(currentPage);

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfUrl, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  return (
    <div>
      <canvas ref={canvasRef} />
      <div>
        <button onClick={handlePrevPage} disabled={currentPage <= 1} className='pdfViewerButton'>Previous</button>
        <span>Page {currentPage} of {numPages}</span>
        <button onClick={handleNextPage} disabled={currentPage >= numPages} className='pdfViewerButton'>Next</button>
      </div>
    </div>
  );
}
