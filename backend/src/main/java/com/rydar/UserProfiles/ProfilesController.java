package com.rydar.UserProfiles;

import com.rydar.UserProfiles.dto.GetProfileResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user/me/profile")
@RequiredArgsConstructor
public class ProfilesController {
  private final ProfileService profileService;

  @GetMapping("")
  public ResponseEntity<GetProfileResponse> getProfile(@AuthenticationPrincipal String userID) {
    return ResponseEntity.ok(profileService.getProfile(UUID.fromString(userID)));
  }
}
