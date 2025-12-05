package com.rydar.security;

import com.rydar.user.Role;
import com.rydar.user.UserAccount;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class RydarUserDetails implements UserDetails {

  private final UserAccount userAccount;

  public RydarUserDetails(UserAccount userAccount) {
    this.userAccount = userAccount;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return userAccount.getRoles().stream()
        .map(role -> new SimpleGrantedAuthority(role.name()))
        .toList();
  }

  @Override
  public String getUsername() {
    return userAccount.getEmail(); // We don't want to support usernames yet.
  }

  @Override
  public String getPassword() {
    return userAccount.getPassword();
  }

  public Set<Role> getRoles() {
    return userAccount.getRoles();
  }

  public UUID getUserId() {
    return userAccount.getId();
  }
}
