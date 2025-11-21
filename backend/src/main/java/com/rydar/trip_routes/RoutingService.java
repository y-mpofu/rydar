package com.rydar.trip_routes;

import com.rydar.driver.Driver;
import com.rydar.driver.DriverRepository;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class RoutingService {

  private final DriverRepository driverRepo;

  public RoutingService(DriverRepository driverRepository) {
    this.driverRepo = driverRepository;
  }

  public boolean addRoute(UUID driverID, String name, String end) {

    Driver driver = driverRepo.findById(driverID).orElse(null);
    if (driver == null) return false;

    DriverRoute route = new DriverRoute(name, end);
    driver.getRoutes().add(route);

    driverRepo.save(driver);
    return true;
  }

  public boolean removeRoute(UUID driverID, String name) {

    Driver driver = driverRepo.findById(driverID).orElse(null);
    if (driver == null) return false;

    boolean removed = driver.getRoutes().removeIf(route -> route.routeName().equals(name));

    driverRepo.save(driver);
    return removed;
  }

  public Set<DriverRoute> getRoutes(UUID driverID) {
    return driverRepo.findById(driverID).map(Driver::getRoutes).orElse(Collections.emptySet());
  }
}
