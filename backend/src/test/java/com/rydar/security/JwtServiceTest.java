package com.rydar.security;

import static org.junit.jupiter.api.Assertions.*;

import com.rydar.user.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

  private JwtService jwtService;
  private User user;
  private static final String TEST_SECRET_BASE64 = "9ghWh0nbGIySJtBm+PTWphm8ZqRRdTTj/qJhQATRDkQ=";
  private static final UUID expectedId = UUID.randomUUID();

  @BeforeEach
  void setUp() {
    jwtService = new JwtService();
    user = User.builder().id(expectedId).email("john@example.com").password("x").build();
  }

  @Test
  void shouldGenerateValidTokenForUser() {
    String token = jwtService.generateToken(user);

    assertNotNull(token);
    assertFalse(token.isEmpty());
    assertEquals(expectedId.toString(), jwtService.extractAllClaims(token).getSubject());
  }

  @Test
  void shouldThrowForExpiredToken() throws InterruptedException {
    String shortLived = buildToken(expectedId, 1000);
    assertEquals(expectedId.toString(), jwtService.extractAllClaims(shortLived).getSubject());
    Thread.sleep(1500);
    assertThrows(ExpiredJwtException.class, () -> jwtService.extractAllClaims(shortLived));
  }

  @Test
  void shouldThrowForInvalidToken() {
    String invalidToken = "not.a.valid.token";
    assertThrows(MalformedJwtException.class, () -> jwtService.extractAllClaims(invalidToken));
  }

  private static String buildToken(UUID subject, long ttlMillis) {
    return Jwts.builder()
        .setSubject(subject.toString())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + ttlMillis))
        .signWith(
            Keys.hmacShaKeyFor(Decoders.BASE64.decode(TEST_SECRET_BASE64)),
            SignatureAlgorithm.HS256)
        .compact();
  }
}
