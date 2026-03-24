package edu.infosys.lostFoundLocatorApplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import edu.infosys.lostFoundLocatorApplication.bean.LostfoundUser;
import edu.infosys.lostFoundLocatorApplication.dao.LostfoundUserRepository;
import java.util.List;

@Service
public class LostfoundUserService implements UserDetailsService {

    @Autowired
    private LostfoundUserRepository repository;

    private String userId;
    private String role;
    private LostfoundUser user;

    // ================= SAVE USER =================
    public void saveUser(LostfoundUser user1) {
        repository.save(user1);
    }

    // ================= FIND USER =================
    public LostfoundUser findByUsername(String username) {
        return repository.findById(username).orElse(null);
    }

    // ================= LOAD USER FOR SPRING SECURITY =================
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        this.user = repository.findById(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username)
                );
        this.userId = user.getUsername();
        this.role = user.getRole();
        return this.user;
    }

    // ================= GETTERS =================
    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public LostfoundUser getUser() {
        return user;
    }

    // ================= DELETE =================
    public void deleteUser(String id) {
        repository.deleteById(id);
    }

    // ================= GET ALL STUDENTS =================
    public List<LostfoundUser> getAllStudents() {
        return repository.findByRole("Student");
    }
}