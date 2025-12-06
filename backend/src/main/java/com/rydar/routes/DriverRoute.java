package com.rydar.routes;

import lombok.Getter;

/** Route object to track drivers' routes\ */
public class DriverRoute {
  @Getter String routeName;
  @Getter Double latitude;
  @Getter Double longitude;
  @Getter String customComments;
}
