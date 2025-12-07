package com.rydar.routes.dto;

/** JSON contents driver request to addRoute */
public record AddRouteRequest(
    String routeName, Double latitude, Double longitude, String customComments) {}

