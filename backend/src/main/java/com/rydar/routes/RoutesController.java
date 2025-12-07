package com.rydar.routes;

import com.rydar.routes.dto.AddRouteRequest;
import java.util.Set;
import java.util.UUID;

import com.rydar.routes.dto.UpdateCustomCommentsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/drivers/me/routes")
@RequiredArgsConstructor
public class RoutesController {

  private final RoutesService routesService;

  @GetMapping("/allRoutes")
  public ResponseEntity<Set<String>> getMyRoutes(@AuthenticationPrincipal String userID) {
    return ResponseEntity.ok(routesService.getRoutes(UUID.fromString(userID)));
  }

  @PostMapping("/add")
  public ResponseEntity<Void> addMyRoute(
      @RequestBody AddRouteRequest request, @AuthenticationPrincipal String userId) {

    routesService.addRoute(
        UUID.fromString(userId),
        request.routeName(),
        request.latitude(),
        request.longitude(),
        request.customComments());
    return ResponseEntity.status(201).build(); // 201 Created
  }

  @DeleteMapping("/remove")
  public ResponseEntity<Void> removeMyRoute(
      @RequestBody AddRouteRequest request, @AuthenticationPrincipal String userId) {

    routesService.removeRoute(UUID.fromString(userId), request.routeName());
    return ResponseEntity.status(201).build(); // 204 No Content
  }
    @PutMapping("/CustomCommentsUpdate")
    public ResponseEntity<Void> updateCustomComments(
            @RequestBody UpdateCustomCommentsRequest request,
            @AuthenticationPrincipal String userId) {

        routesService.updateCustomComments(
                UUID.fromString(userId),
                request.routeName(),
                request.customComments());


        return ResponseEntity.noContent().build();
    }
}
