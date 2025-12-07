package com.rydar.location.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DriverLocationUpdate(
    @NotNull Double latitude, @NotNull Double longitude, @NotBlank String currRouteName) {}
