package com.rydar.routes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Route object to track drivers' routes */
@Data // Generates getters, setters, equals, hashCode, toString
@Builder // Allows builder pattern: DriverRoute.builder().routeName("X").build()
@NoArgsConstructor // Generates no-args constructor
@AllArgsConstructor // Generates constructor with all fields
public class DriverRoute {

  private String routeName;
  private Double latitude;
  private Double longitude;
  private String customComments;
}
