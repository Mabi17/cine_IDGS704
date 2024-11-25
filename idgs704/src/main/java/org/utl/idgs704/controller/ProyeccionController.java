package org.utl.idgs704.controller;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.utl.idgs704.model.Proyeccion;
import org.utl.idgs704.service.ProyeccionService;
import java.util.Date;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Controller
@RequestMapping("/horarioProyeccion")
public class ProyeccionController {

    @Autowired
    private ProyeccionService proyeccionService;

    @GetMapping
    public String listaDeProyecciones(Model model) {
        // Obtener todas las proyecciones
        List<Proyeccion> proyecciones = proyeccionService.ListarProyecciones();
        model.addAttribute("horarioProyeccion", proyecciones);

        // Filtrar solo las fechas únicas
        List<Date> dias = proyecciones.stream()
                                       .map(Proyeccion::getFecha)  // Extraer solo las fechas
                                       .distinct()                 // Eliminar duplicados
                                       .collect(Collectors.toList()); // Recoger en una lista
        
        // Añadir los días únicos al modelo
        model.addAttribute("diasFunciones", dias);
        
        return "HorariosProyecciones";
    }
    
@PostMapping("/generar-pdf")
public ResponseEntity<byte[]> generarPdf(@RequestBody Map<String, List<Map<String, String>>> data) {
    try {
        // Verificar que los datos sean correctos
        if (data == null || data.get("data") == null) {
            return ResponseEntity.badRequest().body("Datos no proporcionados".getBytes());
        }
        List<Map<String, String>> tableData = data.get("data");

        // Crear el documento PDF en orientación horizontal
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        // Crear el escritor de PDF 
        PdfWriter.getInstance(document, byteArrayOutputStream);

        // Abrir el documento para añadir contenido
        document.open();

        // Añadir un título al documento
        Paragraph title = new Paragraph("Horario de Salas", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Crear la tabla con 5 columnas y formato
        PdfPTable table = new PdfPTable(5); // 5 columnas
        table.setWidthPercentage(100); // Tabla ocupa el 100% del ancho
        table.setSpacingBefore(10f);

        // Ajustar proporción de las columnas
        table.setWidths(new float[]{3, 2, 3, 2, 2});

        // Estilo para el encabezado
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
        BaseColor headerBackground = BaseColor.DARK_GRAY;

        // Añadir encabezados con formato
        Stream.of("Película", "Sala", "Tipo de Rendimiento", "Hora Inicio", "Fecha").forEach(columnTitle -> {
            PdfPCell header = new PdfPCell(new Paragraph(columnTitle, headerFont));
            header.setBackgroundColor(headerBackground);
            header.setHorizontalAlignment(Element.ALIGN_CENTER);
            header.setPadding(10);
            table.addCell(header);
        });

        // Añadir los datos de la tabla con formato
        for (Map<String, String> row : tableData) {
            table.addCell(createCell(row.get("pelicula"), Element.ALIGN_LEFT));
            table.addCell(createCell(row.get("sala"), Element.ALIGN_CENTER));
            table.addCell(createCell(row.get("tipoRendimiento"), Element.ALIGN_LEFT));
            table.addCell(createCell(row.get("hora"), Element.ALIGN_CENTER));
            table.addCell(createCell(row.get("fecha"), Element.ALIGN_CENTER));
        }

        // Añadir la tabla al documento
        document.add(table);

        // Cerrar el documento después de añadir todo el contenido
        document.close();

        // Convertir el documento a un arreglo de bytes
        byte[] pdfBytes = byteArrayOutputStream.toByteArray();

        // Devolver el PDF como una respuesta con los encabezados
        return ResponseEntity.ok()
                             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=horario_salas.pdf")
                             .body(pdfBytes);
    } catch (DocumentException e) {
        return ResponseEntity.status(500).body("Error al generar el PDF".getBytes());
    }
}

// Método auxiliar para crear celdas con formato
private PdfPCell createCell(String content, int alignment) {
    Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
    PdfPCell cell = new PdfPCell(new Paragraph(content, cellFont));
    cell.setHorizontalAlignment(alignment);
    cell.setPadding(8);
    return cell;
}






}
