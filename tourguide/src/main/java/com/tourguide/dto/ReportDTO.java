package com.backend.dto.Analyse;

import java.math.BigDecimal;

public class ReportDTO {
    private String period;
    private Integer totalUnits;
    private BigDecimal totalSales;
    private String label;
    private BigDecimal pricePerUnit;

    public ReportDTO() {
    }

    public ReportDTO(String period, Integer totalUnits, BigDecimal totalSales, String label, BigDecimal pricePerUnit) {
        this.period = period;
        this.totalUnits = totalUnits;
        this.totalSales = totalSales;
        this.label = label;
        this.pricePerUnit = pricePerUnit;
    }

    public ReportDTO(String string, Integer unitsSold, BigDecimal totalSales, Long packageId, BigDecimal pricePerUnit) {

    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Integer getTotalUnits() {
        return totalUnits;
    }

    public void setTotalUnits(Integer totalUnits) {
        this.totalUnits = totalUnits;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }
}