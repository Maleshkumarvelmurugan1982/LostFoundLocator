package edu.infosys.lostFoundLocatorApplication.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.infosys.lostFoundLocatorApplication.bean.LostfoundUser;
import java.util.List;

public interface LostfoundUserRepository extends JpaRepository<LostfoundUser, String> {
    List<LostfoundUser> findByRole(String role);
}