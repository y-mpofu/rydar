package com.rydar.security;

import com.rydar.user.User;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class RydarUserDetails implements UserDetails {

  private final User user;

  public RydarUserDetails(User user) {
    this.user = user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(user.getRole().name()));
  }

  @Override
  public String getUsername() {
    return user.getEmail(); // We don't want to support usernames yet.
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  public UUID getUserId() {
    return user.getId();
  }
}
