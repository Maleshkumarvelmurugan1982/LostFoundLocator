package edu.infosys.lostFoundLocatorApplication.bean;

import jakarta.persistence.*;

@Entity
@Table(name = "found_items")
public class FoundItem {

    @Id
    @Column(length = 10)
    private String id;   // F0001

    @Column(name = "item_name", nullable = false)
    private String itemName;

    private String brand;

    private String category;

    private String description;

    private String location;

    private String date;   // String

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "posted_by")
    private String postedBy;

    private boolean status;  // true = FOUND , false = CLAIMED

    public FoundItem() {
        super();
    }

    // ===== GETTERS & SETTERS =====

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getDate() {
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

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}