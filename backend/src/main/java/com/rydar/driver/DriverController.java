package com.rydar.driver;

import com.rydar.location.LocationService;
import com.rydar.location.dto.LocationUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/driver")
@RequiredArgsConstructor
public class DriverController {

  private final LocationService locationService;

  @PostMapping("/location")
  public ResponseEntity<Void> updateLocation(
      @RequestBody LocationUpdate locationUpdate, @AuthenticationPrincipal String userId) {
    locationService.updateDriverLocation(userId, locationUpdate);
    return ResponseEntity.noContent().build();
  }
}
