"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUpcomingAppointments, getServicesByProfessional, updateAppointmentStatus } from "@/lib/db";
import type { Appointment, BeautyService } from "@/lib/db";
import { Calendar, User, Clock, Scissors, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getProfessionalById, saveProfessional } from "@/lib/db";

export default function AgendaPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<BeautyService[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("18:00");
  const [serviceInterval, setServiceInterval] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const [appsData, rawServices, professional] = await Promise.all([
            getUpcomingAppointments(user.uid),
            getServicesByProfessional(user.uid),
            getProfessionalById(user.uid)
          ]);
          setAppointments(appsData);
          setServices(rawServices);
          if (professional) {
            if (professional.workingDays) setWorkingDays(professional.workingDays);
            if (professional.workingHours) {
              setStartHour(professional.workingHours.start);
              setEndHour(professional.workingHours.end);
            }
            if (professional.serviceInterval !== undefined) setServiceInterval(professional.serviceInterval);
          }
        } catch (error) {
          console.error("[agenda] Failed to load agenda data:", error);
          toast.error("Erro ao carregar a agenda.");
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await saveProfessional(user.uid, {
        workingDays,
        workingHours: { start: startHour, end: endHour },
        serviceInterval
      });
      setIsConfigOpen(false);
      toast.success("Configurações atualizadas!");
    } catch {
      toast.error("Erro ao salvar opções.");
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => 
        prev.map(app => app.id === appointmentId ? { ...app, status: newStatus } : app)
      );
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
       toast.error("Erro ao atualizar status.");
    }
  };

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || "Serviço Desconhecido";
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 w-48 bg-white/20 rounded-xl" />
        <div className="h-[60vh] bg-white/20 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Sua Agenda</h1>
          <p className="text-neutral-500 font-medium">Veja todos os seus agendamentos futuros confirmados e gerencie seu tempo.</p>
        </div>
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger render={<button type="button" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-neutral-50 transition-colors" />}>
            <Calendar className="h-6 w-6 text-black" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] glass-modal rounded-3xl border-white/80 shadow-glass">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Horário de Trabalho</DialogTitle>
              <DialogDescription className="text-neutral-500">
                Configure os dias da semana e a janela de horários em que você atende.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveConfig} className="space-y-6 mt-4">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Dias da Semana</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 0, label: "Dom" },
                    { id: 1, label: "Seg" },
                    { id: 2, label: "Ter" },
                    { id: 3, label: "Qua" },
                    { id: 4, label: "Qui" },
                    { id: 5, label: "Sex" },
                    { id: 6, label: "Sáb" }
                  ].map(day => {
                    const isSelected = workingDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => {
                          setWorkingDays(prev => 
                            isSelected ? prev.filter(d => d !== day.id) : [...prev, day.id].sort()
                          );
                        }}
                        className={`w-12 h-12 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isSelected ? "bg-black text-white shadow-button scale-105" : "bg-white/50 text-neutral-500 hover:bg-white"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startHour" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Início</Label>
                  <input
                    id="startHour"
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    required
                    className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endHour" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Fim</Label>
                  <input
                    id="endHour"
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    required
                    className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceInterval" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Intervalo entre atendimentos (minutos)</Label>
                <input
                  id="serviceInterval"
                  type="number"
                  min="0"
                  step="5"
                  value={serviceInterval}
                  onChange={(e) => setServiceInterval(Number(e.target.value))}
                  className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder="Ex: 15"
                />
              </div>

              <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold">
                Salvar Configurações
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <section className="animate-slide-up animate-delay-200">
        <div className="glass-strong rounded-[2.5rem] overflow-hidden border border-white/40 shadow-glass">
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/30 border-b border-white/20">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Serviço & Horário</th>
                    <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {appointments.map((app, idx) => (
                    <tr key={app.id || idx} className="group hover:bg-white/40 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-neutral-400" />
                          </div>
                          <div>
                            <p className="font-bold text-base text-neutral-900">{app.guestClient?.name || "Cliente"}</p>
                            {app.guestClient?.email && (
                              <p className="text-xs text-neutral-500">{app.guestClient.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-neutral-400" />
                            <span className="font-bold text-sm tracking-tight">{getServiceName(app.serviceId)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-neutral-100/50 w-max px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3" />
                            {app.date ? format(new Date(app.date + "T00:00:00"), "dd 'de' MMM", { locale: ptBR }) : ""} • {app.startTime} - {app.endTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
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
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {app.status === "CONFIRMED" && (
                             <>
                                <button 
                                  onClick={() => handleStatusUpdate(app.id!, "COMPLETED")}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                  title="Marcar como Concluído"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(app.id!, "CANCELLED")}
                                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                  title="Cancelar Agendamento"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                             </>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white/50 border border-white flex items-center justify-center mb-6 shadow-sm">
                <Calendar className="h-10 w-10 text-neutral-300" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">Sem agendamentos no momento</h3>
              <p className="text-neutral-500 max-w-sm font-medium">Sua agenda está livre. Quando os clientes marcarem horários, eles aparecerão detalhadamente aqui.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
