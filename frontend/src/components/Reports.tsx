import React, { useState, useRef, useEffect } from 'react';
import { Promotion, Payment } from '../types/Event';
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameWeek, isSameMonth } from 'date-fns';
import SimpleBarChart, { BarDataset } from './SimpleBarChart';

interface ReportsProps {
  promotions: Promotion[];
  payments?: Payment[];
}

type CsvRow = {
  sale_date: string; // yyyy-mm-dd
  package_name: string;
  units_sold: number;
  price_per_unit: number;
  total_sales: number;
};

const Reports: React.FC<ReportsProps> = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBar, setSelectedBar] = useState<{label: string, value: number, index: number} | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const dailyRef = useRef<HTMLDivElement>(null);
  const weeklyRef = useRef<HTMLDivElement>(null);
  const monthlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCsv = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/tour_sales_full_aug_sep_2025_with_promotions.csv');
        if (!res.ok) throw new Error(`Failed to load CSV (${res.status})`);
        const text = await res.text();
        const lines = text.trim().split(/\r?\n/);
        const data: CsvRow[] = lines.slice(1).map(line => {
          const parts = line.split(',');
          return {
            sale_date: parts[0],
            package_name: parts[1],
            units_sold: Number(parts[2]),
            price_per_unit: Number(parts[3]),
            total_sales: Number(parts[4])
          };
        });
        setRows(data);
      } catch (e: any) {
        setError(e?.message || 'Error loading data');
      } finally {
        setIsLoading(false);
      }
    };
    loadCsv();
  }, []);

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;

  // Color palette for different packages
  const colorPalette = [
    '#10b981', // emerald-500
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
    '#84cc16', // lime-500
    '#6366f1', // indigo-500
    '#f97316', // orange-500
    '#14b8a6', // teal-500
    '#d946ef'  // fuchsia-500
  ];

  // Aggregations from real data
  const getDailyPackages = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const map = new Map<string, { name: string; sold: number; price: number; total: number }>();
    rows.filter(r => r.sale_date === dateStr).forEach(r => {
      const curr = map.get(r.package_name) || { name: r.package_name, sold: 0, price: r.price_per_unit, total: 0 };
      curr.sold += r.units_sold;
      curr.total += r.total_sales;
      curr.price = r.price_per_unit; // assume consistent price per day
      map.set(r.package_name, curr);
    });
    return Array.from(map.values());
  };

  const getWeekDays = (date: Date) => {
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

  const getMonthWeeks = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    // Build 4-5 week buckets by weekStartsOn:1
    const weeks: { week: string; period: string; sold: number; total: number }[] = [];
    let cursor = startOfWeek(start, { weekStartsOn: 1 });
    let index = 1;
    while (cursor <= end) {
      const weekStart = cursor;
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const clampedEnd = weekEnd > end ? end : weekEnd;
      // Sum rows within this interval and within the month
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
    // Import jsPDF and html2canvas dynamically
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
        backgroundColor: '#f0fdf4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth - 20; // 10mm margins
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

  const getTotalSales = (data: any[]) => data.reduce((sum, item) => sum + (item.total || 0), 0);
  const getTotalSold = (data: any[]) => data.reduce((sum, item) => sum + (item.sold || 0), 0);

  const handleBarClick = (labelIndex: number, datasetIndex: number, value: number, label: string) => {
    setSelectedBar({label, value, index: labelIndex});
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setSelectedBar(null);
    }, 3000);
  };

  const renderBarChart = (data: any[], type: 'daily' | 'weekly' | 'monthly') => {
    // Prepare data for SimpleBarChart with different colors for each item
    const labels = data.map(item => {
      if (type === 'daily') return item.name;
      if (type === 'weekly') return item.date;
      return item.week;
    });

    // Create single dataset but with different colors for each bar
    let datasets: BarDataset[];
    
    if (type === 'daily') {
      // Single dataset with each package as a separate bar with different colors
      datasets = [{
        label: 'Package Sales',
        data: data.map(item => item.total),
        color: '#10b981' // This will be overridden per bar in the chart component
      }];
    } else {
      // For weekly/monthly, use single dataset 
      datasets = [{
        label: type === 'weekly' ? 'Daily Sales' : 'Weekly Sales',
        data: data.map(item => item.total || item.sold * (item.price || 0)),
        color: '#10b981'
      }];
    }

    return (
      <div className="chart-container bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h6 className="text-xl font-bold text-gray-900">Sales Analytics</h6>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-xl p-4 border border-slate-100">
          <SimpleBarChart 
            labels={labels}
            datasets={datasets}
            height={window.innerWidth < 768 ? 200 : 240}
            yPrefix="Rs "
            onBarClick={handleBarClick}
            barColors={type === 'daily' ? data.map((_, index) => colorPalette[index % colorPalette.length]) : undefined}
          />
          
          {/* Selected Bar Info Tooltip */}
          {selectedBar && (
            <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="text-sm font-semibold">{selectedBar.label}</div>
              <div className="text-lg font-bold text-emerald-400">{formatCurrency(selectedBar.value)}</div>
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
        
        {/* Enhanced Legend for daily view */}
        {type === 'daily' && data.length > 0 && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-slate-100">
            <h6 className="text-sm font-semibold text-gray-700 mb-3">Package Legend</h6>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                    style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-700 truncate block">{item.name}</span>
                    <span className="text-xs text-gray-500">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {data.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
              <div className="text-lg font-bold text-emerald-600">
                {type === 'daily' ? data.length : data.reduce((sum, item) => sum + (item.sold || 0), 0)}
              </div>
              <div className="text-xs text-gray-500">
                {type === 'daily' ? 'Packages' : 'Total Units'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(data.reduce((sum, item) => sum + (item.total || 0), 0))}
              </div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
              <div className="text-lg font-bold text-purple-600">
                {formatCurrency(Math.round(data.reduce((sum, item) => sum + (item.total || 0), 0) / data.length))}
              </div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
              <div className="text-lg font-bold text-orange-600">
                {Math.max(...data.map(item => item.total || 0)).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Peak Sales</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (activeTab === 'daily') setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
    else if (activeTab === 'weekly') setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    else setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading reports data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={reportRef} className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-3xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-1">
                <svg className="w-6 h-6 md:w-8 md:h-8 inline mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Sales Analytics Dashboard
              </h2>
              <p className="text-emerald-100 opacity-90 text-sm md:text-base">Comprehensive tour sales reports and insights</p>
        </div>
            <div className="mt-4 md:mt-0">
              <button onClick={downloadPDF} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 text-sm md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Download PDF Report</span>
                <span className="sm:hidden">PDF</span>
              </button>
          </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation & Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 md:px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Daily Report</span>
              <span className="sm:hidden">Daily</span>
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3 md:px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                activeTab === 'weekly'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Weekly Report</span>
              <span className="sm:hidden">Weekly</span>
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 md:px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                activeTab === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Monthly Report</span>
              <span className="sm:hidden">Monthly</span>
            </button>
        </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'daily' && (
            <div ref={dailyRef}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-1">Daily Sales Report</h5>
                  <p className="text-gray-600">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {dailyData.date} - {dailyData.dayName}
                  </p>
        </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigateDate('prev')} 
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigateDate('next')} 
                    className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
        </div>
      </div>

              {renderBarChart(dailyData.packages, 'daily')}

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm md:text-base">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-3 font-semibold text-xs md:text-sm">Package Name</th>
                      <th className="pb-3 text-center font-semibold text-xs md:text-sm">Units Sold</th>
                      <th className="pb-3 text-center font-semibold text-xs md:text-sm hidden sm:table-cell">Price per Unit</th>
                      <th className="pb-3 text-center font-semibold text-xs md:text-sm">Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.packages.map((pkg, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-semibold text-gray-900 text-xs md:text-sm">
                          <div className="truncate max-w-[120px] md:max-w-none">{pkg.name}</div>
                        </td>
                        <td className="py-3 text-center">
                          <span className="inline-block bg-emerald-100 text-emerald-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                            {pkg.sold}
                          </span>
                        </td>
                        <td className="py-3 text-center text-gray-600 text-xs md:text-sm hidden sm:table-cell">{formatCurrency(pkg.price)}</td>
                        <td className="py-3 text-center font-bold text-emerald-700 text-xs md:text-sm">{formatCurrency(pkg.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h6 className="font-bold mb-1">Total Sales for {dailyData.date}</h6>
                    <p className="text-emerald-100 text-sm">{getTotalSold(dailyData.packages)} packages sold</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-bold">{formatCurrency(getTotalSales(dailyData.packages))}</h4>
                  </div>
                </div>
              </div>
        </div>
          )}

          {activeTab === 'weekly' && (
            <div ref={weeklyRef}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-1">Weekly Sales Report</h5>
                  <p className="text-gray-600">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {weeklyData.period}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigateDate('prev')} 
                    className="px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Week
                  </button>
                  <button 
                    onClick={() => navigateDate('next')} 
                    className="px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                  >
                    Next Week
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
        </div>
      </div>

              {renderBarChart(weeklyData.days, 'weekly')}

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full">
            <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-3 font-semibold">Day</th>
                      <th className="pb-3 text-center font-semibold">Date</th>
                      <th className="pb-3 text-center font-semibold">Packages Sold</th>
                      <th className="pb-3 text-center font-semibold">Total Sales</th>
              </tr>
            </thead>
            <tbody>
                    {weeklyData.days.map((day, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-semibold text-gray-900">{day.dayName}</td>
                        <td className="py-3 text-center text-gray-600">{day.date}</td>
                        <td className="py-3 text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {day.sold}
                          </span>
                        </td>
                        <td className="py-3 text-center font-bold text-emerald-700">{formatCurrency(day.total)}</td>
                </tr>
              ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h6 className="font-bold mb-1">Total Sales for {weeklyData.period}</h6>
                    <p className="text-emerald-100 text-sm">{getTotalSold(weeklyData.days)} packages sold</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-bold">{formatCurrency(getTotalSales(weeklyData.days))}</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monthly' && (
            <div ref={monthlyRef}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-1">Monthly Sales Report</h5>
                  <p className="text-gray-600">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {monthlyData.month}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigateDate('prev')} 
                    className="px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Month
                  </button>
                  <button 
                    onClick={() => navigateDate('next')} 
                    className="px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm"
                  >
                    Next Month
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {renderBarChart(monthlyData.weeks, 'monthly')}

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-3 font-semibold">Week</th>
                      <th className="pb-3 text-center font-semibold">Period</th>
                      <th className="pb-3 text-center font-semibold">Packages Sold</th>
                      <th className="pb-3 text-center font-semibold">Total Sales</th>
                      <th className="pb-3 text-center font-semibold">Average per Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.weeks.map((week, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 font-semibold text-gray-900">{week.week}</td>
                        <td className="py-3 text-center text-gray-600">{week.period}</td>
                        <td className="py-3 text-center">
                          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {week.sold}
                          </span>
                        </td>
                        <td className="py-3 text-center font-bold text-emerald-700">{formatCurrency(week.total)}</td>
                        <td className="py-3 text-center text-gray-600">{formatCurrency(Math.round(week.total / Math.max(1, week.sold)))}</td>
                </tr>
                    ))}
            </tbody>
          </table>
              </div>

              <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h6 className="font-bold mb-1">Total Sales for {monthlyData.month}</h6>
                    <p className="text-emerald-100 text-sm">{getTotalSold(monthlyData.weeks)} packages sold</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-bold">{formatCurrency(getTotalSales(monthlyData.weeks))}</h4>
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

