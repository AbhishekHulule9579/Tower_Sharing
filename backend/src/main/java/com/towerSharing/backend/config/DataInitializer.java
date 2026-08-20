package com.towerSharing.backend.config;

import com.towerSharing.backend.model.*;
import com.towerSharing.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OperatorRepository operatorRepository;
    private final UserRepository userRepository;
    private final TowerRepository towerRepository;
    private final InventoryItemRepository inventoryRepository;
    private final TowerLeaseRepository leaseRepository;
    private final TowerTransactionRepository transactionRepository;
    private final DisasterIncidentRepository incidentRepository;
    private final EmergencySharingRepository emergencySharingRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final RepairInventoryUsageRepository usageRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(OperatorRepository operatorRepository, 
                           UserRepository userRepository, 
                           TowerRepository towerRepository, 
                           InventoryItemRepository inventoryRepository, 
                           TowerLeaseRepository leaseRepository, 
                           TowerTransactionRepository transactionRepository, 
                           DisasterIncidentRepository incidentRepository, 
                           EmergencySharingRepository emergencySharingRepository, 
                           RepairRequestRepository repairRequestRepository, 
                           RepairInventoryUsageRepository usageRepository,
                           PasswordEncoder passwordEncoder) {
        this.operatorRepository = operatorRepository;
        this.userRepository = userRepository;
        this.towerRepository = towerRepository;
        this.inventoryRepository = inventoryRepository;
        this.leaseRepository = leaseRepository;
        this.transactionRepository = transactionRepository;
        this.incidentRepository = incidentRepository;
        this.emergencySharingRepository = emergencySharingRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.usageRepository = usageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> Checking persistent data status...");

        // Ensure predefined ADMIN user exists with BCrypt password encryption if missing
        User adminUser = userRepository.findByUsername("admin").orElse(null);
        if (adminUser == null) {
            userRepository.save(new User("admin", passwordEncoder.encode("admin123"), "admin@platform.com", UserRole.ADMIN, null));
            System.out.println(">>> Predefined ADMIN account created (Username: admin, Password: BCrypt[admin123]).");
        } else {
            System.out.println(">>> Predefined ADMIN account exists. Preserving all registered user data.");
        }

        if (operatorRepository.count() > 0) {
            System.out.println(">>> Base telecom operators & domain data already initialized.");
            return;
        }

        System.out.println(">>> Initializing Telecom Tower Sharing & Disaster Recovery Platform Core Data...");

        // Create Telecom Operators
        Operator jio = operatorRepository.save(new Operator("Reliance Jio Infocomm", "JIO", "admin@jio.com", "+91-9820011223"));
        Operator airtel = operatorRepository.save(new Operator("Bharti Airtel Limited", "AIRTEL", "admin@airtel.com", "+91-9810044556"));
        Operator vi = operatorRepository.save(new Operator("Vodafone Idea Limited", "VI", "admin@vodafoneidea.com", "+91-9830077889"));
        Operator bsnl = operatorRepository.save(new Operator("Bharat Sanchar Nigam Ltd", "BSNL", "admin@bsnl.co.in", "+91-9410001122"));

        // Create Telecom Towers
        Tower t1 = towerRepository.save(new Tower("TOW-MUM-01", "Marine Drive Metro Cell", "Marine Drive, Nariman Point", "Mumbai", "Maharashtra", 18.9438, 72.8229, 100, 60, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 75000.0, 15000000.0));
        Tower t2 = towerRepository.save(new Tower("TOW-MUM-02", "BKC Financial Core Hub", "Bandra Kurla Complex", "Mumbai", "Maharashtra", 19.0657, 72.8687, 120, 90, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 85000.0, 18000000.0));
        Tower t3 = towerRepository.save(new Tower("TOW-DEL-01", "Connaught Place Central Node", "Block C, Connaught Place", "Delhi", "Delhi NCR", 28.6315, 77.2167, 80, 80, vi, TowerStatus.DISASTER_AFFECTED, SharingStatus.AVAILABLE_FOR_SALE, 60000.0, 9000000.0));
        Tower t4 = towerRepository.save(new Tower("TOW-DEL-02", "Aerocity Gateway Tower", "Aerocity Hospital Sector", "Delhi", "Delhi NCR", 28.5494, 77.1226, 150, 40, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 95000.0, 22000000.0));
        Tower t5 = towerRepository.save(new Tower("TOW-CHE-01", "Anna Salai Main Cell", "Anna Salai, Mount Road", "Chennai", "Tamil Nadu", 13.0604, 80.2496, 90, 30, bsnl, TowerStatus.UNDER_MAINTENANCE, SharingStatus.AVAILABLE_FOR_SALE, 45000.0, 7500000.0));
        Tower t6 = towerRepository.save(new Tower("TOW-BLR-01", "Whitefield Tech Hub Node", "ITPL Main Road, Whitefield", "Bangalore", "Karnataka", 12.9698, 77.7499, 110, 50, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 80000.0, 16000000.0));

        // Create Inventory Spare Parts
        InventoryItem inv1 = inventoryRepository.save(new InventoryItem("PART-ANT-5G", "5G Heavy-Duty Panel Antenna 3.5GHz", 40, 35000.0, "Mumbai Central Depot", 10));
        InventoryItem inv2 = inventoryRepository.save(new InventoryItem("PART-GEN-50K", "50KVA Backup Diesel Generator Set", 8, 250000.0, "Delhi Regional Depot", 5));
        InventoryItem inv3 = inventoryRepository.save(new InventoryItem("PART-FIB-100M", "100m Armored Optical Fiber Cable Spool", 100, 15000.0, "Chennai Telecom Hub", 20));
        InventoryItem inv4 = inventoryRepository.save(new InventoryItem("PART-PWR-RECT", "48V Telecom Rectifier Power Module", 25, 45000.0, "Bangalore Logistics Warehouse", 8));

        // Create Tower Leases
        TowerLease lease1 = leaseRepository.save(new TowerLease(
                t1, jio, vi, 20, 75000.0, LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(9), LeaseStatus.ACTIVE, "Approved by Admin - Lease ACTIVE"
        ));
        TowerLease lease2 = leaseRepository.save(new TowerLease(
                t6, airtel, bsnl, 15, 80000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Admin approval"
        ));

        // Create Buy/Sell Asset Purchase History
        TowerTransaction tx1 = transactionRepository.save(new TowerTransaction(
                t5, bsnl, jio, 7500000.0, LocalDate.now().minusMonths(1), TransactionStatus.COMPLETED, "BSNL sold aging site asset to Jio for network overhaul"
        ));

        // Create Disaster Incidents
        DisasterIncident incident1 = incidentRepository.save(new DisasterIncident(
                "INC-2026-FL01",
                "North India Severe Flash Flood & Substation Damage",
                DisasterType.FLOOD,
                "Heavy torrential rain caused severe flooding at Connaught Place substation, knocking out power and damaging base transceiver equipment of TOW-DEL-01.",
                "Delhi NCR",
                LocalDate.now().minusDays(2),
                IncidentStatus.ACTIVE
        ));

        // Create Emergency Network Sharing
        EmergencySharing emerg1 = emergencySharingRepository.save(new EmergencySharing(
                incident1, t3, t4, vi, jio, 30, 2500.0, LocalDate.now().minusDays(2), LocalDate.now().plusDays(28), 75000.0, EmergencyStatus.ACTIVE
        ));

        // Create Repair Requests (Unassigned initially so user can assign after registering Site Managers)
        RepairRequest rep1 = repairRequestRepository.save(new RepairRequest(
                "REP-DEL-2026-001",
                t3,
                incident1,
                RepairPriority.HIGH,
                RepairStatus.IN_PROGRESS,
                "Flood dewatering completed. Need replacement of damaged 48V power rectifiers and feeder cable inspection.",
                null,
                LocalDate.now().minusDays(2),
                null,
                "Awaiting site manager assignment after manual user registration."
        ));

        RepairRequest rep2 = repairRequestRepository.save(new RepairRequest(
                "REP-CHE-2026-001",
                t5,
                null,
                RepairPriority.MEDIUM,
                RepairStatus.PENDING,
                "Scheduled 5G upgrade and panel antenna replacement.",
                null,
                LocalDate.now().minusDays(1),
                null,
                "Awaiting site manager maintenance review."
        ));

        // Record Inventory Usage for Repair Work Order
        usageRepository.save(new RepairInventoryUsage(rep1, inv4, 2));

        System.out.println(">>> Demo Core Setup Completed Successfully!");
    }
}
