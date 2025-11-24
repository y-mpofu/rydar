package com.rydar.tripRoutes;

import com.rydar.tripRoutes.dto.AddRouteRequest;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers/me/routes")
@RequiredArgsConstructor
public class RoutesController {

  private final RoutingService routingService;

  @GetMapping("/allRoutes")
  public ResponseEntity<Set<DriverRoute>> getMyRoutes(@AuthenticationPrincipal String userID) {
    return ResponseEntity.ok(routingService.getRoutes(UUID.fromString(userID)));
  }

  @PostMapping("/add")
  public ResponseEntity<Void> addMyRoute(
      @RequestBody AddRouteRequest request, @AuthenticationPrincipal String userId) {

    routingService.addRoute(UUID.fromString(userId), request.routeName());
      return ResponseEntity.status(201).build(); // 201 Created
  }

  @DeleteMapping("/remove")
  public ResponseEntity<Void> removeMyRoute(
      @RequestBody AddRouteRequest request, @AuthenticationPrincipal String userId) {

    routingService.removeRoute(UUID.fromString(userId), request.routeName());
    return ResponseEntity.status(201).build(); // 204 No Content
  }
}
