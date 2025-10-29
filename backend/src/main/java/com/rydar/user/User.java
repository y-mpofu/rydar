package com.rydar.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

  @Id @GeneratedValue private Integer id;
  private String firstname;
  private String lastname;

  @Column(nullable = false, unique = true)
  private String email;

  private String username;
  private String password;

  @Enumerated(EnumType.STRING)
  private Role role;
}
