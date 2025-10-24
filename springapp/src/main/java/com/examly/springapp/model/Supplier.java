package com.examly.springapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactInfo;
    private String products;
    private Integer rating;
    private String contractDetails;

    public Supplier() {}

    public Supplier(String name, String contactInfo, String products, Integer rating, String contractDetails) {
        this.name = name;
        this.contactInfo = contactInfo;
        this.products = products;
        this.rating = rating;
        this.contractDetails = contractDetails;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getProducts() { return products; }
    public void setProducts(String products) { this.products = products; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getContractDetails() { return contractDetails; }
    public void setContractDetails(String contractDetails) { this.contractDetails = contractDetails; }
}
