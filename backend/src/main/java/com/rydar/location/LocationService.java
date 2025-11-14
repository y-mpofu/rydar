package com.rydar.location;

import com.rydar.location.dto.BoundingBox;
import com.rydar.location.dto.LocationUpdate;
import com.rydar.location.dto.NearbyDriver;
import com.rydar.location.dto.UserLocation;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

  private final Map<String, UserLocation> availableDriversLocation = new ConcurrentHashMap<>();

  private static final long TTL_MS = 60_000;

  public void updateDriverLocation(String id, LocationUpdate locationUpdate) {
    long now = System.currentTimeMillis();
    UserLocation driverLocation =
        new UserLocation(locationUpdate.latitude(), locationUpdate.longitude(), now);
    availableDriversLocation.put(id, driverLocation);
  }

  public List<NearbyDriver> findNearbyDrivers(
      Double latitude, Double longitude, Integer radiusMeters, Integer limit) {

    final long now = System.currentTimeMillis();
    BoundingBox riderBounds = getLocationBounds(latitude, longitude, radiusMeters);

    return availableDriversLocation.entrySet().stream()
        .filter(e -> now - e.getValue().updatedAtTimestamp() <= TTL_MS)
        .filter(
            e ->
                isLocationWithinBounds(
                    e.getValue().latitude(), e.getValue().longitude(), riderBounds))
        .map(e -> new NearbyDriver(e.getKey(), e.getValue().latitude(), e.getValue().longitude()))
        .limit(limit)
        .toList();
  }

  private static Boolean isLocationWithinBounds(
      Double latitude, Double longitude, BoundingBox boundingBox) {

    return inRange(latitude, boundingBox.minLat(), boundingBox.maxLat())
        && inRange(longitude, boundingBox.minLng(), boundingBox.maxLng());
  }

  private static BoundingBox getLocationBounds(
      Double latitude, Double longitude, Integer radiusMeters) {
    double latDelta = radiusMeters / 111_320.0;
    double lngDelta = radiusMeters / (111_320.0 * Math.cos(Math.toRadians(latitude)));
    double minLat = latitude - latDelta;
    double maxLat = latitude + latDelta;
    double minLng = longitude - lngDelta;
    double maxLng = longitude + lngDelta;

    return new BoundingBox(minLat, maxLat, minLng, maxLng);
  }

  private static boolean inRange(double value, double min, double max) {
    return value >= min && value <= max;
  }
}
