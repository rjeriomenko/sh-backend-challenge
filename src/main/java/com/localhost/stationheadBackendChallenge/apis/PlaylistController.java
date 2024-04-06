package com.localhost.stationheadBackendChallenge.apis;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlaylistController {

  @GetMapping("/hello")
  public String helloUser() {
    return "hi there. Your application is working correctly on localhost:8080/hello";
  }
}
