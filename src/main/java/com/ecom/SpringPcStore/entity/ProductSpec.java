package com.ecom.SpringPcStore.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProductSpec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(name = "spec_key")
    private String specKey;
    
    @Column(name = "spec_value")
    private String specValue;
}
