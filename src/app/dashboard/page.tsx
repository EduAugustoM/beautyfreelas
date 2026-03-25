"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { getServicesByProfessional, getUpcomingAppointments, getProfessionalById } from "@/lib/db";
import type { BeautyService, Appointment, Professional } from "@/lib/db";
import { Users, Calendar, Scissors, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<BeautyService[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONFIRMED" | "CANCELLED" | "COMPLETED">("ALL");

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const [servicesData, appointmentsData, profData] = await Promise.all([
            getServicesByProfessional(user.uid),
            getUpcomingAppointments(user.uid),
            getProfessionalById(user.uid),
          ]);
          setServices(servicesData);
          setAppointments(appointmentsData);
          setProfessional(profData);
        } catch (error) {
          console.error("[dashboard] Failed to load data:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user]);

  const uniqueClients = useMemo(() => {
    const names = appointments.map(a => a.guestClient?.name).filter(Boolean);
    return [...new Set(names)].length;
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (filterStatus === "ALL") return appointments;
    return appointments.filter(app => app.status === filterStatus);
  }, [appointments, filterStatus]);

  const occupancyRate = useMemo(() => {
    if (!professional || !professional.workingDays || !professional.workingHours) return "—";
    
    const numWorkingDays = professional.workingDays.length;
    if (numWorkingDays === 0) return "0%"; 
    
    const [startH, startM] = professional.workingHours.start.split(":").map(Number);
    const [endH, endM] = professional.workingHours.end.split(":").map(Number);
    const dailyMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    
    if (dailyMinutes <= 0) return "0%"; 
    const weeklyAvailableMinutes = dailyMinutes * numWorkingDays;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    
    let weeklyBookedMinutes = 0;
    appointments.forEach(app => {
      const appDate = new Date(app.date + "T00:00:00");
      if (appDate >= today && appDate < in7Days && app.status !== "CANCELLED") {
         const service = services.find(s => s.id === app.serviceId);
         if (service) {
           weeklyBookedMinutes += service.durationMinutes;
         }
      }
    });
    
    const rate = (weeklyBookedMinutes / weeklyAvailableMinutes) * 100;
    return `${Math.min(100, Math.round(rate))}%`;
  }, [appointments, professional, services]);

  const stats = useMemo(() => {
    return [
      {
        title: "Agendamentos",
        value: appointments.length,
        icon: Calendar,
        color: "text-blue-500",
        bg: "bg-blue-50",
        delay: "animate-delay-100"
      },
      {
        title: "Serviços",
        value: services.length,
        icon: Scissors,
        color: "text-rose-500",
        bg: "bg-rose-50",
        delay: "animate-delay-200"
      },
      {
        title: "Clientes",
        value: uniqueClients,
        icon: Users,
        color: "text-green-500",
        bg: "bg-green-50",
        delay: "animate-delay-300"
      },
      {
        title: "Ocupação",
        value: occupancyRate,
        icon: TrendingUp,
        color: "text-purple-500",
        bg: "bg-purple-50",
        delay: "animate-delay-400"
      },
    ];
  }, [appointments, services, uniqueClients, occupancyRate]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-10 w-64 bg-white/20 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/20 rounded-3xl" />)}
        </div>
        <div className="h-96 bg-white/20 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="animate-slide-up">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Olá, {user?.displayName?.split(" ")[0] || "Profissional"} 👋
        </h1>
        <p className="text-neutral-500 font-medium">Aqui está o resumo do seu dia.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`glass p-6 rounded-3xl animate-slide-up ${stat.delay} group hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total</span>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-neutral-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <section className="animate-slide-up animate-delay-500">
        <div className="glass-strong rounded-[2.5rem] overflow-hidden border border-white/40 shadow-glass">
          <div className="p-8 border-b border-white/20 flex items-center justify-between bg-white/30">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Agendamentos Recentes</h2>
              <p className="text-sm text-neutral-500 font-medium">Seus atendimentos na plataforma</p>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-xs font-bold uppercase tracking-widest text-neutral-600 bg-white/50 border border-white/20 rounded-xl px-4 py-2 cursor-pointer outline-none hover:bg-white transition-colors"
            >
              <option value="ALL">Todos os status</option>
              <option value="CONFIRMED">Confirmados</option>
              <option value="COMPLETED">Concluídos</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>

          <div className="p-4">
            {filteredAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Cliente</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Serviço</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Data & Hora</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredAppointments.map((app, i) => (
                      <tr key={i} className="group hover:bg-white/40 transition-colors">
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-bold text-sm">{app.guestClient?.name || "—"}</p>
                            <p className="text-xs text-neutral-400">{app.guestClient?.phone || ""}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-tighter">
                            {services.find(s => s.id === app.serviceId)?.name || "Serviço"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold">{app.date.split("-").reverse().join("-")}</p>
                          <p className="text-xs text-neutral-500 font-medium">{app.startTime} - {app.endTime}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            app.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                            app.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              app.status === "CONFIRMED" ? "bg-green-500" :
                              app.status === "CANCELLED" ? "bg-red-500" :
                              "bg-blue-500"
                            }`} />
                            {app.status === "CONFIRMED" ? "Confirmado" :
                             app.status === "CANCELLED" ? "Cancelado" :
                             "Concluído"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-neutral-300" />
                </div>
                <p className="text-neutral-500 font-medium">Nenhum agendamento encontrado.</p>
                <p className="text-sm text-neutral-400">Quando seus clientes agendarem ou o status mudar, eles aparecerão aqui.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
