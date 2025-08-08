export const testCredentials = [
  {
    id: "user",
    label: "Regular User",
    email: "gelila.y@email.com",
    password: "g@user",
    role: "user"
  },
  {
    id: "admin",
    label: "Admin User",
    email: "samrawit.a@admin.com",
    password: "s@admin",
    role: "admin"
  },
  {
    id: "superadmin",
    label: "Super Admin",
    email: "kebede.s@superadmin.com",
    password: "superadmin",
    role: "superadmin"
  }
];

export const users: User[] = [
  // Sample users
  {
    id: 1,
    username: "gelila_y",
    email: "gelila.y@email.com",
    role: "user",
    isActive: true,
    walletBalance: 1250.75,
    password: "g@user",
  },
  {
    id: 2,
    username: "dagim_t",
    email: "dagim.t@email.com",
    role: "user",
    isActive: true,
    walletBalance: 250.00,
    password: "d@user",
  },
  {
    id: 3,
    username: "selamawit_a",
    email: "selamawit.a@email.com",
    role: "user",
    isActive: false,
    walletBalance: 5000.00,
    password: "s@user",
  },
  {
    id: 4,
    username: "birhanu_g",
    email: "birhanu.g@email.com",
    role: "user",
    isActive: true,
    walletBalance: 800.20,
    password: "b@user",
  },
  {
    id: 5,
    username: "hana_d",
    email: "hana.d@email.com",
    role: "user",
    isActive: true,
    walletBalance: 310.50,
    password: "h@user",
  },

  // Sample admin users
  {
    id: 6,
    username: "samrawit_admin",
    email: "samrawit.a@admin.com",
    role: "admin",
    isActive: true,
    password: "s@admin",
  },
  {
    id: 7,
    username: "melkamu_admin",
    email: "melkamu.m@admin.com",
    role: "admin",
    isActive: true,
    password: "m@admin",
  },

  // Sample superadmin user
  {
    id: 8,
    username: "kebede_super",
    email: "kebede.s@superadmin.com",
    role: "superadmin",
    isActive: true,
    password: "k@superadmin",
  },
];