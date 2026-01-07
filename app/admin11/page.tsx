export default function AdminPage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Admin</h1>
      <p style={{ marginTop: 12 }}>
        Panel admin desactivado por ahora (modo deploy rápido).
      </p>
      <p style={{ marginTop: 8, opacity: 0.7 }}>
        Próximo paso: conectar Supabase y permitir editar textos/imágenes.
      </p>
    </main>
  );
}
