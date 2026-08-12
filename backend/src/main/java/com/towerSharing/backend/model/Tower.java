package com.towerSharing.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "towers")
public class Tower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String towerCode;

    private String name;
    private String location;
    private String city;
    private String state;
    private Double latitude;
    private Double longitude;

    private Integer totalCapacity;
    private Integer currentOccupancy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_operator_id", nullable = false)
    private Operator ownerOperator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TowerStatus status = TowerStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SharingStatus sharingStatus = SharingStatus.AVAILABLE_FOR_LEASE;

    private Double monthlyLeaseRate;
    private Double salePrice;

    public Tower() {}

    public Tower(String towerCode, String name, String location, String city, String state, 
                 Double latitude, Double longitude, Integer totalCapacity, Integer currentOccupancy, 
                 Operator ownerOperator, TowerStatus status, SharingStatus sharingStatus, 
                 Double monthlyLeaseRate, Double salePrice) {
        this.towerCode = towerCode;
        this.name = name;
        this.location = location;
        this.city = city;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
        this.totalCapacity = totalCapacity;
        this.currentOccupancy = currentOccupancy;
        this.ownerOperator = ownerOperator;
        this.status = status;
        this.sharingStatus = sharingStatus;
        this.monthlyLeaseRate = monthlyLeaseRate;
        this.salePrice = salePrice;
    }

    public Double getUtilizationPercentage() {
        if (totalCapacity == null || totalCapacity == 0) return 0.0;
        return ((double) (currentOccupancy != null ? currentOccupancy : 0) / totalCapacity) * 100.0;
    }

    public Integer getAvailableHeadroom() {
        if (totalCapacity == null) return 0;
        return totalCapacity - (currentOccupancy != null ? currentOccupancy : 0);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTowerCode() {
        return towerCode;
    }

    public void setTowerCode(String towerCode) {
        this.towerCode = towerCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Integer totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public Integer getCurrentOccupancy() {
        return currentOccupancy;
    }

    public void setCurrentOccupancy(Integer currentOccupancy) {
        this.currentOccupancy = currentOccupancy;
    }

    public Operator getOwnerOperator() {
        return ownerOperator;
    }

    public void setOwnerOperator(Operator ownerOperator) {
        this.ownerOperator = ownerOperator;
    }

    public TowerStatus getStatus() {
        return status;
    }

    public void setStatus(TowerStatus status) {
        this.status = status;
    }

    public SharingStatus getSharingStatus() {
        return sharingStatus;
    }

    public void setSharingStatus(SharingStatus sharingStatus) {
        this.sharingStatus = sharingStatus;
    }

    public Double getMonthlyLeaseRate() {
        return monthlyLeaseRate;
    }

    public void setMonthlyLeaseRate(Double monthlyLeaseRate) {
        this.monthlyLeaseRate = monthlyLeaseRate;
    }

    public Double getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(Double salePrice) {
        this.salePrice = salePrice;
    }
}
