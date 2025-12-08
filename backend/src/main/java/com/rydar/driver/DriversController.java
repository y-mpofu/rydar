package com.rydar.driver;

import com.rydar.location.LocationService;
import com.rydar.location.dto.DriverLocationUpdate;
import com.rydar.location.dto.NearbyDriversResponse;
import com.rydar.routes.DriverRoute;
import com.rydar.routes.RoutesService;
import com.rydar.routes.dto.AddRouteRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
@Validated
public class DriversController {

  private final LocationService locationService;
  private final RoutesService routesService;

  @PostMapping("/me/location")
  public ResponseEntity<Void> updateLocation(
      @Valid @RequestBody DriverLocationUpdate driverLocationUpdate,
      @AuthenticationPrincipal String userId) {
    locationService.updateDriverLocation(userId, driverLocationUpdate);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/nearby")
  public ResponseEntity<NearbyDriversResponse> getNearbyDrivers(
      @RequestParam @NotNull @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
          Double latitude,
      @RequestParam @NotNull @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
          Double longitude,
      @RequestParam @NotNull @Positive Integer radiusMeters,
      @RequestParam(defaultValue = "20") @Positive Integer limit,
      @RequestParam(required = false) String destinationName) {

    var nearby = locationService.findNearbyDrivers(latitude, longitude, radiusMeters, limit);
    var filtered = locationService.filterDriversByDestinationName(nearby, destinationName);
    return ResponseEntity.ok(new NearbyDriversResponse(filtered));
  }

  @GetMapping("/me/routes")
  public ResponseEntity<Set<String>> getMyRoutes(@AuthenticationPrincipal String userID) {
    return ResponseEntity.ok(routesService.getRoutes(UUID.fromString(userID)));
  }

  @PostMapping("/me/routes")
  public ResponseEntity<Void> addMyRoute(
      @RequestBody AddRouteRequest request, @AuthenticationPrincipal String userId) {

    routesService.addRoute(
        UUID.fromString(userId),
        request.routeName(),
        request.destinationLat(),
        request.destinationLong(),
        request.customComments());
    return ResponseEntity.status(201).build(); // 201 Created
  }

  @DeleteMapping("/me/routes/{routeName}")
  public ResponseEntity<Void> removeMyRoute(
      @PathVariable String routeName, @AuthenticationPrincipal String userId) {

    routesService.removeRoute(UUID.fromString(userId), routeName);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/me/routes/{routeName}")
  public ResponseEntity<DriverRoute> updateRoute(
      @PathVariable("routeName") String currRouteName,
      @RequestBody AddRouteRequest request,
      @AuthenticationPrincipal String userId) {
    DriverRoute newRoute = routesService.updateDriverRoute(userId, currRouteName, request);
    return ResponseEntity.ok(newRoute);
  }
}
