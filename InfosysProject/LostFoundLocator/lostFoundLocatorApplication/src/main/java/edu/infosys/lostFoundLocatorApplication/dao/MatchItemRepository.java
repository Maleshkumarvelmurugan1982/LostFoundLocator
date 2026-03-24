package edu.infosys.lostFoundLocatorApplication.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.infosys.lostFoundLocatorApplication.bean.MatchItem;
import edu.infosys.lostFoundLocatorApplication.bean.MatchItemId;

@Repository
public interface MatchItemRepository extends JpaRepository<MatchItem, MatchItemId> {

}