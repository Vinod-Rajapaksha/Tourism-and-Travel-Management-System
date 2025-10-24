// models/Feedback.java
package com.example.ttms.models;

import jakarta.persistence.*;

@Entity
@Table(name = "FEEDBACK")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedbackID", insertable = false, updatable = false)
    private Integer feedbackID;

    @Column(name = "Rating")
    private Integer rating;

    @Column(name = "Comment", columnDefinition = "TEXT")
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "packageID")
    private PackageEntity pack;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userID")
    private Client client;

    public Integer getFeedbackID() { return feedbackID; }
    public void setFeedbackID(Integer feedbackID) { this.feedbackID = feedbackID; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public PackageEntity getPack() { return pack; }
    public void setPack(PackageEntity pack) { this.pack = pack; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}