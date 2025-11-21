package com.rydar.location.dto;

public record UserLocation(Double latitude, Double longitude, Long updatedAtTimestamp, String curr_route) {}
