package com.rydar.tripRoutes;

/** Route object to track drivers' routes\ */
public record DriverRoute(String routeName, String endLocation) {
  public static DriverRoute create(String name, String end) {
    return new DriverRoute(name, end);
  }
}
