package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}