package com.ecom.SpringPcStore.repository;

import com.ecom.SpringPcStore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userRoles WHERE u.username = :username")
    Optional<User> findByUsernameWithRoles(String username);
}
