/**
 * Client-side CSV Export Utility
 * @param {Array} data - Array of data objects
 * @param {String} filename - Name of the CSV file without extension
 * @param {Array} columns - Array of { key, label, format } objects
 */
export const exportToCSV = (data, filename, columns) => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  const headers = columns
    .map((c) => `"${c.label.replace(/"/g, '""')}"`)
    .join(",");

  const rows = data.map((item) => {
    return columns
      .map((c) => {
        let val = c.format
          ? c.format(item[c.key], item)
          : item[c.key] !== undefined && item[c.key] !== null
            ? item[c.key]
            : "";
        if (typeof val === "object") val = JSON.stringify(val);
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(",");
  });

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
