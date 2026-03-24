package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.infosys.lostFoundLocatorApplication.bean.LostItem;

@Repository
public interface LostItemRepository 
        extends JpaRepository<LostItem, String> {

    @Query("SELECT MAX(l.id) FROM LostItem l")
    String getLastId();

    @Query("SELECT l FROM LostItem l WHERE l.postedBy = ?1")
    List<LostItem> getLostItemsByUsername(String username);
}