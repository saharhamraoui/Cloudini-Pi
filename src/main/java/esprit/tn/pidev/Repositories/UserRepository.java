package esprit.tn.pidev.Repositories;

import esprit.tn.pidev.entities.Role;
import esprit.tn.pidev.entities.User;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Arrays findByRole(Role role, Limit limit);
}