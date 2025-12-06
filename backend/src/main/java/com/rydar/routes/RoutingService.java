package com.rydar.routes;

import com.rydar.driver.Driver;
import com.rydar.driver.DriverRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RoutingService {

  private final DriverRepository driverRepo;

  public RoutingService(DriverRepository driverRepository) {
    this.driverRepo = driverRepository;
  }

  public void addRoute(UUID userId, String name) {
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException("Route name cannot be empty");
    }
    Driver driver =
        driverRepo
            .findByUserId(userId)
            .orElseThrow(
                () -> new EntityNotFoundException("Driver with ID " + userId + " not found"));
    DriverRoute route = new DriverRoute(name);
    driver.getRoutes().add(route);
    driverRepo.save(driver);
  }

  public void removeRoute(UUID userId, String name) {

    Driver driver =
        driverRepo
            .findByUserId(userId)
            .orElseThrow(
                () -> new EntityNotFoundException("Driver with userID " + userId + " not found"));

    boolean removed = driver.getRoutes().removeIf(route -> route.routeName().equals(name));
    if (!removed) {
      throw new IllegalStateException("Route '" + name + "' was not found for driver " + userId);
    }
    driverRepo.save(driver);
  }

  public Set<DriverRoute> getRoutes(UUID userId) {
    return driverRepo.findByUserId(userId).map(Driver::getRoutes).orElse(Collections.emptySet());
  }
}
