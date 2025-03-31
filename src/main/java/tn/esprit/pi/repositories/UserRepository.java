package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pi.entities.User;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    List<User> findByBannedTrue();

}