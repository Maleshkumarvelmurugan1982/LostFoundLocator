package edu.infosys.lostFoundLocatorApplication.bean;

import jakarta.persistence.*;

@Entity
@Table(name = "lost_items")
public class LostItem {

    @Id
    private String id;   // ✅ VARCHAR(10)

    @Column(name = "item_name", nullable = false)
    private String itemName;

    private String brand;

    private String category;

    private String description;

    private String location;

    private String date;   // ✅ CHANGED to String

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "posted_by")
    private String postedBy;

    private Boolean status;   // ✅ CHANGED to Boolean

    public LostItem() {
        super();
    }

    // ===== GETTERS & SETTERS =====

    public String getId() {
        return id;
    }

    public void setId(String id) {   // IMPORTANT
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDate() {   // ✅ String
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(String postedBy) {
        this.postedBy = postedBy;
    }

    public Boolean getStatus() {   // ✅ Boolean
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}