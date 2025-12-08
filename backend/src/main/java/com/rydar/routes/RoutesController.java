package com.rydar.routes;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
public class RoutesController {

  private final RoutesService routesService;

  @GetMapping("/{userId}/{routeName}")
  public ResponseEntity<DriverRoute> getDriverRoute(
      @PathVariable String routeName, @PathVariable String userId) {

    DriverRoute route = routesService.getDriverRoute(userId, routeName);
    if (route == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(route);
  }
}
