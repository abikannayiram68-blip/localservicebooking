1. Authentication module


## Registeration
## user stories:
    1. As a serive taker,
    2. I want to booking some services,
    3. So that registeration made to acccess a many services. so i take my wanted services.
# requirements:
    1. Name
    2. pass word
    3. phone number
# Acceptance Criteria:
    1. Mainly come to the web appliction Registeration page
    2. Enter your name.
    3. Enter a valid email ID.
    4. Enter a Valid password.
    5. Enter your phonenumber correctly.

## login
## user stories:
    1. As a user,
    2. I want to login and I'm access my services.
    3. So that I easily and securely login my account. And access my dashboard.
# requirements:
    1. User Email
    2. user password.
# Acceptance Criteria:
    1. Enter your email id correctly . you should enter your email is wrong show the page is invalid email id.
    2. At the same time enter your pass word is correctly. same error show again.
# steps:
* Once you registered  account generated a JWT authentication
* Password hashing(using bcrypt)
* Protected routes

## logout
## user stories:
    1. As a user,
    2. I want to logout my account safely.
    3. so that i can logout perfectly.
## steps:
    only click the logout button.


2. Service Management Module:
 

 ## Admin (only admin can managable)

 # services:
## user stories:
    1. As a admin
    2. i want to manage the services add the services delete the services(using CRUD)
    3. so that i can manage this all things new users and services.


## Example services
* Plumbing
* Electrical Repair
* Home Cleaning
* Painting

## requirement:
    1. User can access many services.
    

## service field:
## user stories:
    1. As a admin
    2. I want to all services are see a proper structure.
    3. So that I create  a servicesfield properly.

# requirement field:
* Service Name
* Description
* Price
* Estimated Duration

## Acceptance criteria:
    1. only user fill this all column.
    2. user fill all requirements correctly arrange the services to out home perfectly.


3. Booking System
## access by user:


## user stories:
    1. As a user,
    2. I want to access my dashboard and see all availabe services.
    3. So that i can easily show all servies and i can  booking services also i can add my details, at the same time i cancel my booking

## Details:

* View available services
* Book a service
* Select preferred date
* Add address
* Cancel booking


## Acceptance criteria:
    1. only user can booking available services.
    2. they should not booking unavailable services.
    3. They are mention correctly all  details what services they want, what date they will come, mainly addind their address.
    4. This is very important to booking a order
    5. No preferred past date


## booking status
# user stories:
    1. As a user,
    2. I want my booking status,
    3. so that easily access and see my status


# Requirements status:
    1. Admin access the user booking. they schedule the booking is pending, conform, services is completed and cancel their services
    2. they see our booking is pending. that services are not moving next stage.
    3. User see our booking is confirmed. Admin accept our service .
    4. User see completed. that services was completed their home.
    5.User see our booking is cancelled. Admin is cancell their sevices.



4. Service provided Module:


## Admin only

## user stories:
    1. AS a admin,
    2. I want add some extra fields in services,
    3. So that i can added the services.


### Provider Fields

* Name
* Phone Number
* Skill Type
* Availability Status


## Acceptance criteria:
    1. Compulsory fill this all requirements
    2. their skill type is mandatory because want services they are provided .
    3. check their are available or not.


5. Dashboard module:

## User dashboard:

## user stories:
    1. As a user,
    2. I want to access my dashboard, so I'm login my account i see my dashboard,
    3. So that very easy to see my dashboard and what status i have.


    user can see:
    * total bookings
    * upcoming bookings
    * completed services.


## Details:
    1. User can see our already booking services totally.
    2. They are see upcoming available bookings.
    3. once user services are finished their dashboard show completed services.
    

## Admin Dashboard:
## user stories:
    1. As a admin.
    2. I want to see a user, service provided, and how much are booking is pending.
    3. so that i access total user, booking,active providers.


    Admin can see:
    * Total users
    * Total bookings
    * Active providers

## Details:
    1. Admin can access total number of users and our details.
    2. Total number of booking received their dashboard.
    3. Check the sevice providers are available or not.
    4. They make change user status like confirmed, completed, cancelled their bookings

