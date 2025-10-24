import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import SimpleBarChart from './SimpleBarChart';
import apiService from '../../api/Report';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  const reportRef = useRef(null);
  const dailyRef = useRef(null);
  const weeklyRef = useRef(null);
  const monthlyRef = useRef(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let response;
        if (activeTab === 'daily') {
          response = await apiService.getDailyReport(30);
        } else if (activeTab === 'weekly') {
          response = await apiService.getWeeklyReport(12);
        } else if (activeTab === 'monthly') {
          response = await apiService.getMonthlyReport(12);
        }
        
        console.log('API Response:', response); // Debug logging
        
        if (response && response.data) {
          console.log('Setting rows with data:', response.data); // Debug logging
          // Transform API response to match expected format
          const transformedData = response.data.map(item => ({
            sale_date: item.period,
            package_name: item.label,
            units_sold: item.totalUnits,
            total_sales: item.totalSales,
            price_per_unit: item.pricePerUnit
          }));
          console.log('Transformed data:', transformedData); // Debug logging
          setRows(transformedData);
        } else if (response && response.error) {
          console.error('API Error:', response.error); // Debug logging
          setError(response.error);
          setRows([]);
        } else {
          console.log('No data received'); // Debug logging
          setRows([]);
        }
      } catch (e) {
        console.error('Exception in loadReports:', e); // Debug logging
        setError(e?.message || 'Error loading data');
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, [activeTab]);

  const formatCurrency = (amount) => `Rs. ${amount.toLocaleString('en-LK')}`;

  const colorPalette = [
    '#4e73df',
    '#1cc88a',
    '#36b9cc',
    '#f6c23e',
    '#e74a3b',
    '#858796',
    '#5a5c69',
    '#6f42c1',
    '#e83e8c',
    '#fd7e14',
    '#20c997',
    '#6610f2'
  ];

  const getDailyPackages = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    console.log('getDailyPackages - dateStr:', dateStr, 'rows:', rows); // Debug logging
    const map = new Map();
    rows.filter(r => r.sale_date === dateStr).forEach(r => {
      const curr = map.get(r.package_name) || { name: r.package_name, sold: 0, price: r.price_per_unit, total: 0 };
      curr.sold += r.units_sold;
      curr.total += r.total_sales;
      curr.price = r.price_per_unit;
      map.set(r.package_name, curr);
    });
    return Array.from(map.values());
  };

  const getWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    return days.map(d => {
      const dayStr = format(d, 'yyyy-MM-dd');
      const dayRows = rows.filter(r => r.sale_date === dayStr);
      const sold = dayRows.reduce((s, r) => s + r.units_sold, 0);
      const total = dayRows.reduce((s, r) => s + r.total_sales, 0);
      return { date: format(d, 'MMM dd'), dayName: format(d, 'EEEE'), sold, total };
    });
  };

  const getMonthWeeks = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const weeks = [];
    let cursor = startOfWeek(start, { weekStartsOn: 1 });
    let index = 1;
    while (cursor <= end) {
      const weekStart = cursor;
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const clampedEnd = weekEnd > end ? end : weekEnd;
      const dates = eachDayOfInterval({ start: weekStart, end: clampedEnd });
      let sold = 0; let total = 0;
      dates.forEach(d => {
        const dayStr = format(d, 'yyyy-MM-dd');
        rows.filter(r => r.sale_date === dayStr).forEach(r => { sold += r.units_sold; total += r.total_sales; });
      });
      weeks.push({
        week: `Week ${index}`,
        period: `${format(weekStart, 'MMM dd')} - ${format(clampedEnd, 'MMM dd')}`,
        sold,
        total
      });
      index += 1;
      cursor = addDays(weekEnd, 1);
    }
    return weeks;
  };

  const dailyData = React.useMemo(() => {
    const packages = getDailyPackages(currentDate);
    return {
      date: format(currentDate, 'MMM dd, yyyy'),
      dayName: format(currentDate, 'EEEE'),
      packages
    };
  }, [rows, currentDate]);

  const weeklyData = React.useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return {
      period: `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`,
      days: getWeekDays(currentDate)
    };
  }, [rows, currentDate]);

  const monthlyData = React.useMemo(() => {
    return {
      month: format(currentDate, 'MMMM yyyy'),
      weeks: getMonthWeeks(currentDate)
    };
  }, [rows, currentDate]);

  const getActiveSectionRef = () => {
    if (activeTab === 'daily') return dailyRef;
    if (activeTab === 'weekly') return weeklyRef;
    return monthlyRef;
  };

  const downloadPDF = async () => {
    const [jsPDF, html2canvas] = await Promise.all([
      import('jspdf').then(m => m.default),
      import('html2canvas').then(m => m.default)
    ]);

    const targetRef = getActiveSectionRef().current;
    if (!targetRef) return;

    try {
      const canvas = await html2canvas(targetRef, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f8f9fc'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let positionY = 10;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 10, positionY, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);
      positionY = 10;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, positionY - (imgHeight - heightLeft), imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }

      const fileName = `tour_report_${activeTab}_${format(currentDate, 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const getTotalSales = (data) => data.reduce((sum, item) => sum + (item.total || 0), 0);
  const getTotalSold = (data) => data.reduce((sum, item) => sum + (item.sold || 0), 0);

  const handleBarClick = (labelIndex, datasetIndex, value, label) => {
    setSelectedBar({label, value, index: labelIndex});

    setTimeout(() => {
      setSelectedBar(null);
    }, 3000);
  };

  const renderBarChart = (data, type) => {
    const labels = data.map(item => {
      if (type === 'daily') return item.name;
      if (type === 'weekly') return item.date;
      return item.week;
    });

    let datasets;

    if (type === 'daily') {
      datasets = [{
        label: 'Package Sales',
        data: data.map(item => item.total),
        color: '#4e73df'
      }];
    } else {
      datasets = [{
        label: type === 'weekly' ? 'Daily Sales' : 'Weekly Sales',
        data: data.map(item => item.total || item.sold * (item.price || 0)),
        color: '#4e73df'
      }];
    }

    return (
        <div className="tw-chart-container tw-bg-gradient-to-br tw-from-slate-50 tw-to-white tw-rounded-2xl tw-p-6 tw-border tw-border-slate-200 tw-shadow-sm">
  <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
    <div className="tw-flex tw-items-center tw-space-x-3">
      <div className="tw-p-2 tw-bg-blue-100 tw-rounded-lg">
        <svg className="tw-w-5 tw-h-5 tw-text-[#4e73df]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div>
        <h6 className="tw-text-xl tw-font-bold tw-text-gray-900">Sales Analytics</h6>
      </div>
    </div>
  </div>

  <div className="tw-relative tw-bg-white tw-rounded-xl tw-p-4 tw-border tw-border-slate-100">
    <SimpleBarChart
      labels={labels}
      datasets={datasets}
      height={window.innerWidth < 768 ? 200 : 240}
      yPrefix="Rs "
      onBarClick={handleBarClick}
      barColors={type === 'daily' ? data.map((_, index) => colorPalette[index % colorPalette.length]) : undefined}
    />

    {selectedBar && (
      <div className="tw-absolute tw-top-4 tw-right-4 tw-bg-gray-900 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-lg tw-animate-in tw-fade-in-0 tw-zoom-in-95 tw-duration-200">
        <div className="tw-text-sm tw-font-semibold">{selectedBar.label}</div>
        <div className="tw-text-lg tw-font-bold tw-text-blue-400">{formatCurrency(selectedBar.value)}</div>
        <div className="tw-absolute -tw-bottom-1 tw-right-4 tw-w-2 tw-h-2 tw-bg-gray-900 tw-rotate-45"></div>
      </div>
    )}
  </div>

  {type === 'daily' && data.length > 0 && (
    <div className="tw-mt-6 tw-p-4 tw-bg-white tw-rounded-xl tw-border tw-border-slate-100">
      <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700 tw-mb-3">Package Legend</h6>
      <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-3">
        {data.map((item, index) => (
          <div key={index} className="tw-flex tw-items-center tw-space-x-2 tw-p-2 tw-rounded-lg tw-bg-slate-50 hover:tw-bg-slate-100 tw-transition-colors">
            <div
              className="tw-w-4 tw-h-4 tw-rounded-full tw-border-2 tw-border-white tw-shadow-sm"
              style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
            ></div>
            <div className="tw-flex-1 tw-min-w-0">
              <span className="tw-text-xs tw-font-medium tw-text-gray-700 tw-truncate tw-block">{item.name}</span>
              <span className="tw-text-xs tw-text-gray-500">{formatCurrency(item.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {data.length > 0 && (
    <div className="tw-mt-4 tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
      <div className="tw-bg-white tw-rounded-lg tw-p-3 tw-border tw-border-slate-100 tw-text-center">
        <div className="tw-text-lg tw-font-bold tw-text-[#4e73df]">
          {type === 'daily' ? data.length : data.reduce((sum, item) => sum + (item.sold || 0), 0)}
        </div>
        <div className="tw-text-xs tw-text-gray-500">
          {type === 'daily' ? 'Packages' : 'Total Units'}
        </div>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-p-3 tw-border tw-border-slate-100 tw-text-center">
        <div className="tw-text-lg tw-font-bold tw-text-[#1cc88a]">
          {formatCurrency(data.reduce((sum, item) => sum + (item.total || 0), 0))}
        </div>
        <div className="tw-text-xs tw-text-gray-500">Total Revenue</div>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-p-3 tw-border tw-border-slate-100 tw-text-center">
        <div className="tw-text-lg tw-font-bold tw-text-[#36b9cc]">
          {formatCurrency(Math.round(data.reduce((sum, item) => sum + (item.total || 0), 0) / data.length))}
        </div>
        <div className="tw-text-xs tw-text-gray-500">Average</div>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-p-3 tw-border tw-border-slate-100 tw-text-center">
        <div className="tw-text-lg tw-font-bold tw-text-[#f6c23e]">
          {Math.max(...data.map(item => item.total || 0)).toLocaleString()}
        </div>
        <div className="tw-text-xs tw-text-gray-500">Peak Sales</div>
      </div>
    </div>
  )}
</div>
    );
  };

  const navigateDate = (direction) => {
    if (activeTab === 'daily') setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
    else if (activeTab === 'weekly') setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    else setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  if (isLoading) {
    return (
        <div className="tw-space-y-6">
          <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-6">
            <div className="tw-flex tw-items-center tw-justify-center tw-py-12">
              <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-[#4e73df]"></div>
              <span className="tw-ml-3 tw-text-lg tw-text-gray-600">Loading reports data...</span>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="tw-space-y-6">
          <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-p-6">
            <div className="tw-text-center tw-py-12">
              <div className="tw-w-16 tw-h-16 tw-mx-auto tw-mb-4 tw-bg-red-50 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <svg className="tw-w-8 tw-h-8 tw-text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-mb-2">Error Loading Data</h3>
              <p className="tw-text-gray-500 tw-mb-6">{error}</p>
              <button
                  onClick={() => window.location.reload()}
                  className="tw-bg-[#4e73df] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-semibold hover:tw-bg-[#4266c9] tw-transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div ref={reportRef} className="tw-space-y-6">
  <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-border tw-border-gray-100">
    <div className="tw-bg-gradient-to-r tw-from-[#4e73df] tw-to-[#6a8ae3] tw-rounded-t-3xl tw-p-4 md:tw-p-6">
      <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between">
        <div>
          <h2 className="tw-text-xl md:tw-text-3xl tw-font-bold tw-text-white tw-mb-1">
            <svg className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8 tw-inline tw-mr-2 md:tw-mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Sales Analytics Dashboard
          </h2>
          <p className="tw-text-blue-100 tw-opacity-90 tw-text-sm md:tw-text-base">Comprehensive tour sales reports and insights</p>
        </div>
        <div className="tw-mt-4 md:tw-mt-0">
          <button onClick={downloadPDF} className="tw-bg-white/20 hover:tw-bg-white/30 tw-backdrop-blur-sm tw-text-white tw-px-4 md:tw-px-6 tw-py-2 md:tw-py-3 tw-rounded-xl tw-font-semibold tw-transition-all tw-duration-300 tw-border tw-border-white/20 tw-text-sm md:tw-text-base">
            <svg className="tw-w-4 tw-h-4 md:tw-w-5 md:tw-h-5 tw-inline tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="tw-hidden sm:tw-inline">Download PDF Report</span>
            <span className="sm:tw-hidden">PDF</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="tw-bg-white tw-rounded-3xl tw-shadow-xl tw-border tw-border-gray-100 tw-overflow-hidden">
    <div className="tw-bg-gray-50 tw-px-4 md:tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
      <div className="tw-flex tw-space-x-1 tw-overflow-x-auto">
        <button
          onClick={() => setActiveTab('daily')}
          className={`tw-px-3 md:tw-px-4 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition-all tw-duration-300 tw-text-sm md:tw-text-base tw-whitespace-nowrap ${
            activeTab === 'daily'
              ? 'tw-bg-[#4e73df] tw-text-white tw-shadow-md'
              : 'tw-text-gray-600 hover:tw-text-gray-900 hover:tw-bg-gray-100'
          }`}
        >
          <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-1 md:tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="tw-hidden sm:tw-inline">Daily Report</span>
          <span className="sm:tw-hidden">Daily</span>
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`tw-px-3 md:tw-px-4 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition-all tw-duration-300 tw-text-sm md:tw-text-base tw-whitespace-nowrap ${
            activeTab === 'weekly'
              ? 'tw-bg-[#4e73df] tw-text-white tw-shadow-md'
              : 'tw-text-gray-600 hover:tw-text-gray-900 hover:tw-bg-gray-100'
          }`}
        >
          <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-1 md:tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="tw-hidden sm:tw-inline">Weekly Report</span>
          <span className="sm:tw-hidden">Weekly</span>
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`tw-px-3 md:tw-px-4 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition-all tw-duration-300 tw-text-sm md:tw-text-base tw-whitespace-nowrap ${
            activeTab === 'monthly'
              ? 'tw-bg-[#4e73df] tw-text-white tw-shadow-md'
              : 'tw-text-gray-600 hover:tw-text-gray-900 hover:tw-bg-gray-100'
          }`}
        >
          <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-1 md:tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="tw-hidden sm:tw-inline">Monthly Report</span>
          <span className="sm:tw-hidden">Monthly</span>
        </button>
      </div>
    </div>

    <div className="tw-p-6">
      {activeTab === 'daily' && (
        <div ref={dailyRef}>
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <div>
              <h5 className="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-1">Daily Sales Report</h5>
              <p className="tw-text-gray-600">
                <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dailyData.date} - {dailyData.dayName}
              </p>
            </div>
            <div className="tw-flex tw-space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="tw-p-2 tw-text-gray-600 hover:tw-text-[#4e73df] hover:tw-bg-blue-50 tw-rounded-lg tw-transition-colors"
              >
                <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="tw-p-2 tw-text-gray-600 hover:tw-text-[#4e73df] hover:tw-bg-blue-50 tw-rounded-lg tw-transition-colors"
              >
                <svg className="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {renderBarChart(dailyData.packages, 'daily')}

          <div className="tw-mt-6 tw-overflow-x-auto">
            <table className="tw-min-w-full tw-text-sm md:tw-text-base">
              <thead>
                <tr className="tw-text-left tw-text-gray-500 tw-border-b tw-border-gray-200">
                  <th className="tw-pb-3 tw-font-semibold tw-text-xs md:tw-text-sm">Package Name</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold tw-text-xs md:tw-text-sm">Units Sold</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold tw-text-xs md:tw-text-sm tw-hidden sm:tw-table-cell">Price per Unit</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold tw-text-xs md:tw-text-sm">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.packages.map((pkg, index) => (
                  <tr key={index} className="tw-border-b tw-border-gray-100 hover:tw-bg-gray-50">
                    <td className="tw-py-3 tw-font-semibold tw-text-gray-900 tw-text-xs md:tw-text-sm">
                      <div className="tw-truncate tw-max-w-[120px] md:tw-max-w-none">{pkg.name}</div>
                    </td>
                    <td className="tw-py-3 tw-text-center">
                      <span className="tw-inline-block tw-bg-blue-100 tw-text-blue-800 tw-px-2 md:tw-px-3 tw-py-1 tw-rounded-full tw-text-xs md:tw-text-sm tw-font-semibold">
                        {pkg.sold}
                      </span>
                    </td>
                    <td className="tw-py-3 tw-text-center tw-text-gray-600 tw-text-xs md:tw-text-sm tw-hidden sm:tw-table-cell">{formatCurrency(pkg.price)}</td>
                    <td className="tw-py-3 tw-text-center tw-font-bold tw-text-[#4e73df] tw-text-xs md:tw-text-sm">{formatCurrency(pkg.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tw-mt-6 tw-bg-gradient-to-r tw-from-[#4e73df] tw-to-[#6a8ae3] tw-rounded-2xl tw-p-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-text-white">
              <div>
                <h6 className="tw-font-bold tw-mb-1">Total Sales for {dailyData.date}</h6>
                <p className="tw-text-blue-100 tw-text-sm">{getTotalSold(dailyData.packages)} packages sold</p>
              </div>
              <div className="tw-text-right">
                <h4 className="tw-text-2xl tw-font-bold">{formatCurrency(getTotalSales(dailyData.packages))}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div ref={weeklyRef}>
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <div>
              <h5 className="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-1">Weekly Sales Report</h5>
              <p className="tw-text-gray-600">
                <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {weeklyData.period}
              </p>
            </div>
            <div className="tw-flex tw-space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="tw-px-3 tw-py-2 tw-text-gray-600 hover:tw-text-[#4e73df] hover:tw-bg-blue-50 tw-rounded-lg tw-transition-colors tw-text-sm"
              >
                <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Week
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="tw-px-3 tw-py-2 tw-text-gray-600 hover:tw-text-[#4e73df] hover:tw-bg-blue-50 tw-rounded-lg tw-transition-colors tw-text-sm"
              >
                Next Week
                <svg className="tw-w-4 tw-h-4 tw-inline tw-ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {renderBarChart(weeklyData.days, 'weekly')}

          <div className="tw-mt-6 tw-overflow-x-auto">
            <table className="tw-min-w-full">
              <thead>
                <tr className="tw-text-left tw-text-gray-500 tw-border-b tw-border-gray-200">
                  <th className="tw-pb-3 tw-font-semibold">Day</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Date</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Packages Sold</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.days.map((day, index) => (
                  <tr key={index} className="tw-border-b tw-border-gray-100 hover:tw-bg-gray-50">
                    <td className="tw-py-3 tw-font-semibold tw-text-gray-900">{day.dayName}</td>
                    <td className="tw-py-3 tw-text-center tw-text-gray-600">{day.date}</td>
                    <td className="tw-py-3 tw-text-center">
                      <span className="tw-inline-block tw-bg-blue-100 tw-text-blue-800 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold">
                        {day.sold}
                      </span>
                    </td>
                    <td className="tw-py-3 tw-text-center tw-font-bold tw-text-[#4e73df]">{formatCurrency(day.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tw-mt-6 tw-bg-gradient-to-r tw-from-[#4e73df] tw-to-[#6a8ae3] tw-rounded-2xl tw-p-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-text-white">
              <div>
                <h6 className="tw-font-bold tw-mb-1">Total Sales for {weeklyData.period}</h6>
                <p className="tw-text-blue-100 tw-text-sm">{getTotalSold(weeklyData.days)} packages sold</p>
              </div>
              <div className="tw-text-right">
                <h4 className="tw-text-2xl tw-font-bold">{formatCurrency(getTotalSales(weeklyData.days))}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'monthly' && (
        <div ref={monthlyRef}>
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <div>
              <h5 className="tw-text-xl tw-font-bold tw-text-gray-900 tw-mb-1">Monthly Sales Report</h5>
              <p className="tw-text-gray-600">
                <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {monthlyData.month}
              </p>
            </div>
            <div className="tw-flex tw-space-x-2">
              <button
                onClick={() => navigateDate('prev')}
                className="tw-px-3 tw-py-2 tw-text-gray-600 hover:tw-text-[#4e73df] hover:tw-bg-blue-50 tw-rounded-lg tw-transition-colors tw-text-sm"
              >
                <svg className="tw-w-4 tw-h-4 tw-inline tw-mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Month
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="tw-px-3 tw-py-2 tw-text-gray-600 hover:tw-text-[#4e73df] hover:tw-bg-blue-50 tw-rounded-lg tw-transition-colors tw-text-sm"
              >
                Next Month
                <svg className="tw-w-4 tw-h-4 tw-inline tw-ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {renderBarChart(monthlyData.weeks, 'monthly')}

          <div className="tw-mt-6 tw-overflow-x-auto">
            <table className="tw-min-w-full">
              <thead>
                <tr className="tw-text-left tw-text-gray-500 tw-border-b tw-border-gray-200">
                  <th className="tw-pb-3 tw-font-semibold">Week</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Period</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Packages Sold</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Total Sales</th>
                  <th className="tw-pb-3 tw-text-center tw-font-semibold">Average per Package</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.weeks.map((week, index) => (
                  <tr key={index} className="tw-border-b tw-border-gray-100 hover:tw-bg-gray-50">
                    <td className="tw-py-3 tw-font-semibold tw-text-gray-900">{week.week}</td>
                    <td className="tw-py-3 tw-text-center tw-text-gray-600">{week.period}</td>
                    <td className="tw-py-3 tw-text-center">
                      <span className="tw-inline-block tw-bg-blue-100 tw-text-blue-800 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold">
                        {week.sold}
                      </span>
                    </td>
                    <td className="tw-py-3 tw-text-center tw-font-bold tw-text-[#4e73df]">{formatCurrency(week.total)}</td>
                    <td className="tw-py-3 tw-text-center tw-text-gray-600">{formatCurrency(Math.round(week.total / Math.max(1, week.sold)))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tw-mt-6 tw-bg-gradient-to-r tw-from-[#4e73df] tw-to-[#6a8ae3] tw-rounded-2xl tw-p-4">
            <div className="tw-flex tw-items-center tw-justify-between tw-text-white">
              <div>
                <h6 className="tw-font-bold tw-mb-1">Total Sales for {monthlyData.month}</h6>
                <p className="tw-text-blue-100 tw-text-sm">{getTotalSold(monthlyData.weeks)} packages sold</p>
              </div>
              <div className="tw-text-right">
                <h4 className="tw-text-2xl tw-font-bold">{formatCurrency(getTotalSales(monthlyData.weeks))}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default Reports;