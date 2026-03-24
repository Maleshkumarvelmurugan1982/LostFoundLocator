package edu.infosys.lostFoundLocatorApplication.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;
import edu.infosys.lostFoundLocatorApplication.bean.FoundItemDTO;
import edu.infosys.lostFoundLocatorApplication.dao.FoundItemRepository;

@Service
public class FoundItemService {

    @Autowired
    private FoundItemRepository dao;

    // ================= GENERATE ID =================
    private String generateNextId() {

        String lastId = dao.getLastId();

        if (lastId == null || lastId.isEmpty()) {
            return "F0001";
        }

        int number = Integer.parseInt(lastId.substring(1));
        number++;

        return String.format("F%04d", number);
    }

    // ================= SAVE FOUND ITEM =================
    public void saveFoundItem(FoundItem item) {

        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId(generateNextId());
            item.setStatus(true); // FOUND
        }

        dao.save(item);
    }

    // ================= GET ALL FOUND ITEMS =================
    public List<FoundItem> getAllFoundItems() {
        return dao.findAll();
    }

    // ================= GET FOUND ITEM BY ID =================
    public Optional<FoundItem> getById(String id) {
        return dao.findById(id);
    }

    // ================= DELETE FOUND ITEM =================
    public void deleteFoundItemById(String id) {
        dao.deleteById(id);
    }

    // ================= CLAIM ITEM =================
    public boolean claimItem(String id) {

        Optional<FoundItem> itemOpt = dao.findById(id);

        if (itemOpt.isPresent()) {
            FoundItem item = itemOpt.get();
            item.setStatus(false); // CLAIMED
            dao.save(item);
            return true;
        }

        return false;
    }

    // ================= SMART SEARCH =================
    private List<FoundItemDTO> smartSearch(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return new ArrayList<>();
        }

        List<FoundItem> keywordResults = dao.searchByKeyword(keyword);
        List<FoundItem> soundexResults = dao.fuzzySearchBySoundex(keyword);

        Map<String, FoundItemDTO> merged = new LinkedHashMap<>();

        if (keywordResults != null) {
            keywordResults.forEach(f ->
                    merged.put(f.getId(), new FoundItemDTO(f))
            );
        }

        if (soundexResults != null) {
            soundexResults.forEach(f ->
                    merged.put(f.getId(), new FoundItemDTO(f))
            );
        }

        return new ArrayList<>(merged.values());
    }

    // ================= COLLECT MATCHED FOUND ITEMS =================
    public List<FoundItemDTO> collectFoundItems(String itemName, String category, String brand) {

        TreeSet<FoundItemDTO> itemSet = new TreeSet<>();

        if (itemName != null && !itemName.isEmpty()) {
            itemSet.addAll(smartSearch(itemName));
        }

        if (category != null && !category.isEmpty()) {
            itemSet.addAll(smartSearch(category));
        }

        if (brand != null && !brand.isEmpty()) {
            itemSet.addAll(smartSearch(brand));
        }

        return new ArrayList<>(itemSet);
    }
}