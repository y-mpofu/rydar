package com.rydar.user.UserProfiles.dto;

public record GetProfileResponse(
    String username, String firstname, String lastname, String email) {}
