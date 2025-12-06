package com.rydar.driver;

import com.rydar.location.LocationService;
import com.rydar.location.dto.DriverLocationUpdate;
import com.rydar.location.dto.NearbyDriversResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
      @RequestParam(defaultValue = "20") @Positive Integer limit) {

    var nearbyDrivers = locationService.findNearbyDrivers(latitude, longitude, radiusMeters, limit);
    return ResponseEntity.ok(new NearbyDriversResponse(nearbyDrivers));
  }
}
