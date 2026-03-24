package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItem;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItemId;

@Repository
public class MatchItemDaoImpl implements MatchItemDao {

    @Autowired
    private MatchItemRepository repository;

    @Autowired
    private FoundItemRepository foundItemRepository; // ✅

    // ================= SAVE MATCH =================
    @Override
    public void saveMatchItem(MatchItem item) {
        repository.save(item);
    }

    // ================= GET ALL MATCHES =================
    @Override
    public List<MatchItem> getAllMatchItems() {
        return repository.findAll();
    }

    // ================= DELETE MATCH =================
    @Override
    public void deleteMatchItem(String lostItemId, String foundItemId) {
        MatchItemId id = new MatchItemId(lostItemId, foundItemId);
        repository.deleteById(id);
    }

    // ================= FIND PROBABLE MATCHES =================
    // ✅ UPDATED - passes location for proximity ordering
    @Override
    public List<FoundItem> findProbableMatches(String category, String itemName, String location) {
        return foundItemRepository.findByCategoryIgnoreCaseAndItemNameIgnoreCase(
            category, itemName, location
        );
    }
}