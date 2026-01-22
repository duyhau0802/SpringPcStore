package com.ecom.SpringPcStore.entity;

import com.ecom.SpringPcStore.entity.id.UserRoleId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@IdClass(UserRoleId.class)
public class UserRole {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @EqualsAndHashCode.Include
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    @EqualsAndHashCode.Include
    private Role role;
}
