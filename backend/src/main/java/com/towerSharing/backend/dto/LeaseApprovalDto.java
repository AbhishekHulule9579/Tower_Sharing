package com.towerSharing.backend.dto;

public class LeaseApprovalDto {
    private boolean approved;
    private String approvalNotes;

    public LeaseApprovalDto() {}

    public LeaseApprovalDto(boolean approved, String approvalNotes) {
        this.approved = approved;
        this.approvalNotes = approvalNotes;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public String getApprovalNotes() {
        return approvalNotes;
    }

    public void setApprovalNotes(String approvalNotes) {
        this.approvalNotes = approvalNotes;
    }
}
