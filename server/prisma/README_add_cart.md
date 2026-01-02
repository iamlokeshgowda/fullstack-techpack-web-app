Manual step: after editing schema.prisma, run:

```
cd server
npx prisma migrate dev --name add_cart
npx prisma generate
```

This will create the CartItem table referenced by the server controllers.
