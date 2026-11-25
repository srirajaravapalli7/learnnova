const USERS_KEY = "learnnova_users";
const USER_SESSION_KEY = "learnnova_user_session";
const LEGACY_SESSION_KEY = "learnnova_session";
const ADMINS_KEY = "learnnova_admins";
const ADMIN_SESSION_KEY = "learnnova_admin_session";
const PASSWORD_ITERATIONS = 310000;
let demoAdminCreation;
const DEMO_ADMIN = {
  name: "LearnNova Administrator",
  email: "admin@learnnova.com",
  password: "LearnNova@Admin123",
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const getCrypto = () => {
  if (!globalThis.crypto?.subtle || !globalThis.crypto.getRandomValues) {
    throw new Error("This browser does not support secure password hashing. Use a current browser over HTTPS or localhost.");
  }
  return globalThis.crypto;
};

const bytesToHex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const hexToBytes = (hex) => {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) throw new Error("Stored account credentials are invalid.");
  return Uint8Array.from(hex.match(/.{2}/g), (byte) => parseInt(byte, 16));
};

const readUsers = () => {
  const serialized = window.localStorage.getItem(USERS_KEY);
  if (!serialized) return [];
  let users;
  try {
    users = JSON.parse(serialized);
  } catch {
    throw new Error("Saved LearnNova accounts could not be read. The local account data may be damaged.");
  }
  if (!Array.isArray(users)) throw new Error("Saved LearnNova account data has an invalid format.");
  return users;
};

const saveUsers = (users) => {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new Error("Could not save your account in browser storage. Check available storage space and browser privacy settings.");
  }
};

const readAdmins = () => {
  const serialized = window.localStorage.getItem(ADMINS_KEY);
  if (!serialized) return [];
  let admins;
  try {
    admins = JSON.parse(serialized);
  } catch {
    throw new Error("Saved LearnNova admin accounts could not be read. The local account data may be damaged.");
  }
  if (!Array.isArray(admins)) throw new Error("Saved LearnNova admin data has an invalid format.");
  return admins;
};

const saveAdmins = (admins) => {
  try {
    window.localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  } catch {
    throw new Error("Could not save the admin account in browser storage.");
  }
};

const derivePasswordHash = async (password, salt, iterations = PASSWORD_ITERATIONS) => {
  const crypto = getCrypto();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(salt), iterations, hash: "SHA-256" },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(bits));
};

const makePublicUser = (user) => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  studentId: user.studentId,
  department: user.department,
  role: user.role,
  title: user.department,
  createdAt: user.registrationDate,
});

const makeStudentId = (users) => {
  const crypto = getCrypto();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(6));
    const studentId = `LN-${new Date().getFullYear()}-${bytesToHex(randomBytes).toUpperCase()}`;
    if (!users.some((user) => user.studentId === studentId)) return studentId;
  }
  throw new Error("Could not generate a unique Student ID. Please try again.");
};

const makeSalt = () => bytesToHex(getCrypto().getRandomValues(new Uint8Array(16)));

const validatePasswordStrength = (password) => {
  if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    throw new Error("Use at least 8 characters with an uppercase letter, a lowercase letter, and a number.");
  }
};

const readSession = (sessionKey, legacyKey) => {
  const serialized = window.localStorage.getItem(sessionKey)
    || window.localStorage.getItem(legacyKey)
    || window.sessionStorage.getItem(legacyKey);
  if (!serialized) return null;
  try {
    const session = JSON.parse(serialized);
    if (typeof session.userId !== "string") throw new Error("invalid session");
    if (!window.localStorage.getItem(sessionKey)) {
      window.localStorage.setItem(sessionKey, serialized);
      window.localStorage.removeItem(legacyKey);
      window.sessionStorage.removeItem(legacyKey);
    }
    return session;
  } catch {
    throw new Error("The saved LearnNova session is invalid. Sign in again to continue.");
  }
};

const clearStoredSession = (sessionKey, legacyKey) => {
  window.localStorage.removeItem(sessionKey);
  window.localStorage.removeItem(legacyKey);
  window.sessionStorage.removeItem(legacyKey);
};

const saveSession = (sessionKey, userId) => {
  try {
    window.localStorage.setItem(sessionKey, JSON.stringify({ userId }));
  } catch {
    throw new Error("Could not save your sign-in session in browser storage.");
  }
};

export const restoreUserSession = () => {
  const session = readSession(USER_SESSION_KEY, LEGACY_SESSION_KEY);
  if (!session) return null;
  const user = readUsers().find((savedUser) => savedUser.id === session.userId);
  if (!user) {
    clearStoredSession(USER_SESSION_KEY, LEGACY_SESSION_KEY);
    return null;
  }
  return makePublicUser(user);
};

const makePublicAdmin = (admin) => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
  role: "admin",
  title: admin.title,
  createdAt: admin.createdAt,
});

