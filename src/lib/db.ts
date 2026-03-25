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
} from "firebase/firestore";

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
export const getProfessionalBySlug = async (
  slug: string
): Promise<Professional | null> => {
  try {
    const q = query(
      collection(db, "professionals"),
      where("slug", "==", slug)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Professional;
  } catch (error) {
    console.error("[db] getProfessionalBySlug failed:", error);
    return null;
  }
};

export const getAllProfessionals = async (): Promise<Professional[]> => {
  try {
    const snap = await getDocs(collection(db, "professionals"));
    return snap.docs.map((d) => d.data() as Professional);
  } catch (error) {
    console.error("[db] getAllProfessionals failed:", error);
    return [];
  }
};

export const getProfessionalById = async (
  uid: string
): Promise<Professional | null> => {
  try {
    const docRef = doc(db, "professionals", uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Professional) : null;
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
  } catch (error) {
    console.error("[db] saveProfessional failed:", error);
    throw error; // Re-throw so the UI can show an error toast
  }
};

// -- Services --
export const getServicesByProfessional = async (
  professionalId: string
): Promise<BeautyService[]> => {
  try {
    const q = query(
      collection(db, "services"),
      where("professionalId", "==", professionalId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BeautyService));
  } catch (error) {
    console.error("[db] getServicesByProfessional failed:", error);
    return [];
  }
};

export const addService = async (service: Omit<BeautyService, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "services"), service);
    return docRef.id;
  } catch (error) {
    console.error("[db] addService failed:", error);
    throw error; // Re-throw so the UI can show an error toast
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    const docRef = doc(db, "services", serviceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("[db] deleteService failed:", error);
    throw error;
  }
};

// -- Appointments --
export const getAppointmentsByDate = async (
  professionalId: string,
  date: string
): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, "appointments"),
      where("professionalId", "==", professionalId),
      where("date", "==", date)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
  } catch (error) {
    console.error("[db] getAppointmentsByDate failed:", error);
    return [];
  }
};

export const getUpcomingAppointments = async (
  professionalId: string
): Promise<Appointment[]> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const q = query(
      collection(db, "appointments"),
      where("professionalId", "==", professionalId),
      where("date", ">=", today),
      orderBy("date", "asc"),
      orderBy("startTime", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
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
    return docRef.id;
  } catch (error) {
    console.error("[db] createAppointment failed:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment["status"]
) => {
  try {
    const docRef = doc(db, "appointments", appointmentId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("[db] updateAppointmentStatus failed:", error);
    throw error;
  }
};
