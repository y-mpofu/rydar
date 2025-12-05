package com.rydar.user.UserProfiles;

import com.rydar.user.UserAccount;
import com.rydar.user.UserAccountRepository;
import com.rydar.user.UserProfiles.dto.GetProfileResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
  @Autowired private final UserAccountRepository userRepo;

  public GetProfileResponse getProfile(UUID userID) {

    UserAccount user = userRepo.findById(userID).orElse(null);
    if (user == null) {
      log.error("User not found");
      return null;
    }
    String email = user.getEmail();
    String lastname = user.getLastname();
    String firstname = user.getFirstname();
    String username = user.getUsername();

    return new GetProfileResponse(username, firstname, lastname, email);
  }
}
