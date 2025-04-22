package tn.esprit.pi.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.User;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
