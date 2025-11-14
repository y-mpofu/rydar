package com.rydar.rider;

import com.rydar.location.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rider/")
@RequiredArgsConstructor
public class RiderController {

  private final LocationService locationService;
}
