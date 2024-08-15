import React, { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
// import 'pdfjs-dist/es5/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default function FirstPage({ pdfUrl, width, height }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const loadingTask = getDocument("http://localhost:8000/archive/files/" + pdfUrl);
      const pdf = await loadingTask.promise;
      const firstPage = await pdf.getPage(1);
      
      let viewportOriginal = firstPage.getViewport({ scale: 1.0 });
      let scale, viewport;

      if (width) {
        scale = width / viewportOriginal.width;
        viewport = firstPage.getViewport({ scale });
      } else if (height) {
        scale = height / viewportOriginal.height;
        viewport = firstPage.getViewport({ scale });
      } else {
        scale = 150 / viewportOriginal.width; // Default scale if no width or height is provided
        viewport = firstPage.getViewport({ scale });
      }

      const canvas = canvasRef.current;
      canvas.width = width || viewport.width;
      canvas.height = height || viewport.height;

      const context = canvas.getContext('2d');

      if (renderTaskRef.current) {
        // Cancel the previous rendering task if it exists
        renderTaskRef.current.cancel();
      }

      // Save the new rendering task
      renderTaskRef.current = firstPage.render({ canvasContext: context, viewport: viewport });

      try {
        // Wait for rendering to finish
        await renderTaskRef.current.promise;
      } catch (error) {
        console.error("Rendering error:", error);
      }
    };

    fetchPdf();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfUrl, width, height]);

  return <canvas ref={canvasRef} />;
}

