export const driverColumns = [
	{ name: "id", label: "ID" },
	{ name: "firstName", label: "First Name" },
	{ name: "lastName", label: "Last Name" },
	{ name: "phoneNumber", label: "Phone Number" },
	{ name: "email", label: "Email" },
	{ name: "license", label: "License" },
	{ name: "chekr", label: "Background Check Status" },
	{ name: "chekrID", label: "Background Check ID" }
];

export const ownerColumns = [
	{ name: "id", label: "ID" },
	{ name: "firstName", label: "First Name" },
	{ name: "lastName", label: "Last Name" },
	{ name: "phoneNumber", label: "Phone Number" },
	{ name: "email", label: "Email" },
	{ name: "vehicles", label: "Vehicles" }
];

export const waitlistColumns = [
	{ name: "id", label: "ID" },
	{ name: "status", label: "Status" },
	{ name: "type", label: "Type" },
	{ name: "userID", label: "User ID" },
	{ name: "points", label: "Points" }
]

export const connectionColumns = [
	{ name: "id", label: "ID" },
	{ name: "status", label: "Status" },
	{ name: "driverMatchID", label: "Driver Match ID" },
	{ name: "ownerMatchID", label: "Onwer Match ID" },
	{ name: "carID", label: "Car ID" },
	{ name: "date", label: "Date" },
	{ name: "paid", label: "Paid" },
	{ name: "canceledBy", label: "Canceled By" }
]

export const matchColumns = [
	{ name: "id", label: "ID" },
	{ name: "status", label: "Status" },
	{ name: "date", label: "Date" },
	{ name: "driverID", label: "Driver ID" },
	{ name: "ownerID", label: "Onwer ID" },
	{ name: "connectionID", label: "Connection ID" },
	{ name: "type", label: "Type" },
]

export const vehicleColumns = [
	{ name: "id", label: "ID" },
	{ name: "make", label: "Make" },
	{ name: "model", label: "Model" },
	{ name: "year", label: "Year" },
	{ name: "plateNumber", label: "Plate Number" },
	{ name: "ownerID", label: "Onwer ID" }
]