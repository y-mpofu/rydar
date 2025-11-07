package com.rydar.auth;

import com.rydar.security.JwtService;
import com.rydar.security.RydarUserDetails;
import com.rydar.user.Role;
import com.rydar.user.User;
import com.rydar.user.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request, Role role) {
    var user =
        User.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(role)
            .build();
    userRepository.save(user);
    RydarUserDetails userDetails = new RydarUserDetails(user);
    return AuthenticationResponse.builder().token(createJwt(userDetails)).build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    Authentication auth =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    RydarUserDetails userDetails = (RydarUserDetails) auth.getPrincipal();
    return AuthenticationResponse.builder().token(createJwt(userDetails)).build();
  }

  private String createJwt(RydarUserDetails userDetails) {
    List<String> roles =
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put("roles", roles);
    return jwtService.generateToken(extraClaims, userDetails.getUser());
  }
}
