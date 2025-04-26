package tn.esprit.pi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.pi.entities.User;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    List<User> findByBannedTrue();
    User findByResetToken(String resetToken);


    @Query(value = "SELECT * FROM user WHERE face_descriptor IS NOT NULL",
            nativeQuery = true)
    List<User> findAllUsersWithDescriptors();
}
