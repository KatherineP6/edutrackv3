// dashboard.js
import { renderClassroomsSummaryTable } from './salones.js';
import { fetchPerformanceData, renderPerformanceChart, renderPerformancePieChart } from './performance.js';

import { fetchClassrooms } from './salones.js';

export async function initDashboard() {
  await fetchPerformanceData();
  await fetchClassrooms();
  renderClassroomsSummaryTable();
}
