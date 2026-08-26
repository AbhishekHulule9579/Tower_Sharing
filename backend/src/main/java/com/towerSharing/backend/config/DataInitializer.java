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
        System.out.println(">>> Checking & synchronizing multi-state persistent telecom data...");

        // Remove legacy generic "admin" user if present
        userRepository.findByUsername("admin").ifPresent(user -> {
            userRepository.delete(user);
            System.out.println(">>> Removed legacy generic 'admin' account.");
        });

        // Initialize base operators if not present
        Operator jio = operatorRepository.findByCode("JIO").map(op -> {
            op.setName("Jio");
            return operatorRepository.save(op);
        }).orElseGet(() -> 
            operatorRepository.save(new Operator("Jio", "JIO", "admin@jio.com", "+91-9820011223"))
        );
        Operator airtel = operatorRepository.findByCode("AIRTEL").map(op -> {
            op.setName("Airtel");
            return operatorRepository.save(op);
        }).orElseGet(() -> 
            operatorRepository.save(new Operator("Airtel", "AIRTEL", "admin@airtel.com", "+91-9810044556"))
        );
        Operator vi = operatorRepository.findByCode("VI").map(op -> {
            op.setName("VI");
            return operatorRepository.save(op);
        }).orElseGet(() -> 
            operatorRepository.save(new Operator("VI", "VI", "admin@vodafoneidea.com", "+91-9830077889"))
        );
        Operator bsnl = operatorRepository.findByCode("BSNL").map(op -> {
            op.setName("BSNL");
            return operatorRepository.save(op);
        }).orElseGet(() -> 
            operatorRepository.save(new Operator("BSNL", "BSNL", "admin@bsnl.co.in", "+91-9410001122"))
        );

        // 1. Seed Governance ADMIN accounts
        seedUserIfMissing("jio_admin", "admin123", "admin@jio.com", "Jio System Administrator", "+91-9820000001", "Maharashtra", UserRole.ADMIN, jio);
        seedUserIfMissing("airtel_admin", "admin123", "admin@airtel.com", "Airtel System Administrator", "+91-9810000002", "Delhi", UserRole.ADMIN, airtel);
        seedUserIfMissing("vi_admin", "admin123", "admin@vodafoneidea.com", "Vi System Administrator", "+91-9830000003", "Tamil Nadu", UserRole.ADMIN, vi);
        seedUserIfMissing("bsnl_admin", "admin123", "admin@bsnl.co.in", "BSNL System Administrator", "+91-9410000004", "Karnataka", UserRole.ADMIN, bsnl);

        // 2. Seed Operations Managers across key States (Maharashtra, Goa, Delhi, Karnataka, Gujarat, Tamil Nadu)
        // Maharashtra
        seedUserIfMissing("jio_mgr", "pass123", "manager@jio.com", "Jio Operations Manager", "+91-9820099001", "Maharashtra", UserRole.OPERATOR_MANAGER, jio);
        seedUserIfMissing("airtel_mgr_mh", "pass123", "manager.mh@airtel.com", "Airtel Operations Manager MH", "+91-9810099011", "Maharashtra", UserRole.OPERATOR_MANAGER, airtel);
        seedUserIfMissing("vi_mgr_mh", "pass123", "manager.mh@vi.com", "Vi Operations Manager MH", "+91-9830099021", "Maharashtra", UserRole.OPERATOR_MANAGER, vi);
        seedUserIfMissing("bsnl_mgr_mh", "pass123", "manager.mh@bsnl.com", "BSNL Operations Manager MH", "+91-9410099031", "Maharashtra", UserRole.OPERATOR_MANAGER, bsnl);

        // Goa
        seedUserIfMissing("jio_mgr_goa", "pass123", "manager.goa@jio.com", "Jio Operations Manager Goa", "+91-9820099005", "Goa", UserRole.OPERATOR_MANAGER, jio);
        seedUserIfMissing("airtel_mgr_goa", "pass123", "manager.goa@airtel.com", "Airtel Operations Manager Goa", "+91-9810099015", "Goa", UserRole.OPERATOR_MANAGER, airtel);
        seedUserIfMissing("vi_mgr_goa", "pass123", "manager.goa@vi.com", "Vi Operations Manager Goa", "+91-9830099025", "Goa", UserRole.OPERATOR_MANAGER, vi);
        seedUserIfMissing("bsnl_mgr_goa", "pass123", "manager.goa@bsnl.com", "BSNL Operations Manager Goa", "+91-9410099035", "Goa", UserRole.OPERATOR_MANAGER, bsnl);

        // Delhi
        seedUserIfMissing("jio_mgr_delhi", "pass123", "manager.delhi@jio.com", "Jio Operations Manager Delhi", "+91-9820099002", "Delhi", UserRole.OPERATOR_MANAGER, jio);
        seedUserIfMissing("airtel_mgr", "pass123", "manager@airtel.com", "Airtel Operations Manager", "+91-9810099002", "Delhi", UserRole.OPERATOR_MANAGER, airtel);
        seedUserIfMissing("vi_mgr_delhi", "pass123", "manager.delhi@vi.com", "Vi Operations Manager Delhi", "+91-9830099022", "Delhi", UserRole.OPERATOR_MANAGER, vi);
        seedUserIfMissing("bsnl_mgr_delhi", "pass123", "manager.delhi@bsnl.com", "BSNL Operations Manager Delhi", "+91-9410099032", "Delhi", UserRole.OPERATOR_MANAGER, bsnl);

        // Karnataka
        seedUserIfMissing("jio_mgr_blr", "pass123", "manager.blr@jio.com", "Jio Operations Manager Karnataka", "+91-9820099004", "Karnataka", UserRole.OPERATOR_MANAGER, jio);
        seedUserIfMissing("airtel_mgr_blr", "pass123", "manager.blr@airtel.com", "Airtel Operations Manager Karnataka", "+91-9810099014", "Karnataka", UserRole.OPERATOR_MANAGER, airtel);
        seedUserIfMissing("vi_mgr_blr", "pass123", "manager.blr@vi.com", "Vi Operations Manager Karnataka", "+91-9830099024", "Karnataka", UserRole.OPERATOR_MANAGER, vi);
        seedUserIfMissing("bsnl_mgr", "pass123", "manager@bsnl.com", "BSNL Operations Manager", "+91-9410099004", "Karnataka", UserRole.OPERATOR_MANAGER, bsnl);

        // Gujarat
        seedUserIfMissing("jio_mgr_guj", "pass123", "manager.guj@jio.com", "Jio Operations Manager Gujarat", "+91-9820099006", "Gujarat", UserRole.OPERATOR_MANAGER, jio);
        seedUserIfMissing("airtel_mgr_guj", "pass123", "manager.guj@airtel.com", "Airtel Operations Manager Gujarat", "+91-9810099016", "Gujarat", UserRole.OPERATOR_MANAGER, airtel);
        seedUserIfMissing("vi_mgr_guj", "pass123", "manager.guj@vi.com", "Vi Operations Manager Gujarat", "+91-9830099026", "Gujarat", UserRole.OPERATOR_MANAGER, vi);
        seedUserIfMissing("bsnl_mgr_guj", "pass123", "manager.guj@bsnl.com", "BSNL Operations Manager Gujarat", "+91-9410099036", "Gujarat", UserRole.OPERATOR_MANAGER, bsnl);

        // Tamil Nadu
        seedUserIfMissing("jio_mgr_tn", "pass123", "manager.tn@jio.com", "Jio Operations Manager TN", "+91-9820099003", "Tamil Nadu", UserRole.OPERATOR_MANAGER, jio);
        seedUserIfMissing("airtel_mgr_tn", "pass123", "manager.tn@airtel.com", "Airtel Operations Manager TN", "+91-9810099013", "Tamil Nadu", UserRole.OPERATOR_MANAGER, airtel);
        seedUserIfMissing("vi_mgr", "pass123", "manager@vi.com", "Vi Operations Manager", "+91-9830099003", "Tamil Nadu", UserRole.OPERATOR_MANAGER, vi);
        seedUserIfMissing("bsnl_mgr_tn", "pass123", "manager.tn@bsnl.com", "BSNL Operations Manager TN", "+91-9410099033", "Tamil Nadu", UserRole.OPERATOR_MANAGER, bsnl);

        // 3. Seed Site Managers
        seedUserIfMissing("site_mgr_mumbai", "site123", "mumbai.site@jio.com", "Jio Site Engineer Mumbai", "+91-9820088001", "Maharashtra", UserRole.SITE_MANAGER, jio);
        seedUserIfMissing("site_mgr_pune", "site123", "pune.site@airtel.com", "Airtel Site Engineer Pune", "+91-9810088011", "Maharashtra", UserRole.SITE_MANAGER, airtel);
        seedUserIfMissing("site_mgr_panaji", "site123", "panaji.site@jio.com", "Jio Site Engineer Panaji", "+91-9820088005", "Goa", UserRole.SITE_MANAGER, jio);
        seedUserIfMissing("site_mgr_margao", "site123", "margao.site@airtel.com", "Airtel Site Engineer Margao", "+91-9810088015", "Goa", UserRole.SITE_MANAGER, airtel);
        seedUserIfMissing("site_mgr_delhi", "site123", "delhi.site@airtel.com", "Airtel Site Engineer Delhi", "+91-9810088002", "Delhi", UserRole.SITE_MANAGER, airtel);
        seedUserIfMissing("site_mgr_chennai", "site123", "chennai.site@vi.com", "Vi Site Engineer Chennai", "+91-9830088003", "Tamil Nadu", UserRole.SITE_MANAGER, vi);
        seedUserIfMissing("site_mgr_blr", "site123", "blr.site@bsnl.co.in", "BSNL Site Engineer Bangalore", "+91-9410088004", "Karnataka", UserRole.SITE_MANAGER, bsnl);

        // 4. Seed Multi-State Telecom Towers
        // Maharashtra Towers
        Tower t_mum_01 = seedTowerIfMissing("TOW-MUM-01", "Marine Drive Metro Cell", "Marine Drive, Nariman Point", "Mumbai", "Maharashtra", 18.9438, 72.8229, 100, 60, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 75000.0, 15000000.0);
        Tower t_mum_02 = seedTowerIfMissing("TOW-MUM-02", "BKC Financial Core Hub", "Bandra Kurla Complex", "Mumbai", "Maharashtra", 19.0657, 72.8687, 120, 90, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 85000.0, 18000000.0);
        Tower t_mum_03 = seedTowerIfMissing("TOW-MUM-03", "Andheri West Commercial Cell", "Link Road, Andheri West", "Mumbai", "Maharashtra", 19.1363, 72.8277, 90, 50, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 65000.0, 12500000.0);
        Tower t_mum_04 = seedTowerIfMissing("TOW-MUM-04", "Dadar Central Exchange", "Dadar TT Circle", "Mumbai", "Maharashtra", 19.0178, 72.8478, 80, 40, bsnl, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 55000.0, 11000000.0);
        Tower t_mum_05 = seedTowerIfMissing("TOW-MUM-05", "Powai Hiranandani Tech Node", "Central Avenue, Powai", "Mumbai", "Maharashtra", 19.1197, 72.9051, 110, 70, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 78000.0, 16000000.0);
        Tower t_mum_06 = seedTowerIfMissing("TOW-MUM-06", "Navi Mumbai Infotech Tower", "Vashi Sector 17", "Navi Mumbai", "Maharashtra", 19.0771, 72.9986, 95, 45, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 68000.0, 13500000.0);
        Tower t_pun_01 = seedTowerIfMissing("TOW-PUN-01", "Hinjewadi Phase 1 Tech Node", "Hinjewadi IT Park", "Pune", "Maharashtra", 18.5913, 73.7389, 110, 60, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 70000.0, 14000000.0);
        Tower t_pun_02 = seedTowerIfMissing("TOW-PUN-02", "Viman Nagar Airport Corridor", "Viman Nagar", "Pune", "Maharashtra", 18.5679, 73.9143, 95, 45, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 72000.0, 13500000.0);
        Tower t_pun_03 = seedTowerIfMissing("TOW-PUN-03", "Koregaon Park Prestige Cell", "North Main Road, KP", "Pune", "Maharashtra", 18.5362, 73.8940, 85, 30, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 66000.0, 12800000.0);
        Tower t_pun_04 = seedTowerIfMissing("TOW-PUN-04", "Magarpatta Cybercity Hub", "Magarpatta City", "Pune", "Maharashtra", 18.5137, 73.9288, 120, 80, bsnl, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 60000.0, 11800000.0);

        // Goa Towers
        Tower t_goa_01 = seedTowerIfMissing("TOW-GOA-01", "Miramar Beach Micro Cell", "Miramar Coastal Road", "Panaji", "Goa", 15.4862, 73.8114, 80, 40, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 60000.0, 12000000.0);
        Tower t_goa_02 = seedTowerIfMissing("TOW-GOA-02", "Margao Central Station Node", "Station Road, Pajifond", "Margao", "Goa", 15.2736, 73.9582, 90, 50, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 58000.0, 11500000.0);
        Tower t_goa_03 = seedTowerIfMissing("TOW-GOA-03", "Vasco Port Logistics Tower", "Mormugao Port Area", "Vasco da Gama", "Goa", 15.3956, 73.8130, 85, 35, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 52000.0, 10500000.0);
        Tower t_goa_04 = seedTowerIfMissing("TOW-GOA-04", "Mapusa Market Junction Tower", "Near Municipal Market", "Mapusa", "Goa", 15.5937, 73.8142, 75, 30, bsnl, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 48000.0, 9000000.0);
        Tower t_goa_05 = seedTowerIfMissing("TOW-GOA-05", "Calangute Coastal Coverage Cell", "Calangute Beach Road", "Calangute", "Goa", 15.5440, 73.7554, 100, 40, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 65000.0, 13000000.0);
        Tower t_goa_06 = seedTowerIfMissing("TOW-GOA-06", "Ponda Industrial Hub Cell", "Tiska Industrial Area", "Ponda", "Goa", 15.4026, 74.0152, 90, 40, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 54000.0, 10800000.0);
        Tower t_goa_07 = seedTowerIfMissing("TOW-GOA-07", "Candolim Resort Strip Node", "Fort Aguada Road", "Candolim", "Goa", 15.5173, 73.7667, 85, 50, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 62000.0, 12200000.0);

        // Delhi Towers
        Tower t_del_01 = seedTowerIfMissing("TOW-DEL-01", "Connaught Place Central Node", "Block C, Connaught Place", "Delhi", "Delhi", 28.6315, 77.2167, 80, 80, vi, TowerStatus.DISASTER_AFFECTED, SharingStatus.AVAILABLE_FOR_SALE, 60000.0, 9000000.0);
        Tower t_del_02 = seedTowerIfMissing("TOW-DEL-02", "Aerocity Gateway Tower", "Aerocity Hospital Sector", "Delhi", "Delhi", 28.5494, 77.1226, 150, 40, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 95000.0, 22000000.0);
        Tower t_del_03 = seedTowerIfMissing("TOW-DEL-03", "Saket South Core Tower", "Saket District Centre", "Delhi", "Delhi", 28.5244, 77.2185, 110, 50, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 88000.0, 19500000.0);
        Tower t_del_04 = seedTowerIfMissing("TOW-DEL-04", "Rohini Sector 9 Substation", "Rohini Institutional Area", "Delhi", "Delhi", 28.7159, 77.1182, 85, 35, bsnl, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 58000.0, 11000000.0);
        Tower t_del_05 = seedTowerIfMissing("TOW-DEL-05", "Dwarka Sector 12 Metro Mast", "Sector 12 City Centre", "Delhi", "Delhi", 28.5921, 77.0460, 105, 55, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 82000.0, 17000000.0);
        Tower t_del_06 = seedTowerIfMissing("TOW-DEL-06", "Hauz Khas Urban Cell", "Aurobindo Marg", "Delhi", "Delhi", 28.5494, 77.2001, 95, 45, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 86000.0, 18500000.0);

        // Karnataka Towers
        Tower t_blr_01 = seedTowerIfMissing("TOW-BLR-01", "Whitefield Tech Hub Node", "ITPL Main Road, Whitefield", "Bangalore", "Karnataka", 12.9698, 77.7499, 110, 50, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 80000.0, 16000000.0);
        Tower t_blr_02 = seedTowerIfMissing("TOW-BLR-02", "Electronic City Phase 2 Hub", "Hosur Main Road", "Bangalore", "Karnataka", 12.8452, 77.6602, 120, 60, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 82000.0, 17500000.0);
        Tower t_blr_03 = seedTowerIfMissing("TOW-BLR-03", "Koramangala 80ft Road Cell", "80 Feet Road, 4th Block", "Bangalore", "Karnataka", 12.9352, 77.6245, 90, 45, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 78000.0, 15500000.0);
        Tower t_blr_04 = seedTowerIfMissing("TOW-BLR-04", "Indiranagar 100ft Hub", "100 Feet Road", "Bangalore", "Karnataka", 12.9784, 77.6408, 100, 50, bsnl, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 74000.0, 14500000.0);
        Tower t_blr_05 = seedTowerIfMissing("TOW-BLR-05", "HSR Layout Sector 2 Cell", "27th Main Road, HSR", "Bangalore", "Karnataka", 12.9116, 77.6389, 105, 55, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 80000.0, 16500000.0);

        // Gujarat Towers
        Tower t_ahm_01 = seedTowerIfMissing("TOW-AHM-01", "SG Highway Corporate Hub", "SG Highway, Bodakdev", "Ahmedabad", "Gujarat", 23.0373, 72.5119, 115, 55, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 72000.0, 14500000.0);
        Tower t_ahm_02 = seedTowerIfMissing("TOW-AHM-02", "Prahlad Nagar Business Park", "Prahlad Nagar", "Ahmedabad", "Gujarat", 23.0120, 72.5080, 105, 50, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 70000.0, 14000000.0);
        Tower t_ahm_03 = seedTowerIfMissing("TOW-AHM-03", "Vastrapur Lake Commercial Cell", "Vastrapur", "Ahmedabad", "Gujarat", 23.0350, 72.5293, 90, 40, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 65000.0, 12500000.0);
        Tower t_srt_01 = seedTowerIfMissing("TOW-SRT-01", "Ring Road Diamond Market Cell", "Ring Road", "Surat", "Gujarat", 21.1959, 72.8302, 95, 40, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 68000.0, 13000000.0);
        Tower t_srt_02 = seedTowerIfMissing("TOW-SRT-02", "Vesu High Street Mast", "VIP Road, Vesu", "Surat", "Gujarat", 21.1418, 72.7709, 100, 50, bsnl, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_SALE, 62000.0, 12000000.0);

        // Tamil Nadu Towers
        Tower t_che_01 = seedTowerIfMissing("TOW-CHE-01", "Anna Salai Main Cell", "Anna Salai, Mount Road", "Chennai", "Tamil Nadu", 13.0604, 80.2496, 90, 30, bsnl, TowerStatus.UNDER_MAINTENANCE, SharingStatus.AVAILABLE_FOR_SALE, 45000.0, 7500000.0);
        Tower t_che_02 = seedTowerIfMissing("TOW-CHE-02", "OMR IT Expressway Tower", "Old Mahabalipuram Road", "Chennai", "Tamil Nadu", 12.9516, 80.2415, 120, 60, vi, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 75000.0, 15000000.0);
        Tower t_che_03 = seedTowerIfMissing("TOW-CHE-03", "T-Nagar Commercial Hub", "Usman Road, T-Nagar", "Chennai", "Tamil Nadu", 13.0418, 80.2341, 100, 50, airtel, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 78000.0, 16000000.0);
        Tower t_che_04 = seedTowerIfMissing("TOW-CHE-04", "Guindy Industrial Estate Mast", "Guindy Estate", "Chennai", "Tamil Nadu", 13.0067, 80.2025, 110, 60, jio, TowerStatus.ACTIVE, SharingStatus.AVAILABLE_FOR_LEASE, 82000.0, 17000000.0);

        // 5. Seed Inventory Items
        if (inventoryRepository.count() == 0) {
            inventoryRepository.save(new InventoryItem("PART-ANT-5G", "5G Heavy-Duty Panel Antenna 3.5GHz", 45, 35000.0, "Mumbai Central Depot", 10));
            inventoryRepository.save(new InventoryItem("PART-GEN-50K", "50KVA Backup Diesel Generator Set", 12, 250000.0, "Delhi Regional Depot", 5));
            inventoryRepository.save(new InventoryItem("PART-FIB-100M", "100m Armored Optical Fiber Cable Spool", 120, 15000.0, "Chennai Telecom Hub", 20));
            inventoryRepository.save(new InventoryItem("PART-PWR-RECT", "48V Telecom Rectifier Power Module", 30, 45000.0, "Bangalore Logistics Warehouse", 8));
            inventoryRepository.save(new InventoryItem("PART-BATT-LITH", "48V 100Ah Lithium-Ion Battery Storage Unit", 22, 115000.0, "Pune Regional Warehouse", 6));
            inventoryRepository.save(new InventoryItem("PART-SOLAR-MPPT", "5KW Solar MPPT Hybrid Power Controller", 18, 85000.0, "Ahmedabad Depot", 5));
            inventoryRepository.save(new InventoryItem("PART-BEACON-AV", "High-Intensity LED Aviation Warning Beacon", 50, 18000.0, "Goa Technical Store", 12));
        }

        // 6. Seed Leases across Maharashtra, Goa, Delhi, Karnataka, Gujarat, Tamil Nadu
        seedLeaseIfMissing(t_mum_01, jio, airtel, 25, 75000.0, LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(9), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager MH - Active co-location lease");
        seedLeaseIfMissing(t_mum_02, airtel, vi, 20, 85000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Airtel Maharashtra manager approval");
        seedLeaseIfMissing(t_mum_05, jio, bsnl, 30, 78000.0, LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(10), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager MH - Powai IT corridor sharing");
        seedLeaseIfMissing(t_pun_01, jio, bsnl, 15, 70000.0, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(11), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager MH - Hinjewadi phase 1");
        seedLeaseIfMissing(t_pun_03, vi, airtel, 20, 66000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Vi Maharashtra manager approval");

        seedLeaseIfMissing(t_goa_01, jio, airtel, 20, 60000.0, LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(10), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager Goa - Miramar beach cell");
        seedLeaseIfMissing(t_goa_02, airtel, vi, 15, 58000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Airtel Goa manager approval for Margao station");
        seedLeaseIfMissing(t_goa_04, bsnl, jio, 20, 48000.0, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(11), LeaseStatus.ACTIVE, "Approved by BSNL Operator Manager Goa");
        seedLeaseIfMissing(t_goa_06, airtel, jio, 25, 54000.0, LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(8), LeaseStatus.ACTIVE, "Approved by Airtel Operator Manager Goa - Ponda industrial node");

        seedLeaseIfMissing(t_del_02, jio, airtel, 30, 95000.0, LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(8), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager Delhi - Aerocity gateway");
        seedLeaseIfMissing(t_del_03, airtel, bsnl, 25, 88000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Airtel Delhi manager approval for Saket core");
        seedLeaseIfMissing(t_del_05, jio, vi, 25, 82000.0, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(11), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager Delhi - Dwarka metro");

        seedLeaseIfMissing(t_blr_01, airtel, bsnl, 20, 80000.0, LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(10), LeaseStatus.ACTIVE, "Approved by Airtel Operator Manager Karnataka - Whitefield IT hub");
        seedLeaseIfMissing(t_blr_02, jio, vi, 25, 82000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Jio Karnataka manager approval for E-City");
        seedLeaseIfMissing(t_blr_04, bsnl, airtel, 20, 74000.0, LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(9), LeaseStatus.ACTIVE, "Approved by BSNL Operator Manager Karnataka");

        seedLeaseIfMissing(t_ahm_01, jio, vi, 20, 72000.0, LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(11), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager Gujarat");
        seedLeaseIfMissing(t_srt_01, vi, airtel, 15, 68000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Vi Gujarat manager approval for Surat diamond market");

        seedLeaseIfMissing(t_che_02, vi, jio, 25, 75000.0, LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(9), LeaseStatus.ACTIVE, "Approved by Vi Operator Manager TN - OMR expressway");
        seedLeaseIfMissing(t_che_03, airtel, bsnl, 20, 78000.0, LocalDate.now(), LocalDate.now().plusMonths(12), LeaseStatus.PENDING_APPROVAL, "Awaiting Airtel TN manager approval");
        seedLeaseIfMissing(t_che_04, jio, airtel, 30, 82000.0, LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(10), LeaseStatus.ACTIVE, "Approved by Jio Operator Manager TN - Guindy estate");

        // 7. Seed Transactions across States
        seedTransactionIfMissing(t_mum_03, vi, jio, 12500000.0, LocalDate.now().minusMonths(1), TransactionStatus.COMPLETED, "Vi sold Andheri West site asset to Jio for network density expansion in Maharashtra");
        seedTransactionIfMissing(t_mum_06, airtel, jio, 13500000.0, LocalDate.now().minusDays(10), TransactionStatus.COMPLETED, "Airtel sold Vashi Navi Mumbai mast to Jio for 5G enterprise backbone");
        seedTransactionIfMissing(t_pun_02, airtel, vi, 13500000.0, LocalDate.now().minusMonths(2), TransactionStatus.COMPLETED, "Airtel sold Viman Nagar corridor asset to Vi in Pune");

        seedTransactionIfMissing(t_goa_03, vi, jio, 10500000.0, LocalDate.now().minusMonths(2), TransactionStatus.COMPLETED, "Vi sold Vasco Port site asset to Jio for coastal coverage expansion in Goa");
        seedTransactionIfMissing(t_goa_05, jio, airtel, 13000000.0, LocalDate.now().minusDays(15), TransactionStatus.COMPLETED, "Jio transferred Calangute beach cell capacity to Airtel in Goa");

        seedTransactionIfMissing(t_del_04, bsnl, airtel, 11000000.0, LocalDate.now().minusMonths(1), TransactionStatus.COMPLETED, "BSNL sold Rohini substation tower to Airtel in Delhi");
        seedTransactionIfMissing(t_del_01, vi, jio, 9000000.0, LocalDate.now().minusDays(5), TransactionStatus.COMPLETED, "Vi sold Connaught Place site asset to Jio in Delhi");

        seedTransactionIfMissing(t_blr_03, vi, airtel, 15500000.0, LocalDate.now().minusMonths(2), TransactionStatus.COMPLETED, "Vi sold Koramangala site asset to Airtel in Karnataka");
        seedTransactionIfMissing(t_blr_05, jio, bsnl, 16500000.0, LocalDate.now().minusDays(20), TransactionStatus.COMPLETED, "Jio transferred HSR Layout tower asset to BSNL in Bangalore");

        seedTransactionIfMissing(t_ahm_02, airtel, jio, 14000000.0, LocalDate.now().minusMonths(1), TransactionStatus.COMPLETED, "Airtel sold Prahlad Nagar tower asset to Jio in Gujarat");
        seedTransactionIfMissing(t_srt_02, bsnl, airtel, 12000000.0, LocalDate.now().minusDays(8), TransactionStatus.COMPLETED, "BSNL sold Vesu High Street site to Airtel in Surat");

        seedTransactionIfMissing(t_che_01, bsnl, jio, 7500000.0, LocalDate.now().minusMonths(3), TransactionStatus.COMPLETED, "BSNL sold Anna Salai tower asset to Jio in Tamil Nadu");

        // 8. Seed Disaster Incidents & Emergency Sharing across multiple states
        if (incidentRepository.count() == 0) {
            // Incident 1: Delhi Flood
            DisasterIncident incident1 = incidentRepository.save(new DisasterIncident(
                    "INC-2026-FL01",
                    "North India Severe Flash Flood & Substation Damage",
                    DisasterType.FLOOD,
                    "Heavy torrential rain caused severe flooding at Connaught Place substation, knocking out power and damaging base transceiver equipment of TOW-DEL-01.",
                    "Delhi",
                    LocalDate.now().minusDays(2),
                    IncidentStatus.ACTIVE
            ));

            emergencySharingRepository.save(new EmergencySharing(
                    incident1, t_del_01, t_del_02, vi, jio, 30, 2500.0, LocalDate.now().minusDays(2), LocalDate.now().plusDays(28), 75000.0, EmergencyStatus.ACTIVE
            ));

            // Incident 2: Goa Cyclone Gale Wind
            DisasterIncident incident2 = incidentRepository.save(new DisasterIncident(
                    "INC-2026-CY02",
                    "Arabian Sea Cyclone Coastal Gale Wind Outage",
                    DisasterType.STORM,
                    "High velocity cyclone gale winds tilted secondary microwave dish antennas and triggered safety power shutdowns near Miramar coastal node.",
                    "Goa",
                    LocalDate.now().minusDays(1),
                    IncidentStatus.ACTIVE
            ));

            emergencySharingRepository.save(new EmergencySharing(
                    incident2, t_goa_01, t_goa_06, jio, airtel, 25, 2200.0, LocalDate.now().minusDays(1), LocalDate.now().plusDays(20), 44000.0, EmergencyStatus.ACTIVE
            ));

            // Incident 3: Maharashtra Monsoon Landslide
            DisasterIncident incident3 = incidentRepository.save(new DisasterIncident(
                    "INC-2026-LS03",
                    "Western Ghats Flash Landslide & Fiber Severance",
                    DisasterType.EARTHQUAKE,
                    "Heavy slope erosion severed underground backhaul fiber links feeding Hinjewadi IT node.",
                    "Maharashtra",
                    LocalDate.now().minusDays(3),
                    IncidentStatus.ACTIVE
            ));

            emergencySharingRepository.save(new EmergencySharing(
                    incident3, t_pun_01, t_pun_04, jio, bsnl, 35, 3000.0, LocalDate.now().minusDays(3), LocalDate.now().plusDays(15), 45000.0, EmergencyStatus.ACTIVE
            ));

            RepairRequest rep1 = repairRequestRepository.save(new RepairRequest(
                    "REP-DEL-2026-001",
                    t_del_01,
                    incident1,
                    RepairPriority.HIGH,
                    RepairStatus.IN_PROGRESS,
                    "Flood dewatering completed. Need replacement of damaged 48V power rectifiers and feeder cable inspection.",
                    null,
                    LocalDate.now().minusDays(2),
                    null,
                    "Awaiting site engineer maintenance review."
            ));

            RepairRequest rep2 = repairRequestRepository.save(new RepairRequest(
                    "REP-GOA-2026-001",
                    t_goa_01,
                    incident2,
                    RepairPriority.HIGH,
                    RepairStatus.IN_PROGRESS,
                    "Realign microwave dish antennas and test 5G panel structural mountings post-cyclone.",
                    null,
                    LocalDate.now().minusDays(1),
                    null,
                    "Field crew dispatched with calibration kit."
            ));

            RepairRequest rep3 = repairRequestRepository.save(new RepairRequest(
                    "REP-CHE-2026-001",
                    t_che_01,
                    null,
                    RepairPriority.MEDIUM,
                    RepairStatus.PENDING,
                    "Scheduled 5G upgrade and panel antenna replacement.",
                    null,
                    LocalDate.now().minusDays(1),
                    null,
                    "Awaiting site manager maintenance review."
            ));

            InventoryItem invRect = inventoryRepository.findAll().stream().filter(i -> i.getItemCode().equals("PART-PWR-RECT")).findFirst().orElse(null);
            if (invRect != null) {
                usageRepository.save(new RepairInventoryUsage(rep1, invRect, 2));
            }
            InventoryItem invAnt = inventoryRepository.findAll().stream().filter(i -> i.getItemCode().equals("PART-ANT-5G")).findFirst().orElse(null);
            if (invAnt != null) {
                usageRepository.save(new RepairInventoryUsage(rep2, invAnt, 1));
            }
        }

        System.out.println(">>> Multi-State Telecom Tower Sharing Platform Initialized Successfully!");
    }

    private void seedUserIfMissing(String username, String rawPassword, String email, String fullName, String phone, String state, UserRole role, Operator operator) {
        User existing = userRepository.findByUsername(username)
                .or(() -> userRepository.findByFullNameIgnoreCase(fullName))
                .or(() -> userRepository.findFirstByEmailIgnoreCase(email))
                .orElse(null);
        if (existing == null) {
            userRepository.save(new User(username, passwordEncoder.encode(rawPassword), email, fullName, phone, state, role, operator));
            System.out.println(">>> Predefined account created: " + fullName + " (" + role + ") for " + (operator != null ? operator.getName() : "All") + " [" + state + "]");
        } else {
            boolean updated = false;
            if (existing.getState() == null || !existing.getState().equalsIgnoreCase(state)) {
                existing.setState(state);
                updated = true;
            }
            if (operator != null && (existing.getOperator() == null || !existing.getOperator().getId().equals(operator.getId()))) {
                existing.setOperator(operator);
                updated = true;
            }
            if (updated) {
                userRepository.save(existing);
                System.out.println(">>> Synchronized account: " + fullName + " -> " + state + " (" + (operator != null ? operator.getName() : "") + ")");
            }
        }
    }

    private Tower seedTowerIfMissing(String towerCode, String name, String location, String city, String state, 
                                     Double latitude, Double longitude, Integer totalCapacity, Integer currentOccupancy, 
                                     Operator ownerOperator, TowerStatus status, SharingStatus sharingStatus, 
                                     Double monthlyLeaseRate, Double salePrice) {
        return towerRepository.findByTowerCode(towerCode).map(t -> {
            boolean changed = false;
            if (!state.equalsIgnoreCase(t.getState())) {
                t.setState(state);
                changed = true;
            }
            if (!sharingStatus.equals(t.getSharingStatus())) {
                t.setSharingStatus(sharingStatus);
                changed = true;
            }
            if (changed) {
                return towerRepository.save(t);
            }
            return t;
        }).orElseGet(() -> 
            towerRepository.save(new Tower(towerCode, name, location, city, state, latitude, longitude, 
                                           totalCapacity, currentOccupancy, ownerOperator, status, sharingStatus, 
                                           monthlyLeaseRate, salePrice))
        );
    }

    private void seedLeaseIfMissing(Tower tower, Operator lessor, Operator lessee, Integer capacity, Double rate, 
                                    LocalDate start, LocalDate end, LeaseStatus status, String notes) {
        if (tower == null || tower.getId() == null) return;
        List<TowerLease> existing = leaseRepository.findByTowerId(tower.getId());
        boolean alreadyLeased = existing.stream().anyMatch(l -> 
            l.getLesseeOperator() != null && l.getLesseeOperator().getId().equals(lessee.getId()) &&
            l.getStatus() == status
        );
        if (!alreadyLeased) {
            leaseRepository.save(new TowerLease(tower, lessor, lessee, capacity, rate, start, end, status, notes));
        }
    }

    private void seedTransactionIfMissing(Tower tower, Operator seller, Operator buyer, Double price, 
                                          LocalDate date, TransactionStatus status, String notes) {
        if (tower == null || tower.getId() == null) return;
        List<TowerTransaction> existing = transactionRepository.findByTowerId(tower.getId());
        boolean alreadyDone = existing.stream().anyMatch(tx -> 
            tx.getBuyerOperator() != null && tx.getBuyerOperator().getId().equals(buyer.getId())
        );
        if (!alreadyDone) {
            transactionRepository.save(new TowerTransaction(tower, seller, buyer, price, date, status, notes));
        }
    }
}
