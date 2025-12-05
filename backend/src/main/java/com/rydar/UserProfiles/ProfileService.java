package com.rydar.UserProfiles;

import com.rydar.UserProfiles.dto.GetProfileResponse;
import com.rydar.user.User;
import com.rydar.user.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
  @Autowired private final UserRepository userRepo;

  public GetProfileResponse getProfile(UUID userID) {

    User user = userRepo.findById(userID).orElse(null);
    if (user == null) {
      log.error("User not found");
      return null;
    }
    String email = user.getEmail();
    String lastname = user.getLastname();
    String firstname = user.getFirstname();

    return new GetProfileResponse(firstname, lastname, email);
  }
}
