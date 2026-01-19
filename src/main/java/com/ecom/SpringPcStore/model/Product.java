package com.ecom.SpringPcStore.model;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Product {
    private Long id;
    private String name;
}
