/**
 * HorlSM - Dashboard Charts Controller (Chart.js Integration)
 */

window.appCharts = {
  classChartInstance: null,
  feeChartInstance: null,
  incomeChartInstance: null,

  initDashboardCharts(store) {
    if (typeof Chart === 'undefined') return;

    this.renderClassChart(store);
    this.renderFeeChart(store);
    this.renderIncomeChart(store);
  },

  // ===== CHART 1: Donut - សិស្សតាមថ្នាក់ =====
  renderClassChart(store) {
    const canvas = document.getElementById('classChart');
    if (!canvas) return;

    const students = store ? store.getStudents() : [];
    const counts = { 'ថ្នាក់ទី៩': 0, 'ថ្នាក់ទី១០': 0, 'ថ្នាក់ទី១១': 0 };

    students.forEach(s => {
      const cls = s.className || s.class;
      if (counts[cls] !== undefined) counts[cls]++;
      else if (cls === 'ថ្នាក់ទី១២') counts['ថ្នាក់ទី១១']++;
      else counts['ថ្នាក់ទី១០']++;
    });

    const labels = Object.keys(counts);
    let data = Object.values(counts);
    if (data.every(v => v === 0)) data = [1, 2, 1];

    if (this.classChartInstance) this.classChartInstance.destroy();

    this.classChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
          borderWidth: 0,
          hoverOffset: 12,
          hoverBorderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
              font: { family: 'Kantumruy Pro', size: 12 }
            }
          }
        }
      }
    });
  },

  // ===== CHART 2: Pie - ថ្លៃសិក្សា =====
  renderFeeChart(store) {
    const canvas = document.getElementById('feeChart');
    if (!canvas) return;

    const invoices = store ? store.getInvoices() : [];
    let paid = 0, partial = 0, pending = 0;

    invoices.forEach(inv => {
      const total = Number(inv.total || inv.totalAmount) || 0;
      const paidAmt = Number(inv.paid || inv.paidAmount) || 0;
      if (paidAmt >= total && total > 0) paid++;
      else if (paidAmt > 0) partial++;
      else pending++;
    });

    let data = [paid, partial, pending];
    if (invoices.length === 0) data = [1, 1, 1];

    if (this.feeChartInstance) this.feeChartInstance.destroy();

    this.feeChartInstance = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['បានបង់គ្រប់', 'បង់ខ្លះ', 'នៅជំពាក់'],
        datasets: [{
          data: data,
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 14
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1400,
          easing: 'easeOutBack'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              font: { family: 'Kantumruy Pro', size: 12 }
            }
          }
        }
      }
    });
  },

  // ===== CHART 3: Bar - ចំណូល =====
  renderIncomeChart(store) {
    const canvas = document.getElementById('incomeChart');
    if (!canvas) return;

    if (this.incomeChartInstance) this.incomeChartInstance.destroy();

    this.incomeChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា'],
        datasets: [{
          label: 'ចំណូល',
          data: [2500, 2800, 3200, 2900, 3600, 4100, 4800],
          backgroundColor: (ctx) => {
            const chartCtx = ctx.chart.ctx;
            const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.95)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
            return gradient;
          },
          borderRadius: 10,
          borderSkipped: false,
          barPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          delay: (ctx) => ctx.dataIndex * 80
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { family: 'Kantumruy Pro' } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Kantumruy Pro', size: 11 } }
          }
        }
      }
    });
  }
};
