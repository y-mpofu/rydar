package com.rydar.location;

import com.rydar.location.dto.BoundingBox;
import com.rydar.location.dto.DriverLocation;
import com.rydar.location.dto.DriverLocationUpdate;
import com.rydar.location.dto.NearbyDriver;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

  private static final long DRIVER_LOCATION_TTL_MS = 600_000L;
  private static final double METERS_PER_DEGREE_LAT = 111_320.0;

  private final Map<String, DriverLocation> availableDriversLocation = new ConcurrentHashMap<>();

  public void updateDriverLocation(String id, DriverLocationUpdate driverLocationUpdate) {
    long now = System.currentTimeMillis();
    DriverLocation driverLocation =
        new DriverLocation(
            driverLocationUpdate.latitude(),
            driverLocationUpdate.longitude(),
            now,
            driverLocationUpdate.currRouteName(),
            driverLocationUpdate.customComments());
    availableDriversLocation.put(id, driverLocation);
  }

  public List<NearbyDriver> findNearbyDrivers(
      double latitude, double longitude, int radiusMeters, int limit) {

    final long now = System.currentTimeMillis();
    cleanupStaleLocations(now);
    BoundingBox riderBounds = getLocationBounds(latitude, longitude, radiusMeters);

    return availableDriversLocation.entrySet().stream()
        .filter(
            e ->
                isLocationWithinBounds(
                    e.getValue().latitude(), e.getValue().longitude(), riderBounds))
        .limit(limit)
        .map(
            e ->
                new NearbyDriver(
                    e.getKey(),
                    e.getValue().latitude(),
                    e.getValue().longitude(),
                    e.getValue().currRouteName(),
                    e.getValue().customComments()))
        .toList();
  }

  public List<NearbyDriver> filterDriversByDestinationName(
      List<NearbyDriver> drivers, String destinationName) {

    if (destinationName == null || destinationName.isBlank()) {
      return drivers; // nothing to filter by
    }

    String normalized = destinationName.trim().toLowerCase();

    return drivers.stream()
        .filter(
            d -> {
              if (d.currRouteName() == null) return false;
              return d.currRouteName().trim().toLowerCase().equals(normalized);
            })
        .toList();
  }

  private void cleanupStaleLocations(long now) {
    availableDriversLocation
        .entrySet()
        .removeIf(e -> now - e.getValue().updatedAtTimestamp() > DRIVER_LOCATION_TTL_MS);
  }

  private static boolean isLocationWithinBounds(
      double latitude, double longitude, BoundingBox boundingBox) {

    return inRange(latitude, boundingBox.minLat(), boundingBox.maxLat())
        && inRange(longitude, boundingBox.minLng(), boundingBox.maxLng());
  }

  private static BoundingBox getLocationBounds(
      double latitude, double longitude, int radiusMeters) {
    double latDelta = radiusMeters / METERS_PER_DEGREE_LAT;

    double cosLat = Math.cos(Math.toRadians(latitude));
    double lngDelta;
    if (Math.abs(cosLat) < 1e-6) {
      // Near the poles: destinationLong spacing collapses, treat as full destinationLong span.
      lngDelta = 180.0;
    } else {
      lngDelta = radiusMeters / (METERS_PER_DEGREE_LAT * cosLat);
    }

    double minLat = clamp(latitude - latDelta, -90.0, 90.0);
    double maxLat = clamp(latitude + latDelta, -90.0, 90.0);
    double minLng = clamp(longitude - lngDelta, -180.0, 180.0);
    double maxLng = clamp(longitude + lngDelta, -180.0, 180.0);

    return new BoundingBox(minLat, maxLat, minLng, maxLng);
  }

  private static double clamp(double value, double min, double max) {
    return Math.max(min, Math.min(max, value));
  }

  private static boolean inRange(double value, double min, double max) {
    return value >= min && value <= max;
  }
}
