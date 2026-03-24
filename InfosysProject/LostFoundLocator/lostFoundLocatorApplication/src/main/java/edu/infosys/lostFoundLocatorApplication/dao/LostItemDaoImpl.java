package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import edu.infosys.lostFoundLocatorApplication.bean.LostItem;

@Repository
public class LostItemDaoImpl implements LostItemDao {

    @Autowired
    private LostItemRepository repository;

    @Override
    public void saveLostItem(LostItem lostItem) {
        repository.save(lostItem);
    }

    @Override
    public List<LostItem> getAllLostItems() {
        return repository.findAll();
    }

    // 🔥 ID changed to String
    @Override
    public LostItem getLostItemById(String lostItemId) {
        return repository.findById(lostItemId).orElse(null);
    }

    @Override
    public void deleteLostItemById(String lostItemId) {
        repository.deleteById(lostItemId);
    }

    // 🔥 Return String (L0001)
    @Override
    public String getLastId() {
        return repository.getLastId();
    }

    @Override
    public List<LostItem> getLostItemsByUsername(String username) {
        return repository.getLostItemsByUsername(username);
    }
}