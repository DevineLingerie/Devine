#!/usr/bin/env bash
# Lance un PostgreSQL jetable, applique le stub Supabase et les migrations,
# puis exécute les tests de permissions (tests/db).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PGTEST_PORT:-54329}"
BIN="$(pg_config --bindir 2>/dev/null || true)"
if [ -z "$BIN" ] || [ ! -x "$BIN/initdb" ]; then
  BIN="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -n1)"
fi
if [ -z "$BIN" ] || [ ! -x "$BIN/initdb" ]; then
  echo "PostgreSQL (initdb) introuvable : installez PostgreSQL 15+ pour lancer ces tests." >&2
  exit 1
fi

DATA="$(mktemp -d)"
RUN=""
if [ "$(id -u)" = "0" ]; then
  # initdb refuse de s'exécuter en root.
  chown postgres "$DATA"
  RUN="runuser -u postgres --"
fi

cleanup() {
  $RUN "$BIN/pg_ctl" -D "$DATA" stop -m immediate >/dev/null 2>&1 || true
  rm -rf "$DATA"
}
trap cleanup EXIT

$RUN "$BIN/initdb" -D "$DATA" -U postgres --auth=trust >/dev/null
$RUN "$BIN/pg_ctl" -D "$DATA" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$DATA/log" start >/dev/null

export DATABASE_URL="postgresql://postgres@localhost:$PORT/postgres"
psql "$DATABASE_URL" -q -v ON_ERROR_STOP=1 -f "$ROOT/supabase/tests/supabase-stub.sql"
for migration in "$ROOT"/supabase/migrations/*.sql; do
  echo "Migration : $(basename "$migration")"
  psql "$DATABASE_URL" -q -v ON_ERROR_STOP=1 -f "$migration"
done
# Rejouer les migrations de données ne doit rien casser.
psql "$DATABASE_URL" -q -v ON_ERROR_STOP=1 -f "$ROOT/supabase/migrations/20261012100300_seed.sql"

cd "$ROOT"
npx vitest run --project db
