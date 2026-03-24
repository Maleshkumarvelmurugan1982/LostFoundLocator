package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;

import edu.infosys.lostFoundLocatorApplication.bean.LostItem;

public interface LostItemDao {

    void saveLostItem(LostItem lostItem);

    List<LostItem> getAllLostItems();

    // 🔥 ID changed to String
    LostItem getLostItemById(String lostItemId);

    void deleteLostItemById(String lostItemId);

    // 🔥 Must return String (L0001)
    String getLastId();

    List<LostItem> getLostItemsByUsername(String username);
}