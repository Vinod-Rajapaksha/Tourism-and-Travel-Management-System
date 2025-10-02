package com.tourguide.dto;

public class PromotionDTO {
    private Integer id; // Integer to match backend entity
    private String title;
    private String startDate;
    private String endDate;
    private String color; // match frontend
    private String description;
    private String time;
    private String price;
    private String originalPrice;
    private String discount;
    private String duration;
    private Integer maxParticipants;
    private Boolean isActive;
    private String promotionType;
    private String terms;

    public PromotionDTO() {}

    // Constructor
    public PromotionDTO(Integer id, String title, String startDate, String endDate, String color,
                        String description, String time, String price, String originalPrice,
                        String discount, String duration, Integer maxParticipants, Boolean isActive,
                        String promotionType, String terms) {
        this.id = id;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.color = color;
        this.description = description;
        this.time = time;
        this.price = price;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.duration = duration;
        this.maxParticipants = maxParticipants;
        this.isActive = isActive;
        this.promotionType = promotionType;
        this.terms = terms;
    }

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(String originalPrice) { this.originalPrice = originalPrice; }

    public String getDiscount() { return discount; }
    public void setDiscount(String discount) { this.discount = discount; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getPromotionType() { return promotionType; }
    public void setPromotionType(String promotionType) { this.promotionType = promotionType; }

    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }
}
