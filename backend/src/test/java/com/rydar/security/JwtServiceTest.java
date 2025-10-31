package com.rydar.security;

import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.Jwts;
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
    assertEquals("john@example.com", jwtService.extractEmail(token));
  }

  @Test
  void shouldReturnNullForExpiredToken() throws InterruptedException {
    String shortLived = buildToken(user.getUsername(), 1000);
    assertEquals("john@example.com", jwtService.extractEmail(shortLived));
    Thread.sleep(1500);
    assertNull(jwtService.extractEmail(shortLived));
  }

  @Test
  void shouldReturnNullForInvalidToken() {
    String invalidToken = "not.a.valid.token";
    assertNull(jwtService.extractEmail(invalidToken));
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
