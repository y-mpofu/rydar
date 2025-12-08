package com.rydar.routes.dto;

/** JSON contents driver request to addRoute */
public record AddRouteRequest(
    String routeName, Double destinationLat, Double destinationLong, String customComments) {}
