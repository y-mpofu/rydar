package com.rydar.rider;

import com.rydar.user.UserAccount;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "riders")
public class Rider {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

  @OneToOne
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private UserAccount user;

}
