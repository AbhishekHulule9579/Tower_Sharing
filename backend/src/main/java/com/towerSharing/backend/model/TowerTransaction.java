package com.towerSharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tower_transactions")
public class TowerTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tower_id", nullable = false)
    private Tower tower;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_operator_id", nullable = false)
    private Operator sellerOperator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_operator_id", nullable = false)
    private Operator buyerOperator;

    private Double agreedPrice;
    private LocalDate transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.PROPOSED;

    private String notes;

    public TowerTransaction() {}

    public TowerTransaction(Tower tower, Operator sellerOperator, Operator buyerOperator, 
                            Double agreedPrice, LocalDate transactionDate, TransactionStatus status, String notes) {
        this.tower = tower;
        this.sellerOperator = sellerOperator;
        this.buyerOperator = buyerOperator;
        this.agreedPrice = agreedPrice;
        this.transactionDate = transactionDate;
        this.status = status;
        this.notes = notes;
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

    public Operator getSellerOperator() {
        return sellerOperator;
    }

    public void setSellerOperator(Operator sellerOperator) {
        this.sellerOperator = sellerOperator;
    }

    public Operator getBuyerOperator() {
        return buyerOperator;
    }

    public void setBuyerOperator(Operator buyerOperator) {
        this.buyerOperator = buyerOperator;
    }

    public Double getAgreedPrice() {
        return agreedPrice;
    }

    public void setAgreedPrice(Double agreedPrice) {
        this.agreedPrice = agreedPrice;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
