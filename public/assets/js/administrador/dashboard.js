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

  async function cargarGrafico() {
    try {
       
      const response = await fetch('/api/carreras', { credentials: 'include' });
        if (!response.ok) throw new Error('Error al cargar carreras');
        const data = await response.json();

        const responseEstudiante = await fetch('/api/estudiantes', { credentials: 'include' });
        if (!responseEstudiante.ok) throw new Error('Error al cargar carreras');
        const dataEstudiante = await responseEstudiante.json();

        var listaCarrera = [];
        var listaCantidad = [];
        
        for(var i = 0; i<data.length ; i++){
          var cant= 0;
          listaCarrera.push(data[i].nombre);
          for(var j = 0; j<dataEstudiante.length ; j++){
             if(data[i]._id == dataEstudiante[j].carreraId) {cant++;}
          }
          listaCantidad.push(cant);
        }

        const labels = ["Enero", "Febrero", "Marzo", "Abril"];
        const datos = [120, 150, 180, 90];

        const ctx = document.getElementById('performanceChart').getContext('2d');
        const miGrafico = new Chart(ctx, {
            type: 'bar', // tipos: 'line', 'pie', 'doughnut', 'bar', etc.
            data: {
                labels: listaCarrera,
                datasets: [{
                    label: 'Carreras',
                    data: listaCantidad,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
      alert(error.message);
    }
  }

  async function cargarEstadisticas() {
    try {
       

        const response = await fetch('/api/salones', { credentials: 'include' });
        if (!response.ok) throw new Error('Error al cargar carreras');
        const data = await response.json();

        var listaSalones = [];
        var listaCantidad = [];
        
        for(var i = 0; i<data.length ; i++){
          
          listaSalones.push(data[i].bloque);
          listaCantidad.push(data[i].capacidad);
        }

        const labels = ["Enero", "Febrero", "Marzo", "Abril"];
        const datos = [120, 150, 180, 90];

        const ctx = document.getElementById('performanceChart2').getContext('2d');
        const miGrafico = new Chart(ctx, {
            type: 'pie', // tipos: 'line', 'pie', 'doughnut', 'bar', etc.
            data: {
                labels: listaSalones,
                datasets: [{
                    label: 'Cantidad',
                    data: listaCantidad,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: false,
                 plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Capacidad por Salones'
                    }
                }
            }
        });

        
    } catch (error) {
      alert(error.message);
    }
  }

  cargarGrafico();
  cargarEstadisticas();

});