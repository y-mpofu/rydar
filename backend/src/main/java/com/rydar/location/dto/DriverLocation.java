package com.rydar.location.dto;

public record DriverLocation(
    Double latitude, Double longitude, Long updatedAtTimestamp, String currRouteName) {}
