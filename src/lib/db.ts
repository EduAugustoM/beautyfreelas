import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { cacheGet, cacheSet, cacheInvalidate } from "./cache";

export interface Professional {
  uid: string;
  slug: string;
  name: string;
  description: string;
  photoUrl?: string;
  phone?: string;
  workingDays?: number[];
  workingHours?: { start: string; end: string };
  serviceInterval?: number;
}

export interface BeautyService {
  id: string;
  professionalId: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  professionalId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  guestClient: {
    name: string;
    phone: string;
    email?: string;
  };
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

// -- Professionals --

/**
 * Cached: public profile by slug.
 * TTL 5 min — profile data changes rarely.
 */
export const getProfessionalBySlug = async (
  slug: string
): Promise<Professional | null> => {
  const cacheKey = `prof:slug:${slug}`;
  const cached = cacheGet<Professional>(cacheKey);
  if (cached) return cached;

  try {
    const q = query(
      collection(db, "professionals"),
      where("slug", "==", slug),
      limit(1) // optimisation: stop after first match
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data() as Professional;
    cacheSet(cacheKey, data, 300); // 5 minutes
    return data;
  } catch (error) {
    console.error("[db] getProfessionalBySlug failed:", error);
    return null;
  }
};

/**
 * Cached: explore page list.
 * TTL 2 min with a limit to avoid reading entire collection.
 */
export const getAllProfessionals = async (): Promise<Professional[]> => {
  const cacheKey = "prof:all";
  const cached = cacheGet<Professional[]>(cacheKey);
  if (cached) return cached;

  try {
    const q = query(collection(db, "professionals"), limit(100));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => d.data() as Professional);
    cacheSet(cacheKey, data, 120); // 2 minutes
    return data;
  } catch (error) {
    console.error("[db] getAllProfessionals failed:", error);
    return [];
  }
};

/**
 * Cached: professional by UID (dashboard).
 * TTL 5 min.
 */
export const getProfessionalById = async (
  uid: string
): Promise<Professional | null> => {
  const cacheKey = `prof:id:${uid}`;
  const cached = cacheGet<Professional>(cacheKey);
  if (cached) return cached;

  try {
    const docRef = doc(db, "professionals", uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data() as Professional;
    cacheSet(cacheKey, data, 300);
    return data;
  } catch (error) {
    console.error("[db] getProfessionalById failed:", error);
    return null;
  }
};

export const saveProfessional = async (
  uid: string,
  data: Partial<Professional>
) => {
  try {
    const docRef = doc(db, "professionals", uid);
    await setDoc(docRef, data, { merge: true });
    // Invalidate all caches for this professional
    cacheInvalidate(`prof:id:${uid}`);
    cacheInvalidate("prof:all");
    if (data.slug) cacheInvalidate(`prof:slug:${data.slug}`);
  } catch (error) {
    console.error("[db] saveProfessional failed:", error);
    throw error;
  }
};

// -- Services --

/**
 * Cached: services list per professional.
 * TTL 5 min.
 */
export const getServicesByProfessional = async (
  professionalId: string
): Promise<BeautyService[]> => {
  const cacheKey = `services:${professionalId}`;
  const cached = cacheGet<BeautyService[]>(cacheKey);
  if (cached) return cached;

  try {
    const q = query(
      collection(db, "services"),
      where("professionalId", "==", professionalId)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BeautyService));
    cacheSet(cacheKey, data, 300);
    return data;
  } catch (error) {
    console.error("[db] getServicesByProfessional failed:", error);
    return [];
  }
};

export const addService = async (service: Omit<BeautyService, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "services"), service);
    cacheInvalidate(`services:${service.professionalId}`);
    return docRef.id;
  } catch (error) {
    console.error("[db] addService failed:", error);
    throw error;
  }
};

export const deleteService = async (serviceId: string, professionalId: string) => {
  try {
    const docRef = doc(db, "services", serviceId);
    await deleteDoc(docRef);
    cacheInvalidate(`services:${professionalId}`);
  } catch (error) {
    console.error("[db] deleteService failed:", error);
    throw error;
  }
};

// -- Appointments --

/**
 * Appointments for a specific date (booking conflict check).
 * Short TTL: 30s — this data must be fresh to prevent double-bookings.
 */
export const getAppointmentsByDate = async (
  professionalId: string,
  date: string
): Promise<Appointment[]> => {
  const cacheKey = `appts:${professionalId}:${date}`;
  const cached = cacheGet<Appointment[]>(cacheKey);
  if (cached) return cached;

  try {
    const q = query(
      collection(db, "appointments"),
      where("professionalId", "==", professionalId),
      where("date", "==", date)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
    cacheSet(cacheKey, data, 30); // 30s only — conflict-critical
    return data;
  } catch (error) {
    console.error("[db] getAppointmentsByDate failed:", error);
    return [];
  }
};

/**
 * Upcoming appointments for dashboard.
 * Limit to 50 most recent; TTL 60s.
 */
export const getUpcomingAppointments = async (
  professionalId: string
): Promise<Appointment[]> => {
  const cacheKey = `appts:upcoming:${professionalId}`;
  const cached = cacheGet<Appointment[]>(cacheKey);
  if (cached) return cached;

  try {
    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "appointments"),
      where("professionalId", "==", professionalId),
      where("date", ">=", today),
      orderBy("date", "asc"),
      orderBy("startTime", "asc"),
      limit(50) // prevent fetching unlimited documents
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
    cacheSet(cacheKey, data, 60);
    return data;
  } catch (error) {
    console.error("[db] getUpcomingAppointments failed:", error);
    return [];
  }
};

export const createAppointment = async (
  appointment: Omit<Appointment, "id">
) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), appointment);
    // Invalidate date-specific and upcoming caches
    cacheInvalidate(`appts:${appointment.professionalId}:${appointment.date}`);
    cacheInvalidate(`appts:upcoming:${appointment.professionalId}`);
    return docRef.id;
  } catch (error) {
    console.error("[db] createAppointment failed:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment["status"],
  professionalId?: string
) => {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await updateDoc(docRef, { status });
    // Invalidate upcoming cache so dashboard refreshes
    if (professionalId) {
      cacheInvalidate(`appts:upcoming:${professionalId}`);
    }
  } catch (error) {
    console.error("[db] updateAppointmentStatus failed:", error);
    throw error;
  }
};
