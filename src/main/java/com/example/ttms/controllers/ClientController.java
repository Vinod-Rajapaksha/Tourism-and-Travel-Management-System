package com.example.ttms.controllers;

import com.example.ttms.dto.ClientDTO;
import com.example.ttms.security.AuthUtils;
import com.example.ttms.services.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;
    private final AuthUtils auth;

    public ClientController(ClientService clientService, AuthUtils auth) {
        this.clientService = clientService;
        this.auth = auth;
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClientDTO> getClient(@PathVariable Integer userId) {
        auth.assertClientSelf(userId);
        return ResponseEntity.ok(clientService.getById(userId));
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClientDTO> update(@PathVariable Integer userId, @RequestBody ClientDTO dto) {
        auth.assertClientSelf(userId);
        return ResponseEntity.ok(clientService.updateProfile(userId, dto));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClientDTO> me() {
        Integer id = auth.currentClientId();
        return ResponseEntity.ok(clientService.getById(id));
    }
}
