

### to start the app run the next commands in order (you can copy them on the terminals)

## FROM A NEW TERMINAL ON THE ROOT FOLDER of the project
## to install dependencies and run the backend of the project (DO NOT CLOSE THE TERMINAL AFTER RUN THE COMMAND)
DEFAULT PORT: 3002 (HTTP://LOCALHOST:3002)
`cd munka-back && npm install && npm run start` 

## FROM A NEW TERMINAL (also from the root), to run a seed to generate the db and set some test data (YOU CAN CLOSE IT AFTER ONCE THE COMMAND COMPLETE THE PROCESS)
`cd munka-back && npm run seed`

## FROM A NEW TERMINAL (also from the root), to install dependencies and run the frontend project (DO NOT CLOSE THE TERMINAL AFTER RUN THE COMMAND)
DEFAULT PORT: 3000 (HTTP://LOCALHOST:3000)
`cd munka-front && npm install && npm start`

TO HAVE IN CONSIDERATION
* the seed will create all the tables and 2 users to test
* the active coupons limit per user is 3 (.env)
* the total active coupons limit is 5 (.env)
* any buy order is going to generate and assigns a new coupon to the logged user
* the discounts are crated at random
* once a coupon is used is moved to the " used coupons" table and removed fro the "active coupons" one
* you can check te list of all the coupons on http://localhost:3002/coupons/all
* if the limit of coups (active or active for an user) is reached, no coupon will be created.
* the frontend buy order is a mock, it's not possible to create orders with different items.
* to restart the db data run the seed command again (requires refresh the browser where the front is running)


