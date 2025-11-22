package com.rydar.tripRoutes;

import com.rydar.driver.Driver;
import com.rydar.driver.DriverRepository;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

  private static final Logger log = LoggerFactory.getLogger(RoutingService.class);

  private final DriverRepository driverRepo;

  public RoutingService(DriverRepository driverRepository) {
    this.driverRepo = driverRepository;
  }

  public boolean addRoute(UUID driverID, String name) {

    Driver driver = driverRepo.findById(driverID).orElse(null);
    if (driver == null) {
      log.info("Could not find a driver at the given ID, ADD FAILED");
      return false;
    }

    DriverRoute route = new DriverRoute(name);
    driver.getRoutes().add(route);

    driverRepo.save(driver);
    return true;
  }

  public boolean removeRoute(UUID driverID, String name) {

    Driver driver = driverRepo.findById(driverID).orElse(null);
    if (driver == null) {
      log.info("Driver not found for given ID, REMOVE FAILED");
      return false;
    }

    driver.getRoutes().removeIf(route -> route.routeName().equals(name));

    driverRepo.save(driver);

    return true;
  }

  public Set<DriverRoute> getRoutes(UUID driverID) {
    return driverRepo.findById(driverID).map(Driver::getRoutes).orElse(Collections.emptySet());
  }
}
