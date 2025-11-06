package com.rydar.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    final String jwt;
    final String userEmail;
    final String authHeader;

    // If this request is already authenticated, skip
    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      filterChain.doFilter(request, response);
      return;
    }

    authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    jwt = authHeader.substring(7);
    final Claims claims;

    try {
      claims = jwtService.extractAllClaims(jwt);

    } catch (Exception e) {
      // If the token was invalid, or expired, skip authentication
      filterChain.doFilter(request, response);
      return;
    }

    userEmail = claims.getSubject();
    @SuppressWarnings("unchecked")
    List<String> roles = claims.get("roles", List.class);
    List<SimpleGrantedAuthority> authorities =
        roles.stream().map(SimpleGrantedAuthority::new).toList();

    UsernamePasswordAuthenticationToken auth =
        new UsernamePasswordAuthenticationToken(userEmail, null, authorities);

    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

    SecurityContextHolder.getContext().setAuthentication(auth);

    filterChain.doFilter(request, response);
  }
}
