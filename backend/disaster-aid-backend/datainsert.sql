-- 1) Admins
INSERT INTO Admin (Name, Email, PhoneNo) VALUES
('Ravindu Perera', 'ravindu.admin@example.com', '0771234567'),
('Sajani Fernando', 'sajani.admin@example.com', '0712345678');

-- 2) Aid Centers
INSERT INTO AidCenter (District, Location) VALUES
('Colombo', 'Nugegoda'),
('Galle', 'Hikkaduwa'),
('Kandy', 'Peradeniya');

-- 3) Aid Center Managers
INSERT INTO AidCenterManager (FName, LName, Email, PhoneNo, District, AdminID) VALUES
('Tharindu', 'Silva', 'tharindu.manager@example.com', '0759876543', 'Colombo', 1),
('Ishara', 'Jayawardena', 'ishara.manager@example.com', '0788765432', 'Galle', 1),
('Kasun', 'Fernando', 'kasun.manager@example.com', '0711122233', 'Kandy', 2);

-- 4) Disaster Areas
INSERT INTO DisasterArea (District, AidCenterID) VALUES
('Colombo', 1),
('Galle', 2),
('Kandy', 3);

-- 5) Inventory Items
INSERT INTO Inventory (ItemCategory, Quantity, AdminID) VALUES
('Dry Rations', 500, 1),
('Medicine', 300, 1),
('Water Bottles', 700, 2),
('Clothes', 400, 2);

-- 6) Donations
INSERT INTO Donation (ItemID, ItemCategory, Quantity, VolunteerName, VolunteerPhoneNo, AdminID) VALUES
(1, 'Dry Rations', 50, 'Nipun Jayasuriya', '0777777777', 1),
(2, 'Medicine', 30, 'Sahan Dissanayake', '0718888888', 1),
(3, 'Water Bottles', 80, 'Dilini Rajapaksha', '0755555555', 2),
(4, 'Clothes', 40, 'Chamodi Weerasinghe', '0706666666', 2);