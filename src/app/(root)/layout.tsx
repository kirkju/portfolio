// Layout mínimo de la raíz `/`, que solo redirige al idioma por defecto.
// En producción la redirección la hace IIS (public/web.config) antes de llegar aquí.
export default function RootRedirectLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
