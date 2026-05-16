export interface InvoiceItemData {
  description: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
  discount: number;
}

export function calculateItemTotal(item: InvoiceItemData) {
  const subtotal = item.quantity * item.unitPrice;
  const discountAmount = subtotal * (item.discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = afterDiscount * (item.gstPercent / 100);
  
  return {
    subtotal,
    discountAmount,
    afterDiscount,
    gstAmount,
    total: afterDiscount + gstAmount,
  };
}

export function calculateInvoiceTotals(items: InvoiceItemData[]) {
  return items.reduce(
    (acc, item) => {
      const calc = calculateItemTotal(item);
      return {
        subtotal: acc.subtotal + calc.subtotal,
        discountTotal: acc.discountTotal + calc.discountAmount,
        gstTotal: acc.gstTotal + calc.gstAmount,
        grandTotal: acc.grandTotal + calc.total,
      };
    },
    { subtotal: 0, discountTotal: 0, gstTotal: 0, grandTotal: 0 }
  );
}