export const ensureDemoAdminAccount = () => {
  if (!demoAdminCreation) {
    demoAdminCreation = (async () => {
      if (readAdmins().length) return;
      const passwordSalt = makeSalt();
      const passwordHash = await derivePasswordHash(DEMO_ADMIN.password, passwordSalt);
      if (readAdmins().length) return;
      saveAdmins([{
        id: crypto.randomUUID(),
        name: DEMO_ADMIN.name,
        email: DEMO_ADMIN.email,
        title: "LearnNova Administrator",
        passwordHash,
        passwordSalt,
        passwordAlgorithm: "PBKDF2-SHA-256",
        passwordIterations: PASSWORD_ITERATIONS,
        role: "admin",
        createdAt: new Date().toISOString(),
      }]);
    })().catch((error) => {
      demoAdminCreation = null;
      throw error;
    });
  }
  return demoAdminCreation;
};

export const restoreAdminSession = () => {
  const session = readSession(ADMIN_SESSION_KEY, ADMIN_SESSION_KEY);
  if (!session) return null;
  const admin = readAdmins().find((savedAdmin) => savedAdmin.id === session.userId);
  if (!admin) {
    clearStoredSession(ADMIN_SESSION_KEY, ADMIN_SESSION_KEY);
    return null;
  }
  return makePublicAdmin(admin);
};

export const authenticateAdmin = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const admin = readAdmins().find((savedAdmin) => savedAdmin.email === normalizedEmail);
  if (!admin || typeof admin.passwordSalt !== "string" || typeof admin.passwordHash !== "string") {
    throw new Error("Email or password is incorrect.");
  }
  const hash = await derivePasswordHash(password, admin.passwordSalt, admin.passwordIterations || PASSWORD_ITERATIONS);
  if (!hashesMatch(hash, admin.passwordHash)) {
    throw new Error("Email or password is incorrect.");
  }
  saveSession(ADMIN_SESSION_KEY, admin.id);
  return makePublicAdmin(admin);
};

export const signOutAdmin = () => {
  clearStoredSession(ADMIN_SESSION_KEY, ADMIN_SESSION_KEY);
};

export const getRegisteredUsers = () =>
  readUsers().map(makePublicUser);

export const registerStudent = async ({ fullName, email, department, password }) => {
  if (!fullName.trim() || !email.trim() || !department || !password) {
    throw new Error("Complete all required fields.");
  }
  const normalizedEmail = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }
  validatePasswordStrength(password);
  const users = readUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account already exists for this email. Sign in instead or use password reset.");
  }

  const passwordSalt = makeSalt();
  const passwordHash = await derivePasswordHash(password, passwordSalt);
  const latestUsers = readUsers();
  if (latestUsers.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account already exists for this email. Sign in instead or use password reset.");
  }

  const user = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    studentId: makeStudentId(latestUsers),
    department,
    passwordHash,
    passwordSalt,
    passwordAlgorithm: "PBKDF2-SHA-256",
    passwordIterations: PASSWORD_ITERATIONS,
    role: "student",
    registrationDate: new Date().toISOString(),
  };
  saveUsers([...latestUsers, user]);
  return makePublicUser(user);
};

const hashesMatch = (actual, expected) => {
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
};

export const authenticateUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = readUsers().find((savedUser) => savedUser.email === normalizedEmail);
  if (!user || typeof user.passwordSalt !== "string" || typeof user.passwordHash !== "string") {
    throw new Error("Email or password is incorrect.");
  }
  const hash = await derivePasswordHash(password, user.passwordSalt, user.passwordIterations || PASSWORD_ITERATIONS);
  if (!hashesMatch(hash, user.passwordHash)) {
    throw new Error("Email or password is incorrect.");
  }
  saveSession(USER_SESSION_KEY, user.id);
  return makePublicUser(user);
};

export const resetLocalPassword = async ({ email, password }) => {
  validatePasswordStrength(password);
  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();
  const userIndex = users.findIndex((savedUser) => savedUser.email === normalizedEmail);
  if (userIndex < 0) throw new Error("No local account was found for this email.");
  const passwordSalt = makeSalt();
  const passwordHash = await derivePasswordHash(password, passwordSalt);
  const latestUsers = readUsers();
  const latestIndex = latestUsers.findIndex((savedUser) => savedUser.email === normalizedEmail);
  if (latestIndex < 0) throw new Error("The local account is no longer available.");
  latestUsers[latestIndex] = {
    ...latestUsers[latestIndex],
    passwordSalt,
    passwordHash,
    passwordAlgorithm: "PBKDF2-SHA-256",
    passwordIterations: PASSWORD_ITERATIONS,
  };
  saveUsers(latestUsers);
};

export const signOutUser = () => {
  clearStoredSession(USER_SESSION_KEY, LEGACY_SESSION_KEY);
};

export const updateLocalProfile = (userId, fullName) => {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index < 0) throw new Error("Your local account could not be found.");
  users[index] = { ...users[index], fullName: fullName.trim() };
  saveUsers(users);
  return makePublicUser(users[index]);
};
