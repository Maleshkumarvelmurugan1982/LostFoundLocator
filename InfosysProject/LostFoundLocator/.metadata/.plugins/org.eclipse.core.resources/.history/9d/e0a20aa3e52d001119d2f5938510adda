package edu.infosys.lostFoundLocatorApplication.bean;

import edu.infosys.lostFoundLocatorApplication.bean.MatchItem;

public class MatchItemDTO {

    private String lostItemId;
    private String foundItemId;
    private String itemName;
    private String category;
    private String lostUsername;
    private String foundUsername;
    private byte[] image;   // image stored in DB

    public MatchItemDTO() {
        super();
    }

    public MatchItemDTO(String lostItemId, String foundItemId, String itemName,
                        String category, String lostUsername, String foundUsername, byte[] image) {
        super();
        this.lostItemId = lostItemId;
        this.foundItemId = foundItemId;
        this.itemName = itemName;
        this.category = category;
        this.lostUsername = lostUsername;
        this.foundUsername = foundUsername;
        this.image = image;
    }

    // Convert Entity → DTO
    public MatchItemDTO(MatchItem matchItem) {
        super();
        this.lostItemId = matchItem.getMatchItemId().getLostItemId();
        this.foundItemId = matchItem.getMatchItemId().getFoundItemId();
        this.itemName = matchItem.getItemName();
        this.category = matchItem.getCategory();
        this.lostUsername = matchItem.getLostUsername();
        this.foundUsername = matchItem.getFoundUsername();
        this.image = matchItem.getImage();
    }

    public String getLostItemId() {
        return lostItemId;
    }

    public void setLostItemId(String lostItemId) {
        this.lostItemId = lostItemId;
    }

    public String getFoundItemId() {
        return foundItemId;
    }

    public void setFoundItemId(String foundItemId) {
        this.foundItemId = foundItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLostUsername() {
        return lostUsername;
    }

    public void setLostUsername(String lostUsername) {
        this.lostUsername = lostUsername;
    }

    public String getFoundUsername() {
        return foundUsername;
    }

    public void setFoundUsername(String foundUsername) {
        this.foundUsername = foundUsername;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}