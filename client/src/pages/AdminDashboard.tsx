import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, X, Clock } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: reservations } = trpc.reservations.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });
  const { data: pendingReviews } = trpc.reviews.pending.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const updateReservationStatus = trpc.reservations.updateStatus.useMutation();
  const approveReview = trpc.reviews.approve.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Accès Admin Requis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">Vous devez être connecté pour accéder au dashboard admin.</p>
            <a href={getLoginUrl()}>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold">
                Se Connecter
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Accès Refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">Vous n'avez pas les permissions d'accéder au dashboard admin.</p>
            <Link href="/">
              <Button variant="outline" className="w-full border-amber-500 text-amber-400">
                Retour à l'Accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleReservationStatus = async (id: number, status: 'confirmed' | 'cancelled') => {
    try {
      await updateReservationStatus.mutateAsync({ id, status });
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleApproveReview = async (id: number) => {
    try {
      await approveReview.mutateAsync({ id });
    } catch (error) {
      console.error("Error approving review:", error);
    }
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
          <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
          <div className="text-slate-300 text-sm">{user?.name}</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-slate-800">
            <TabsTrigger
              value="reservations"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-slate-300"
            >
              Réservations ({reservations?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-slate-300"
            >
              Avis en Attente ({pendingReviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-4">
            {reservations && reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map(reservation => (
                  <Card key={reservation.id} className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{reservation.guestName}</CardTitle>
                          <CardDescription className="text-slate-400">
                            {reservation.numberOfPeople} personne(s) - {reservation.reservationDate?.toString().split('T')[0]} à {reservation.reservationTime}
                          </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                          reservation.status === 'confirmed'
                            ? 'bg-green-900/50 text-green-200'
                            : reservation.status === 'cancelled'
                            ? 'bg-red-900/50 text-red-200'
                            : 'bg-yellow-900/50 text-yellow-200'
                        }`}>
                          {reservation.status === 'pending' && <Clock className="w-4 h-4" />}
                          {reservation.status === 'confirmed' && <Check className="w-4 h-4" />}
                          {reservation.status === 'cancelled' && <X className="w-4 h-4" />}
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                        <div>
                          <p className="text-slate-400">Email</p>
                          <p>{reservation.guestEmail || 'Non fourni'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Téléphone</p>
                          <p>{reservation.guestPhone || 'Non fourni'}</p>
                        </div>
                      </div>
                      {reservation.specialRequests && (
                        <div className="text-sm text-slate-300">
                          <p className="text-slate-400">Demandes Spéciales</p>
                          <p>{reservation.specialRequests}</p>
                        </div>
                      )}
                      {reservation.status === 'pending' && (
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={() => handleReservationStatus(reservation.id, 'confirmed')}
                            disabled={updateReservationStatus.isPending}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            Confirmer
                          </Button>
                          <Button
                            onClick={() => handleReservationStatus(reservation.id, 'cancelled')}
                            disabled={updateReservationStatus.isPending}
                            variant="destructive"
                            className="flex-1"
                          >
                            Annuler
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="py-12 text-center text-slate-400">
                  Aucune réservation
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {pendingReviews && pendingReviews.length > 0 ? (
              <div className="space-y-4">
                {pendingReviews.map(review => (
                  <Card key={review.id} className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{review.authorName}</CardTitle>
                          <CardDescription className="text-slate-400">
                            {'⭐'.repeat(review.rating)} ({review.rating}/5)
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300">{review.comment}</p>
                      <Button
                        onClick={() => handleApproveReview(review.id)}
                        disabled={approveReview.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approuver
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="py-12 text-center text-slate-400">
                  Aucun avis en attente
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
