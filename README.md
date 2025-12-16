# fullstack-techpack-web-app

# create DB
    1. create a database manually
    2. npm install prisma@6.12.0 --save-dev / npm install @prisma/client@6.12.0
    2a. set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fullstack-app-techpack
    3. npx prisma format  
    4. npx prisma validate
    5. npx prisma migrate dev --name init_auth_schema
    6. npx prisma generate

