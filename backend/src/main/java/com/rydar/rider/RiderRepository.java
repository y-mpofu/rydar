package com.rydar.rider;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiderRepository extends JpaRepository<Rider, UUID> {
  Optional<Rider> findByUserId(UUID userId);
}
