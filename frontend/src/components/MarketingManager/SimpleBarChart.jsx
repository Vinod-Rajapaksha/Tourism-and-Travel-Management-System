import React, { useEffect, useRef } from 'react';

const SimpleBarChart = ({ labels, datasets, stacked = false, height = 240, yPrefix = '', onBarClick, barColors }) => {
  const canvasRef = useRef(null);
  const barsRef = useRef([]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const h = height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const isMobile = width < 768;
    const padL = isMobile ? 35 : 48;
    const padR = isMobile ? 8 : 12;
    const padT = isMobile ? 8 : 10;
    const padB = isMobile ? 35 : 28;
    const plotW = width - padL - padR;
    const plotH = h - padT - padB;

    const totals = labels.map((_, i) => datasets.reduce((acc, ds) => acc + (ds.data[i] || 0), 0));
    const maxVal = Math.max(1, stacked ? Math.max(...totals) : Math.max(...datasets.flatMap(ds => ds.data)));

    const xStep = plotW / labels.length;

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, h);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padT + (plotH * i) / gridLines;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();

      if (i < gridLines) {
        const val = Math.round(maxVal - (maxVal * i) / gridLines);
        ctx.fillStyle = '#64748b';
        ctx.font = `${isMobile ? '9px' : '11px'} system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'right';
        const labelText = isMobile && val > 1000 ? `${yPrefix}${(val / 1000).toFixed(0)}k` : `${yPrefix}${val.toLocaleString()}`;
        ctx.fillText(labelText, padL - (isMobile ? 4 : 6), y + 4);
      }
    }

    barsRef.current = [];

    labels.forEach((label, i) => {
      const x = padL + i * xStep + xStep * 0.1;
      const barW = xStep * 0.8;
      if (stacked) {
        let accH = 0;
        datasets.forEach((ds, j) => {
          const val = ds.data[i] || 0;
          const hFrac = val / maxVal;
          const bh = Math.max(1, hFrac * plotH);
          const y = padT + plotH - accH - bh;
          ctx.fillStyle = ds.color;
          ctx.fillRect(x, y, barW, bh);

          barsRef.current.push({
            x, y, width: barW, height: bh,
            labelIndex: i, datasetIndex: j, value: val, label
          });

          accH += bh;
        });
      } else {
        const n = datasets.length;
        const gap = Math.min(4, barW * 0.1);
        const subW = (barW - gap * (n - 1)) / n;
        datasets.forEach((ds, j) => {
          const val = ds.data[i] || 0;
          const hFrac = val / maxVal;
          const bh = Math.max(2, hFrac * plotH);
          const y = padT + plotH - bh;
          const sx = x + j * (subW + gap);

          const barColor = barColors && barColors[i] ? barColors[i] : ds.color;

          const barGradient = ctx.createLinearGradient(sx, y, sx, y + bh);
          barGradient.addColorStop(0, barColor);
          barGradient.addColorStop(1, barColor + '80');
          ctx.fillStyle = barGradient;

          ctx.beginPath();
          const radius = Math.min(4, subW / 4);
          ctx.roundRect(sx, y, subW, bh, [radius, radius, 0, 0]);
          ctx.fill();

          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetY = 1;
          ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;

          barsRef.current.push({
            x: sx, y, width: subW, height: bh,
            labelIndex: i, datasetIndex: j, value: val, label
          });
        });
      }
      ctx.fillStyle = '#475569';
      ctx.font = `${isMobile ? '9px' : '11px'} system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';

      let displayLabel = label;
      if (isMobile && label.length > 8) {
        displayLabel = label.substring(0, 6) + '...';
      }

      ctx.fillText(displayLabel, x + barW / 2, padT + plotH + (isMobile ? 20 : 16));
    });
  };

  const handleCanvasClick = (event) => {
    if (!onBarClick) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const bar of barsRef.current) {
      if (x >= bar.x && x <= bar.x + bar.width &&
          y >= bar.y && y <= bar.y + bar.height) {
        onBarClick(bar.labelIndex, bar.datasetIndex, bar.value, bar.label);
        break;
      }
    }
  };

  useEffect(() => {
    drawChart();

    const handleResize = () => {
      setTimeout(drawChart, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [labels, datasets, stacked, height, yPrefix, barColors]);

  return (
      <div className="w-full">
        <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ width: '100%', height, minHeight: '200px', cursor: onBarClick ? 'pointer' : 'default' }}
        />
      </div>
  );
};

export default SimpleBarChart;