package com.rydar.auth;

import com.rydar.driver.Driver;
import com.rydar.driver.DriverRepository;
import com.rydar.rider.Rider;
import com.rydar.rider.RiderRepository;
import com.rydar.security.JwtService;
import com.rydar.security.RydarUserDetails;
import com.rydar.user.Role;
import com.rydar.user.UserAccount;
import com.rydar.user.UserAccountRepository;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

  private final UserAccountRepository userAccountRepository;
  private final DriverRepository driverRepository;
  private final RiderRepository riderRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse registerDriver(RegisterRequest request) {
    UserAccount userAccount = getOrCreateUser(request);
    addRole(userAccount, Role.DRIVER);
    Driver driver = Driver.builder().user(userAccount).build();
    driverRepository.save(driver);
    RydarUserDetails userDetails = new RydarUserDetails(userAccount);
    return AuthenticationResponse.builder().token(createJwt(userDetails)).build();
  }

  public AuthenticationResponse registerRider(RegisterRequest request) {
    UserAccount userAccount = getOrCreateUser(request);
    addRole(userAccount, Role.RIDER);
    Rider rider = Rider.builder().user(userAccount).build();
    riderRepository.save(rider);
    RydarUserDetails userDetails = new RydarUserDetails(userAccount);
    return AuthenticationResponse.builder().token(createJwt(userDetails)).build();
  }

  public AuthenticationResponse authenticateUser(AuthenticationRequest request, Role role) {
    Authentication auth =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    RydarUserDetails userDetails = (RydarUserDetails) auth.getPrincipal();
    if (!userDetails.getRoles().contains(role)) {
      throw new RuntimeException("User is not registered with the role " + role);
    }
    return AuthenticationResponse.builder().token(createJwt(userDetails)).build();
  }

  private void addRole(UserAccount userAccount, Role role) {
    if (userAccount.getRoles().contains(role)) {
      throw new IllegalStateException("User is already registered as a " + role.name());
    }
    userAccount.getRoles().add(role);
    userAccountRepository.save(userAccount);
  }

  private UserAccount getOrCreateUser(RegisterRequest request) {
    UserAccount userAccount = userAccountRepository.findByEmail(request.getEmail()).orElse(null);
    if (userAccount == null) {
      userAccount =
          UserAccount.builder()
              .firstname(request.getFirstname())
              .lastname(request.getLastname())
              .email(request.getEmail())
              .password(passwordEncoder.encode(request.getPassword()))
              .build();
      userAccountRepository.save(userAccount);
    }
    return userAccount;
  }

  private String createJwt(RydarUserDetails userDetails) {
    List<String> roles =
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put("roles", roles);
    return jwtService.generateToken(extraClaims, userDetails.getUserAccount());
  }
}
