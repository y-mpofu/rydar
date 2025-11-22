package com.rydar.driver;

import com.rydar.location.LocationService;
import com.rydar.location.dto.LocationUpdate;
import com.rydar.location.dto.NearbyDriversResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriversController {

  private final LocationService locationService;

  @PostMapping("/me/location")
  public ResponseEntity<Void> updateLocation(
      @RequestBody LocationUpdate locationUpdate, @AuthenticationPrincipal String userId) {
    locationService.updateDriverLocation(userId, locationUpdate);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/nearby")
  public ResponseEntity<NearbyDriversResponse> getNearbyDrivers(
      //            @RequestParam DriverRoute ,
      @RequestParam Double latitude,
      @RequestParam Double longitude,
      @RequestParam Integer radiusMeters,
      @RequestParam(defaultValue = "20") Integer limit) {

    var nearbyDrivers = locationService.findNearbyDrivers(latitude, longitude, radiusMeters, limit);
    return ResponseEntity.ok(new NearbyDriversResponse(nearbyDrivers));
  }
}
