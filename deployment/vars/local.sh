# AWS
export AWS_STAGE='dev'
# Others not required for local testing

# Gmail
# Not required for local testing

# App
export JWT_SECRET=insecure
export FRONTEND_URL="localhost:3000"
export BACKEND_PORT=5000
export GRAPHQL_ENDPOINT=http://localhost:$BACKEND_PORT/graphql

# Postgres
export PGUSERNAME=postgres
export PGPASSWORD=password
export PGENDPOINT=localhost