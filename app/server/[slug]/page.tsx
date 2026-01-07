type Props = {
  params: { slug: string };
};

export default function ServerSlugPage({ params }: Props) {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Server: {params.slug}</h1>
      <p style={{ marginTop: 12 }}>
        Esta página individual está en construcción. Por ahora usá la home para ver info del server.
      </p>
      <a href="/" style={{ marginTop: 16, display: "inline-block" }}>
        ← Volver
      </a>
    </main>
  );
}
