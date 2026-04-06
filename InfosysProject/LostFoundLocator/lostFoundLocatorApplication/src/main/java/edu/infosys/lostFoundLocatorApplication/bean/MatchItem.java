package edu.infosys.lostFoundLocatorApplication.bean;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "match_items")
public class MatchItem {

    @EmbeddedId
    private MatchItemId matchItemId;

    private String itemName;
    private String category;
    private String lostUsername;
    private String foundUsername;

    // ✅ FIX: store image FILE NAME (String)
    private String image;

    public MatchItem() {
        super();
    }

    public MatchItem(MatchItemId matchItemId, String itemName, String category,
                     String lostUsername, String foundUsername, String image) {
        super();
        this.matchItemId = matchItemId;
        this.itemName = itemName;
        this.category = category;
        this.lostUsername = lostUsername;
        this.foundUsername = foundUsername;
        this.image = image;
    }

    public MatchItem(MatchItemDTO matchItem) {
        super();
        String lostItemId = matchItem.getLostItemId();
        String foundItemId = matchItem.getFoundItemId();

        this.matchItemId = new MatchItemId(lostItemId, foundItemId);
        this.itemName = matchItem.getItemName();
        this.category = matchItem.getCategory();
        this.lostUsername = matchItem.getLostUsername();
        this.foundUsername = matchItem.getFoundUsername();
        this.image = matchItem.getImage(); // ✅ IMPORTANT
    }

    public MatchItemId getMatchItemId() {
        return matchItemId;
    }

    public void setMatchItemId(MatchItemId matchItemId) {
        this.matchItemId = matchItemId;
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

    // ✅ UPDATED GETTER/SETTER
    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}