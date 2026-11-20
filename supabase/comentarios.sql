-- Comentarios de «Palabras».
-- Pegar completo en Supabase → SQL Editor → New query → Run (una sola vez).
--
-- Quien lee el sitio (rol «anon», la clave pública) solo puede:
--   · leer comentarios aprobados
--   · enviar comentarios nuevos, que siempre quedan pendientes (aprobado = false)
-- Para publicar uno: Table Editor → comentarios → marcar «aprobado» en true.
-- Para borrarlo: eliminar la fila.

create table if not exists public.comentarios (
	id bigint generated always as identity primary key,
	articulo text not null check (char_length(articulo) between 1 and 200),
	nombre text not null check (char_length(btrim(nombre)) between 1 and 80),
	texto text not null check (char_length(btrim(texto)) between 1 and 3000),
	aprobado boolean not null default false,
	creado timestamptz not null default now()
);

create index if not exists comentarios_articulo_creado on public.comentarios (articulo, creado);

alter table public.comentarios enable row level security;

drop policy if exists "leer aprobados" on public.comentarios;
create policy "leer aprobados" on public.comentarios
	for select to anon using (aprobado);

drop policy if exists "enviar pendientes" on public.comentarios;
create policy "enviar pendientes" on public.comentarios
	for insert to anon with check (aprobado = false);

-- Permisos mínimos: leer todo lo aprobado, y al enviar solo estas tres columnas
-- (así nadie puede mandar «aprobado = true» ni cambiar la fecha).
revoke all on public.comentarios from anon;
grant select on public.comentarios to anon;
grant insert (articulo, nombre, texto) on public.comentarios to anon;
