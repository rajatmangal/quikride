
# Quik Ride:
<p align="center">
  <img src="https://raw.github.com/rajatmangal/quikride/master/public/images/favicon.png">
</p>

## Basic Idea:
Canada is currently lagging in carpooling technologies and this application attempts to rectify that. This app provides a flexible way to request and share rides anywhere within the region. Public transit in the region can be finicky, we all remember the transit strike that recently happened. This app provides a way for people to connect and share car rides, by either booking a car or advertising that their own car is available to pick up passengers. Our app is flexible for any user’s car booking needs, from solo to group booking, and last-minute trips to booking rides ahead of time.

## Architecture
**![](https://lh3.googleusercontent.com/xzgybfXEIEhixkZ3KJ7lExXzhJLdSq65Uwl9T7yvEav7O82QDRnIg8mBQJyZ_fLKlbVvtQe4CZoLSzXuuXDuRTTLkRMD_Tf4TpEHO52wHlVbs4ps8VrI_Gq8tjhw91QZMeVVcyRW)

## How to Run the Application:
* Clone this repository.
* Now go inside the root folder and do `npm install` (to install all the required packages).
* Make a new .env file in the root repository.
* Add a variable SESSION_SECRET and assign it to anything for instance 
	<p align="center">"SESSION_SECRET = "rdcfubuigbuyibuyfhjvuyvkjbivujycv"</p>
* Make sure that your Mongo Server is up and running on your local host.
* To Start the app, run `npm run start` in out CLI.

## Technologies Used:
* Node.js
* MongoDB
* EJS

### External Services Used:
* Google Maps API
* Google Autofill API
* Google Authentication
* Facebook Authentication
