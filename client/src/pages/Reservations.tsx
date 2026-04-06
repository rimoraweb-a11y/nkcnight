import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Users, Phone } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Reservations() {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfPeople: 1,
    reservationDate: "",
    reservationTime: "19:00",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createReservation = trpc.reservations.create.useMutation({
    onSuccess: () => {
      setSuccessMessage("Votre réservation a été créée avec succès!");
      setErrorMessage("");
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        numberOfPeople: 1,
        reservationDate: "",
        reservationTime: "19:00",
        specialRequests: "",
      });
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Une erreur est survenue");
      setSuccessMessage("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createReservation.mutateAsync({
        ...formData,
        numberOfPeople: parseInt(formData.numberOfPeople.toString()),
        reservationDate: new Date(formData.reservationDate),
      });
    } catch (error) {
      console.error("Reservation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            Réserver une Table
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Formulaire de Réservation</CardTitle>
              <CardDescription className="text-slate-400">
                Remplissez le formulaire ci-dessous pour réserver votre table
              </CardDescription>
            </CardHeader>
            <CardContent>
              {successMessage && (
                <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
                  ✓ {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                  ✕ {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="guestName" className="text-slate-300">
                    Nom Complet *
                  </Label>
                  <Input
                    id="guestName"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="guestEmail" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="guestEmail"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="guestPhone" className="text-slate-300">
                    Téléphone
                  </Label>
                  <Input
                    id="guestPhone"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    placeholder="+222 XX XX XX XX"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Number of People */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfPeople" className="text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Nombre de Personnes *
                  </Label>
                  <Input
                    id="numberOfPeople"
                    name="numberOfPeople"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.numberOfPeople}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="reservationDate" className="text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de Réservation *
                  </Label>
                  <Input
                    id="reservationDate"
                    name="reservationDate"
                    type="date"
                    value={formData.reservationDate}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="reservationTime" className="text-slate-300">
                    Heure de Réservation *
                  </Label>
                  <Input
                    id="reservationTime"
                    name="reservationTime"
                    type="time"
                    value={formData.reservationTime}
                    onChange={handleChange}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="text-slate-300">
                    Demandes Spéciales
                  </Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Allergies, préférences, occasions spéciales..."
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || createReservation.isPending}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                >
                  {isSubmitting || createReservation.isPending ? "Envoi en cours..." : "Confirmer la Réservation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-slate-900/50 border-slate-800 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <a href="tel:+22243207257" className="text-amber-400 hover:text-amber-300">
                  WhatsApp: +222 43 20 72 57
                </a>
              </p>
              <p>
                Vous pouvez également nous contacter directement via WhatsApp pour des réservations urgentes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
