import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoicePDF(invoice: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text("INVOICE", 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoice.number}`, 14, 30);
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 14, 35);
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 40);

  // Customer Info
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 55);
  doc.setFontSize(10);
  doc.text(`${invoice.customer.name}`, 14, 62);
  doc.text(`${invoice.customer.email || ''}`, 14, 67);
  doc.text(`${invoice.customer.address || ''}`, 14, 72);

  // Items Table (Assuming items are added later or we just put the total for now)
  autoTable(doc, {
    startY: 85,
    head: [['Description', 'Amount']],
    body: [
      ['Services Rendered', `$${(invoice.amount).toFixed(2)}`],
      ['Tax (GST)', `$${(invoice.tax).toFixed(2)}`],
    ],
    foot: [['Total', `$${(invoice.total).toFixed(2)}`]],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  // Download
  doc.save(`${invoice.number}.pdf`);
}
