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
 

});