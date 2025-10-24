package com.backend.dto.Analyse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PopularPackageDTO {
    private Long packageId;
    private String packageName;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Long salesCount;
    private String image;
}