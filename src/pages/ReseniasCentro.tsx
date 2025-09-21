import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReseniaService } from "../services/ReseniaService";
import { CentroDeEsteticaService } from "../services/CentroDeEsteticaService";
import type { ReseniaResponseDTO } from "../types/resenia/ReseniaResponseDTO";
import type { CentroEsteticaResponseDTO } from "../types/centroDeEstetica/CentroDeEsteticaResponseDTO";

const STAR_SCALE = 5;

const renderStars = (value: number) => {
  const rounded = Math.round(Math.max(0, Math.min(value, STAR_SCALE)));
  return Array.from({ length: STAR_SCALE }, (_, index) => (
    <span key={index} className={index < rounded ? "text-[#C19BA8]" : "text-gray-300"}>
      {index < rounded ? "★" : "☆"}
    </span>
  ));
};

const ReseniasCentro = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [centro, setCentro] = useState<CentroEsteticaResponseDTO | null>(null);
  const [resenias, setResenias] = useState<ReseniaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resenaService = useMemo(() => new ReseniaService(), []);
  const centroService = useMemo(() => new CentroDeEsteticaService(), []);

  useEffect(() => {
    const centroId = Number(id);
    if (!id || Number.isNaN(centroId)) {
      setError("Identificador de centro inválido");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [centroData, allResenias] = await Promise.all([
          centroService.getById(centroId),
          resenaService.getAll(),
        ]);

        if (!centroData) {
          throw new Error("No se encontró el centro solicitado");
        }

        setCentro(centroData);
        setResenias(
          allResenias.filter((res) => res.centroDeEstetica?.id === centroId)
        );
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudieron cargar las reseñas.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [id, centroService, resenaService]);

  const promedio =
    resenias.length > 0
      ? resenias.reduce((acum, res) => acum + res.puntuacion, 0) / resenias.length
      : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAFAFA] px-4 py-18">
        <div className="max-w-4xl mx-auto">
          <button
            className="text-secondary font-semibold hover:underline mb-6"
            onClick={() => navigate(-1)}
          >
            &larr; Volver
          </button>

          <h1 className="text-3xl font-secondary font-bold text-[#1f1f1f] mb-2">
            Reseñas {centro ? `de ${centro.nombre}` : "del centro"}
          </h1>
          {centro && (
            <p className="text-sm text-gray-600 mb-8">
              {centro.domicilio
                ? `${centro.domicilio.calle} ${centro.domicilio.numero}, ${centro.domicilio.localidad}`
                : "Dirección no disponible"}
            </p>
          )}

          {loading && <p>Cargando reseñas...</p>}
          {error && !loading && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              {resenias.length > 0 && (
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-4xl font-bold text-[#C19BA8]">
                    {promedio.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex">{renderStars(promedio)}</div>
                    <p className="text-sm text-gray-600">
                      Basado en {resenias.length} reseña{resenias.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              )}

              {resenias.length === 0 ? (
                <p className="text-gray-600">Todavía no hay reseñas para este centro.</p>
              ) : (
                <div className="space-y-6">
                  {resenias.map((resenia) => (
                    <div key={resenia.id} className="bg-white rounded-lg shadow p-5">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-semibold text-sm text-[#1f1f1f]">
                            {resenia.cliente?.nombre ?? "Cliente anónimo"}
                          </p>
                        </div>
                        <div className="flex">{renderStars(resenia.puntuacion)}</div>
                      </div>
                      <p className="text-sm text-[#333] leading-relaxed">
                        {resenia.comentario}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReseniasCentro;
