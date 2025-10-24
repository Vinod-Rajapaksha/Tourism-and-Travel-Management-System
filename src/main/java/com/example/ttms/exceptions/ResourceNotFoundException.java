// exceptions/ResourceNotFoundException.java
package com.example.ttms.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}