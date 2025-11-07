package com.rydar.location;

import com.rydar.location.dto.LocationUpdate;
import com.rydar.location.dto.UserLocation;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

  private final Map<String, UserLocation> availableDriversLocation = new ConcurrentHashMap<>();

  public void updateDriverLocation(String id, LocationUpdate locationUpdate) {
    long now = System.currentTimeMillis();
    UserLocation driverLocation =
        new UserLocation(locationUpdate.latitude(), locationUpdate.longitude(), now);
    availableDriversLocation.put(id, driverLocation);
  }
}
