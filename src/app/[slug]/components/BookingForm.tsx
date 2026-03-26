"use client";

import { useEffect, useState, useMemo } from "react";
import { getServicesByProfessional, createAppointment, getAppointmentsByDate } from "@/lib/db";
import type { BeautyService, Professional, Appointment } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Phone, 
  Scissors, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface BookingFormProps {
  professional: Professional;
}

type Step = "service" | "date" | "customer" | "success";

export default function BookingForm({ professional }: BookingFormProps) {
  const [step, setStep] = useState<Step>("service");
  const [services, setServices] = useState<BeautyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateAppointments, setDateAppointments] = useState<Appointment[]>([]);

  // Selection state
  const [selectedService, setSelectedService] = useState<BeautyService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Customer state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Input helpers — [A-02, A-04]
  const PHONE_REGEX = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
  const sanitize = (str: string, maxLen = 100) => str.trimStart().slice(0, maxLen);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getServicesByProfessional(professional.uid);
        setServices(data);
      } catch (error) {
        console.error("[booking] Error loading services:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [professional.uid]);

  useEffect(() => {
    async function fetchAppointments() {
      if (selectedDate) {
        const dStr = format(selectedDate, "yyyy-MM-dd");
        const apps = await getAppointmentsByDate(professional.uid, dStr);
        setDateAppointments(apps.filter(app => app.status !== "CANCELLED"));
        setSelectedTime(null);
      }
    }
    fetchAppointments();
  }, [selectedDate, professional.uid]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedService || !selectedDate || !professional.workingHours) return [];
    
    const { start, end } = professional.workingHours;
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    
    let currentMinutes = startH * 60 + startM;
    const finalMinutes = endH * 60 + endM;
    const duration = selectedService.durationMinutes;
    const gap = professional.serviceInterval || 0;

    const slots: string[] = [];

    const isConflict = (proposedStart: number, proposedEnd: number) => {
      return dateAppointments.some(app => {
        const [aStartH, aStartM] = app.startTime.split(":").map(Number);
        const [aEndH, aEndM] = app.endTime.split(":").map(Number);
        const appStart = aStartH * 60 + aStartM;
        const appEnd = aEndH * 60 + aEndM;
        
        // Conflict occurs if strict overlap (including the gap required after an appointment)
        const appEndWithGap = appEnd + gap;
        const proposedEndWithGap = proposedEnd + gap;

        return (proposedStart < appEndWithGap) && (proposedEndWithGap > appStart);
      });
    };

    while (currentMinutes + duration <= finalMinutes) {
      const pStart = currentMinutes;
      const pEnd = currentMinutes + duration;
      
      if (!isConflict(pStart, pEnd)) {
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
      currentMinutes += 15; // 15 min increments
    }
    
    return slots;
  }, [selectedService, selectedDate, dateAppointments, professional]);

  async function handleCompleteBooking() {
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerPhone) return;

    // --- Input validation [A-02] ---
    if (customerName.trim().length < 2) {
      toast.error("Por favor, informe seu nome completo (mínimo 2 caracteres).");
      return;
    }
    if (!PHONE_REGEX.test(customerPhone.replace(/\s/g, ""))) {
      toast.error("Telefone inválido. Use o formato (11) 98765-4321.");
      return;
    }

    // --- Basic rate limiting [A-04] — 1 booking per professional per 60s ---
    const BOOKING_KEY = `bf_booked_${professional.uid}`;
    const lastBooking = sessionStorage.getItem(BOOKING_KEY);
    if (lastBooking && Date.now() - Number(lastBooking) < 60_000) {
      toast.error("Aguarde 1 minuto antes de fazer outro agendamento.");
      return;
    }

    setSubmitting(true);
    try {
      const [sh, sm] = selectedTime.split(":").map(Number);
      const totalEndMin = (sh * 60 + sm) + selectedService.durationMinutes;
      const endH = Math.floor(totalEndMin / 60);
      const endM = totalEndMin % 60;
      const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

      await createAppointment({
        professionalId: professional.uid,
        serviceId: selectedService.id!,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedTime,
        endTime,
        guestClient: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
        },
        status: "CONFIRMED",
      });
      // Mark booking time for rate limiting
      sessionStorage.setItem(`bf_booked_${professional.uid}`, String(Date.now()));
      setStep("success");
      toast.success("Agendamento realizado com sucesso!");
    } catch (error) {
      console.error("[booking] Final error:", error);
      toast.error("Erro ao finalizar agendamento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="h-96 flex items-center justify-center animate-pulse text-neutral-400 font-bold uppercase tracking-widest text-xs">Preparando Experiência...</div>;
  }

  // --- RENDERING HELPERS ---

  const StepHeader = ({ title, description }: { title: string, description: string }) => (
    <div className="mb-10 text-center animate-slide-up">
      <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">{title}</h2>
      <p className="text-sm text-neutral-500 font-medium">{description}</p>
    </div>
  );

  const ProgressIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-12">
      {[
        { id: "service", icon: Scissors },
        { id: "date", icon: CalendarIcon },
        { id: "customer", icon: User }
      ].map((s, idx) => {
        const isPast = ["service", "date", "customer"].indexOf(step) > ["service", "date", "customer"].indexOf(s.id as Step);
        const isActive = step === s.id;
        
        return (
          <div key={s.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isActive ? "bg-black text-white shadow-button scale-110" : 
              isPast ? "bg-green-500 text-white" : "bg-white/50 text-neutral-400"
            }`}>
              {isPast ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
            </div>
            {idx < 2 && (
              <div className={`w-8 h-[2px] mx-2 rounded-full transition-colors duration-500 ${
                isPast ? "bg-green-500" : "bg-white/30"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // --- STEPS ---

  if (step === "service") {
    return (
      <div className="p-4 md:p-8">
        <ProgressIndicator />
        <StepHeader title="Escolha o Serviço" description="Selecione um dos nossos serviços especializados." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up animate-delay-200">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setStep("date");
              }}
              className="glass p-6 text-left rounded-3xl group hover:border-black/10 transition-all duration-500 hover:scale-[1.02] border border-white/20 shadow-sm hover:shadow-card hover:bg-white/60"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-neutral-100/50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-white">
                  <Scissors className="h-5 w-5 text-black" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Investimento</p>
                  <p className="text-lg font-black">R$ {service.price.toFixed(2)}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">{service.name}</h3>
              <p className="text-xs font-semibold opacity-60 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {service.durationMinutes} minutos
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "date") {
    return (
      <div className="p-4 md:p-8 animate-fade-in">
        <ProgressIndicator />
        <StepHeader title="Data e Hora" description={`Agendando: ${selectedService?.name}`} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 max-w-3xl mx-auto items-start">
          <div className="flex justify-center md:justify-end">
            <div className="bg-white/40 p-4 sm:p-6 rounded-[2.5rem] border border-white/40 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-3xl border-none scale-105 sm:scale-110 md:scale-125 origin-center m-2 sm:m-6"
                disabled={(date) => {
                  if (date < new Date(new Date().setHours(0,0,0,0))) return true;
                  if (professional.workingDays && !professional.workingDays.includes(date.getDay())) return true;
                  return false;
                }}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Horários Disponíveis</p>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 ${availableTimeSlots.length === 0 ? "opacity-50" : ""}`}>
              {availableTimeSlots.length > 0 ? availableTimeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    selectedTime === t 
                    ? "bg-black text-white shadow-button scale-105" 
                    : "bg-white/50 text-neutral-600 hover:bg-white shadow-sm"
                  }`}
                >
                  {t}
                </button>
              )) : (
                <div className="col-span-full text-center text-sm font-semibold text-neutral-400 py-4">
                  Nenhum horário disponível para esta data.
                </div>
              )}
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                onClick={() => setStep("service")}
                className="p-4 rounded-2xl bg-white/40 text-neutral-500 hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep("customer")}
                className="btn-primary flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo Passo
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "customer") {
    return (
      <div className="p-4 md:p-8 animate-fade-in">
        <ProgressIndicator />
        <StepHeader title="Seus Dados" description="Quase lá! Só precisamos de algumas informações." />
        
        <div className="max-w-xl mx-auto glass p-8 md:p-10 rounded-[2.5rem] border border-white/40 shadow-glass">
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <User className="h-3 w-3" /> Seu Nome Completo
              </Label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(sanitize(e.target.value))}
                placeholder="Ex: Maria Oliveira"
                maxLength={100}
                autoComplete="name"
                className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-4 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <Phone className="h-3 w-3" /> Celular ou WhatsApp para Confirmação
              </Label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(sanitize(e.target.value, 20))}
                placeholder="(11) 98765-4321"
                maxLength={20}
                autoComplete="tel"
                pattern="[0-9\s\-\(\)]+"
                className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-4 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 font-semibold"
              />
            </div>

            <div className="pt-4 p-6 bg-black/5 rounded-3xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 font-medium">Serviço:</span>
                <span className="font-bold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 font-medium">Data:</span>
                <span className="font-bold">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""} às {selectedTime}</span>
              </div>
              <div className="flex justify-between text-lg border-t border-black/5 pt-3">
                <span className="font-black opacity-40 uppercase text-xs self-center">Valor Total</span>
                <span className="font-black text-rose-500">R$ {selectedService?.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep("date")}
                className="p-4 rounded-2xl bg-black/5 text-neutral-500 hover:bg-black/10 transition-all font-bold"
              >
                Voltar
              </button>
              <button
                disabled={submitting || !customerName || !customerPhone}
                onClick={handleCompleteBooking}
                className="btn-primary flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold"
              >
                {submitting ? "Finalizando..." : "Confirmar Agendamento"}
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="p-12 md:p-20 text-center animate-slide-up">
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-button animate-bounce">
          <Check className="h-12 w-12" />
        </div>
        <h2 className="text-4xl font-black tracking-tight mb-4">Tudo Certo!</h2>
        <p className="text-lg text-neutral-500 font-medium max-w-md mx-auto mb-12">
          Seu agendamento com <span className="text-black font-bold">{professional.name}</span> foi confirmado. Entraremos em contato no WhatsApp informado em breve.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setStep("service")}
            className="px-8 py-4 rounded-2xl bg-white text-black border border-neutral-200 font-bold hover:bg-neutral-50 transition-all shadow-sm"
          >
            Fazer outro agendamento
          </button>
          <button 
            className="btn-primary px-8 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold"
            onClick={() => window.location.href = "/"}
          >
            Voltar ao Início
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
