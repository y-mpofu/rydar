package com.rydar.security;

import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

class JwtServiceTest {

  private JwtService jwtService;
  private UserDetails user;
  private static final String TEST_SECRET_BASE64 = "9ghWh0nbGIySJtBm+PTWphm8ZqRRdTTj/qJhQATRDkQ=";

  @BeforeEach
  void setUp() {
    jwtService = new JwtService();
    user = User.withUsername("john@example.com").password("x").authorities("RIDER").build();
  }

  @Test
  void shouldGenerateValidTokenForUser() {
    String token = jwtService.generateToken(user);

    assertNotNull(token);
    assertFalse(token.isEmpty());
    assertEquals("john@example.com", jwtService.extractAllClaims(token).getSubject());
  }

  @Test
  void shouldThrowForExpiredToken() throws InterruptedException {
    String shortLived = buildToken(user.getUsername(), 1000);
    assertEquals("john@example.com", jwtService.extractAllClaims(shortLived).getSubject());
    Thread.sleep(1500);
    assertThrows(ExpiredJwtException.class, () -> jwtService.extractAllClaims(shortLived));
  }

  @Test
  void shouldThrowForInvalidToken() {
    String invalidToken = "not.a.valid.token";
    assertThrows(MalformedJwtException.class, () -> jwtService.extractAllClaims(invalidToken));
  }

  private static String buildToken(String subject, long ttlMillis) {
    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + ttlMillis))
        .signWith(
            Keys.hmacShaKeyFor(Decoders.BASE64.decode(TEST_SECRET_BASE64)),
            SignatureAlgorithm.HS256)
        .compact();
  }
}
