package com.ecom.SpringPcStore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_spec")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProductSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "spec_key", length = 255)
    private String specKey;

    @Column(name = "spec_value", length = 255)
    private String specValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;
}
