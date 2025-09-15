"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Receita = {
  id: number;
  nome: string;
  descricao: string;
  ingredientes: string[];
  modoPreparo: string;
};

async function buscarReceitasDummy(): Promise<Receita[]> {
  // Usando produtos como "receitas" para exemplo
  const res = await fetch("https://dummyjson.com/products?limit=6");
  const data = await res.json();
  return data.products.map((p: {
    id: number;
    title: string;
    description: string;
    brand: string;
    category: string;
    price: number;
  }) => ({
    id: p.id,
    nome: p.title,
    descricao: p.description,
    ingredientes: [p.brand, p.category],
    modoPreparo: `Preço: $${p.price}`,
  }));
}

export default function Home() {
  const [filtro, setFiltro] = useState("");
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarReceitasDummy().then((dados) => {
      setReceitas(dados);
      setCarregando(false);
    });
  }, []);

  const receitasFiltradas = receitas.filter(r => r.nome.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold mb-4">Receitas Diversas</h1>
      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="border rounded px-3 py-2 mb-6 w-full max-w-xs text-base"
      />
      {carregando ? (
        <p className="text-center text-muted-foreground">Carregando receitas...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
          {receitasFiltradas.length === 0 ? (
            <p className="col-span-3 text-center text-muted-foreground">Nenhuma receita encontrada.</p>
          ) : (
            receitasFiltradas.map((receita) => (
              <Card key={receita.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{receita.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-muted-foreground">{receita.descricao}</p>
                  <strong>Ingredientes:</strong>
                  <ul className="list-disc list-inside mb-2">
                    {receita.ingredientes.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                  <strong>Modo de preparo:</strong>
                  <p>{receita.modoPreparo}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </main>
  );
}
