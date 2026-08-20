package com.email.writer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Object request) {
        // Implementation pending Epic 2 detailed execution
        return ResponseEntity.ok("Login endpoint scaffolded");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Object request) {
        // Implementation pending Epic 2 detailed execution
        return ResponseEntity.ok("Register endpoint scaffolded");
    }
}
