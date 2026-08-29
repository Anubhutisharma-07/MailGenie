package com.email.writer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
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
