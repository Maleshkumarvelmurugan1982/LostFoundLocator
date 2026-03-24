package edu.infosys.lostFoundLocatorApplication.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.lostFoundLocatorApplication.bean.LostItem;
import edu.infosys.lostFoundLocatorApplication.dao.LostItemDao;

@Service
public class LostItemService {

    @Autowired
    private LostItemDao lostItemDao;

    // ================= GENERATE CUSTOM ID =================
    private String generateNextId() {

        String lastId = lostItemDao.getLastId();

        // If table empty
        if (lastId == null || lastId.trim().isEmpty()) {
            return "L0001";
        }

        try {
            // Remove first letter (L)
            String numberPart = lastId.substring(1);

            int number = Integer.parseInt(numberPart);
            number++;

            return String.format("L%04d", number);

        } catch (Exception e) {
            // Safety fallback
            return "L0001";
        }
    }

    // ================= SAVE =================
    public void saveLostItem(LostItem lostItem) {

        lostItem.setId(generateNextId());
        lostItem.setStatus(true);   // boolean

        lostItemDao.saveLostItem(lostItem);
    }

    // ================= GET ALL =================
    public List<LostItem> getAllLostItems() {
        return lostItemDao.getAllLostItems();
    }

    // ================= GET BY ID =================
    public LostItem getLostItemById(String id) {
        return lostItemDao.getLostItemById(id);
    }

    // ================= DELETE =================
    public void deleteLostItemById(String id) {
        lostItemDao.deleteLostItemById(id);
    }

    // ================= GET BY USER =================
    public List<LostItem> getLostItemsByUsername(String username) {
        return lostItemDao.getLostItemsByUsername(username);
    }
}