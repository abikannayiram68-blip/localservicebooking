#### TEST CASES  ####
######       AUTHENTICATION       #####
# TC 01:
### Features: REGISTERATION
## Steps:
    1.open a web application
    2.Enter their Name.
    3.Enter their password.
    4.Enter confirm password.
    5.Enter mobile number.
    6.click submit button.

## Expected result:
    The registeration is successfully

## Actual Result:
    (after the  code writing i check it and fillup this line)

## Status:
- pass or fail




# TC 02:
### Features: Login
## Steps:
    1. Go to login page.
    2. enter the email ID.
    3. enter the password.
    4. click login button.


## Expected output:
- that user enter the vaild email ID and password, successfully login and go to dashboard page.


## actual output:

### Status:


# TC03:
### Features Invalid login
## Steps:
    1. go to login page
    2. enter the wrong email id.
    3. enter the wrong password.
    4. login button clicked by user.

## Expected output
    "invalid password or email" show this command our system


## Actuall output:


## status:



# TC04:
### Features  Reset password:
## Steps:
    1. The regitered user want to reset their password or forgot their password.
    2. They can modify it.
    3. the registered user can access their email inbox.
    4. So, they click the forgot password
    5. Enter email address perfectly. they are get the one inbox message the system give e one time password(OTP).
    6. They enter the OTP correctly. After verification is completed they can enter the new password.
    7. At the same time enter the confirmed password.



## Expected output:
    1. IF enter correct email they received email OTP
    2. If enter correct OTP they can reset password.
    3. After complted the reset correctly they can access their already registered account.


Example:
    Email ID: user@gmail.com
    Password: user123.


## Actual Output:



## Status:


pass/fail



#### Service Management
## TC01:
### Features: Admin usage

## Steps:
    1. go to dashboard.
    2. show side bars like manage provider, manage services, view all bookings
    3. Admin can manage the service provider and add extra service provider service details, manage the user bookings, view user details, and allocate the service provider for this user.
    4. Also admin can manage the user status like pending, confirmed, completed, cancelled.


## Expected output:
    1. Admin can enter a email and password open their dashboard securely.
    2. view the page side bar like Manage services, Manage providers, View all booking.
    3. They can add more services. add their service provider, update user status
    4. Admin can successfully created a services  show api as 201 status ok

## Actual output:

 

 ## Status:


 ## TC02:

 ## Features: Non admin role


 ## steps:
    1. Verify non-admin role cannot create a service.
   
##  Expected output:
    1. if they are create show 401 unautherized.
    2. they user only add the services, cancelled their services. 
    3. they see past history.
    4. they not add price in negative value (price: -120)
    5. error showed by 400 bad requests.


## Actual output:

## Status:

## BOOKING SYSTEM MODULE
## TC 01

##  Features:  Creating and managing bookings.


## Steps:
    1. Verify booking creation is valid future date.
    2. Once user booking correctly their status update pending 201 status ok


## Expected output:
    1. verification is done. the user status change to confirmed.



## Actual output:


## Status:

## TC 02:
## Features: User can cancell their booking before completed.

## Steps:
    1. user can cancel their own booking
    2. if already created the booking. it current status is pending or confirmed they can canceled.
    3. But once the services is completed they can't change their status.

## expeted output:
    1. they can cancel their own booking 
    2. {status: cancelled}
    3. 200 ok .

## Actual output:


## status



## TC03:

## Features : Verify mybooking

## Steps:
    




