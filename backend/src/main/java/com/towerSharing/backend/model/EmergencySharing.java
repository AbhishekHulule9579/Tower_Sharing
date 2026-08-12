package com.towerSharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "emergency_sharings")
public class EmergencySharing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id", nullable = false)
    private DisasterIncident incident;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "damaged_tower_id", nullable = false)
    private Tower damagedTower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "host_tower_id", nullable = false)
    private Tower hostTower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "affected_operator_id", nullable = false)
    private Operator affectedOperator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "host_operator_id", nullable = false)
    private Operator hostOperator;

    private Integer sharedCapacity;
    private Double dailyRate;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPayment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmergencyStatus status = EmergencyStatus.ACTIVE;

    public EmergencySharing() {}

    public EmergencySharing(DisasterIncident incident, Tower damagedTower, Tower hostTower, 
                            Operator affectedOperator, Operator hostOperator, Integer sharedCapacity, 
                            Double dailyRate, LocalDate startDate, LocalDate endDate, Double totalPayment, 
                            EmergencyStatus status) {
        this.incident = incident;
        this.damagedTower = damagedTower;
        this.hostTower = hostTower;
        this.affectedOperator = affectedOperator;
        this.hostOperator = hostOperator;
        this.sharedCapacity = sharedCapacity;
        this.dailyRate = dailyRate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalPayment = totalPayment;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DisasterIncident getIncident() {
        return incident;
    }

    public void setIncident(DisasterIncident incident) {
        this.incident = incident;
    }

    public Tower getDamagedTower() {
        return damagedTower;
    }

    public void setDamagedTower(Tower damagedTower) {
        this.damagedTower = damagedTower;
    }

    public Tower getHostTower() {
        return hostTower;
    }

    public void setHostTower(Tower hostTower) {
        this.hostTower = hostTower;
    }

    public Operator getAffectedOperator() {
        return affectedOperator;
    }

    public void setAffectedOperator(Operator affectedOperator) {
        this.affectedOperator = affectedOperator;
    }

    public Operator getHostOperator() {
        return hostOperator;
    }

    public void setHostOperator(Operator hostOperator) {
        this.hostOperator = hostOperator;
    }

    public Integer getSharedCapacity() {
        return sharedCapacity;
    }

    public void setSharedCapacity(Integer sharedCapacity) {
        this.sharedCapacity = sharedCapacity;
    }

    public Double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(Double dailyRate) {
        this.dailyRate = dailyRate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(Double totalPayment) {
        this.totalPayment = totalPayment;
    }

    public EmergencyStatus getStatus() {
        return status;
    }

    public void setStatus(EmergencyStatus status) {
        this.status = status;
    }
}
