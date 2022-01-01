# RoadTrip
RoadTrip is a web application that let users plan a road trip. 

## Video Demo
[VIDEO DEMO LINK]

## How it works

### Authentication Function

* User can register for an account, and login to gain access to the features of the web application. 

### View Trips

* Once logged in, the user can view all the trips he/she created or was invited to. The user can click on each trip to view the details of the trip. 

### View Specific Trip

* When the user clicks on a specific trip, the details of the trip, such as the users following the trip, the Origin, Stopovers and Destination waypoints, as well as it’s details, will be displayed.
* The user can invite friends into the trip by clicking/pressing the friend’s username when viewing the specific trip. 

### Create Trip

* For this function, the user can create a new trip. The user can modify the name of the trip, add the origin, stopovers and destination waypoints of the trip. 
* For each waypoint, the user is able to set the TO and FROM date and time of the trip, and, with the help of asynchronous search, look up the location to set the waypoint. The Asynchronous search input field was implemented using the React TypeAhead library, fetching data from the MapBox API endpoint. In addition, the user can also add tasks to do at every waypoint. 

### Lookup Users

* A TypeAhead input field is present in the navigation bar. This input field can be used to look up other users that are registered in the web application.
* When a user item is clicked, the user can view user2’s (the user profile that is being viewed) trip counts, as well as their friend count, but not their trips. To view user2’s trips, user will need to send a friend request.

### Notifications

* Users can receive two different types of notifications, a trip invite and a friend request. 
* A friend request can be sent when viewing a specific user’s profile, by pressing the Add Friend button. 
* A trip invite can be sent when a user, who’s username is in the trip, presses the Add Friends to Trip button. 
* The recipient of the request can view all their notifications in the Notifications page. 


## Technologies used
RoadTrip, is a web application that allows users to plan a road trip. The web application is developed on a client-server approach, with the
React JavaScript library, along with HTML and CSS used on the front-end, while Python (Django Rest Framework) was used on the back-end.

