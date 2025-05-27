// dashboard.js
/*
import { renderClassroomsSummaryTable } from './salones.js';
import { fetchPerformanceData, renderPerformanceChart, renderPerformancePieChart } from './performance.js';

import { fetchClassrooms } from './salones.js';

export async function initDashboard() {
  await fetchPerformanceData();
  await fetchClassrooms();
  renderClassroomsSummaryTable();
}
*/
document.addEventListener('DOMContentLoaded', () => {

  const tablaCuerpo = document.querySelector('#reporteTable tbody');

  function agregarFila(carrera) {
    const fila = document.createElement('tr');
    fila.dataset.id = carrera._id;
    fila.innerHTML = `
      <td>${carrera.nombre}</td>
      <td>${carrera.duracionSem}</td>
      <td>${carrera.precio.toFixed(2)}</td>
      <td>${carrera.cantidadcurso}</td>
      <td>${carrera.preciocurso.toFixed(2)}</td>
      <td>${carrera.cantidadestudiante}</td>
      <td>${carrera.precioestudiante.toFixed(2)}</td>
      
    `;
    tablaCuerpo.appendChild(fila);
  }

  async function lleanrTabla() {
    try {
       
      const response = await fetch('/api/carreras', { credentials: 'include' });
        if (!response.ok) throw new Error('Error al cargar carreras');
        const data = await response.json();

        const responseEstudiante = await fetch('/api/estudiantes', { credentials: 'include' });
        if (!responseEstudiante.ok) throw new Error('Error al cargar carreras');
        const dataEstudiante = await responseEstudiante.json();

        const responseCurso = await fetch('/api/cursos', { credentials: 'include' });
        if (!responseCurso.ok) throw new Error('Error al cargar carreras');
        const dataCurso = await responseCurso.json();




        
        for(var i = 0; i<data.length ; i++){
          var carrera = data[i];
          var cantEstudiante = 0;
          var cantCurso = 0;
          var docentes = "";
          for(var est = 0; est<dataEstudiante.length ; est++){
            if(data[i]._id == dataEstudiante[est].carreraId) {cantEstudiante++;}
          }
          for(var cur = 0; cur<dataCurso.length ; cur++){
            if(data[i]._id == dataCurso[cur].carreraId) {cantCurso++;}
          }
   
          carrera.cantidadestudiante = cantEstudiante;
          carrera.precioestudiante = parseFloat(cantEstudiante)*parseFloat(data[i].precio);
          carrera.cantidadcurso = cantCurso;
          carrera.preciocurso = parseFloat(cantCurso)*parseFloat(data[i].precio);
          
          agregarFila(carrera);
        }

        
    } catch (error) {
      alert(error.message);
    }
  }

 

  lleanrTabla();

  // PDF generation logic
  const { jsPDF } = window.jspdf;

  const generatePdfBtn = document.getElementById('generatePdfBtn');
  generatePdfBtn.addEventListener('click', () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Centered and bold title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Reporte de Carreras';
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;
    doc.text(title, x, 22);
    doc.setFont(undefined, 'normal');

    const headers = ['Carrera', 'Duracion Carrera', 'Precio', 'Cantidad de Cursos', 'Precio*Cursos', 'Cantidad de Estudiantes', 'Precio*Estudiantes'];

    const rows = [];
    document.querySelectorAll('#reporteTable tbody tr').forEach(row => {
      const rowData = [];
      row.querySelectorAll('td').forEach(td => {
        rowData.push(td.textContent);
      });
      rows.push(rowData);
    });

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30,
      styles: { fontSize: 12, cellPadding: 4 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: 'striped',
      margin: { left: 14, right: 14 },
      tableLineWidth: 0,
      tableLineColor: 255,
      didDrawCell: (data) => {
        if (data.section === 'body' && data.cell.section === 'body') {
          // Draw only horizontal lines between rows
          const { doc, cell, row } = data;
          const y = cell.y + cell.height;
          doc.setDrawColor(200);
          doc.setLineWidth(0.1);
          doc.line(cell.x, y, cell.x + cell.width, y);
        }
      }
    });

    doc.save('reporte_carreras.pdf');
  });

});
