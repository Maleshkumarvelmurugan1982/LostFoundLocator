package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItem;
import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;

public interface MatchItemDao {

    // ================= SAVE MATCH =================
    void saveMatchItem(MatchItem item);

    // ================= GET ALL MATCHES =================
    List<MatchItem> getAllMatchItems();

    // ================= DELETE MATCH =================
    void deleteMatchItem(String lostItemId, String foundItemId);

    // ================= FIND PROBABLE MATCHES =================
    // ✅ UPDATED - now takes location too
    List<FoundItem> findProbableMatches(String category, String itemName, String location);
}