package edu.infosys.lostFoundLocatorApplication.bean;

import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;

public class FoundItemDTO implements Comparable<FoundItemDTO> {

    private String id;
    private String itemName;
    private String brand;
    private String category;
    private String description;
    private String location;
    private String date;
    private String imagePath;
    private String postedBy;
    private boolean status;

    // Default Constructor
    public FoundItemDTO() {
        super();
    }

    // All Arguments Constructor
    public FoundItemDTO(String id, String itemName, String brand, String category,
                        String description, String location, String date,
                        String imagePath, String postedBy, boolean status) {

        this.id = id;
        this.itemName = itemName;
        this.brand = brand;
        this.category = category;
        this.description = description;
        this.location = location;
        this.date = date;
        this.imagePath = imagePath;
        this.postedBy = postedBy;
        this.status = status;
    }

    // Convert Entity → DTO
    public FoundItemDTO(FoundItem item) {

        this.id = item.getId();
        this.itemName = item.getItemName();
        this.brand = item.getBrand();
        this.category = item.getCategory();
        this.description = item.getDescription();
        this.location = item.getLocation();
        this.date = item.getDate();
        this.imagePath = item.getImagePath();
        this.postedBy = item.getPostedBy();
        this.status = item.isStatus();
    }

    // ===== GETTERS & SETTERS =====

    public String getId() { return id; }

    public void setId(String id) { this.id = id; }

    public String getItemName() { return itemName; }

    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getBrand() { return brand; }

    public void setBrand(String brand) { this.brand = brand; }

    public String getCategory() { return category; }

    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getDate() { return date; }

    public void setDate(String date) { this.date = date; }

    public String getImagePath() { return imagePath; }

    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getPostedBy() { return postedBy; }

    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }

    public boolean isStatus() { return status; }

    public void setStatus(boolean status) { this.status = status; }

    // Required for TreeSet sorting
    @Override
    public int compareTo(FoundItemDTO o) {
        return this.id.compareTo(o.getId());
    }
}