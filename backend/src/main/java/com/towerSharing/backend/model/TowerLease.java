package com.towerSharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tower_leases")
public class TowerLease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tower_id", nullable = false)
    private Tower tower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lessor_operator_id", nullable = false)
    private Operator lessorOperator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lessee_operator_id", nullable = false)
    private Operator lesseeOperator;

    private Integer sharedCapacity;
    private Double monthlyRate;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaseStatus status = LeaseStatus.PENDING_APPROVAL;

    private String approvalNotes;

    public TowerLease() {}

    public TowerLease(Tower tower, Operator lessorOperator, Operator lesseeOperator, 
                      Integer sharedCapacity, Double monthlyRate, LocalDate startDate, 
                      LocalDate endDate, LeaseStatus status, String approvalNotes) {
        this.tower = tower;
        this.lessorOperator = lessorOperator;
        this.lesseeOperator = lesseeOperator;
        this.sharedCapacity = sharedCapacity;
        this.monthlyRate = monthlyRate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.approvalNotes = approvalNotes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tower getTower() {
        return tower;
    }

    public void setTower(Tower tower) {
        this.tower = tower;
    }

    public Operator getLessorOperator() {
        return lessorOperator;
    }

    public void setLessorOperator(Operator lessorOperator) {
        this.lessorOperator = lessorOperator;
    }

    public Operator getLesseeOperator() {
        return lesseeOperator;
    }

    public void setLesseeOperator(Operator lesseeOperator) {
        this.lesseeOperator = lesseeOperator;
    }

    public Integer getSharedCapacity() {
        return sharedCapacity;
    }

    public void setSharedCapacity(Integer sharedCapacity) {
        this.sharedCapacity = sharedCapacity;
    }

    public Double getMonthlyRate() {
        return monthlyRate;
    }

    public void setMonthlyRate(Double monthlyRate) {
        this.monthlyRate = monthlyRate;
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

    public LeaseStatus getStatus() {
        return status;
    }

    public void setStatus(LeaseStatus status) {
        this.status = status;
    }

    public String getApprovalNotes() {
        return approvalNotes;
    }

    public void setApprovalNotes(String approvalNotes) {
        this.approvalNotes = approvalNotes;
    }
}
