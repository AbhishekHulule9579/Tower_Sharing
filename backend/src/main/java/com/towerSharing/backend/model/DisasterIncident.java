package com.towerSharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "disaster_incidents")
public class DisasterIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String incidentCode;

    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisasterType disasterType;

    @Column(length = 1000)
    private String description;

    private String region;
    private LocalDate incidentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.ACTIVE;

    public DisasterIncident() {}

    public DisasterIncident(String incidentCode, String title, DisasterType disasterType, 
                            String description, String region, LocalDate incidentDate, IncidentStatus status) {
        this.incidentCode = incidentCode;
        this.title = title;
        this.disasterType = disasterType;
        this.description = description;
        this.region = region;
        this.incidentDate = incidentDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIncidentCode() {
        return incidentCode;
    }

    public void setIncidentCode(String incidentCode) {
        this.incidentCode = incidentCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public DisasterType getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(DisasterType disasterType) {
        this.disasterType = disasterType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public LocalDate getIncidentDate() {
        return incidentDate;
    }

    public void setIncidentDate(LocalDate incidentDate) {
        this.incidentDate = incidentDate;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }
}
