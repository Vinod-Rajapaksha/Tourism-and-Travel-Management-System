// dto/FeedbackDTO.java
package com.example.ttms.dto;

public class FeedbackDTO {
    private Integer feedbackID;
    private Integer rating;
    private String comment;
    private Integer packageID;
    private String packageTitle;
    private Integer userID;
    private String userName;

    public Integer getFeedbackID() { return feedbackID; }
    public void setFeedbackID(Integer feedbackID) { this.feedbackID = feedbackID; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Integer getPackageID() { return packageID; }
    public void setPackageID(Integer packageID) { this.packageID = packageID; }

    public String getPackageTitle() { return packageTitle; }
    public void setPackageTitle(String packageTitle) { this.packageTitle = packageTitle; }

    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}