import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportResultsToPDF(): Promise<void> {
  const el = document.getElementById('results-content');
  if (!el) throw new Error('Element #results-content introuvable');

  // Ajouter la classe pdf-export-mode pour le styling
  document.body.classList.add('pdf-export-mode');

  // Petit délai pour laisser le DOM se mettre à jour
  await new Promise(r => setTimeout(r, 200));

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // En-tête
    pdf.setFontSize(16);
    pdf.setTextColor(13, 148, 136); // primary
    pdf.text('StatutNet — Simulation fiscale', margin, 15);
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139); // muted
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, 22);

    let yOffset = 28;
    let remainingHeight = imgHeight;
    let sourceY = 0;

    // Pagination
    while (remainingHeight > 0) {
      const availableHeight = (yOffset === 28 ? pageHeight - 35 : pageHeight - 20) - margin;
      const sliceHeight = Math.min(remainingHeight, availableHeight);
      const sliceCanvasHeight = (sliceHeight / imgHeight) * canvas.height;

      pdf.addImage(
        imgData, 'PNG',
        margin, yOffset,
        contentWidth, imgHeight,
        undefined, 'FAST',
        0
      );

      // Pied de page
      pdf.setFontSize(7);
      pdf.setTextColor(150);
      pdf.text(
        'StatutNet — Estimations indicatives, paramètres 2025. Consultez un expert-comptable.',
        pageWidth / 2, pageHeight - 5,
        { align: 'center' }
      );

      remainingHeight -= sliceHeight;
      sourceY += sliceCanvasHeight;

      if (remainingHeight > 0) {
        pdf.addPage();
        yOffset = margin;
      }
    }

    pdf.save('simulation-statutnet.pdf');
  } finally {
    document.body.classList.remove('pdf-export-mode');
  }
}
