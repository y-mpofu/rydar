package com.rydar.auth;

import com.rydar.security.JwtService;
import com.rydar.security.RydarUserDetails;
import com.rydar.user.Role;
import com.rydar.user.User;
import com.rydar.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
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
    var userDetails = new RydarUserDetails(user);
    var jwtToken = jwtService.generateToken(userDetails);
    return AuthenticationResponse.builder().token(jwtToken).build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    Authentication auth =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    UserDetails userDetails = (UserDetails) auth.getPrincipal();
    var jwtToken = jwtService.generateToken(userDetails);
    return AuthenticationResponse.builder().token(jwtToken).build();
  }
}
