package com.rydar.routes;

import com.rydar.driver.Driver;
import com.rydar.driver.DriverRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RoutesService {

  private final DriverRepository driverRepo;

  public RoutesService(DriverRepository driverRepository) {
    this.driverRepo = driverRepository;
  }

  public void addRoute(
      UUID userId, String name, Double latitude, Double longitude, String customComments) {
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException("Route name cannot be empty");
    }
    Driver driver =
        driverRepo
            .findByUserId(userId)
            .orElseThrow(
                () -> new EntityNotFoundException("Driver with ID " + userId + " not found"));
    DriverRoute route = new DriverRoute(name, latitude, longitude, customComments);
    driver.getRoutes().add(route);
    driverRepo.save(driver);
  }

  public void removeRoute(UUID userId, String name) {

    Driver driver =
        driverRepo
            .findByUserId(userId)
            .orElseThrow(
                () -> new EntityNotFoundException("Driver with userID " + userId + " not found"));

    boolean removed = driver.getRoutes().removeIf(route -> route.getRouteName().equals(name));
    if (!removed) {
      throw new IllegalStateException("Route '" + name + "' was not found for driver " + userId);
    }
    driverRepo.save(driver);
  }

  /***Returns the list of route names from the routes data of the given driver,
   * NOTE: does not include other variables in the routes column */
  public Set<String> getRoutes(UUID userId) {
    return driverRepo
        .findByUserId(userId)
        .map(
            driver ->
                driver.getRoutes().stream()
                    .map(DriverRoute::getRouteName) // <–– pick only the name
                    .collect(Collectors.toSet()))
        .orElse(Collections.emptySet());
  }
    /**
     * Updates the custom comments for a specific route belonging to a driver.
     *
     */
    public void updateCustomComments(UUID userId, String routeName, String customComments) {
        // Step 1: Validate that custom comments are not empty
        if (customComments == null || customComments.isBlank()) {
            throw new IllegalArgumentException("Custom comments cannot be empty");
        }
        Driver driver =
                driverRepo
                        .findByUserId(userId)
                        .orElseThrow(
                                () -> new EntityNotFoundException("Driver with userID " + userId + " not found"));
        // Step 3: Search through the driver's routes to find the matching route
        DriverRoute routeToUpdate =
                driver.getRoutes().stream()
                        .filter(route -> route.getRouteName().equals(routeName))
                        .findFirst()
                        .orElseThrow(
                                () ->
                                        new IllegalStateException(
                                                "Route '" + routeName + "' was not found for driver " + userId));

        // Step 4: Update the custom comments field
        routeToUpdate.setCustomComments(customComments);

        // Step 5: Save the updated driver back to the database
        driverRepo.save(driver);
    }
}
