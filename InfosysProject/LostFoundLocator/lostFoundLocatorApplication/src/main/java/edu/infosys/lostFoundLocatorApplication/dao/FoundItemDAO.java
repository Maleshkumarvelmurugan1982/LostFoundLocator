package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;
import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;

public interface FoundItemDAO {

    void save(FoundItem item);

    void update(FoundItem item);

    void delete(String id);

    FoundItem findById(String id);

    List<FoundItem> findAll();

    String getLastFoundItemId();   // 🔥 NEW
}