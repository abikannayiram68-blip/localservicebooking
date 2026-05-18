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
    1. Log into a brand new user account and open /my-bookings.
    
## Expected output:
      Screen safely displays fallback UI message: "No bookings found

## Actual output:


## Status:


###  SERVICE PROVIDER MODULE  ###


## TC 01:
## Features: Provider adminstration

## Steps:
    1. Admin can add new service provider.
    2. Input: { "name": "Alex Electrician", "phone_number": "1234567890", "skill_type": "Electrician" }
    3. I click the add provider.

## Expected output:
    1. 201 status ok 
    2. created successfully.

## Actual output:

## Status:


## TC02:

## Features: verify validation

## Steps:
    1. The service provider not give invalid mobile no like {Mobile no: abc--xyz123}
    2. The mobile number strictly give as a int type.

## Expected output:
    1. If service provider give a invalid number as a 400 bad request show the system screen.


## Actual output:


## Status:


####   DASHBOARD AND MIGRATION

## TC01:
## Features: User dashboard
## steps:
    1. once login the already registered user they see own personal history
    2. they already add a services, cancelled services, confirmed and completed services and now pending services.
    3. they see our own history.



## TC02:
## Features: Admin dashboard 

## Steps:
    1. Open admin dashboard panel.
    2. Statistics accurately sum total global users, entire system bookings, and overall active service providers.

## Expected output:
    1. all button and sidebars are worked correctly.
    2. navigate perfectly and securely.

## Actual output:


## Status:
### MIGRATION DATABASE
## TC03:
## Features: UPLOAD PROFILE

## Step:
    1. This test checks if your first database update (Migration 1) successfully added a spot for profile pictures.
    2. After added the migration go to mysql page see the user table.

##  Expected output:
    1. A brand-new column named profile_photo must be there.
    2. It should be configured to accept empty text (NULL or empty strings). 
    3. This is important because when a new user registers, they do not have a profile picture yet. The system must let them sign up without forcing them to upload a photo immediately.

## Actual output:

## Status:

## TC04:

## Features: The provider rating updates.


## Steps:
    1. I check my second database migration is successfully.
    2. Adding the rating system for our service provider.
    3. You open your database tool and look at the structure of the service_providers table.

## Expected output:
    1. A brand-new column named rating must be there. 
    2. It must accept decimals (like 4.5 or 4.8 stars), not just whole numbers (like 4 or 5).
    3. When you add a brand-new provider who has no reviews yet, their rating should automatically start at 0 or stay blank (NULL) instead of crashing the system.

## Actual output:

## Status:



