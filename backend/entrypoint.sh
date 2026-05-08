#!/bin/sh

# Wait for PostgreSQL to be ready before running migrations
echo "Waiting for database connection..."
until php -r "
try {
    new PDO(
        'pgsql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD')
    );
    exit(0);
} catch (Exception \$e) {
    exit(1);
}
" 2>/dev/null; do
    echo "Database not ready, retrying in 3s..."
    sleep 3
done

echo "Database is ready. Running migrations..."
php artisan migrate --force

USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null | grep -E '^[0-9]+$' | head -1)
if [ "${USER_COUNT:-0}" = "0" ]; then
    echo "Seeding database..."
    php artisan db:seed --force
fi

php artisan serve --host=0.0.0.0 --port=8000
