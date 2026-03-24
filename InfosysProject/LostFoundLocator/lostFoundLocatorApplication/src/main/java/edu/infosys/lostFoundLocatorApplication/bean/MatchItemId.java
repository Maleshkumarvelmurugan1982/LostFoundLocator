package edu.infosys.lostFoundLocatorApplication.bean;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class MatchItemId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "lost_item_id", nullable = false)
    private String lostItemId;

    @Column(name = "found_item_id", nullable = false)
    private String foundItemId;

    public MatchItemId() {
        super();
    }

    public MatchItemId(String lostItemId, String foundItemId) {
        super();
        this.lostItemId = lostItemId;
        this.foundItemId = foundItemId;
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

    @Override
    public int hashCode() {
        return Objects.hash(lostItemId, foundItemId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;

        MatchItemId other = (MatchItemId) obj;

        return Objects.equals(lostItemId, other.lostItemId)
                && Objects.equals(foundItemId, other.foundItemId);
    }
}