"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getServicesByProfessional, addService, deleteService } from "@/lib/db";
import type { BeautyService } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Trash2, Scissors, Clock, DollarSign, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<BeautyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New service form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    async function loadServices() {
      if (user) {
        try {
          const data = await getServicesByProfessional(user.uid);
          setServices(data);
        } catch (error) {
          console.error("[services] Failed to load services:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadServices();
  }, [user]);

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // --- Input validation [A-03] ---
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      toast.error("Nome do serviço deve ter entre 2 e 100 caracteres.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 10_000) {
      toast.error("Preço inválido. Deve ser entre R$ 0,01 e R$ 10.000,00.");
      return;
    }
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration < 5 || parsedDuration > 480) {
      toast.error("Duração inválida. Deve ser entre 5 e 480 minutos.");
      return;
    }

    try {
      await addService({
        professionalId: user.uid,
        name: trimmedName,
        price: parsedPrice,
        durationMinutes: parsedDuration,
      });
      
      const updated = await getServicesByProfessional(user.uid);
      setServices(updated);
      setIsDialogOpen(false);
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");
      toast.success("Serviço adicionado com sucesso!");
    } catch (error) {
      console.error("[services] Failed to add:", error);
      toast.error("Erro ao adicionar serviço.");
    }
  }


  async function handleDelete(id: string) {
    if (!user || !confirm("Deseja realmente excluir este serviço?")) return;

    try {
      await deleteService(id, user.uid);

      setServices(services.filter((s) => s.id !== id));
      toast.success("Serviço removido.");
    } catch (error) {
      console.error("[services] Failed to delete:", error);
      toast.error("Erro ao remover serviço.");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Seus Serviços</h1>
          <p className="text-neutral-500 font-medium">Gerencie o que você oferece aos seus clientes.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<button type="button" className="btn-primary flex items-center justify-center gap-2 px-6 py-4 text-sm rounded-2xl w-full sm:w-auto cursor-pointer" />}>
            <Plus className="h-5 w-5" />
            Adicionar Novo Serviço
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass-modal rounded-3xl border-white/80 shadow-glass">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Novo Serviço</DialogTitle>
              <DialogDescription className="text-neutral-500">
                Preencha os detalhes do serviço que você deseja oferecer.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Nome do Serviço</Label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Corte de Cabelo Masculino"
                  required
                  className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Preço (R$)</Label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Duração (minutos)</Label>
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    required
                    className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Descrição</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que está incluso..."
                  className="w-full bg-white/50 border-white/20 rounded-xl px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300 resize-none"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold">
                Publicar Serviço
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/20 rounded-3xl" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="glass p-8 rounded-[2rem] flex flex-col group hover:scale-[1.02] transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                  <Scissors className="h-6 w-6 text-black" />
                </div>
                <button
                  onClick={() => handleDelete(service.id!)}
                  className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold tracking-tight mb-2">{service.name}</h3>
              <p className="text-sm text-neutral-400 font-medium mb-6 line-clamp-2 flex-grow">
                {service.name}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-black/5 mt-auto">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter bg-neutral-100 px-3 py-1.5 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  {service.durationMinutes} min
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black bg-black text-white px-4 py-1.5 rounded-full shadow-button">
                  <span className="text-[10px] opacity-70">R$</span>
                  <span className="text-sm">{service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-strong py-20 rounded-[2.5rem] flex flex-col items-center justify-center text-center animate-fade-in border border-white/20">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <Sparkles className="h-10 w-10 text-neutral-300" />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2">Comece Adicionando Serviços</h3>
          <p className="text-neutral-500 max-w-sm font-medium">
            Você ainda não cadastrou nenhum serviço. Adicione seu primeiro serviço para que as pessoas possam agendar com você.
          </p>
        </div>
      )}
    </div>
  );
}
