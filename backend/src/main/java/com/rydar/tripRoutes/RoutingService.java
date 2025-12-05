package com.rydar.tripRoutes;

import com.rydar.driver.Driver;
import com.rydar.driver.DriverRepository;
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

  public void addRoute(UUID driverID, String name) {

    Driver driver = driverRepo.findByUserId(driverID).orElse(null);
    if (driver == null) {
      log.info("Could not find a driver at the given ID, ADD FAILED");
    }

    DriverRoute route = new DriverRoute(name);
    driver.getRoutes().add(route);

    driverRepo.save(driver);
  }

  public void removeRoute(UUID driverID, String name) {

    Driver driver = driverRepo.findByUserId(driverID).orElse(null);
    if (driver == null) {
      log.info("Driver not found for given ID, REMOVE FAILED");
    }

    driver.getRoutes().removeIf(route -> route.routeName().equals(name));

    driverRepo.save(driver);
  }

  public Set<DriverRoute> getRoutes(UUID driverID) {
    return driverRepo.findByUserId(driverID).map(Driver::getRoutes).orElse(Collections.emptySet());
  }
}
