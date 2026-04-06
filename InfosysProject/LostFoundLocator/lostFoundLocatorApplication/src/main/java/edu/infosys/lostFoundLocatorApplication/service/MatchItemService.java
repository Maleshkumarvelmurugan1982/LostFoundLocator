package edu.infosys.lostFoundLocatorApplication.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;
import edu.infosys.lostFoundLocatorApplication.bean.LostItem;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItem;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItemDTO;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItemId;
import edu.infosys.lostFoundLocatorApplication.dao.FoundItemDAO;
import edu.infosys.lostFoundLocatorApplication.dao.LostItemDao;
import edu.infosys.lostFoundLocatorApplication.dao.MatchItemRepository;

@Service
public class MatchItemService {

    @Autowired
    private MatchItemRepository repository;

    @Autowired
    private LostItemDao lostItemDao;

    @Autowired
    private FoundItemDAO foundItemDao;

    // ================= SAVE MATCH (FINAL FIX) =================
    public void saveMatchItem(MatchItemDTO dto) {

        MatchItemId id = new MatchItemId(
                dto.getLostItemId(),
                dto.getFoundItemId()
        );

        if (!repository.existsById(id)) {

            // 🔥 GET IMAGE FROM FOUND ITEM
            FoundItem foundItem = foundItemDao.findById(dto.getFoundItemId());

            if (foundItem != null) {
                dto.setImage(foundItem.getImagePath()); // ✅ FIX
            }

            MatchItem item = new MatchItem();
            item.setMatchItemId(id);
            item.setItemName(dto.getItemName());
            item.setCategory(dto.getCategory());
            item.setLostUsername(dto.getLostUsername());
            item.setFoundUsername(dto.getFoundUsername());
            item.setImage(dto.getImage());

            repository.save(item); // ✅ SAVES TO DB

            updateLostFoundItems(dto); // ✅ UPDATE STATUS
        }
    }

    // ================= UPDATE STATUS =================
    public void updateLostFoundItems(MatchItemDTO dto) {

        LostItem lostItem = lostItemDao.getLostItemById(dto.getLostItemId());
        FoundItem foundItem = foundItemDao.findById(dto.getFoundItemId());

        if (lostItem != null && foundItem != null) {

            lostItem.setStatus(false);  // ✅ recovered
            foundItem.setStatus(false);

            lostItemDao.saveLostItem(lostItem);
            foundItemDao.update(foundItem);
        }
    }

    // ================= GET ALL =================
    public List<MatchItemDTO> getAllMatches() {

        List<MatchItem> items = repository.findAll();
        List<MatchItemDTO> result = new ArrayList<>();

        for (MatchItem item : items) {
            result.add(new MatchItemDTO(item));
        }

        return result;
    }

    // ================= GET BY ID =================
    public Optional<MatchItemDTO> getMatch(String lostId, String foundId) {

        MatchItemId id = new MatchItemId(lostId, foundId);

        Optional<MatchItem> itemOpt = repository.findById(id);

        if (itemOpt.isPresent()) {
            return Optional.of(new MatchItemDTO(itemOpt.get()));
        }

        return Optional.empty();
    }

    // ================= DELETE =================
    public void deleteMatch(String lostId, String foundId) {

        MatchItemId id = new MatchItemId(lostId, foundId);

        if (repository.existsById(id)) {
            repository.deleteById(id);
        }
    }
}