package com.rydar.auth;

import com.rydar.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService authService;

  @PostMapping("/register/rider")
  public ResponseEntity<AuthenticationResponse> registerRider(
      @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authService.registerRider(request));
  }

  @PostMapping("/register/driver")
  public ResponseEntity<AuthenticationResponse> registerDriver(
      @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(authService.registerDriver(request));
  }

  @PostMapping("/login/driver")
  public ResponseEntity<AuthenticationResponse> authenticateDriver(
      @RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authService.authenticateUser(request, Role.DRIVER));
  }

  @PostMapping("/login/rider")
  public ResponseEntity<AuthenticationResponse> authenticateRider(
      @RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authService.authenticateUser(request, Role.RIDER));
  }
}
