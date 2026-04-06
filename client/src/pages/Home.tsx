import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, Phone, Mail, Utensils, Wine } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: reviews } = trpc.reviews.list.useQuery();
  const { data: hours } = trpc.hours.list.useQuery();
  const { data: menuItems } = trpc.menu.list.useQuery();

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const today = new Date().getDay();
  const todayHours = hours?.find(h => h.dayOfWeek === today);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wine className="w-8 h-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">NKC Night</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#menu" className="text-slate-300 hover:text-white transition">Menu</Link>
            <Link href="#reservations" className="text-slate-300 hover:text-white transition">Réservations</Link>
            <Link href="#reviews" className="text-slate-300 hover:text-white transition">Avis</Link>
            {isAuthenticated ? (
              <Link href="/admin" className="text-slate-300 hover:text-white transition">Admin</Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Bienvenue à NKC Night
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Découvrez une expérience gastronomique unique dans une ambiance premium avec piscine
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="#reservations">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                Réserver une Table
              </Button>
            </Link>
            <Link href="#menu">
              <Button size="lg" variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">
                Voir le Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Hours */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader>
                <Clock className="w-6 h-6 text-amber-500 mb-2" />
                <CardTitle className="text-white">Horaires</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                {todayHours ? (
                  <div>
                    <p className="font-semibold text-white">{dayNames[today]}</p>
                    {todayHours.isClosed ? (
                      <p>Fermé</p>
                    ) : (
                      <p>{todayHours.openTime} - {todayHours.closeTime}</p>
                    )}
                  </div>
                ) : (
                  <p>Horaires non disponibles</p>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader>
                <Phone className="w-6 h-6 text-amber-500 mb-2" />
                <CardTitle className="text-white">Contact</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-2">
                  <a href="tel:+22243207257" className="text-amber-400 hover:text-amber-300">
                    WhatsApp: +222 43 20 72 57
                  </a>
                </p>
                <p>
                  <a href="mailto:rimoraweb@gmail.com" className="text-amber-400 hover:text-amber-300">
                    rimoraweb@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader>
                <Star className="w-6 h-6 text-amber-500 mb-2" />
                <CardTitle className="text-white">Évaluations</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-amber-400">{avgRating}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2">({reviews?.length || 0} avis)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section id="menu" className="py-16 md:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-white mb-12 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-amber-500" />
            Notre Menu
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems?.slice(0, 6).map((item) => (
              <Card key={item.id} className="bg-slate-900/50 border-slate-800 hover:border-amber-500/50 transition overflow-hidden group">
                {item.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-amber-500/20 to-purple-500/20 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.nameFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-white">{item.nameFr}</CardTitle>
                  <CardDescription className="text-amber-400">{item.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">{item.descriptionFr}</p>
                  <p className="text-amber-400 font-bold text-lg">{(item.price / 100).toFixed(2)} MRU</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/menu">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
                Voir le Menu Complet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-white mb-12">Avis Clients</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews?.slice(0, 6).map((review) => (
              <Card key={review.id} className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{review.authorName}</CardTitle>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="reservations" className="py-16 md:py-24 bg-gradient-to-r from-amber-500/10 to-purple-500/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Prêt à nous rejoindre ?</h3>
          <p className="text-xl text-slate-300 mb-8">Réservez votre table dès maintenant pour une soirée inoubliable</p>
          <Link href="/reservations">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              Réserver Maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2026 NKC Night - Nouakchott. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
