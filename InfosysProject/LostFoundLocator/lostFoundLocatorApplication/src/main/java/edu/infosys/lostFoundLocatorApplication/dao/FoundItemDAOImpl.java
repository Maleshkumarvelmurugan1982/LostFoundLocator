package edu.infosys.lostFoundLocatorApplication.dao;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Repository;

import edu.infosys.lostFoundLocatorApplication.bean.FoundItem;

@Repository
@Transactional
public class FoundItemDAOImpl implements FoundItemDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(FoundItem item) {

        // 🔥 Generate ID before saving
        String lastId = getLastFoundItemId();

        if (lastId == null) {
            item.setId("F0001");
        } else {
            int number = Integer.parseInt(lastId.substring(1));
            number++;
            item.setId(String.format("F%04d", number));
        }

        entityManager.persist(item);
    }

    @Override
    public void update(FoundItem item) {
        entityManager.merge(item);
    }

    @Override
    public void delete(String id) {
        FoundItem item = entityManager.find(FoundItem.class, id);
        if (item != null) {
            entityManager.remove(item);
        }
    }

    @Override
    public FoundItem findById(String id) {
        return entityManager.find(FoundItem.class, id);
    }

    @Override
    public List<FoundItem> findAll() {
        return entityManager
                .createQuery("FROM FoundItem", FoundItem.class)
                .getResultList();
    }

    @Override
    public String getLastFoundItemId() {

        List<String> ids = entityManager
                .createQuery("SELECT f.id FROM FoundItem f ORDER BY f.id DESC", String.class)
                .setMaxResults(1)
                .getResultList();

        if (ids.isEmpty()) {
            return null;
        }

        return ids.get(0);
    }
}