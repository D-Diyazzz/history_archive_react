import React, { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
// import 'pdfjs-dist/es5/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


export default function FirstPage({ pdfUrl }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const loadingTask = getDocument("http://localhost:8000/archive/files/" + pdfUrl);
      const pdf = await loadingTask.promise;
      const firstPage = await pdf.getPage(1);
      
      const viewportOriginal = firstPage.getViewport({ scale: 1.0 });
      const scale = 150 / viewportOriginal.width;
      const viewport = firstPage.getViewport({ scale });

        const canvas = canvasRef.current;
        canvas.width = 150; // Фиксированная ширина
        canvas.height = viewport.height; // Высота соответствующая масштабу

        const context = canvas.getContext('2d');

        if (renderTaskRef.current) {
            // Отменяем предыдущую задачу рендеринга, если она существует
            renderTaskRef.current.cancel();
        }

        // Сохраняем новую задачу рендеринга
        renderTaskRef.current = firstPage.render({ canvasContext: context, viewport: viewport });

        try {
            // Ожидаем завершения рендеринга
            await renderTaskRef.current.promise;
        } catch (error) {
            console.error("Ошибка рендеринга страницы:", error);
        }
    };

    fetchPdf();

    return () => {
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
        }
    };
  }, [pdfUrl]);

  return <canvas ref={canvasRef} />;
}
