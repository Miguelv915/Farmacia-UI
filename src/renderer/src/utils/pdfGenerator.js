import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Genera un PDF de la boleta de venta
 * @param {Object} venta - Objeto con los datos de la venta
 * @param {number} venta.id - ID de la venta
 * @param {string} venta.cliente_nombre - Nombre del cliente
 * @param {string} venta.fecha - Fecha de la venta
 * @param {number} venta.total - Total de la venta
 * @param {Array} venta.detalles - Array con los productos vendidos
 */
export function generarBoletaPDF(venta) {
    // Crear un nuevo documento PDF (tamaño carta)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Configuración de colores
    const colorPrimario = [107, 114, 128]; // #6b7280
    const colorSecundario = [75, 85, 99]; // #4b5563

    // ENCABEZADO
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, 210, 40, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FARMACIA', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión Farmacéutica', 105, 22, { align: 'center' });

    // Información de contacto (opcional - personaliza según tu negocio)
    doc.setFontSize(9);
    doc.text('Dirección: Av. Principal 123 | Tel: (01) 234-5678', 105, 28, { align: 'center' });
    doc.text('Email: contacto@farmacia.com', 105, 33, { align: 'center' });

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);

    // TÍTULO DE DOCUMENTO
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BOLETA DE VENTA', 105, 50, { align: 'center' });

    // INFORMACIÓN DE LA VENTA
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const infoY = 60;
    const col1X = 20;
    const col2X = 120;

    // Columna 1
    doc.setFont('helvetica', 'bold');
    doc.text('N° Boleta:', col1X, infoY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(venta.id).padStart(8, '0'), col1X + 25, infoY);

    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', col1X, infoY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(venta.cliente_nombre || 'Público General', col1X + 25, infoY + 7);

    // Columna 2
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', col2X, infoY);
    doc.setFont('helvetica', 'normal');
    const fechaFormateada = new Date(venta.fecha).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    doc.text(fechaFormateada, col2X + 20, infoY);

    doc.setFont('helvetica', 'bold');
    doc.text('Hora:', col2X, infoY + 7);
    doc.setFont('helvetica', 'normal');
    const horaActual = new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(horaActual, col2X + 20, infoY + 7);

    // Línea separadora
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);

    // TABLA DE PRODUCTOS
    const tableColumn = ['Producto', 'Cant.', 'P. Unit.', 'Subtotal'];
    const tableRows = [];

    venta.detalles.forEach(detalle => {
        const productoData = [
            detalle.producto_nombre || 'Sin nombre',
            String(detalle.cantidad),
            `S/. ${detalle.precio_unitario.toFixed(2)}`,
            `S/. ${detalle.subtotal.toFixed(2)}`
        ];
        tableRows.push(productoData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: colorPrimario,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 90 }, // Producto
            1: { halign: 'center', cellWidth: 25 }, // Cantidad
            2: { halign: 'right', cellWidth: 35 }, // Precio Unitario
            3: { halign: 'right', cellWidth: 35 } // Subtotal
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        }
    });

    // Obtener la posición Y donde terminó la tabla
    const finalY = doc.lastAutoTable.finalY || 80;

    // TOTALES
    const totalesY = finalY + 10;
    const totalesX = 140;

    // Línea antes del total
    doc.setLineWidth(0.3);
    doc.line(totalesX, totalesY - 2, 190, totalesY - 2);

    // Total
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', totalesX, totalesY + 5);
    doc.setFontSize(16);
    doc.text(`S/. ${venta.total.toFixed(2)}`, 190, totalesY + 5, { align: 'right' });

    // PIE DE PÁGINA
    const footerY = 270;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Gracias por su compra', 105, footerY, { align: 'center' });

    doc.setFontSize(8);
    doc.text('Este documento es una representación electrónica de la boleta de venta', 105, footerY + 5, { align: 'center' });

    // Línea decorativa en el pie
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(40, footerY - 3, 170, footerY - 3);

    // Generar el nombre del archivo
    const nombreArchivo = `Boleta_${String(venta.id).padStart(8, '0')}_${fechaFormateada.replace(/\//g, '-')}.pdf`;

    // Guardar el PDF
    doc.save(nombreArchivo);

    return nombreArchivo;
}

/**
 * Genera un PDF con formato de ticket (más pequeño)
 * Útil para impresoras térmicas o tickets de caja
 */
export function generarTicketPDF(venta) {
    // Crear documento más pequeño (ticket)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Ancho 80mm (estándar de tickets)
    });

    let yPos = 10;

    // ENCABEZADO
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FARMACIA', 40, yPos, { align: 'center' });
    yPos += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Av. Principal 123', 40, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Tel: (01) 234-5678', 40, yPos, { align: 'center' });
    yPos += 6;

    // Línea separadora
    doc.setLineWidth(0.3);
    doc.line(5, yPos, 75, yPos);
    yPos += 5;

    // INFORMACIÓN DE VENTA
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BOLETA DE VENTA', 40, yPos, { align: 'center' });
    yPos += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`N°: ${String(venta.id).padStart(8, '0')}`, 5, yPos);
    yPos += 4;

    const fechaFormateada = new Date(venta.fecha).toLocaleDateString('es-PE');
    doc.text(`Fecha: ${fechaFormateada}`, 5, yPos);
    yPos += 4;

    doc.text(`Cliente: ${venta.cliente_nombre || 'Público General'}`, 5, yPos);
    yPos += 6;

    // Línea separadora
    doc.line(5, yPos, 75, yPos);
    yPos += 5;

    // PRODUCTOS
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', 5, yPos);
    doc.text('Cant', 50, yPos);
    doc.text('Total', 75, yPos, { align: 'right' });
    yPos += 4;

    doc.line(5, yPos, 75, yPos);
    yPos += 4;

    doc.setFont('helvetica', 'normal');
    venta.detalles.forEach(detalle => {
        const nombre = detalle.producto_nombre || 'Sin nombre';
        doc.text(nombre.substring(0, 30), 5, yPos);
        doc.text(String(detalle.cantidad), 50, yPos);
        doc.text(`${detalle.subtotal.toFixed(2)}`, 75, yPos, { align: 'right' });
        yPos += 4;
    });

    // Línea antes del total
    yPos += 2;
    doc.setLineWidth(0.5);
    doc.line(5, yPos, 75, yPos);
    yPos += 5;

    // TOTAL
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 5, yPos);
    doc.text(`S/. ${venta.total.toFixed(2)}`, 75, yPos, { align: 'right' });
    yPos += 8;

    // PIE
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por su compra', 40, yPos, { align: 'center' });

    // Guardar
    const nombreArchivo = `Ticket_${String(venta.id).padStart(8, '0')}.pdf`;
    doc.save(nombreArchivo);

    return nombreArchivo;
}
