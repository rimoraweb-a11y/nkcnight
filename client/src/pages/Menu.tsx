import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Utensils } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const CATEGORIES = ["Pâtes", "Desserts", "Milkshakes", "Boissons"];
const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("Pâtes");
  const [selectedLang, setSelectedLang] = useState("fr");
  const { data: allMenuItems } = trpc.menu.list.useQuery();

  const filteredItems = allMenuItems?.filter(item => item.category === selectedCategory) || [];

  const getItemName = (item: any) => {
    if (selectedLang === "fr") return item.nameFr;
    if (selectedLang === "ar") return item.nameAr;
    return item.nameEn;
  };

  const getItemDescription = (item: any) => {
    if (selectedLang === "fr") return item.descriptionFr;
    if (selectedLang === "ar") return item.descriptionAr;
    return "";
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
            <Utensils className="w-6 h-6 text-amber-500" />
            Notre Menu
          </h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Language Selector */}
        <div className="flex justify-center gap-2 mb-12">
          {LANGUAGES.map(lang => (
            <Button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              variant={selectedLang === lang.code ? "default" : "outline"}
              className={selectedLang === lang.code
                ? "bg-amber-500 hover:bg-amber-600 text-black"
                : "border-amber-500 text-amber-400 hover:bg-amber-500/10"
              }
            >
              {lang.flag} {lang.label}
            </Button>
          ))}
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
            {CATEGORIES.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-slate-300"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map(category => (
            <TabsContent key={category} value={category} className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <Card
                      key={item.id}
                      className="bg-slate-900/50 border-slate-800 hover:border-amber-500/50 transition overflow-hidden group"
                    >
                      {item.imageUrl && (
                        <div className="h-48 bg-gradient-to-br from-amber-500/20 to-purple-500/20 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={getItemName(item)}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-white">{getItemName(item)}</CardTitle>
                        <CardDescription className="text-amber-400">{category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm mb-4">{getItemDescription(item)}</p>
                        <p className="text-amber-400 font-bold text-lg">
                          {(item.price / 100).toFixed(2)} MRU
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-slate-400">Aucun plat disponible dans cette catégorie</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
