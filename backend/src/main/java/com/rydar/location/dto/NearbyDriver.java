package com.rydar.location.dto;

public record NearbyDriver(
    String userId,
    Double latitude,
    Double longitude,
    String currRouteName,
    String customComments) {}
