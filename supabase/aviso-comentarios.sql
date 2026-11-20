-- Aviso por correo cuando llega un comentario nuevo (vía Resend).
-- Requiere haber corrido antes supabase/comentarios.sql.
--
-- PASO 1 — una sola vez, en una query aparte y SIN guardarla en este archivo:
--   guarda tu clave de Resend y tu correo en el Vault de Supabase (cifrado).
--   Reemplaza los dos textos entre comillas antes de correrlo:
--
--   select vault.create_secret('re_TU_CLAVE_DE_RESEND', 'resend_api_key');
--   select vault.create_secret('tu-correo@ejemplo.com', 'aviso_correo');
--
--   (El correo debe ser el mismo con el que creaste la cuenta de Resend: con el
--   remitente de prueba onboarding@resend.dev, Resend solo envía a ese correo.)
--
-- PASO 2 — pegar todo lo que sigue en SQL Editor → New query → Run.
-- El envío es asíncrono: si el correo falla, el comentario se guarda igual.

create extension if not exists pg_net with schema extensions;

create or replace function public.avisar_comentario()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
	clave text;
	correo text;
begin
	select decrypted_secret into clave from vault.decrypted_secrets where name = 'resend_api_key';
	select decrypted_secret into correo from vault.decrypted_secrets where name = 'aviso_correo';
	if clave is null or correo is null then
		return new;
	end if;

	perform net.http_post(
		url := 'https://api.resend.com/emails',
		headers := jsonb_build_object(
			'Authorization', 'Bearer ' || clave,
			'Content-Type', 'application/json'
		),
		body := jsonb_build_object(
			'from', 'Comentarios del sitio <onboarding@resend.dev>',
			'to', jsonb_build_array(correo),
			'subject', 'Nuevo comentario en «' || new.articulo || '»',
			'text', new.nombre || ' escribió en https://catacallejas.cl/palabras/' || new.articulo || '/ :'
				|| E'\n\n' || new.texto
				|| E'\n\n—\nPara publicarlo, márcalo como aprobado en Supabase → Table Editor → comentarios.'
		)
	);
	return new;
end;
$$;

drop trigger if exists avisar_comentario on public.comentarios;
create trigger avisar_comentario
	after insert on public.comentarios
	for each row execute function public.avisar_comentario();
