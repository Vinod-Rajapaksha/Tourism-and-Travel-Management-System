package com.example.ttms.services;

import com.example.ttms.dto.ClientDTO;
import com.example.ttms.models.Client;
import com.example.ttms.models.ClientPhone;
import com.example.ttms.repositories.ClientRepository;
import com.example.ttms.repositories.ClientPhoneRepository;
import com.example.ttms.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {
    private final ClientRepository clientRepo;
    private final ClientPhoneRepository clientPhoneRepo;

    public ClientService(ClientRepository clientRepo, ClientPhoneRepository clientPhoneRepo) {
        this.clientRepo = clientRepo;
        this.clientPhoneRepo = clientPhoneRepo;
    }

    public ClientDTO getById(Integer id) {
        Client c = clientRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));
        return toDTO(c);
    }

    public Client findByEmailOrThrow(String email) {
        return clientRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found by email"));
    }

    @Transactional
    public ClientDTO updateProfile(Integer id, ClientDTO dto) {
        Client c = clientRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));

        c.setFirstName(dto.getFirstName());
        c.setLastName(dto.getLastName());
        c.setGender(dto.getGender());

        // Update phone numbers
        if (dto.getPhoneNumbers() != null) {
            // Delete existing phone numbers
            clientPhoneRepo.deleteByUserID(id);
            
            // Add new phone numbers
            for (String phoneNo : dto.getPhoneNumbers()) {
                if (phoneNo != null && !phoneNo.trim().isEmpty()) {
                    ClientPhone phone = new ClientPhone(id, phoneNo.trim());
                    clientPhoneRepo.save(phone);
                }
            }
        }

        return toDTO(clientRepo.save(c));
    }

    public ClientDTO toDTO(Client c) {
        ClientDTO dto = new ClientDTO();
        dto.setUserID(c.getUserID());
        dto.setFirstName(c.getFirstName());
        dto.setLastName(c.getLastName());
        dto.setGender(c.getGender());
        dto.setNic(c.getNic());
        dto.setEmail(c.getEmail());
        
        // Get phone numbers
        List<ClientPhone> phones = clientPhoneRepo.findByUserID(c.getUserID());
        List<String> phoneNumbers = phones.stream()
                .map(ClientPhone::getPhoneNo)
                .collect(Collectors.toList());
        dto.setPhoneNumbers(phoneNumbers);
        
        return dto;
    }
}
