package com.example.ttms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ttms.sample-data")
public class SampleDataConfig {
    
    private boolean enabled = true;
    private int minToursPerCustomer = 2;
    private int maxToursPerCustomer = 3;
    private int minToursPerGuide = 1;
    private int maxToursPerGuide = 2;
    private int minDaysAgo = 7;
    private int maxDaysAgo = 90;
    
    // Getters and Setters
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public int getMinToursPerCustomer() {
        return minToursPerCustomer;
    }
    
    public void setMinToursPerCustomer(int minToursPerCustomer) {
        this.minToursPerCustomer = minToursPerCustomer;
    }
    
    public int getMaxToursPerCustomer() {
        return maxToursPerCustomer;
    }
    
    public void setMaxToursPerCustomer(int maxToursPerCustomer) {
        this.maxToursPerCustomer = maxToursPerCustomer;
    }
    
    public int getMinToursPerGuide() {
        return minToursPerGuide;
    }
    
    public void setMinToursPerGuide(int minToursPerGuide) {
        this.minToursPerGuide = minToursPerGuide;
    }
    
    public int getMaxToursPerGuide() {
        return maxToursPerGuide;
    }
    
    public void setMaxToursPerGuide(int maxToursPerGuide) {
        this.maxToursPerGuide = maxToursPerGuide;
    }
    
    public int getMinDaysAgo() {
        return minDaysAgo;
    }
    
    public void setMinDaysAgo(int minDaysAgo) {
        this.minDaysAgo = minDaysAgo;
    }
    
    public int getMaxDaysAgo() {
        return maxDaysAgo;
    }
    
    public void setMaxDaysAgo(int maxDaysAgo) {
        this.maxDaysAgo = maxDaysAgo;
    }
}
