package com.rydar.security;

import com.rydar.user.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private static final String SECRET_KEY = "9ghWh0nbGIySJtBm+PTWphm8ZqRRdTTj/qJhQATRDkQ=";

  public String generateToken(UserAccount userAccount) {
    return generateToken(new HashMap<>(), userAccount);
  }

  public String generateToken(Map<String, Object> extraClaims, UserAccount userAccount) {
    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(userAccount.getId().toString())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(
            new Date(
                System.currentTimeMillis()
                    + 1000 * 60 * 30)) // Access token expires after 30 minutes
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
